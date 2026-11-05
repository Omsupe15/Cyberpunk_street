'use client';
import { useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getSkyscraperFacadeTexture } from '@/lib/proceduralTextures';

interface Skyscraper {
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  seed: number;
  hasBeacon?: boolean;
  beaconColor?: string;
  billboard?: {
    text: string;
    sub: string;
    color: string;
    y: number;
  };
}

export function MegastructureSkyline() {
  const beaconLightsRef = useRef<THREE.Group>(null);
  const billboardsRef = useRef<THREE.Group>(null);
  const [facadeTextures, setFacadeTextures] = useState<THREE.CanvasTexture[]>([]);

  useEffect(() => {
    const list = [];
    for (let i = 0; i < 6; i++) {
      list.push(getSkyscraperFacadeTexture(i + 1));
    }
    setFacadeTextures(list);
  }, []);

  // Generate building placement along both street flanks
  const buildings: Skyscraper[] = useMemo(() => {
    const list: Skyscraper[] = [];
    const zStops = [12, -10, -32, -54, -76, -98, -120, -142, -164, -186];

    // Left Flank Towers (X: -21 to -25)
    zStops.forEach((z, idx) => {
      const height = 50 + (idx * 7) % 35;
      list.push({
        x: -22 - (idx % 2) * 3,
        z: z,
        width: 16 + (idx % 3) * 2,
        height,
        depth: 18,
        seed: idx % 5,
        hasBeacon: true,
        beaconColor: idx % 2 === 0 ? '#FF0055' : '#00F3FF',
        billboard:
          idx === 1
            ? { text: 'CYBER-NETICS', sub: '生体サイバー // V9', color: '#00F3FF', y: 28 }
            : idx === 4
            ? { text: 'ASTRA LUX', sub: '高級アパレル // SECTOR 7', color: '#8A2BE2', y: 32 }
            : idx === 7
            ? { text: 'SYNTH-CORP', sub: '電脳ブレイン // 01', color: '#05FFA1', y: 26 }
            : undefined,
      });
    });

    // Right Flank Towers (X: 21 to 25)
    zStops.forEach((z, idx) => {
      const height = 48 + ((idx + 2) * 6) % 38;
      list.push({
        x: 22 + (idx % 2) * 3,
        z: z,
        width: 16 + ((idx + 1) % 3) * 2,
        height,
        depth: 18,
        seed: (idx + 3) % 5,
        hasBeacon: true,
        beaconColor: idx % 2 === 0 ? '#FFAA00' : '#FF0055',
        billboard:
          idx === 2
            ? { text: 'ORBIT RECHARGE', sub: '宇宙カフェ // STN 01', color: '#FFAA00', y: 24 }
            : idx === 5
            ? { text: 'OFF-WORLD EXP', sub: '植民地移住 // AD-2077', color: '#00F3FF', y: 34 }
            : idx === 8
            ? { text: 'NOVA STASIS', sub: 'スリープポッド // 予約受付中', color: '#FF0055', y: 30 }
            : undefined,
      });
    });

    return list;
  }, []);

  // Skybridges connecting skyscrapers high above the street
  const skybridges = useMemo(() => {
    return [
      { z: -20, y: 34 },
      { z: -86, y: 38 },
      { z: -148, y: 32 },
    ];
  }, []);

  // Blinking rooftop aviation beacons & pulsating billboards
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const flash = Math.sin(time * 3.5) > 0.35 ? 1 : 0.12;

    if (beaconLightsRef.current) {
      beaconLightsRef.current.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = flash;
      });
    }

    if (billboardsRef.current) {
      billboardsRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        if (mat) {
          mat.opacity = 0.85 + Math.sin(time * 3 + i) * 0.15;
        }
      });
    }
  });

  return (
    <group>
      {/* 1. Skyscraper Towers with Procedural PBR Office Facades & Realistic Rooftop Mechanicals */}
      {buildings.map((b, idx) => {
        const facingInward = b.x < 0 ? 1 : -1;
        const frontFaceX = facingInward * (b.width / 2 + 0.05);
        const tex = facadeTextures[b.seed] || undefined;

        return (
          <group key={`bldg-${idx}`} position={[b.x, 0, b.z]}>
            {/* Main Skyscraper Structural Mass (Dark Charcoal Concrete / Gunmetal) */}
            <mesh position={[0, b.height / 2, 0]} receiveShadow>
              <boxGeometry args={[b.width, b.height, b.depth]} />
              <meshStandardMaterial
                color="#141720"
                roughness={0.65}
                metalness={0.5}
              />
            </mesh>

            {/* Front Inward-Facing Detailed Window Facade with Lit Offices & Blinds */}
            <mesh
              position={[frontFaceX, b.height / 2, 0]}
              rotation={[0, b.x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
            >
              <planeGeometry args={[b.depth * 0.94, b.height * 0.94]} />
              <meshStandardMaterial
                map={tex}
                color="#ffffff"
                roughness={0.2}
                metalness={0.8}
                emissive="#ffffff"
                emissiveMap={tex}
                emissiveIntensity={0.35}
              />
            </mesh>

            {/* Stepped Architectural Crown / Setback Penthouse Roof */}
            <mesh position={[0, b.height + 2.5, 0]}>
              <boxGeometry args={[b.width * 0.75, 5, b.depth * 0.75]} />
              <meshStandardMaterial color="#0e1017" roughness={0.75} metalness={0.6} />
            </mesh>

            {/* Vertical Glowing Structural Corner Fin */}
            <mesh position={[facingInward * (b.width / 2 + 0.08), b.height / 2, -b.depth * 0.45]}>
              <boxGeometry args={[0.12, b.height * 0.98, 0.2]} />
              <meshBasicMaterial color={b.x < 0 ? '#00F3FF' : '#FF0055'} />
            </mesh>

            {/* Rooftop Industrial HVAC Cooling Towers & Chillers */}
            <group position={[0, b.height + 5.2, 0]}>
              {/* Chiller Box */}
              <mesh position={[-2, 0.8, -2]}>
                <boxGeometry args={[3.2, 1.6, 2.4]} />
                <meshStandardMaterial color="#22252a" roughness={0.7} metalness={0.5} />
              </mesh>
              {/* Cylindrical Cooling Towers */}
              <mesh position={[2, 0.9, 1]}>
                <cylinderGeometry args={[1.2, 1.2, 1.8, 16]} />
                <meshStandardMaterial color="#1a1c22" roughness={0.6} metalness={0.6} />
              </mesh>
              {/* Ductwork Conduit Pipe */}
              <mesh position={[0, 0.4, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.3, 0.3, 4, 8]} />
                <meshStandardMaterial color="#333" metalness={0.9} />
              </mesh>
            </group>

            {/* Rooftop Telecommunications Antenna Spire */}
            <mesh position={[0, b.height + 10.5, 0]}>
              <cylinderGeometry args={[0.06, 0.18, 11, 8]} />
              <meshStandardMaterial color="#888" metalness={0.9} />
            </mesh>
          </group>
        );
      })}

      {/* 2. Giant Glowing Cyberpunk Billboards with Steel Truss Mounts */}
      <group ref={billboardsRef}>
        {buildings
          .filter((b) => b.billboard)
          .map((b, bIdx) => {
            const facingInward = b.x < 0 ? 1 : -1;
            const xPos = b.x + facingInward * (b.width / 2 + 0.45);

            return (
              <group
                key={`bb-${bIdx}`}
                position={[xPos, b.billboard!.y, b.z]}
                rotation={[0, b.x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
              >
                {/* Structural Steel Truss Mounting Frame */}
                <mesh position={[0, 0, -0.1]}>
                  <boxGeometry args={[9.8, 4.8, 0.2]} />
                  <meshStandardMaterial color="#161820" metalness={0.9} roughness={0.3} />
                </mesh>
                {/* Outer Hologram Support Cage */}
                <mesh position={[0, 0, -0.04]}>
                  <planeGeometry args={[9.5, 4.5]} />
                  <meshBasicMaterial color={b.billboard!.color} wireframe />
                </mesh>
                {/* High-Resolution Emissive Billboard Face */}
                <mesh>
                  <planeGeometry args={[9.2, 4.2]} />
                  <meshStandardMaterial
                    color="#090c14"
                    emissive={b.billboard!.color}
                    emissiveIntensity={0.65}
                    roughness={0.2}
                  />
                </mesh>
                {/* Realistic Controlled Point Light casting soft billboard color */}
                <pointLight
                  position={[0, 0, 1.2]}
                  color={b.billboard!.color}
                  intensity={1.8}
                  distance={14}
                  decay={2}
                />
              </group>
            );
          })}
      </group>

      {/* 3. Illuminated Skybridges with Structural Trusses */}
      {skybridges.map((sb, sbIdx) => (
        <group key={`skybridge-${sbIdx}`} position={[0, sb.y, sb.z]}>
          {/* Main Enclosed Bridge Truss */}
          <mesh>
            <boxGeometry args={[38, 3.4, 4.4]} />
            <meshStandardMaterial color="#121520" roughness={0.5} metalness={0.8} />
          </mesh>
          {/* Continuous Window Galleries with Interior Warm Glow */}
          <mesh position={[0, 0, 2.22]}>
            <planeGeometry args={[36, 1.5]} />
            <meshBasicMaterial color="#00F3FF" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0, -2.22]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[36, 1.5]} />
            <meshBasicMaterial color="#00F3FF" transparent opacity={0.6} />
          </mesh>
          {/* Underbridge Magenta Safety Rail Light */}
          <mesh position={[0, -1.72, 0]}>
            <boxGeometry args={[36, 0.06, 4.4]} />
            <meshBasicMaterial color="#FF0055" />
          </mesh>
        </group>
      ))}

      {/* 4. Rooftop Aviation Hazard Strobes */}
      <group ref={beaconLightsRef}>
        {buildings.map((b, idx) => (
          <mesh key={`beacon-${idx}`} position={[b.x, b.height + 16.2, b.z]}>
            <sphereGeometry args={[0.35, 8, 8]} />
            <meshBasicMaterial color={b.beaconColor || '#FF0055'} transparent opacity={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
