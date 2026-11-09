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
        camera={{ position: [0, 2.4, 6.0], fov: 60, near: 0.1, far: 500 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        {/* 1. Sky background: Deep Midnight Slate (Atmospheric City Twilight) */}
        <color attach="background" args={['#0e1422']} />
        
        {/* 2. Atmospheric City Fog: Soft glowing smog that catches neon */}
        <fog attach="fog" args={['#12192a', 30, 190]} />

        {/* 3. Balanced Ambient Light: Lifts shadows so textures and grain are visible */}
        <ambientLight intensity={0.80} color="#2a334a" />
        <hemisphereLight args={['#64748b', '#181e2e', 0.70]} />
        
        {/* 4. Directional Moonlight / Sky Rim: */}
        <directionalLight position={[20, 80, 10]} intensity={0.75} color="#93c5fd" />

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
