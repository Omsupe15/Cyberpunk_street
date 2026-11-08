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
          {/* 1. Left Sidewalk Grand Twin-Arm Gooseneck Lamp (Cyber Cyan Luminaire) */}
          <group position={[-curbX, 0.16, zPos]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.14, 0.19, 0.5, 10]} />
              <meshStandardMaterial color="#12151e" metalness={0.9} roughness={0.25} />
            </mesh>
            {/* 4 Base Anchor Bolt Caps */}
            {[-0.12, 0.12].map((bx, bIdx) =>
              [-0.12, 0.12].map((bz, bzIdx) => (
                <mesh key={`bolt-l-${bIdx}-${bzIdx}`} position={[bx, 0.03, bz]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.04, 6]} />
                  <meshStandardMaterial color="#555" metalness={0.95} />
                </mesh>
              ))
            )}
            <mesh position={[0.08, 0.35, 0]}>
              <boxGeometry args={[0.08, 0.22, 0.14]} />
              <meshStandardMaterial color="#0c0e14" metalness={0.8} />
            </mesh>

            {/* Tapered Structural Mast Pole */}
            <mesh position={[0, 3.4, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 6.2, 10]} />
              <meshStandardMaterial color="#181c26" metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[0.07, 3.2, 0]}>
              <boxGeometry args={[0.015, 4.6, 0.02]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>

            {/* Overhanging Roadway Luminaire Arm */}
            <mesh position={[0.45, 6.4, 0]} rotation={[0, 0, -0.25]}>
              <boxGeometry args={[1.1, 0.12, 0.22]} />
              <meshStandardMaterial color="#10131d" metalness={0.85} />
            </mesh>
            <mesh position={[0.9, 6.22, 0]}>
              <boxGeometry args={[0.45, 0.08, 0.22]} />
              <meshStandardMaterial color="#0c0f16" metalness={0.9} />
            </mesh>
            <mesh position={[0.9, 6.16, 0]}>
              <planeGeometry args={[0.4, 0.18]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>
            <pointLight position={[0.9, 5.8, 0]} color="#00F3FF" intensity={0.9} distance={10} decay={2} />
          </group>

          {/* 2. Right Sidewalk Grand Twin-Arm Gooseneck Lamp (Plasma Amber Luminaire) */}
          <group position={[curbX, 0.16, zPos]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.14, 0.19, 0.5, 10]} />
              <meshStandardMaterial color="#12151e" metalness={0.9} roughness={0.25} />
            </mesh>
            {[-0.12, 0.12].map((bx, bIdx) =>
              [-0.12, 0.12].map((bz, bzIdx) => (
                <mesh key={`bolt-r-${bIdx}-${bzIdx}`} position={[bx, 0.03, bz]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.04, 6]} />
                  <meshStandardMaterial color="#555" metalness={0.95} />
                </mesh>
              ))
            )}
            <mesh position={[-0.08, 0.35, 0]}>
              <boxGeometry args={[0.08, 0.22, 0.14]} />
              <meshStandardMaterial color="#0c0e14" metalness={0.8} />
            </mesh>

            <mesh position={[0, 3.4, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 6.2, 10]} />
              <meshStandardMaterial color="#181c26" metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[-0.07, 3.2, 0]}>
              <boxGeometry args={[0.015, 4.6, 0.02]} />
              <meshBasicMaterial color="#FFAA00" />
            </mesh>

            {/* Overhanging Roadway Luminaire Arm */}
            <mesh position={[-0.45, 6.4, 0]} rotation={[0, 0, 0.25]}>
              <boxGeometry args={[1.1, 0.12, 0.22]} />
              <meshStandardMaterial color="#10131d" metalness={0.85} />
            </mesh>
            <mesh position={[-0.9, 6.22, 0]}>
              <boxGeometry args={[0.45, 0.08, 0.22]} />
              <meshStandardMaterial color="#0c0f16" metalness={0.9} />
            </mesh>
            <mesh position={[-0.9, 6.16, 0]}>
              <planeGeometry args={[0.4, 0.18]} />
              <meshBasicMaterial color="#FFAA00" />
            </mesh>
            <pointLight position={[-0.9, 5.8, 0]} color="#FFAA00" intensity={0.85} distance={10} decay={2} />
          </group>
        </group>
      ))}
    </group>
  );
}
