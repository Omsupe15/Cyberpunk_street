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

  // Strategic solar road studs along center median (reduced to graceful 10m intervals)
  const catEyeZs = useMemo(() => {
    const list: number[] = [];
    for (let z = 6; z > -175; z -= 10.0) {
      list.push(z);
    }
    return list;
  }, []);

  // Recessed cast-iron municipal utility manholes along lanes
  const manholeLocations = useMemo(() => [
    { x: -3.5, z: -18, rot: 0.4 },
    { x: 3.5, z: -46, rot: 1.2 },
    { x: -3.5, z: -86, rot: -0.8 },
    { x: 3.5, z: -130, rot: 0.6 },
    { x: -3.5, z: -158, rot: -1.1 },
  ], []);

  // Sidewalk bollards along curb (spaced gracefully every 20m)
  const bollardZs = useMemo(() => {
    const list: number[] = [];
    for (let z = 4; z > -175; z -= 20) {
      list.push(z);
    }
    return list;
  }, []);

  // Embedded Sidewalk Curb LED Puck Lights
  const curbPuckZs = useMemo(() => {
    const list: number[] = [];
    for (let z = 6; z > -175; z -= 12.0) {
      list.push(z);
    }
    return list;
  }, []);

  // Curbside storm drainage grates along gutters
  const drainZs = useMemo(() => [-10, -32, -58, -80, -104, -128, -152, -170], []);

  // Curated street furniture vignettes placed out of the central walking path
  const streetProps = useMemo(() => {
    return [
      { type: 'kiosk', x: -8.8, z: -14, rot: 0.15 },
      { type: 'hydrant', x: 8.2, z: -20, rot: -Math.PI / 2 },
      { type: 'charger', x: 8.5, z: -52, rot: -Math.PI / 2 },
      { type: 'bin', x: -8.6, z: -56, rot: Math.PI / 2 },
      { type: 'kiosk', x: 8.8, z: -94, rot: -0.2 },
      { type: 'hydrant', x: -8.2, z: -98, rot: Math.PI / 2 },
      { type: 'bin', x: -8.5, z: -122, rot: -Math.PI / 2 },
      { type: 'transformer', x: 8.9, z: -138, rot: Math.PI },
      { type: 'kiosk', x: -8.8, z: -162, rot: 0.1 },
    ];
  }, []);

  // Wall-mounted double-sided neon blade signs pushed back to outer facade lines (X = ±13.0m)
  const wallBladeSigns = useMemo(() => {
    return [
      { x: -13.0, y: 5.2, z: -16, side: 'left', key: 'noodle' },
      { x: 13.0, y: 5.4, z: -48, side: 'right', key: 'clinic' },
      { x: -13.0, y: 5.2, z: -88, side: 'left', key: 'data' },
      { x: 13.0, y: 5.5, z: -124, side: 'right', key: 'lounge' },
      { x: -13.0, y: 5.2, z: -140, side: 'left', key: 'casino' },
      { x: 13.0, y: 5.0, z: -164, side: 'right', key: 'hotel' },
    ];
  }, []);

  const halfRoad = ROAD_WIDTH / 2; // 7.0m
  const sidewalkCenterLeft = -(halfRoad + SIDEWALK_WIDTH / 2); // -9.25m
  const sidewalkCenterRight = halfRoad + SIDEWALK_WIDTH / 2; // +9.25m

  return (
    <group>
      {/* 1. Main 14m 4-Lane Grand Avenue Dry Matte Asphalt Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -85]} receiveShadow>
        <planeGeometry args={[ROAD_WIDTH, 195]} />
        <meshStandardMaterial
          map={asphaltTex || undefined}
          color="#242838"
          roughness={0.88}
          metalness={0.08}
        />
      </mesh>

      {/* 2. Recessed Cast-Iron Municipal Utility Manhole Covers (Matte Industrial Iron) */}
      {manholeLocations.map((mh, mIdx) => (
        <group key={`manhole-${mIdx}`} position={[mh.x, 0.009, mh.z]} rotation={[0, mh.rot, 0]}>
          {/* Manhole Rim */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.38, 0.44, 24]} />
            <meshStandardMaterial color="#383e52" metalness={0.5} roughness={0.65} />
          </mesh>
          {/* Manhole Main Plate */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.38, 24]} />
            <meshStandardMaterial color="#2e3446" metalness={0.45} roughness={0.7} />
          </mesh>
          {/* Inner Geometric Grip Pattern */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.18, 0.28, 8]} />
            <meshStandardMaterial color="#3a4258" metalness={0.4} roughness={0.7} />
          </mesh>
          {/* Sector 07 Embossed Center Boss */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.002]}>
            <circleGeometry args={[0.08, 12]} />
            <meshStandardMaterial color="#424c64" metalness={0.5} roughness={0.65} />
          </mesh>
        </group>
      ))}

      {/* 3. Embedded Solar Road Studs along Center Median Lines */}
      {catEyeZs.map((zPos, idx) => (
        <group key={`cateye-${idx}`} position={[0, 0.015, zPos]}>
          {/* Center Double Amber Studs */}
          <mesh position={[-0.12, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.038, 8]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
          <mesh position={[0.12, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.038, 8]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
          {/* Subtle Outer Lane Guide Pucks */}
          <mesh position={[-3.5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.028, 8]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
          <mesh position={[3.5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.028, 8]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
        </group>
      ))}

      {/* 4. Curbside Storm Sewer Drainage Grates with Slot Depth (No Obsidian Voids) */}
      {drainZs.map((zPos, idx) => (
        <group key={`drain-${idx}`}>
          {/* Left Gutter Drain */}
          <group position={[-(halfRoad - 0.22), 0.008, zPos]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.38, 0.95]} />
              <meshStandardMaterial color="#2a3042" roughness={0.7} metalness={0.5} />
            </mesh>
            {/* Recessed Slot Insets (Rich Slate Shadows, Not Pure Black) */}
            {[-0.32, -0.16, 0, 0.16, 0.32].map((slotZ, sIdx) => (
              <mesh key={`slot-l-${sIdx}`} position={[0, 0.002, slotZ]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.26, 0.05]} />
                <meshBasicMaterial color="#1c2234" />
              </mesh>
            ))}
          </group>

          {/* Right Gutter Drain */}
          <group position={[halfRoad - 0.22, 0.008, zPos]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.38, 0.95]} />
              <meshStandardMaterial color="#2a3042" roughness={0.7} metalness={0.5} />
            </mesh>
            {[-0.32, -0.16, 0, 0.16, 0.32].map((slotZ, sIdx) => (
              <mesh key={`slot-r-${sIdx}`} position={[0, 0.002, slotZ]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.26, 0.05]} />
                <meshBasicMaterial color="#1c2234" />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* 5. Left Pedestrian Sidewalk (Width: 4.5m, Elevation: 0.16m, Industrial Matte Slate Paving) */}
      <mesh position={[sidewalkCenterLeft, 0.08, -85]} receiveShadow>
        <boxGeometry args={[SIDEWALK_WIDTH, 0.16, 195]} />
        <meshStandardMaterial
          map={sidewalkTex || undefined}
          color="#2d3346"
          roughness={0.82}
          metalness={0.10}
        />
      </mesh>
      {/* Left Chamfered Granite Curb Stone */}
      <mesh position={[-halfRoad, 0.09, -85]}>
        <boxGeometry args={[0.16, 0.18, 195]} />
        <meshStandardMaterial color="#262c3e" roughness={0.85} metalness={0.15} />
      </mesh>
      {/* Left Neon Curb Light Strip (Cyber Cyan) */}
      <mesh position={[-(halfRoad - 0.04), 0.162, -85]}>
        <boxGeometry args={[0.04, 0.015, 195]} />
        <meshBasicMaterial color="#00F3FF" />
      </mesh>

      {/* 6. Right Pedestrian Sidewalk (Width: 4.5m, Elevation: 0.16m, Industrial Matte Slate Paving) */}
      <mesh position={[sidewalkCenterRight, 0.08, -85]} receiveShadow>
        <boxGeometry args={[SIDEWALK_WIDTH, 0.16, 195]} />
        <meshStandardMaterial
          map={sidewalkTex || undefined}
          color="#2d3346"
          roughness={0.82}
          metalness={0.10}
        />
      </mesh>
      {/* Right Chamfered Granite Curb Stone */}
      <mesh position={[halfRoad, 0.09, -85]}>
        <boxGeometry args={[0.16, 0.18, 195]} />
        <meshStandardMaterial color="#262c3e" roughness={0.85} metalness={0.15} />
      </mesh>
      {/* Right Neon Curb Light Strip (Plasma Amber) */}
      <mesh position={[halfRoad - 0.04, 0.162, -85]}>
        <boxGeometry args={[0.04, 0.015, 195]} />
        <meshBasicMaterial color="#FFAA00" />
      </mesh>

      {/* 7. Embedded Sidewalk Curb LED Puck Lights */}
      {curbPuckZs.map((zPos, idx) => (
        <group key={`puck-${idx}`}>
          <mesh position={[-halfRoad, 0.165, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.045, 12]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          <mesh position={[halfRoad, 0.165, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.045, 12]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>
      ))}

      {/* 8. Tactical Pedestrian Bollards along Curb Edges (Matte finish) */}
      {bollardZs.map((zPos, idx) => (
        <group key={`bollard-${idx}`}>
          <group position={[-(halfRoad + 0.35), 0.16, zPos]}>
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.07, 0.08, 0.76, 12]} />
              <meshStandardMaterial color="#2c3244" metalness={0.3} roughness={0.75} />
            </mesh>
            <mesh position={[0, 0.62, 0]}>
              <cylinderGeometry args={[0.076, 0.076, 0.035, 12]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>
            <mesh position={[0, 0.78, 0]}>
              <sphereGeometry args={[0.065, 8, 8]} />
              <meshStandardMaterial color="#3a4258" metalness={0.35} roughness={0.7} />
            </mesh>
          </group>

          <group position={[halfRoad + 0.35, 0.16, zPos]}>
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.07, 0.08, 0.76, 12]} />
              <meshStandardMaterial color="#2c3244" metalness={0.3} roughness={0.75} />
            </mesh>
            <mesh position={[0, 0.62, 0]}>
              <cylinderGeometry args={[0.076, 0.076, 0.035, 12]} />
              <meshBasicMaterial color="#FFAA00" />
            </mesh>
            <mesh position={[0, 0.78, 0]}>
              <sphereGeometry args={[0.065, 8, 8]} />
              <meshStandardMaterial color="#3a4258" metalness={0.35} roughness={0.7} />
            </mesh>
          </group>
        </group>
      ))}

      {/* 9. Wall-Mounted Double-Sided Neon Blade Signs (Pushed back to X = ±13.0m, Matte chassis) */}
      {wallBladeSigns.map((sign, idx) => {
        const tex = bladeSigns[sign.key] || undefined;
        const isLeft = sign.side === 'left';

        return (
          <group key={`blade-${idx}`} position={[sign.x, sign.y, sign.z]}>
            <mesh position={[isLeft ? -0.4 : 0.4, 0.7, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.8, 8]} />
              <meshStandardMaterial color="#2a3042" metalness={0.3} roughness={0.75} />
            </mesh>
            <mesh position={[isLeft ? -0.4 : 0.4, -0.7, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.8, 8]} />
              <meshStandardMaterial color="#2a3042" metalness={0.3} roughness={0.75} />
            </mesh>

            {/* Neon Blade Housing */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.08, 2.0, 1.0]} />
              <meshStandardMaterial color="#252c3e" metalness={0.25} roughness={0.75} />
            </mesh>
            {/* Front & Back Glowing Faces */}
            <mesh position={[isLeft ? 0.045 : -0.045, 0, 0]} rotation={[0, isLeft ? Math.PI / 2 : -Math.PI / 2, 0]}>
              <planeGeometry args={[0.92, 1.9]} />
              <meshStandardMaterial
                map={tex}
                color="#ffffff"
                emissive="#ffffff"
                emissiveMap={tex}
                emissiveIntensity={0.95}
                roughness={0.5}
              />
            </mesh>
          </group>
        );
      })}

      {/* 10. Curated Street Furniture Vignettes (Matte technical materials) */}
      {streetProps.map((prop, idx) => {
        if (prop.type === 'kiosk') {
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.16, prop.z]} rotation={[0, prop.rot, 0]}>
              <mesh position={[0, 0.9, 0]}>
                <boxGeometry args={[0.48, 1.8, 0.3]} />
                <meshStandardMaterial color="#282e40" metalness={0.25} roughness={0.75} />
              </mesh>
              {/* Holographic Headline Screen */}
              <mesh position={[0, 1.1, 0.16]}>
                <planeGeometry args={[0.4, 0.75]} />
                <meshBasicMaterial color="#00F3FF" transparent opacity={0.85} />
              </mesh>
              <mesh position={[0, 1.72, 0.16]}>
                <planeGeometry args={[0.38, 0.06]} />
                <meshBasicMaterial color="#00F0FF" />
              </mesh>
            </group>
          );
        } else if (prop.type === 'charger') {
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.16, prop.z]} rotation={[0, prop.rot, 0]}>
              <mesh position={[0, 0.75, 0]}>
                <boxGeometry args={[0.32, 1.5, 0.28]} />
                <meshStandardMaterial color="#282e40" metalness={0.25} roughness={0.75} />
              </mesh>
              <mesh position={[0, 1.2, 0.15]}>
                <planeGeometry args={[0.22, 0.35]} />
                <meshBasicMaterial color="#05FFA1" />
              </mesh>
              <mesh position={[0, 0.6, 0.15]}>
                <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
                <meshStandardMaterial color="#3a4258" metalness={0.4} roughness={0.7} />
              </mesh>
            </group>
          );
        } else if (prop.type === 'hydrant') {
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.16, prop.z]} rotation={[0, prop.rot, 0]}>
              <mesh position={[0, 0.06, 0]}>
                <cylinderGeometry args={[0.18, 0.22, 0.12, 12]} />
                <meshStandardMaterial color="#2c3244" metalness={0.3} roughness={0.75} />
              </mesh>
              <mesh position={[0, 0.38, 0]}>
                <cylinderGeometry args={[0.13, 0.14, 0.55, 12]} />
                <meshStandardMaterial color="#c2410c" roughness={0.7} metalness={0.2} />
              </mesh>
              <mesh position={[0.15, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.055, 0.055, 0.12, 8]} />
                <meshStandardMaterial color="#FFAA00" metalness={0.4} roughness={0.6} />
              </mesh>
              <mesh position={[-0.15, 0.42, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.055, 0.055, 0.12, 8]} />
                <meshStandardMaterial color="#FFAA00" metalness={0.4} roughness={0.6} />
              </mesh>
            </group>
          );
        } else if (prop.type === 'transformer') {
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.16, prop.z]} rotation={[0, prop.rot, 0]}>
              <mesh position={[0, 0.65, 0]}>
                <boxGeometry args={[0.9, 1.3, 0.7]} />
                <meshStandardMaterial color="#282e40" metalness={0.2} roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.8, 0.36]}>
                <planeGeometry args={[0.7, 0.4]} />
                <meshStandardMaterial color="#202536" roughness={0.85} />
              </mesh>
              <mesh position={[0, 0.35, 0.36]}>
                <planeGeometry args={[0.25, 0.25]} />
                <meshBasicMaterial color="#FFAA00" />
              </mesh>
            </group>
          );
        } else {
          // Smart Trash Receptacle
          return (
            <group key={`prop-${idx}`} position={[prop.x, 0.16, prop.z]} rotation={[0, prop.rot, 0]}>
              <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.55, 1.0, 0.38]} />
                <meshStandardMaterial color="#282e40" metalness={0.25} roughness={0.75} />
              </mesh>
              <mesh position={[-0.14, 0.75, 0.2]}>
                <planeGeometry args={[0.16, 0.08]} />
                <meshBasicMaterial color="#00F0FF" />
              </mesh>
              <mesh position={[0.14, 0.75, 0.2]}>
                <planeGeometry args={[0.16, 0.08]} />
                <meshBasicMaterial color="#05FFA1" />
              </mesh>
            </group>
          );
        }
      })}

      {/* 11. Pedestrian Crosswalks with Roadway Embedded LED Strips & Traffic Signal Posts */}
      {[-52, -128].map((crossZ, cIdx) => (
        <group key={`crosswalk-${cIdx}`}>
          {[-5.5, -4.0, -2.5, -1.0, 0.5, 2.0, 3.5, 5.0].map((xOffset, stripeIdx) => (
            <mesh
              key={stripeIdx}
              rotation={[-Math.PI / 2, 0, 0]}
              position={[xOffset, 0.012, crossZ]}
            >
              <planeGeometry args={[0.75, 3.8]} />
              <meshStandardMaterial
                color="#e2e8f0"
                roughness={0.8}
                emissive="#94a3b8"
                emissiveIntensity={0.15}
              />
            </mesh>
          ))}

          {/* Road Embedded Sensor Light Bars at Crossing Thresholds */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, crossZ - 2.1]}>
            <planeGeometry args={[13.5, 0.06]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.014, crossZ + 2.1]}>
            <planeGeometry args={[13.5, 0.06]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>

          {/* Traffic Signal Posts at Curb Edges */}
          <group position={[-(halfRoad + 0.45), 0.16, crossZ + 2.0]}>
            <mesh position={[0, 1.4, 0]}>
              <cylinderGeometry args={[0.04, 0.05, 2.8, 8]} />
              <meshStandardMaterial color="#2a3042" metalness={0.3} roughness={0.75} />
            </mesh>
            <mesh position={[0, 2.4, 0]}>
              <boxGeometry args={[0.2, 0.44, 0.2]} />
              <meshStandardMaterial color="#24293a" roughness={0.8} />
            </mesh>
            <mesh position={[0.11, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.06, 12]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>
            <mesh position={[0.11, 2.3, 0]} rotation={[0, Math.PI / 2, 0]}>
              <circleGeometry args={[0.06, 12]} />
              <meshBasicMaterial color="#FF0055" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}
