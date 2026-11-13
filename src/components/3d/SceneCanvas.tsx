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
        {/* 1. Sky background: Deep Prussian Indigo (Neo-Tokyo Twilight Canvas) */}
        <color attach="background" args={['#0e1424']} />
        
        {/* 2. Atmospheric City Fog: Luminous twilight teal smog that grounds distant towers */}
        <fog attach="fog" args={['#121a2c', 35, 220]} />

        {/* 3. Dual-Tone Ambient & Hemisphere Lighting: Cool Twilight Sky vs. Warm Tokyo Ground Bounce */}
        <ambientLight intensity={0.75} color="#222d42" />
        <hemisphereLight args={['#64748b', '#382a1a', 0.85]} />
        
        {/* 4. Directional Moonlight / Upper Tower Rim: */}
        <directionalLight position={[25, 85, 15]} intensity={0.65} color="#93c5fd" />

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
