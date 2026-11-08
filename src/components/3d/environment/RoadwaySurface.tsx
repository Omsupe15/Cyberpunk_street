'use client';
import { useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { getAsphaltTexture, getSidewalkTexture, getNeonBladeSignTexture } from '@/lib/proceduralTextures';
import { ROAD_WIDTH, SIDEWALK_WIDTH } from '@/lib/constants';

export function RoadwaySurface() {
  const [asphaltTex, setAsphaltTex] = useState<THREE.CanvasTexture | null>(null);
  const [sidewalkTex, setSidewalkTex] = useState<THREE.CanvasTexture | null>(null);
  const [bladeSigns, setBladeSigns] = useState<Record<string, THREE.CanvasTexture>>({});

  useEffect(() => {
    setAsphaltTex(getAsphaltTexture());
    setSidewalkTex(getSidewalkTexture());
    setBladeSigns({
      noodle: getNeonBladeSignTexture('NOODLE BAR', 'ラーメン', '#FFAA00'),
      clinic: getNeonBladeSignTexture('CYBER CLINIC', '診療所', '#00F3FF'),
      lounge: getNeonBladeSignTexture('NEON LOUNGE', '酒場', '#FF0055'),
      data: getNeonBladeSignTexture('DATA NET', '通信', '#05FFA1'),
      casino: getNeonBladeSignTexture('CASINO ROYALE', '娯楽場', '#FFAA00'),
      hotel: getNeonBladeSignTexture('HOTEL SUITES', '客室', '#8A2BE2'),
    });
  }, []);

  // Specular puddle locations reflecting ambient neon across 14m wide avenue
  const puddles = useMemo(() => {
    return [
      { x: -2.8, z: -18, rx: 2.2, rz: 4.2, rot: 0.18 },
      { x: 3.2, z: -34, rx: 2.6, rz: 5.0, rot: -0.15 },
      { x: -1.8, z: -52, rx: 2.0, rz: 3.8, rot: 0.25 },
      { x: 2.4, z: -72, rx: 2.8, rz: 5.4, rot: 0.1 },
      { x: -3.4, z: -92, rx: 2.4, rz: 4.4, rot: -0.22 },
      { x: 1.6, z: -112, rx: 2.5, rz: 4.8, rot: 0.16 },
      { x: -2.2, z: -136, rx: 2.3, rz: 4.2, rot: -0.12 },
      { x: 3.0, z: -154, rx: 2.9, rz: 5.6, rot: 0.18 },
    ];
  }, []);

  // Cat-eye solar road studs along lane dividing lines (X = -3.5m, 0m, +3.5m)
  const catEyeZs = useMemo(() => {
    const list: number[] = [];
    for (let z = 8; z > -175; z -= 4.0) {
      list.push(z);
    }
    return list;
  }, []);

  // Sidewalk bollards along the curb
  const bollardZs = useMemo(() => {
    const list: number[] = [];
    for (let z = 6; z > -175; z -= 14) {
      list.push(z);
    }
    return list;
  }, []);

  // Embedded Sidewalk Curb LED Puck Lights
  const curbPuckZs = useMemo(() => {
    const list: number[] = [];
    for (let z = 8; z > -175; z -= 6.0) {
      list.push(z);
    }
    return list;
  }, []);

  // Sewer drainage grates along gutters
  const drainZs = useMemo(() => [-10, -28, -50, -78, -100, -122, -148, -168], []);

  // Street furniture locations: Trash bins, Data Terminals, Fire Hydrants, Transformers
  const streetProps = useMemo(() => {
    return [
      { type: 'kiosk', x: -8.8, z: -14, rot: 0.2 },
      { type: 'hydrant', x: 8.2, z: -22, rot: -Math.PI / 2 },
      { type: 'transformer', x: -9.0, z: -44, rot: 0 },
      { type: 'bin', x: 8.4, z: -58, rot: Math.PI / 2 },
      { type: 'kiosk', x: 8.6, z: -84, rot: -0.3 },
      { type: 'hydrant', x: -8.2, z: -98, rot: Math.PI / 2 },
      { type: 'bin', x: -8.4, z: -118, rot: -Math.PI / 2 },
      { type: 'transformer', x: 9.0, z: -138, rot: Math.PI },
      { type: 'kiosk', x: -8.6, z: -158, rot: 0.15 },
    ];
  }, []);

  // Perpendicular Neon Blade Signs mounted along building facades (English-First with Asian Subtitles)
  const wallBladeSigns = useMemo(() => {
    return [
      { x: -11.6, y: 4.8, z: -18, side: 'left', key: 'noodle' },
      { x: 11.6, y: 5.0, z: -48, side: 'right', key: 'clinic' },
      { x: -11.6, y: 4.8, z: -88, side: 'left', key: 'data' },
      { x: 11.6, y: 5.2, z: -126, side: 'right', key: 'lounge' },
      { x: -11.6, y: 5.0, z: -142, side: 'left', key: 'casino' },
      { x: 11.6, y: 4.8, z: -160, side: 'right', key: 'hotel' },
    ];
  }, []);

  const halfRoad = ROAD_WIDTH / 2; // 7.0m
  const sidewalkCenterLeft = -(halfRoad + SIDEWALK_WIDTH / 2); // -9.25m
  const sidewalkCenterRight = halfRoad + SIDEWALK_WIDTH / 2; // +9.25m

  return (
    <group>
      {/* 1. Main 14m 4-Lane Grand Avenue Asphalt Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -85]} receiveShadow>
        <planeGeometry args={[ROAD_WIDTH, 195]} />
        <meshStandardMaterial
          map={asphaltTex || undefined}
          color="#222632"
          roughness={0.25}
          metalness={0.35}
        />
      </mesh>

      {/* 2. Specular Water Puddles with Organic Soft Damp Edges */}
      {puddles.map((p, idx) => (
        <group key={`puddle-${idx}`} position={[p.x, 0.006, p.z]} rotation={[-Math.PI / 2, 0, p.rot]}>
          <mesh position={[0, 0, -0.001]}>
            <circleGeometry args={[p.rx * 0.65, 20]} />
            <meshBasicMaterial color="#0c1018" transparent opacity={0.65} />
          </mesh>
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

      {/* 3. Embedded Glowing Cat-Eye Solar Road Studs along Lane Dividers */}
      {catEyeZs.map((zPos, idx) => (
        <group key={`cateye-${idx}`} position={[0, 0.015, zPos]}>
          {/* Left Lane Divider Stud (White) */}
          <mesh position={[-3.5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.035, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Center Median Double Amber Studs */}
          <mesh position={[-0.1, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.038, 8]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
          <mesh position={[0.1, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.038, 8]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
          {/* Right Lane Divider Stud (White) */}
          <mesh position={[3.5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.035, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {/* 4. Gutter Storm Sewer Drainage Grates */}
      {drainZs.map((zPos, idx) => (
        <group key={`drain-${idx}`}>
          <mesh position={[-(halfRoad - 0.2), 0.008, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.35, 0.9]} />
            <meshStandardMaterial color="#0a0c10" roughness={0.8} metalness={0.9} />
          </mesh>
          <mesh position={[halfRoad - 0.2, 0.008, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.35, 0.9]} />
            <meshStandardMaterial color="#0a0c10" roughness={0.8} metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 5. Left Pedestrian Sidewalk (Width: 4.5m, Elevation: 0.16m) */}
      <mesh position={[sidewalkCenterLeft, 0.08, -85]} receiveShadow>
        <boxGeometry args={[SIDEWALK_WIDTH, 0.16, 195]} />
        <meshStandardMaterial
          map={sidewalkTex || undefined}
          color="#222632"
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>
      {/* Left Chamfered Granite Curb Stone */}
      <mesh position={[-halfRoad, 0.09, -85]}>
        <boxGeometry args={[0.16, 0.18, 195]} />
        <meshStandardMaterial color="#2c303e" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Left Neon Curb Light Strip (Cyber Cyan) */}
      <mesh position={[-(halfRoad - 0.04), 0.162, -85]}>
        <boxGeometry args={[0.05, 0.02, 195]} />
        <meshBasicMaterial color="#00F3FF" />
      </mesh>

      {/* 6. Right Pedestrian Sidewalk (Width: 4.5m, Elevation: 0.16m) */}
      <mesh position={[sidewalkCenterRight, 0.08, -85]} receiveShadow>
        <boxGeometry args={[SIDEWALK_WIDTH, 0.16, 195]} />
        <meshStandardMaterial
          map={sidewalkTex || undefined}
          color="#222632"
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>
      {/* Right Chamfered Granite Curb Stone */}
      <mesh position={[halfRoad, 0.09, -85]}>
        <boxGeometry args={[0.16, 0.18, 195]} />
        <meshStandardMaterial color="#2c303e" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Right Neon Curb Light Strip (Neon Magenta) */}
      <mesh position={[halfRoad - 0.04, 0.162, -85]}>
        <boxGeometry args={[0.05, 0.02, 195]} />
        <meshBasicMaterial color="#FF0055" />
      </mesh>

      {/* 7. Embedded Sidewalk Curb LED Puck Lights */}
      {curbPuckZs.map((zPos, idx) => (
        <group key={`puck-${idx}`}>
          <mesh position={[-halfRoad, 0.165, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.05, 12]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          <mesh position={[halfRoad, 0.165, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.05, 12]} />
            <meshBasicMaterial color="#FF0055" />
          </mesh>
        </group>
      ))}

      {/* 8. Tactical Pedestrian Bollards along Curb Edges */}
      {bollardZs.map((zPos, idx) => (
        <group key={`bollard-${idx}`}>
          <group position={[-(halfRoad + 0.35), 0.16, zPos]}>
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.08, 0.09, 0.76, 12]} />
              <meshStandardMaterial color="#1a1e28" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.62, 0]}>
              <cylinderGeometry args={[0.088, 0.088, 0.04, 12]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>
            <mesh position={[0, 0.78, 0]}>
              <sphereGeometry args={[0.075, 8, 8]} />
              <meshStandardMaterial color="#262c3a" metalness={0.9} />
            </mesh>
          </group>

          <group position={[halfRoad + 0.35, 0.16, zPos]}>
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.08, 0.09, 0.76, 12]} />
              <meshStandardMaterial color="#1a1e28" metalness={0.85} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.62, 0]}>
              <cylinderGeometry args={[0.088, 0.088, 0.04, 12]} />
              <meshBasicMaterial color="#FF0055" />
            </mesh>
            <mesh position={[0, 0.78, 0]}>
              <sphereGeometry args={[0.075, 8, 8]} />
              <meshStandardMaterial color="#262c3a" metalness={0.9} />
            </mesh>
          </group>
        </group>
      ))}

      {/* 9. Perpendicular Double-Sided Neon Blade Signs along Building Facades */}
      {wallBladeSigns.map((sign, idx) => {
        const tex = bladeSigns[sign.key] || undefined;
        const isLeft = sign.side === 'left';

        return (
          <group key={`blade-${idx}`} position={[sign.x, sign.y, sign.z]}>
            <mesh position={[isLeft ? -0.4 : 0.4, 0.7, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
              <meshStandardMaterial color="#333" metalness={0.9} />
            </mesh>
            <mesh position={[isLeft ? -0.4 : 0.4, -0.7, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
              <meshStandardMaterial color="#333" metalness={0.9} />
            </mesh>

            {/* Neon Blade Housing */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.09, 2.0, 1.0]} />
              <meshStandardMaterial color="#0e1017" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Front & Back Glowing Faces */}
            <mesh position={[isLeft ? 0.05 : -0.05, 0, 0]} rotation={[0, isLeft ? Math.PI / 2 : -Math.PI / 2, 0]}>
              <planeGeometry args={[0.92, 1.9]} />
              <meshStandardMaterial
                map={tex}
                color="#ffffff"
                emissive="#ffffff"
                emissiveMap={tex}
                emissiveIntensity={0.9}
                roughness={0.2}
              />
            </mesh>
          </group>
        );
      })}

      {/* 10. Detailed Street Furniture Assets */}
      {streetProps.map((prop, idx) => {
        if (prop.type === 'kiosk') {
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.16, prop.z]} rotation={[0, prop.rot, 0]}>
              <mesh position={[0, 0.9, 0]}>
                <boxGeometry args={[0.48, 1.8, 0.3]} />
                <meshStandardMaterial color="#141720" metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh position={[0, 1.1, 0.16]}>
                <planeGeometry args={[0.4, 0.75]} />
                <meshBasicMaterial color="#00F3FF" transparent opacity={0.85} />
              </mesh>
              <mesh position={[0, 1.72, 0.16]}>
                <planeGeometry args={[0.38, 0.06]} />
                <meshBasicMaterial color="#FFAA00" />
              </mesh>
            </group>
          );
        } else if (prop.type === 'hydrant') {
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.16, prop.z]} rotation={[0, prop.rot, 0]}>
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.18, 0.22, 0.12, 12]} />
                <meshStandardMaterial color="#222" metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.38, 0]}>
                <cylinderGeometry args={[0.14, 0.15, 0.55, 12]} />
                <meshStandardMaterial color="#b22" roughness={0.4} metalness={0.6} />
              </mesh>
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
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.16, prop.z]} rotation={[0, prop.rot, 0]}>
              <mesh position={[0, 0.65, 0]}>
                <boxGeometry args={[0.9, 1.3, 0.7]} />
                <meshStandardMaterial color="#1a1d1b" metalness={0.7} roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.8, 0.36]}>
                <planeGeometry args={[0.7, 0.4]} />
                <meshStandardMaterial color="#0c0e0c" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.35, 0.36]}>
                <planeGeometry args={[0.25, 0.25]} />
                <meshBasicMaterial color="#FFAA00" />
              </mesh>
            </group>
          );
        } else {
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.16, prop.z]} rotation={[0, prop.rot, 0]}>
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.65, 1.0, 0.4]} />
                <meshStandardMaterial color="#181c24" metalness={0.75} roughness={0.3} />
              </mesh>
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

      {/* 11. Pedestrian Crosswalks with Traffic Signal Posts */}
      {[-48, -128].map((crossZ, cIdx) => (
        <group key={`crosswalk-${cIdx}`}>
          {[-6.0, -4.5, -3.0, -1.5, 0, 1.5, 3.0, 4.5, 6.0].map((xOffset, stripeIdx) => (
            <mesh
              key={stripeIdx}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[xOffset, 0.012, crossZ]}
            >
              <planeGeometry args={[0.7, 3.6]} />
              <meshStandardMaterial
                color="#384254"
                roughness={0.5}
                emissive="#00F3FF"
                emissiveIntensity={0.14}
              />
            </mesh>
          ))}

          {/* Traffic Signal Posts at Curb Edges */}
          <group position={[-(halfRoad + 0.5), 0.16, crossZ + 2.0]}>
            <mesh position={[0, 1.3, 0]}>
              <cylinderGeometry args={[0.045, 0.055, 2.6, 8]} />
              <meshStandardMaterial color="#111" metalness={0.9} />
            </mesh>
            <mesh position={[0, 2.3, 0]}>
              <boxGeometry args={[0.22, 0.46, 0.22]} />
              <meshStandardMaterial color="#181818" />
            </mesh>
            <mesh position={[0.12, 2.4, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.065, 12]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>
            <mesh position={[0.12, 2.2, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.065, 12]} />
              <meshBasicMaterial color="#FF0055" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
