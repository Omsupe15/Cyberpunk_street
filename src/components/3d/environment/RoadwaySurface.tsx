'use client';
import { useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { getAsphaltTexture, getSidewalkTexture } from '@/lib/proceduralTextures';

export function RoadwaySurface() {
  const [asphaltTex, setAsphaltTex] = useState<THREE.CanvasTexture | null>(null);
  const [sidewalkTex, setSidewalkTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    setAsphaltTex(getAsphaltTexture());
    setSidewalkTex(getSidewalkTexture());
  }, []);

  // Dashed center lines along the 190m street
  const centerDashes = useMemo(() => {
    const dashes: number[] = [];
    for (let z = 8; z > -175; z -= 4.8) {
      dashes.push(z);
    }
    return dashes;
  }, []);

  // Specular puddle locations reflecting ambient neon
  const puddles = useMemo(() => {
    return [
      { x: -1.2, z: -18, rx: 1.5, rz: 3.4, rot: 0.18 },
      { x: 1.5, z: -34, rx: 1.8, rz: 4.2, rot: -0.15 },
      { x: -0.8, z: -52, rx: 1.3, rz: 2.8, rot: 0.25 },
      { x: 1.2, z: -72, rx: 2.1, rz: 4.6, rot: 0.1 },
      { x: -1.5, z: -92, rx: 1.6, rz: 3.2, rot: -0.22 },
      { x: 0.6, z: -112, rx: 2.0, rz: 4.4, rot: 0.16 },
      { x: -1.1, z: -136, rx: 1.7, rz: 3.6, rot: -0.12 },
      { x: 1.3, z: -154, rx: 2.2, rz: 5.0, rot: 0.18 },
    ];
  }, []);

  // Sidewalk bollards along the curb
  const bollardZs = useMemo(() => {
    const list: number[] = [];
    for (let z = 6; z > -175; z -= 14) {
      list.push(z);
    }
    return list;
  }, []);

  // Sewer drainage grates along gutters
  const drainZs = useMemo(() => [-10, -28, -50, -78, -100, -122, -148, -168], []);

  // Street furniture locations: Trash bins, Data Terminals, Fire Hydrants, Transformers
  const streetProps = useMemo(() => {
    return [
      { type: 'kiosk', x: -5.4, z: -14, rot: 0.2 },
      { type: 'hydrant', x: 4.8, z: -22, rot: -Math.PI / 2 },
      { type: 'transformer', x: -5.6, z: -44, rot: 0 },
      { type: 'bin', x: 5.2, z: -58, rot: Math.PI / 2 },
      { type: 'kiosk', x: 5.3, z: -84, rot: -0.3 },
      { type: 'hydrant', x: -4.8, z: -98, rot: Math.PI / 2 },
      { type: 'bin', x: -5.2, z: -118, rot: -Math.PI / 2 },
      { type: 'transformer', x: 5.6, z: -138, rot: Math.PI },
      { type: 'kiosk', x: -5.3, z: -158, rot: 0.15 },
    ];
  }, []);

  return (
    <group>
      {/* 1. Main Asphalt Roadway with Procedural Texture & Rain-slick PBR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -85]} receiveShadow>
        <planeGeometry args={[8.4, 195]} />
        <meshStandardMaterial
          map={asphaltTex || undefined}
          color="#222630"
          roughness={0.28}
          metalness={0.35}
        />
      </mesh>

      {/* 2. Specular Water Puddles with Organic Soft Wet Edges */}
      {puddles.map((p, idx) => (
        <group key={`puddle-${idx}`} position={[p.x, 0.006, p.z]} rotation={[-Math.PI / 2, 0, p.rot]}>
          {/* Damp Dark Ring around puddle */}
          <mesh position={[0, 0, -0.001]}>
            <circleGeometry args={[p.rx * 0.65, 20]} />
            <meshBasicMaterial color="#0c1018" transparent opacity={0.65} />
          </mesh>
          {/* Glossy High-Reflective Center */}
          <mesh>
            <circleGeometry args={[p.rx * 0.52, 20]} />
            <meshStandardMaterial
              color="#070a12"
              roughness={0.02}
              metalness={0.96}
              transparent
              opacity={0.88}
            />
          </mesh>
        </group>
      ))}

      {/* 3. Glowing Broken Cyan Centerline */}
      {centerDashes.map((zPos, idx) => (
        <mesh key={`dash-${idx}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, zPos]}>
          <planeGeometry args={[0.22, 2.5]} />
          <meshBasicMaterial color="#00F3FF" />
        </mesh>
      ))}

      {/* 4. Glowing Roadway Chevrons / Waypoint Navigation Arrows */}
      {[-24, -64, -104, -144].map((zPos, idx) => (
        <group key={`chevron-${idx}`} position={[0, 0.012, zPos]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.85, 0, 0]}>
            <planeGeometry args={[0.16, 1.4]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.85, 0, 0]}>
            <planeGeometry args={[0.16, 1.4]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>
      ))}

      {/* 5. Gutter Storm Sewer Drainage Grates */}
      {drainZs.map((zPos, idx) => (
        <group key={`drain-${idx}`}>
          {/* Left Drain */}
          <mesh position={[-4.05, 0.008, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 0.8]} />
            <meshStandardMaterial color="#0a0c10" roughness={0.8} metalness={0.9} />
          </mesh>
          {/* Right Drain */}
          <mesh position={[4.05, 0.008, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.3, 0.8]} />
            <meshStandardMaterial color="#0a0c10" roughness={0.8} metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 6. Left Sidewalk (Width: 3.6m, Elevation: 0.14m) */}
      <mesh position={[-6.0, 0.07, -85]} receiveShadow>
        <boxGeometry args={[3.6, 0.14, 195]} />
        <meshStandardMaterial
          map={sidewalkTex || undefined}
          color="#20242e"
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>
      {/* Left Chamfered Granite Curb Stone */}
      <mesh position={[-4.24, 0.08, -85]}>
        <boxGeometry args={[0.12, 0.16, 195]} />
        <meshStandardMaterial color="#2d323f" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Left Neon Curb Light Strip (Cyber Cyan) */}
      <mesh position={[-4.18, 0.142, -85]}>
        <boxGeometry args={[0.04, 0.02, 195]} />
        <meshBasicMaterial color="#00F3FF" />
      </mesh>

      {/* 7. Right Sidewalk (Width: 3.6m, Elevation: 0.14m) */}
      <mesh position={[6.0, 0.07, -85]} receiveShadow>
        <boxGeometry args={[3.6, 0.14, 195]} />
        <meshStandardMaterial
          map={sidewalkTex || undefined}
          color="#20242e"
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>
      {/* Right Chamfered Granite Curb Stone */}
      <mesh position={[4.24, 0.08, -85]}>
        <boxGeometry args={[0.12, 0.16, 195]} />
        <meshStandardMaterial color="#2d323f" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Right Neon Curb Light Strip (Neon Magenta) */}
      <mesh position={[4.18, 0.142, -85]}>
        <boxGeometry args={[0.04, 0.02, 195]} />
        <meshBasicMaterial color="#FF0055" />
      </mesh>

      {/* 8. Tactical Pedestrian Bollards along Curb Edges */}
      {bollardZs.map((zPos, idx) => (
        <group key={`bollard-${idx}`}>
          {/* Left Bollard */}
          <group position={[-4.42, 0.14, zPos]}>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.075, 0.085, 0.7, 12]} />
              <meshStandardMaterial color="#1c202a" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.58, 0]}>
              <cylinderGeometry args={[0.082, 0.082, 0.04, 12]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>
            <mesh position={[0, 0.72, 0]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="#2a3040" metalness={0.9} />
            </mesh>
          </group>

          {/* Right Bollard */}
          <group position={[4.42, 0.14, zPos]}>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.075, 0.085, 0.7, 12]} />
              <meshStandardMaterial color="#1c202a" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.58, 0]}>
              <cylinderGeometry args={[0.082, 0.082, 0.04, 12]} />
              <meshBasicMaterial color="#FF0055" />
            </mesh>
            <mesh position={[0, 0.72, 0]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial color="#2a3040" metalness={0.9} />
            </mesh>
          </group>
        </group>
      ))}

      {/* 9. Detailed Street Furniture Assets */}
      {streetProps.map((prop, idx) => {
        if (prop.type === 'kiosk') {
          // Holographic City Information / Data Terminal
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.14, prop.z]} rotation={[0, prop.rot, 0]}>
              {/* Pillar Base */}
              <mesh position={[0, 0.9, 0]}>
                <boxGeometry args={[0.45, 1.8, 0.28]} />
                <meshStandardMaterial color="#151922" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Holographic Interactive Glass Display */}
              <mesh position={[0, 1.1, 0.15]}>
                <planeGeometry args={[0.38, 0.75]} />
                <meshBasicMaterial color="#00F3FF" transparent opacity={0.85} />
              </mesh>
              {/* Status Header Light */}
              <mesh position={[0, 1.72, 0.15]}>
                <planeGeometry args={[0.36, 0.05]} />
                <meshBasicMaterial color="#FFAA00" />
              </mesh>
            </group>
          );
        } else if (prop.type === 'hydrant') {
          // Cyber Fire Hydrant
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.14, prop.z]} rotation={[0, prop.rot, 0]}>
              {/* Base Flange */}
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.18, 0.22, 0.12, 12]} />
                <meshStandardMaterial color="#222" metalness={0.8} />
              </mesh>
              {/* Hydrant Body */}
              <mesh position={[0, 0.38, 0]}>
                <cylinderGeometry args={[0.14, 0.15, 0.55, 12]} />
                <meshStandardMaterial color="#c22" roughness={0.4} metalness={0.6} />
              </mesh>
              {/* Brass Hose Nozzles */}
              <mesh position={[0.16, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[-0.16, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 0.12, 8]} />
                <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.2} />
              </mesh>
            </group>
          );
        } else if (prop.type === 'transformer') {
          // Heavy Ground Electrical Utility Transformer
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.14, prop.z]} rotation={[0, prop.rot, 0]}>
              <mesh position={[0, 0.65, 0]}>
                <boxGeometry args={[0.9, 1.3, 0.7]} />
                <meshStandardMaterial color="#1c201d" metalness={0.7} roughness={0.6} />
              </mesh>
              {/* Cooling Louvers */}
              <mesh position={[0, 0.8, 0.36]}>
                <planeGeometry args={[0.7, 0.4]} />
                <meshStandardMaterial color="#0e100e" roughness={0.8} />
              </mesh>
              {/* High Voltage Hazard Decal */}
              <mesh position={[0, 0.35, 0.36]}>
                <planeGeometry args={[0.25, 0.25]} />
                <meshBasicMaterial color="#FFAA00" />
              </mesh>
            </group>
          );
        } else {
          // Modern Dual Cyber-Recycling Bin
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.14, prop.z]} rotation={[0, prop.rot, 0]}>
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.65, 1.0, 0.4]} />
                <meshStandardMaterial color="#1a1e28" metalness={0.75} roughness={0.3} />
              </mesh>
              {/* Sorting Slots */}
              <mesh position={[-0.16, 0.75, 0.21]}>
                <planeGeometry args={[0.18, 0.08]} />
                <meshBasicMaterial color="#05FFA1" />
              </mesh>
              <mesh position={[0.16, 0.75, 0.21]}>
                <planeGeometry args={[0.18, 0.08]} />
                <meshBasicMaterial color="#00F3FF" />
              </mesh>
            </group>
          );
        }
      })}

      {/* 10. Cast-Iron Utility Manholes with Concentric Tread Rings */}
      {[-12, -40, -82, -125, -162].map((zPos, idx) => (
        <group key={`manhole-${idx}`} position={[-6.2, 0.142, zPos]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.48, 20]} />
            <meshStandardMaterial color="#141822" roughness={0.7} metalness={0.85} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.35, 0.38, 20]} />
            <meshStandardMaterial color="#283040" metalness={0.9} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.44, 0.48, 20]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>
      ))}

      {/* 11. Pedestrian Zebra Crosswalks */}
      {[-48, -128].map((crossZ, cIdx) => (
        <group key={`crosswalk-${cIdx}`}>
          {[-2.8, -1.8, -0.8, 0.2, 1.2, 2.2, 3.2].map((xOffset, stripeIdx) => (
            <mesh
              key={stripeIdx}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[xOffset, 0.012, crossZ]}
            >
              <planeGeometry args={[0.55, 3.2]} />
              <meshStandardMaterial
                color="#3d4658"
                roughness={0.5}
                emissive="#00F3FF"
                emissiveIntensity={0.15}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
