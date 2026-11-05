'use client';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraRig } from './CameraRig';
import { StreetEnvironment } from './StreetEnvironment';
import { CharacterBoy } from './CharacterBoy';
import { SpaceshipCafe } from './landmarks/SpaceshipCafe';
import { StarClothing } from './landmarks/StarClothing';
import { DebrisPawn } from './landmarks/DebrisPawn';
import { NovaMotel } from './landmarks/NovaMotel';
import { StreetLamps } from './landmarks/StreetLamps';
import { PostEffects } from './PostEffects';
import { Suspense } from 'react';

export function SceneCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 2.2, 5.5], fov: 60, near: 0.1, far: 500 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.92,
        }}
      >
        {/* Deep Cyberpunk Midnight Atmosphere & Controlled Distance Fog */}
        <color attach="background" args={['#050812']} />
        <fog attach="fog" args={['#050812', 35, 190]} />

        {/* Realistic Balanced Night Lighting (Prevents Overexposure, Preserves Shadows & Neon Punch) */}
        <ambientLight intensity={0.32} color="#2b3b55" />
        <hemisphereLight args={['#1c2840', '#0a0912', 0.38]} />
        
        {/* Cool Midnight Moonlight - casts crisp rim highlights along shoulders & roofs */}
        <directionalLight position={[25, 45, 15]} intensity={0.75} color="#80a5d5" />
        
        {/* Soft Cyber Canyon Rim Accents (Subtle, non-destructive fill) */}
        <directionalLight position={[-25, 30, -40]} intensity={0.28} color="#ff2277" />
        <directionalLight position={[0, 15, -100]} intensity={0.22} color="#00d5ff" />

        <Suspense fallback={null}>
          <CameraRig />
          <StreetEnvironment />
          <CharacterBoy />
          <SpaceshipCafe />
          <StarClothing />
          <DebrisPawn />
          <NovaMotel />
          <StreetLamps />
          <PostEffects />
        </Suspense>
      </Canvas>
    </div>
  );
}
