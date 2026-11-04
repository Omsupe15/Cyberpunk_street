'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LANDMARKS } from '@/lib/constants';

export function NovaMotel() {
  const elevatorRef = useRef<THREE.Group>(null);
  const neonSignPulseRef = useRef<THREE.PointLight>(null);
  const vacancySignRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Moving exterior glass elevator pod (smooth sinusoidal cycle)
    if (elevatorRef.current) {
      // Moves between Y: 1.8m and 13.5m over a ~14-second roundtrip
      const elevatorY = 1.8 + ((Math.sin(time * 0.45) + 1) / 2) * 11.7;
      elevatorRef.current.position.y = elevatorY;
    }

    // 2. Pulse vertical magenta neon sign
    if (neonSignPulseRef.current) {
      neonSignPulseRef.current.intensity = 4.8 + Math.sin(time * 3) * 0.8;
    }

    // 3. Intermittently flicker the "NO VACANCY" cursive neon sign
    if (vacancySignRef.current) {
      const isFlickering = Math.sin(time * 7) > 0.85 && Math.random() > 0.4;
      const mat = vacancySignRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = isFlickering ? 0.2 : 0.95;
    }
  });

  return (
    <group position={[8.0, 0, LANDMARKS.MOTEL.z]}>
      {/* 1. Towering Brutalist Stasis Motel Tower (Height: 16m) */}
      <mesh position={[0, 8, 0]} receiveShadow>
        <boxGeometry args={[5.2, 16.5, 12]} />
        <meshStandardMaterial color="#17141f" roughness={0.45} metalness={0.65} />
      </mesh>

      {/* 2. Grid of Modular Hexagonal Stasis Sleep Pods */}
      {[-3.6, -1.2, 1.2, 3.6].map((zOffset, colIdx) =>
        [3.5, 6.5, 9.5, 12.5].map((yOffset, rowIdx) => {
          const isOccupied = (colIdx + rowIdx) % 3 === 0;
          const podColor = isOccupied ? '#FF0055' : colIdx % 2 === 0 ? '#FFAA00' : '#00F3FF';

          return (
            <group key={`${colIdx}-${rowIdx}`} position={[-2.62, yOffset, zOffset]}>
              {/* Pod Outer Hex Frame */}
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <ringGeometry args={[0.55, 0.72, 6]} />
                <meshStandardMaterial color="#221e2d" metalness={0.8} roughness={0.3} />
              </mesh>
              {/* Pod Acrylic Viewing Port Glow */}
              <mesh position={[-0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <circleGeometry args={[0.52, 6]} />
                <meshBasicMaterial color={podColor} transparent opacity={isOccupied ? 0.35 : 0.75} />
              </mesh>
              {/* Pod Status LED */}
              <mesh position={[0, 0.62, 0]}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshBasicMaterial color={isOccupied ? '#FF0055' : '#05FFA1'} />
              </mesh>
            </group>
          );
        })
      )}

      {/* 3. Massive 12-Meter Vertical Neon Sign: "NOVA MOTEL - 新星" */}
      <group position={[-2.8, 9.2, 0]}>
        {/* Sign Metal Spine Backplate */}
        <mesh position={[-0.05, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.6, 12.5]} />
          <meshStandardMaterial color="#0e0a14" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Outer Cyan Neon Border Frame */}
        <mesh position={[-0.02, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.75, 12.7]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>

        {/* Vertical Glowing Neon Magenta Face Plate */}
        <mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.4, 12.2]} />
          <meshBasicMaterial color="#FF0055" />
        </mesh>
      </group>

      {/* 4. Art-Deco Cantilevered Entrance Canopy */}
      <group position={[-2.8, 3.2, 0]}>
        {/* Tiered Canopy Overhang */}
        <mesh position={[-0.4, 0, 0]} receiveShadow>
          <boxGeometry args={[2.2, 0.3, 7.5]} />
          <meshStandardMaterial color="#2d2216" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Recessed Golden Lighting Strip */}
        <mesh position={[-0.4, -0.16, 0]}>
          <boxGeometry args={[1.8, 0.04, 7.0]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>

        {/* Flickering Cursive "NO VACANCY" Sign */}
        <mesh ref={vacancySignRef} position={[-1.52, -0.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[3.2, 0.45]} />
          <meshBasicMaterial color="#FF0055" transparent opacity={0.95} />
        </mesh>
      </group>

      {/* 5. Exterior Glass Elevator Shaft with Moving Cabin */}
      <group position={[-2.4, 0, -4.8]}>
        {/* Elevator Vertical Guide Rails */}
        <mesh position={[0, 8.2, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 16, 8]} />
          <meshStandardMaterial color="#555" metalness={0.9} />
        </mesh>
        {/* Transparent Glass Shaft Enclosure */}
        <mesh position={[0, 8.2, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 16, 8]} />
          <meshStandardMaterial
            color="#00F3FF"
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.25}
            wireframe
          />
        </mesh>

        {/* Moving Illuminated Elevator Cabin Pod */}
        <group ref={elevatorRef} position={[0, 2.0, 0]}>
          {/* Cabin Shell */}
          <mesh>
            <cylinderGeometry args={[0.62, 0.62, 1.3, 12]} />
            <meshStandardMaterial color="#1a1c22" roughness={0.3} metalness={0.8} />
          </mesh>
          {/* Cabin Glowing Interior Floor */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 0.08, 12]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
          {/* Cabin Roof Accent Ring */}
          <mesh position={[0, 0.6, 0]}>
            <torusGeometry args={[0.6, 0.03, 8, 16]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          <pointLight color="#FFAA00" intensity={2.0} distance={6} />
        </group>
      </group>

      {/* 6. Dynamic High-Intensity Magenta / Amber Wash Lighting */}
      <pointLight
        ref={neonSignPulseRef}
        position={[-3.2, 9.0, 0]}
        color="#FF0055"
        intensity={5.5}
        distance={22}
      />
      <pointLight position={[-2.8, 3.0, 0]} color="#FFAA00" intensity={3.0} distance={12} />
    </group>
  );
}

