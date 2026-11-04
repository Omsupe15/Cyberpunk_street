'use client';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface Skyscraper {
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  hasBeacon?: boolean;
  beaconColor?: string;
  hasCyanWindows?: boolean;
  hasAmberWindows?: boolean;
}

export function MegastructureSkyline() {
  const beaconLightsRef = useRef<THREE.Group>(null);

  // Generate building placement along both street flanks
  const buildings: Skyscraper[] = useMemo(() => {
    const list: Skyscraper[] = [];
    const zStops = [
      8, -12, -32, -52, -72, -92, -112, -132, -152, -172
    ];

    // Left Flank Towers (X: -18 to -26)
    zStops.forEach((z, idx) => {
      const height = 45 + (idx * 7) % 38;
      list.push({
        x: -21 - (idx % 2) * 3,
        z: z,
        width: 14 + (idx % 3) * 2,
        height,
        depth: 16,
        hasBeacon: idx % 2 === 0,
        beaconColor: idx % 4 === 0 ? '#FF0055' : '#00F3FF',
        hasCyanWindows: idx % 2 === 0,
        hasAmberWindows: idx % 3 === 0,
      });
    });

    // Right Flank Towers (X: +18 to +26)
    zStops.forEach((z, idx) => {
      const height = 42 + ((idx + 3) * 6) % 40;
      list.push({
        x: 21 + (idx % 2) * 3,
        z: z,
        width: 14 + ((idx + 1) % 3) * 2,
        height,
        depth: 16,
        hasBeacon: (idx + 1) % 2 === 0,
        beaconColor: idx % 3 === 0 ? '#FF0055' : '#FFAA00',
        hasCyanWindows: (idx + 1) % 2 === 0,
        hasAmberWindows: (idx + 1) % 3 === 0,
      });
    });

    return list;
  }, []);

  // Blinking rooftop aviation beacons
  useFrame((state) => {
    if (!beaconLightsRef.current) return;
    const time = state.clock.getElapsedTime();
    const flash = Math.sin(time * 3.5) > 0.3 ? 1 : 0.15;

    beaconLightsRef.current.children.forEach((child) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = flash;
    });
  });

  return (
    <group>
      {/* 1. Skyscraper Facades */}
      {buildings.map((b, idx) => (
        <group key={idx} position={[b.x, b.height / 2, b.z]}>
          {/* Main Tower Mass */}
          <mesh receiveShadow>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial
              color="#0d0f15"
              roughness={0.8}
              metalness={0.4}
            />
          </mesh>

          {/* Front Illuminated Window Grid Strip */}
          <mesh
            position={[
              b.x < 0 ? b.width / 2 + 0.05 : -b.width / 2 - 0.05,
              0,
              0,
            ]}
            rotation={[0, b.x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
          >
            <planeGeometry args={[b.depth * 0.75, b.height * 0.85]} />
            <meshStandardMaterial
              color="#0b0d13"
              roughness={0.3}
              metalness={0.7}
              emissive={b.hasCyanWindows ? '#003344' : b.hasAmberWindows ? '#332200' : '#05070a'}
              emissiveIntensity={0.6}
            />
          </mesh>

          {/* Vertical Architectural Accent Ribs */}
          <mesh
            position={[
              b.x < 0 ? b.width / 2 + 0.1 : -b.width / 2 - 0.1,
              0,
              -b.depth * 0.3,
            ]}
          >
            <boxGeometry args={[0.2, b.height, 0.4]} />
            <meshStandardMaterial color="#1a1e29" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh
            position={[
              b.x < 0 ? b.width / 2 + 0.1 : -b.width / 2 - 0.1,
              0,
              b.depth * 0.3,
            ]}
          >
            <boxGeometry args={[0.2, b.height, 0.4]} />
            <meshStandardMaterial color="#1a1e29" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* 2. Rooftop Hazard Aviation Beacons */}
      <group ref={beaconLightsRef}>
        {buildings
          .filter((b) => b.hasBeacon)
          .map((b, idx) => (
            <mesh key={idx} position={[b.x, b.height + 0.5, b.z]}>
              <sphereGeometry args={[0.35, 8, 8]} />
              <meshBasicMaterial
                color={b.beaconColor || '#FF0055'}
                transparent
                opacity={1}
              />
            </mesh>
          ))}
      </group>
    </group>
  );
}

