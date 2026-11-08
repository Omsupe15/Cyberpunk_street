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
        {/* Luminous Neon Cyber-Blue Night Sky (No Black in Background) */}
        <color attach="background" args={['#0c2c62']} />
        
        {/* Atmospheric Luminous Cyber-Blue Night Fog */}
        <fog attach="fog" args={['#0f356e', 90, 320]} />

        {/* Rich Ambient Skylight - Vibrant Cobalt Blue & Electric Cyan Tone */}
        <ambientLight intensity={1.05} color="#2b6cb0" />
        <hemisphereLight args={['#4299e1', '#1a4e8a', 0.85]} />
        
        {/* Downward moonlight wash for clear blue surface visibility */}
        <directionalLight position={[20, 80, 10]} intensity={0.70} color="#a0d8ff" />

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
