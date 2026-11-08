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
              <meshStandardMaterial color="#185292" metalness={0.9} roughness={0.25} />
            </mesh>
            {/* 4 Base Anchor Bolt Caps */}
            {[-0.12, 0.12].map((bx, bIdx) =>
              [-0.12, 0.12].map((bz, bzIdx) => (
                <mesh key={`bolt-l-${bIdx}-${bzIdx}`} position={[bx, 0.03, bz]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.04, 6]} />
                  <meshStandardMaterial color="#00F0FF" metalness={0.95} />
                </mesh>
              ))
            )}
            <mesh position={[0.08, 0.35, 0]}>
              <boxGeometry args={[0.08, 0.22, 0.14]} />
              <meshStandardMaterial color="#00F0FF" metalness={0.8} />
            </mesh>

            {/* Tapered Structural Mast Pole (Vibrant Neon Blue) */}
            <mesh position={[0, 3.4, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 6.2, 10]} />
              <meshStandardMaterial color="#1e60a6" metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[0.07, 3.2, 0]}>
              <boxGeometry args={[0.015, 4.6, 0.02]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>

            {/* Shielded Downward Roadway Luminaire Arm (Zero Camera Glare) */}
            <mesh position={[0.45, 6.4, 0]} rotation={[0, 0, -0.25]}>
              <boxGeometry args={[1.1, 0.12, 0.22]} />
              <meshStandardMaterial color="#1c5ea4" metalness={0.85} />
            </mesh>
            <mesh position={[0.9, 6.26, 0]}>
              <boxGeometry args={[0.5, 0.14, 0.26]} />
              <meshStandardMaterial color="#236cb8" metalness={0.9} />
            </mesh>
            {/* Glowing Downward Lens Plate */}
            <mesh position={[0.9, 6.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.42, 0.2]} />
              <meshBasicMaterial color="#67e8f9" />
            </mesh>
            {/* Soft Downward Accent Light (Tucked inside hood, casts down to sidewalk only) */}
            <pointLight position={[0.9, 6.0, 0]} color="#67e8f9" intensity={0.25} distance={5} decay={2} />
          </group>

          {/* 2. Right Sidewalk Grand Twin-Arm Gooseneck Lamp (Plasma Amber Luminaire) */}
          <group position={[curbX, 0.16, zPos]}>
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[0.14, 0.19, 0.5, 10]} />
              <meshStandardMaterial color="#185292" metalness={0.9} roughness={0.25} />
            </mesh>
            {[-0.12, 0.12].map((bx, bIdx) =>
              [-0.12, 0.12].map((bz, bzIdx) => (
                <mesh key={`bolt-r-${bIdx}-${bzIdx}`} position={[bx, 0.03, bz]}>
                  <cylinderGeometry args={[0.015, 0.015, 0.04, 6]} />
                  <meshStandardMaterial color="#00F0FF" metalness={0.95} />
                </mesh>
              ))
            )}
            <mesh position={[-0.08, 0.35, 0]}>
              <boxGeometry args={[0.08, 0.22, 0.14]} />
              <meshStandardMaterial color="#00F0FF" metalness={0.8} />
            </mesh>

            <mesh position={[0, 3.4, 0]}>
              <cylinderGeometry args={[0.07, 0.09, 6.2, 10]} />
              <meshStandardMaterial color="#1e60a6" metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[-0.07, 3.2, 0]}>
              <boxGeometry args={[0.015, 4.6, 0.02]} />
              <meshBasicMaterial color="#FFAA00" />
            </mesh>

            {/* Shielded Downward Roadway Luminaire Arm (Zero Camera Glare) */}
            <mesh position={[-0.45, 6.4, 0]} rotation={[0, 0, 0.25]}>
              <boxGeometry args={[1.1, 0.12, 0.22]} />
              <meshStandardMaterial color="#1c5ea4" metalness={0.85} />
            </mesh>
            <mesh position={[-0.9, 6.26, 0]}>
              <boxGeometry args={[0.5, 0.14, 0.26]} />
              <meshStandardMaterial color="#236cb8" metalness={0.9} />
            </mesh>
            {/* Glowing Downward Lens Plate */}
            <mesh position={[-0.9, 6.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.42, 0.2]} />
              <meshBasicMaterial color="#ffea75" />
            </mesh>
            {/* Soft Downward Accent Light (Tucked inside hood, casts down to sidewalk only) */}
            <pointLight position={[-0.9, 6.0, 0]} color="#ffea75" intensity={0.25} distance={5} decay={2} />
          </group>
        </group>
      ))}
    </group>
  );
}
