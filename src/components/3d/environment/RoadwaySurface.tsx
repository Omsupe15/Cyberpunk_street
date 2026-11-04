'use client';
import { useMemo } from 'react';
import * as THREE from 'three';

export function RoadwaySurface() {
  // Generate dashed center lines along the 170m street
  const centerDashes = useMemo(() => {
    const dashes: number[] = [];
    for (let z = 5; z > -175; z -= 5) {
      dashes.push(z);
    }
    return dashes;
  }, []);

  return (
    <group>
      {/* 1. Main Wet Asphalt Roadway (Width: 8m, Length: 190m) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -85]} receiveShadow>
        <planeGeometry args={[8.4, 190]} />
        <meshStandardMaterial
          color="#101217"
          roughness={0.18}
          metalness={0.35}
        />
      </mesh>

      {/* 2. Glowing Broken Cyan Centerline */}
      {centerDashes.map((zPos, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, zPos]}>
          <planeGeometry args={[0.22, 2.8]} />
          <meshBasicMaterial color="#00F3FF" />
        </mesh>
      ))}

      {/* 3. Left Sidewalk (Width: 3.6m, Elevation: 0.14m) */}
      <mesh position={[-6.0, 0.07, -85]} receiveShadow>
        <boxGeometry args={[3.6, 0.14, 190]} />
        <meshStandardMaterial color="#1a1c24" roughness={0.75} metalness={0.15} />
      </mesh>
      {/* Left Curb Metal Trim */}
      <mesh position={[-4.2, 0.14, -85]}>
        <boxGeometry args={[0.08, 0.04, 190]} />
        <meshStandardMaterial color="#2d3240" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 4. Right Sidewalk (Width: 3.6m, Elevation: 0.14m) */}
      <mesh position={[6.0, 0.07, -85]} receiveShadow>
        <boxGeometry args={[3.6, 0.14, 190]} />
        <meshStandardMaterial color="#1a1c24" roughness={0.75} metalness={0.15} />
      </mesh>
      {/* Right Curb Metal Trim */}
      <mesh position={[4.2, 0.14, -85]}>
        <boxGeometry args={[0.08, 0.04, 190]} />
        <meshStandardMaterial color="#2d3240" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* 5. Metallic Gutter Drainage Grates along curbs */}
      {[-10, -35, -60, -85, -115, -140, -165].map((zPos, idx) => (
        <group key={idx}>
          {/* Left Gutter Grate */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4.0, 0.012, zPos]}>
            <planeGeometry args={[0.35, 1.2]} />
            <meshStandardMaterial color="#0d0e12" roughness={0.5} metalness={0.9} />
          </mesh>
          {/* Right Gutter Grate */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4.0, 0.012, zPos]}>
            <planeGeometry args={[0.35, 1.2]} />
            <meshStandardMaterial color="#0d0e12" roughness={0.5} metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

