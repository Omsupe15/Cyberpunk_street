'use client';
import { Canvas } from '@react-three/fiber';
import { CameraRig } from './CameraRig';
import { LandmarkProxies } from './LandmarkProxies';
import { Suspense } from 'react';

export function SceneCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 2.2, 5.5], fov: 60, near: 0.1, far: 500 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#05050A']} />
        <fog attach="fog" args={['#05050A', 15, 110]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={0.8} color="#88aaff" />

        <Suspense fallback={null}>
          <CameraRig />
          <LandmarkProxies />
        </Suspense>
      </Canvas>
    </div>
  );
}

