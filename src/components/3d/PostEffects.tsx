'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Custom Cyberpunk Anamorphic Lens Shader: Subtle Chromatic Aberration + Controlled Cinematic Vignette
const CyberpunkLensShader = {
  name: 'CyberpunkLensShader',
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 0.0008 },
    darkness: { value: 0.22 },
    vignetteOffset: { value: 0.42 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float offset;
    uniform float darkness;
    uniform float vignetteOffset;
    varying vec2 vUv;

    void main() {
      vec2 distFromCenter = vUv - 0.5;
      
      // Chromatic Aberration at perimeter
      float dist = length(distFromCenter);
      vec2 redUv = vUv + distFromCenter * offset * dist * 1.8;
      vec2 blueUv = vUv - distFromCenter * offset * dist * 1.8;

      float r = texture2D(tDiffuse, redUv).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, blueUv).b;
      float a = texture2D(tDiffuse, vUv).a;

      vec4 color = vec4(r, g, b, a);

      // Controlled Cinematic Vignette
      float vignette = smoothstep(0.82, vignetteOffset, dist);
      color.rgb = mix(color.rgb * (1.0 - darkness), color.rgb, vignette);

      gl_FragColor = color;
    }
  `,
};

export function PostEffects() {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);

  useEffect(() => {
    // 1. Initialize Three.js EffectComposer
    const composer = new EffectComposer(gl);
    
    // 2. Base Scene Render Pass
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // 3. Selective Clean Unreal Bloom Pass:
    // Threshold 0.86 ensures ONLY true emissive neon and lit windows bloom with warm halation, never diffuse road or walls
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      1.15, // strength (rich, vibrant neon glow)
      0.55, // radius
      0.86  // threshold (isolates true neon emitters, eliminating blowout)
    );
    composer.addPass(bloomPass);

    // 4. Color Management / Tone Mapping Pass
    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // 5. Chromatic Aberration & Vignette Lens Pass
    const lensPass = new ShaderPass(CyberpunkLensShader);
    composer.addPass(lensPass);

    composerRef.current = composer;

    return () => {
      composer.dispose();
    };
  }, [gl, scene, camera, size.width, size.height]);

  useEffect(() => {
    if (composerRef.current) {
      composerRef.current.setSize(size.width, size.height);
    }
  }, [size]);

  // Priority 1 suppresses default R3F gl.render and renders our post-processing chain
  useFrame((_, delta) => {
    if (composerRef.current) {
      composerRef.current.render(delta);
    }
  }, 1);

  return null;
}
