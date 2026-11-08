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
          toneMappingExposure: 0.95,
        }}
      >
        {/* Luminous Celestial Cyberpunk Night Sky (Deep Royal Indigo Gradient) */}
        <color attach="background" args={['#060c1c']} />
        
        {/* Clear Atmospheric Fog (Starts at 80m, preserving razor-sharp landmark & street clarity) */}
        <fog attach="fog" args={['#070e20', 80, 280]} />

        {/* Natural Night Sky Illumination (Provides rich ambient visibility without washed-out blacks) */}
        <ambientLight intensity={0.65} color="#40587c" />
        <hemisphereLight args={['#324a72', '#121624', 0.45]} />
        
        {/* Cool Celestial Moonlight Key Light - crisp rim lighting on architectural crowns & rooftops */}
        <directionalLight position={[30, 55, 20]} intensity={1.2} color="#a8c8ff" />
        
        {/* Soft Cyber Canyon Horizontal Fill Accents */}
        <directionalLight position={[-30, 35, -40]} intensity={0.35} color="#ff2277" />
        <directionalLight position={[30, 25, -90]} intensity={0.28} color="#00d8f0" />

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
