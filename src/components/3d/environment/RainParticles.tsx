'use client';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface RainParticlesProps {
  count?: number;
}

export function RainParticles({ count = 2500 }: RainParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Particle state arrays
  const { positions, speeds, dummy, slantRotation } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const d = new THREE.Object3D();
    // 8-degree diagonal wind slant along Z-axis
    const rot = new THREE.Euler(0.14, 0, 0);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 26; // X: -13 to +13
      pos[i * 3 + 1] = Math.random() * 24;         // Y: 0 to 24
      pos[i * 3 + 2] = 10 - Math.random() * 190;   // Z: +10 to -180
      spd[i] = 22 + Math.random() * 12;            // Fall speed: 22-34 m/s
    }

    return { positions: pos, speeds: spd, dummy: d, slantRotation: rot };
  }, [count]);

  // Initial matrix setup
  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        positions[i * 3 + 0],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      dummy.rotation.copy(slantRotation);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, dummy, positions, slantRotation]);

  // Animate falling rain
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const dt = Math.min(delta, 0.1);

    for (let i = 0; i < count; i++) {
      let y = positions[i * 3 + 1] - speeds[i] * dt;
      let z = positions[i * 3 + 2] + speeds[i] * 0.14 * dt; // Match 8-degree slant drift

      // Recycle when hitting the street
      if (y < 0) {
        y = 22 + Math.random() * 4;
        positions[i * 3 + 0] = (Math.random() - 0.5) * 26;
        z = 10 - Math.random() * 190;
      }

      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      dummy.position.set(
        positions[i * 3 + 0],
        y,
        z
      );
      dummy.rotation.copy(slantRotation);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <boxGeometry args={[0.015, 0.42, 0.015]} />
      <meshBasicMaterial
        color="#88CCFF"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

