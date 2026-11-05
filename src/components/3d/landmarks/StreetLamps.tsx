'use client';
import { useMemo } from 'react';

export function StreetLamps() {
  const lampZPositions = useMemo(() => {
    return [4, -20, -44, -68, -92, -116, -140, -164];
  }, []);

  return (
    <group>
      {lampZPositions.map((zPos, index) => (
        <group key={index}>
          {/* 1. Left Sidewalk Streetlamp (Cyber Cyan Luminaire) */}
          <group position={[-4.5, 0.14, zPos]}>
            {/* Lamp Post Heavy Cast-Iron Flanged Base */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.13, 0.18, 0.5, 10]} />
              <meshStandardMaterial color="#141720" metalness={0.9} roughness={0.25} />
            </mesh>
            {/* Base Electrical Service Access Box */}
            <mesh position={[0.08, 0.35, 0]}>
              <boxGeometry args={[0.08, 0.22, 0.14]} />
              <meshStandardMaterial color="#0e1017" metalness={0.8} />
            </mesh>

            {/* Tapered Structural Mast Pole */}
            <mesh position={[0, 3.2, 0]}>
              <cylinderGeometry args={[0.065, 0.085, 5.8, 10]} />
              <meshStandardMaterial color="#1a1e28" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Recessed Cyan Vertical Neon Slat along mast */}
            <mesh position={[0.07, 3.0, 0]}>
              <boxGeometry args={[0.015, 4.4, 0.02]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>

            {/* Overhanging Curved Architectural Lamp Arm */}
            <mesh position={[0.4, 6.0, 0]} rotation={[0, 0, -0.25]}>
              <boxGeometry args={[1.0, 0.12, 0.22]} />
              <meshStandardMaterial color="#12151f" metalness={0.85} />
            </mesh>
            {/* Downward Luminaire Reflector Housing */}
            <mesh position={[0.82, 5.82, 0]}>
              <boxGeometry args={[0.42, 0.08, 0.2]} />
              <meshStandardMaterial color="#0e1118" metalness={0.9} />
            </mesh>
            {/* Glowing Cyan Lens */}
            <mesh position={[0.82, 5.76, 0]}>
              <planeGeometry args={[0.38, 0.16]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>
            {/* Controlled, Moody Downward Street Light (Decay = 2) */}
            <pointLight position={[0.82, 5.5, 0]} color="#00F3FF" intensity={0.75} distance={9} decay={2} />
          </group>

          {/* 2. Right Sidewalk Streetlamp (Plasma Amber Luminaire) */}
          <group position={[4.5, 0.14, zPos]}>
            {/* Lamp Post Base */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.13, 0.18, 0.5, 10]} />
              <meshStandardMaterial color="#141720" metalness={0.9} roughness={0.25} />
            </mesh>
            {/* Base Electrical Service Access Box */}
            <mesh position={[-0.08, 0.35, 0]}>
              <boxGeometry args={[0.08, 0.22, 0.14]} />
              <meshStandardMaterial color="#0e1017" metalness={0.8} />
            </mesh>

            {/* Tapered Structural Mast Pole */}
            <mesh position={[0, 3.2, 0]}>
              <cylinderGeometry args={[0.065, 0.085, 5.8, 10]} />
              <meshStandardMaterial color="#1a1e28" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Recessed Amber Vertical Neon Slat along mast */}
            <mesh position={[-0.07, 3.0, 0]}>
              <boxGeometry args={[0.015, 4.4, 0.02]} />
              <meshBasicMaterial color="#FFAA00" />
            </mesh>

            {/* Overhanging Lamp Arm */}
            <mesh position={[-0.4, 6.0, 0]} rotation={[0, 0, 0.25]}>
              <boxGeometry args={[1.0, 0.12, 0.22]} />
              <meshStandardMaterial color="#12151f" metalness={0.85} />
            </mesh>
            {/* Downward Luminaire Reflector Housing */}
            <mesh position={[-0.82, 5.82, 0]}>
              <boxGeometry args={[0.42, 0.08, 0.2]} />
              <meshStandardMaterial color="#0e1118" metalness={0.9} />
            </mesh>
            {/* Glowing Amber Lens */}
            <mesh position={[-0.82, 5.76, 0]}>
              <planeGeometry args={[0.38, 0.16]} />
              <meshBasicMaterial color="#FFAA00" />
            </mesh>
            {/* Controlled, Moody Downward Street Light (Decay = 2) */}
            <pointLight position={[-0.82, 5.5, 0]} color="#FFAA00" intensity={0.7} distance={9} decay={2} />
          </group>
        </group>
      ))}
    </group>
  );
}
