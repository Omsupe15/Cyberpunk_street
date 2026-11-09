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
  archetype: 'pagoda' | 'curved' | 'pyramid' | 'truss';
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
    for (let i = 0; i < 5; i++) {
      list.push(getSkyscraperFacadeTexture(i));
    }
    setFacadeTextures(list);
  }, []);

  // Distinct Skyscraper Archetypes pushed back into the midground (X = -29 to -34 and +29 to +34)
  const buildings: Skyscraper[] = useMemo(() => {
    const list: Skyscraper[] = [];
    const zStops = [14, -12, -36, -60, -84, -108, -132, -156, -180];

    // Left Flank Supertowers (X: -29m to -33m)
    zStops.forEach((z, idx) => {
      const height = 58 + (idx * 9) % 40;
      const archetypes: ('pagoda' | 'curved' | 'pyramid' | 'truss')[] = [
        'pagoda',
        'curved',
        'truss',
        'pyramid',
        'curved',
        'pagoda',
        'truss',
        'pyramid',
        'curved',
      ];
      list.push({
        x: -29 - (idx % 2) * 4,
        z: z,
        width: 18 + (idx % 3) * 2,
        height,
        depth: 20,
        archetype: archetypes[idx % archetypes.length],
        seed: idx % 5,
        hasBeacon: true,
        beaconColor: idx % 2 === 0 ? '#FF0055' : '#00F3FF',
        billboard:
          idx === 1
            ? { text: 'NEO SHANGHAI FINANCIAL', sub: '新上海金融 // HQ 01', color: '#00F3FF', y: 32 }
            : idx === 4
            ? { text: 'VEGAS HORIZON RESORT', sub: 'CASINO & SUITES // 娯楽', color: '#FFAA00', y: 36 }
            : idx === 7
            ? { text: 'QUANTUM DYNAMICS INC', sub: 'NEURAL LABS // 量子', color: '#FF0055', y: 30 }
            : undefined,
      });
    });

    // Right Flank Supertowers (X: +29m to +33m)
    zStops.forEach((z, idx) => {
      const height = 56 + ((idx + 2) * 8) % 42;
      const archetypes: ('pagoda' | 'curved' | 'pyramid' | 'truss')[] = [
        'curved',
        'pyramid',
        'pagoda',
        'truss',
        'pyramid',
        'curved',
        'pagoda',
        'truss',
        'pyramid',
      ];
      list.push({
        x: 29 + (idx % 2) * 4,
        z: z,
        width: 18 + ((idx + 1) % 3) * 2,
        height,
        depth: 20,
        archetype: archetypes[idx % archetypes.length],
        seed: (idx + 2) % 5,
        hasBeacon: true,
        beaconColor: idx % 2 === 0 ? '#FFAA00' : '#FF0055',
        billboard:
          idx === 2
            ? { text: 'ORBITAL RECHARGE CORP', sub: 'STATION 07 // 軌道', color: '#05FFA1', y: 28 }
            : idx === 5
            ? { text: 'ASTRA LUXURY TOWER', sub: 'PENTHOUSE RESIDENCES', color: '#8A2BE2', y: 38 }
            : idx === 8
            ? { text: 'CYBERNETIC LIFE CORP', sub: 'BIOMECH RESEARCH', color: '#00F3FF', y: 34 }
            : undefined,
      });
    });

    return list;
  }, []);

  // Skybridges connecting skyscrapers high above the street (Elevated to Y: 38m - 46m)
  const skybridges = useMemo(() => {
    return [
      { z: -20, y: 38 },
      { z: -86, y: 44 },
      { z: -148, y: 40 },
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
          mat.opacity = 0.88 + Math.sin(time * 3 + i) * 0.12;
        }
      });
    }
  });

  return (
    <group>
      {/* 1. Skyscraper Towers with Distinct Architectural Archetypes */}
      {buildings.map((b, idx) => {
        const facingInward = b.x < 0 ? 1 : -1;
        const frontFaceX = facingInward * (b.width / 2 + 0.05);
        const tex = facadeTextures[b.seed] || undefined;

        return (
          <group key={`bldg-${idx}`} position={[b.x, 0, b.z]}>
            {/* Main Skyscraper Structural Mass (Deep Midnight Slate & Structural Steel) */}
            <mesh position={[0, b.height / 2, 0]} receiveShadow>
              <boxGeometry args={[b.width, b.height, b.depth]} />
              <meshStandardMaterial
                color="#161a26"
                roughness={0.65}
                metalness={0.45}
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
                emissiveIntensity={0.95}
              />
            </mesh>

            {/* Distinct Architectural Crowns based on Archetype */}
            {b.archetype === 'pagoda' && (
              // Jin Mao Stepped Pagoda Tower Crown
              <group position={[0, b.height, 0]}>
                {[0, 3, 6, 9].map((yStep, sIdx) => {
                  const scale = 1.0 - sIdx * 0.18;
                  return (
                    <group key={`step-${sIdx}`} position={[0, yStep + 1.2, 0]}>
                      <mesh>
                        <boxGeometry args={[b.width * scale, 2.2, b.depth * scale]} />
                        <meshStandardMaterial color="#1a1c26" metalness={0.85} />
                      </mesh>
                      {/* Illuminated Golden Eaves Slat */}
                      <mesh position={[0, 1.15, 0]}>
                        <boxGeometry args={[b.width * (scale + 0.08), 0.1, b.depth * (scale + 0.08)]} />
                        <meshBasicMaterial color="#FFAA00" />
                      </mesh>
                    </group>
                  );
                })}
              </group>
            )}

            {b.archetype === 'curved' && (
              // Curved Aerodynamic Crown
              <group position={[0, b.height + 4, 0]}>
                <mesh>
                  <cylinderGeometry args={[b.width * 0.25, b.width * 0.45, 8, 20]} />
                  <meshStandardMaterial color="#00F3FF" transparent opacity={0.6} metalness={0.9} />
                </mesh>
                <mesh position={[0, 4.2, 0]}>
                  <torusGeometry args={[b.width * 0.26, 0.08, 8, 24]} />
                  <meshBasicMaterial color="#00F3FF" />
                </mesh>
              </group>
            )}

            {b.archetype === 'pyramid' && (
              // Vegas Resort & Casino Pyramid Crown with Diamond Crest
              <group position={[0, b.height + 4.5, 0]}>
                <mesh rotation={[0, Math.PI / 4, 0]}>
                  <coneGeometry args={[b.width * 0.55, 9, 4]} />
                  <meshStandardMaterial color="#161822" metalness={0.85} roughness={0.25} />
                </mesh>
                {/* Glowing Diamond Tip */}
                <mesh position={[0, 4.8, 0]}>
                  <octahedronGeometry args={[0.9, 0]} />
                  <meshBasicMaterial color="#FFAA00" />
                </mesh>
              </group>
            )}

            {b.archetype === 'truss' && (
              // Monolith Structural Cross-Braced Truss Crown
              <group position={[0, b.height + 4, 0]}>
                <mesh>
                  <boxGeometry args={[b.width * 0.7, 7, b.depth * 0.7]} />
                  <meshBasicMaterial color="#FF0055" wireframe />
                </mesh>
                <mesh position={[0, 3.8, 0]}>
                  <boxGeometry args={[b.width * 0.72, 0.2, b.depth * 0.72]} />
                  <meshBasicMaterial color="#FF0055" />
                </mesh>
              </group>
            )}

            {/* Rooftop Telecommunications Antenna Spire */}
            <mesh position={[0, b.height + 15.5, 0]}>
              <cylinderGeometry args={[0.06, 0.2, 14, 8]} />
              <meshStandardMaterial color="#555" metalness={0.9} />
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
                  <boxGeometry args={[11.2, 5.2, 0.2]} />
                  <meshStandardMaterial color="#12141c" metalness={0.9} roughness={0.3} />
                </mesh>
                {/* Outer Hologram Support Cage */}
                <mesh position={[0, 0, -0.04]}>
                  <planeGeometry args={[10.8, 4.8]} />
                  <meshBasicMaterial color={b.billboard!.color} wireframe />
                </mesh>
                {/* High-Resolution Emissive Billboard Face */}
                <mesh>
                  <planeGeometry args={[10.5, 4.5]} />
                  <meshStandardMaterial
                    color="#080a12"
                    emissive={b.billboard!.color}
                    emissiveIntensity={0.8}
                    roughness={0.2}
                  />
                </mesh>
                {/* Controlled Point Light casting soft billboard color */}
                <pointLight
                  position={[0, 0, 1.0]}
                  color={b.billboard!.color}
                  intensity={0.65}
                  distance={9}
                  decay={2}
                />
              </group>
            );
          })}
      </group>

      {/* 3. Illuminated Skybridges with Structural Trusses (Elevated high above) */}
      {skybridges.map((sb, sbIdx) => (
        <group key={`skybridge-${sbIdx}`} position={[0, sb.y, sb.z]}>
          <mesh>
            <boxGeometry args={[56, 3.8, 4.6]} />
            <meshStandardMaterial color="#151722" roughness={0.5} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0, 2.32]}>
            <planeGeometry args={[54, 1.6]} />
            <meshBasicMaterial color="#00F3FF" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, 0, -2.32]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[54, 1.6]} />
            <meshBasicMaterial color="#00F3FF" transparent opacity={0.6} />
          </mesh>
          <mesh position={[0, -1.92, 0]}>
            <boxGeometry args={[54, 0.08, 4.6]} />
            <meshBasicMaterial color="#FF0055" />
          </mesh>
        </group>
      ))}

      {/* 4. Rooftop Aviation Hazard Strobes */}
      <group ref={beaconLightsRef}>
        {buildings.map((b, idx) => (
          <mesh key={`beacon-${idx}`} position={[b.x, b.height + 22.5, b.z]}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshBasicMaterial color={b.beaconColor || '#FF0055'} transparent opacity={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
