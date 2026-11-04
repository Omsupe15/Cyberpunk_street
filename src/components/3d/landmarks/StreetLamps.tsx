'use client';

export function StreetLamps() {
  const lampZPositions = [-15, -45, -90, -135];

  return (
    <group>
      {lampZPositions.map((zPos, index) => (
        <group key={index}>
          {/* Left Sidewalk Lamp (Cyan Light) */}
          <group position={[-4.5, 0, zPos]}>
            {/* Pole */}
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 5, 8]} />
              <meshStandardMaterial color="#2a2e38" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Lamp Arm */}
            <mesh position={[0.2, 5.0, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.5, 0.12, 0.25]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>
            <pointLight position={[0.25, 4.8, 0]} color="#00F3FF" intensity={1.8} distance={11} />
          </group>

          {/* Right Sidewalk Lamp (Amber Light) */}
          <group position={[4.5, 0, zPos]}>
            {/* Pole */}
            <mesh position={[0, 2.5, 0]}>
              <cylinderGeometry args={[0.06, 0.08, 5, 8]} />
              <meshStandardMaterial color="#2a2e38" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Lamp Arm */}
            <mesh position={[-0.2, 5.0, 0]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.5, 0.12, 0.25]} />
              <meshBasicMaterial color="#FFAA00" />
            </mesh>
            <pointLight position={[-0.25, 4.8, 0]} color="#FFAA00" intensity={1.8} distance={11} />
          </group>
        </group>
      ))}
    </group>
  );
}

