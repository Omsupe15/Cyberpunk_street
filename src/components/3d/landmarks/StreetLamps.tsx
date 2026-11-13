'use client';
import { useMemo } from 'react';
import { ROAD_WIDTH } from '@/lib/constants';

export function StreetLamps() {
  const lampZPositions = useMemo(() => {
    return [4, -20, -44, -68, -92, -116, -140, -164];
  }, []);

  const curbX = ROAD_WIDTH / 2 + 0.25; // 7.25m from center

  return (
    <group>
      {lampZPositions.map((zPos, index) => (
        <group key={index}>
          {/* 1. Left Sidewalk Tokyo Twin-Arm Mast Lamp (Warm Lantern Amber Downlight) */}
          <group position={[-curbX, 0.16, zPos]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.14, 0.19, 0.5, 10]} />
              <meshStandardMaterial color="#222838" metalness={0.3} roughness={0.75} />
            </mesh>
            {/* Base Anchor Bolts */}
            {[-0.12, 0.12].map((bx, bIdx) =>
              [-0.12, 0.12].map((bz, bzIdx) => (
                <mesh key={`bolt-l-${bIdx}-${bzIdx}`} position={[bx, 0.03, bz]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.04, 6]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.7} />
                </mesh>
              ))
            )}
            <mesh position={[0.08, 0.35, 0]}>
              <boxGeometry args={[0.08, 0.22, 0.14]} />
              <meshStandardMaterial color="#00e5ff" metalness={0.4} roughness={0.6} />
            </mesh>

            {/* Tapered Structural Mast Pole (Dark Architectural Graphite) */}
            <mesh position={[0, 3.4, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 6.2, 10]} />
              <meshStandardMaterial color="#2a3348" metalness={0.25} roughness={0.8} />
            </mesh>
            <mesh position={[0.07, 3.2, 0]}>
              <boxGeometry args={[0.015, 4.6, 0.02]} />
              <meshBasicMaterial color="#00e5ff" />
            </mesh>

            {/* Shielded Downward Roadway Luminaire Arm */}
            <mesh position={[0.45, 6.4, 0]} rotation={[0, 0, -0.25]}>
              <boxGeometry args={[1.1, 0.12, 0.22]} />
              <meshStandardMaterial color="#222838" metalness={0.25} roughness={0.8} />
            </mesh>
            <mesh position={[0.9, 6.26, 0]}>
              <boxGeometry args={[0.5, 0.14, 0.26]} />
              <meshStandardMaterial color="#2e374c" metalness={0.3} roughness={0.75} />
            </mesh>
            {/* Glowing Downward Lens Plate (Warm Tokyo Lantern Glow) */}
            <mesh position={[0.9, 6.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.42, 0.2]} />
              <meshBasicMaterial color="#fbbf24" />
            </mesh>
            {/* Tokyo Sodium-Amber Ground Pool Light */}
            <pointLight position={[0.9, 6.0, 0]} color="#fbbf24" intensity={0.75} distance={8} decay={2} />
          </group>

          {/* 2. Right Sidewalk Tokyo Twin-Arm Mast Lamp (Warm Lantern Amber Downlight) */}
          <group position={[curbX, 0.16, zPos]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.14, 0.19, 0.5, 10]} />
              <meshStandardMaterial color="#222838" metalness={0.3} roughness={0.75} />
            </mesh>
            {[-0.12, 0.12].map((bx, bIdx) =>
              [-0.12, 0.12].map((bz, bzIdx) => (
                <mesh key={`bolt-r-${bIdx}-${bzIdx}`} position={[bx, 0.03, bz]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.04, 6]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.7} />
                </mesh>
              ))
            )}
            <mesh position={[-0.08, 0.35, 0]}>
              <boxGeometry args={[0.08, 0.22, 0.14]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.4} roughness={0.6} />
            </mesh>

            <mesh position={[0, 3.4, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 6.2, 10]} />
              <meshStandardMaterial color="#2a3348" metalness={0.25} roughness={0.8} />
            </mesh>
            <mesh position={[-0.07, 3.2, 0]}>
              <boxGeometry args={[0.015, 4.6, 0.02]} />
              <meshBasicMaterial color="#f59e0b" />
            </mesh>

            {/* Shielded Downward Roadway Luminaire Arm */}
            <mesh position={[-0.45, 6.4, 0]} rotation={[0, 0, 0.25]}>
              <boxGeometry args={[1.1, 0.12, 0.22]} />
              <meshStandardMaterial color="#222838" metalness={0.25} roughness={0.8} />
            </mesh>
            <mesh position={[-0.9, 6.26, 0]}>
              <boxGeometry args={[0.5, 0.14, 0.26]} />
              <meshStandardMaterial color="#2e374c" metalness={0.3} roughness={0.75} />
            </mesh>
            {/* Glowing Downward Lens Plate (Warm Tokyo Lantern Glow) */}
            <mesh position={[-0.9, 6.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.42, 0.2]} />
              <meshBasicMaterial color="#fbbf24" />
            </mesh>
            {/* Tokyo Sodium-Amber Ground Pool Light */}
            <pointLight position={[-0.9, 6.0, 0]} color="#fbbf24" intensity={0.75} distance={8} decay={2} />
          </group>
        </group>
      ))}
    </group>
  );
}
