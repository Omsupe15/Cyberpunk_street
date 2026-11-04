'use client';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface VentLocation {
  x: number;
  z: number;
}

const VENT_LOCATIONS: VentLocation[] = [
  { x: -5.2, z: -15 },
  { x: 5.2, z: -50 },
  { x: -5.2, z: -90 },
  { x: 5.2, z: -135 },
];

export function SteamVents() {
  const steamPuffsRef = useRef<THREE.Group>(null);

  // Pre-generate individual steam puff offsets
  const puffsData = useMemo(() => {
    return VENT_LOCATIONS.map((vent) => {
      const puffs = [];
      for (let i = 0; i < 7; i++) {
        puffs.push({
          initialPhase: (i / 7) * Math.PI * 2,
          speed: 0.6 + Math.random() * 0.4,
          driftAngle: Math.random() * Math.PI * 2,
          maxScale: 1.2 + Math.random() * 0.6,
        });
      }
      return { vent, puffs };
    });
  }, []);

  useFrame((state) => {
    if (!steamPuffsRef.current) return;
    const time = state.clock.getElapsedTime();

    // Iterate through all vent clusters and animate their puffs
    let childIdx = 0;
    puffsData.forEach(({ vent, puffs }) => {
      puffs.forEach((puff) => {
        const mesh = steamPuffsRef.current?.children[childIdx] as THREE.Mesh;
        if (mesh) {
          // Normalized lifecycle 0 -> 1
          const life = ((time * puff.speed + puff.initialPhase) % (Math.PI * 2)) / (Math.PI * 2);

          // Position: rises from Y: 0.1 to 3.2m with subtle sway
          mesh.position.set(
            vent.x + Math.sin(time + puff.driftAngle) * 0.25 * life,
            0.15 + life * 3.2,
            vent.z + Math.cos(time + puff.driftAngle) * 0.25 * life
          );

          // Scale: expands as it ascends
          const scale = 0.3 + life * puff.maxScale;
          mesh.scale.set(scale, scale * 0.8, scale);

          // Opacity: fades in, then fades out softly
          const material = mesh.material as THREE.MeshBasicMaterial;
          if (material) {
            const alpha = Math.sin(life * Math.PI) * 0.22;
            material.opacity = alpha;
          }

          // Gentle rotation
          mesh.rotation.y = time * 0.3 + puff.driftAngle;
        }
        childIdx++;
      });
    });
  });

  return (
    <group>
      {/* 1. Cast Iron Sewer Grate Plates on Sidewalks */}
      {VENT_LOCATIONS.map((vent, idx) => (
        <group key={idx} position={[vent.x, 0.142, vent.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.55, 16]} />
            <meshStandardMaterial color="#1f222b" roughness={0.7} metalness={0.8} />
          </mesh>
          {/* Inner vent grate rim */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.42, 0.52, 16]} />
            <meshStandardMaterial color="#0b0c10" roughness={0.4} metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 2. Rising Translucent Steam Puffs */}
      <group ref={steamPuffsRef}>
        {puffsData.flatMap(({ vent, puffs }, vIdx) =>
          puffs.map((_, pIdx) => (
            <mesh key={`${vIdx}-${pIdx}`} position={[vent.x, 0.15, vent.z]}>
              <sphereGeometry args={[0.6, 12, 12]} />
              <meshBasicMaterial
                color="#A0B4C8"
                transparent
                opacity={0.15}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}

