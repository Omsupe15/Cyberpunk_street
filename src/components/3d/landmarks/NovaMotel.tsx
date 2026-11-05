'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LANDMARKS } from '@/lib/constants';

export function NovaMotel() {
  const elevatorRef = useRef<THREE.Group>(null);
  const neonSignPulseRef = useRef<THREE.PointLight>(null);
  const vacancySignRef = useRef<THREE.Mesh>(null);
  const radarDishRef = useRef<THREE.Group>(null);
  const elevatorLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Moving exterior glass elevator pod (smooth sinusoidal cycle)
    if (elevatorRef.current) {
      // Moves smoothly between Y: 1.8m and 13.8m over a ~13-second roundtrip
      const elevatorY = 1.8 + ((Math.sin(time * 0.48) + 1) / 2) * 12.0;
      elevatorRef.current.position.y = elevatorY;
    }

    // Elevator interior subtle light
    if (elevatorLightRef.current) {
      elevatorLightRef.current.intensity = 1.2 + Math.sin(time * 6) * 0.2;
    }

    // 2. Pulse vertical magenta neon sign
    if (neonSignPulseRef.current) {
      neonSignPulseRef.current.intensity = 2.8 + Math.sin(time * 3.0) * 0.5;
    }

    // 3. Intermittently flicker the "NO VACANCY" neon sign
    if (vacancySignRef.current) {
      const isFlickering = Math.sin(time * 6.5) > 0.82 && Math.random() > 0.35;
      const mat = vacancySignRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = isFlickering ? 0.2 : 0.95;
    }

    // 4. Rotate rooftop comms radar dish
    if (radarDishRef.current) {
      radarDishRef.current.rotation.y = time * 0.35;
    }
  });

  return (
    <group position={[8.0, 0, LANDMARKS.MOTEL.z]}>
      {/* 1. Towering Brutalist Stasis Motel Tower (Height: 16.5m) */}
      <mesh position={[0, 8.25, 0]} receiveShadow>
        <boxGeometry args={[5.4, 16.5, 12.5]} />
        <meshStandardMaterial color="#121018" roughness={0.45} metalness={0.7} />
      </mesh>

      {/* Stepped Art-Deco Roof Crown */}
      <mesh position={[0, 16.8, 0]}>
        <boxGeometry args={[4.4, 0.6, 11.5]} />
        <meshStandardMaterial color="#1c1826" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 17.3, 0]}>
        <boxGeometry args={[3.4, 0.4, 10.0]} />
        <meshStandardMaterial color="#252030" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Rooftop Communications Radar Dish & Antennas */}
      <group ref={radarDishRef} position={[0.5, 17.8, -3.0]}>
        <mesh rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.85, 0.1, 0.28, 16]} />
          <meshStandardMaterial color="#2e283a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.28, 0.2]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.75, 8]} />
          <meshBasicMaterial color="#FF0055" />
        </mesh>
      </group>
      <mesh position={[0.5, 18.5, 3.5]}>
        <cylinderGeometry args={[0.05, 0.1, 2.5, 8]} />
        <meshStandardMaterial color="#888" metalness={0.9} />
      </mesh>
      <mesh position={[0.5, 19.8, 3.5]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshBasicMaterial color="#FF0055" />
      </mesh>

      {/* 2. Grid of 16 Modular Hexagonal Stasis Sleep Pods */}
      {[-4.0, -1.35, 1.35, 4.0].map((zOffset, colIdx) =>
        [3.8, 6.8, 9.8, 12.8].map((yOffset, rowIdx) => {
          const stateType = (colIdx * 2 + rowIdx) % 4;
          const podColor =
            stateType === 0 ? '#FF0055' : stateType === 1 ? '#00F3FF' : stateType === 2 ? '#FFAA00' : '#05FFA1';
          const isOccupied = stateType === 0;

          return (
            <group key={`${colIdx}-${rowIdx}`} position={[-2.72, yOffset, zOffset]}>
              {/* Pod Outer Hex Metal Bezel */}
              <mesh rotation={[0, Math.PI / 2, 0]}>
                <ringGeometry args={[0.56, 0.76, 6]} />
                <meshStandardMaterial color="#1e1a26" metalness={0.85} roughness={0.25} />
              </mesh>
              {/* Recessed Capsule Chamber */}
              <mesh position={[-0.03, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <circleGeometry args={[0.54, 6]} />
                <meshBasicMaterial color={podColor} transparent opacity={isOccupied ? 0.35 : 0.8} />
              </mesh>
              {/* Internal Biometric Ring */}
              <mesh position={[-0.04, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <ringGeometry args={[0.24, 0.36, 16]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={isOccupied ? 0.38 : 0.12} />
              </mesh>
              {/* Pod Diagnostic LED Indicator */}
              <mesh position={[0, 0.65, 0]}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshBasicMaterial color={isOccupied ? '#FF0055' : '#05FFA1'} />
              </mesh>
            </group>
          );
        })
      )}

      {/* 3. Massive 12-Meter Vertical Neon Sign: "NOVA MOTEL // 新星" */}
      <group position={[-2.85, 9.4, 0]}>
        <mesh position={[-0.08, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.8, 12.8]} />
          <meshStandardMaterial color="#0a0810" metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[-0.03, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.95, 13.0]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.6, 12.4]} />
          <meshBasicMaterial color="#FF0055" />
        </mesh>
        <mesh position={[0.02, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.16, 12.0]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>

        {/* Horizontal Neon Floor Dividers */}
        {[-4.5, -1.5, 1.5, 4.5].map((yPos, idx) => (
          <mesh key={`seg-${idx}`} position={[0.03, yPos, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[1.5, 0.06]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
        ))}
      </group>

      {/* 4. Art-Deco Cantilevered Entrance Canopy & Ground Lobby */}
      <group position={[-2.85, 3.2, 0]}>
        <mesh position={[-0.5, 0, 0]} receiveShadow>
          <boxGeometry args={[2.4, 0.35, 8.0]} />
          <meshStandardMaterial color="#251b14" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Recessed Warm Tungsten Slabs */}
        <mesh position={[-0.5, -0.19, 0]}>
          <boxGeometry args={[2.0, 0.04, 7.4]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>

        {/* Flickering Cursive "NO VACANCY" Sign */}
        <mesh ref={vacancySignRef} position={[-1.72, -0.35, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[3.6, 0.5]} />
          <meshBasicMaterial color="#FF0055" transparent opacity={0.95} />
        </mesh>

        {/* Ground Floor Recessed Lobby Glass Windows */}
        <mesh position={[0.1, -1.7, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[7.6, 2.6]} />
          <meshStandardMaterial color="#FFAA00" roughness={0.1} metalness={0.8} transparent opacity={0.3} />
        </mesh>
        {/* Lobby Interior Reception Counter Glow */}
        <mesh position={[0.8, -2.4, 0]}>
          <boxGeometry args={[1.2, 0.9, 3.5]} />
          <meshStandardMaterial color="#14111a" roughness={0.4} />
        </mesh>
        <mesh position={[0.8, -1.9, 0]}>
          <boxGeometry args={[1.3, 0.06, 3.6]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>
      </group>

      {/* 5. Exterior Glass Elevator Shaft with Moving Cabin */}
      <group position={[-2.4, 0, -5.2]}>
        <mesh position={[0, 8.2, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 16.5, 8]} />
          <meshStandardMaterial color="#555" metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[0, 8.2, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 16.5, 12]} />
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
          <mesh>
            <cylinderGeometry args={[0.64, 0.64, 1.4, 16]} />
            <meshStandardMaterial color="#14161c" roughness={0.3} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.66, 0.66, 0.85, 16, 1, true, 0, Math.PI]} />
            <meshStandardMaterial color="#00F3FF" roughness={0.05} transparent opacity={0.45} />
          </mesh>
          {/* Passenger Silhouette Inside Elevator */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.75, 8]} />
            <meshBasicMaterial color="#06080d" />
          </mesh>
          <mesh position={[0, -0.58, 0]}>
            <cylinderGeometry args={[0.58, 0.58, 0.08, 16]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
          <mesh position={[0, 0.68, 0]}>
            <torusGeometry args={[0.6, 0.03, 8, 18]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          <pointLight ref={elevatorLightRef} position={[0, 0, 0]} color="#FFAA00" intensity={1.2} distance={6} decay={2} />
        </group>
      </group>

      {/* 6. Realistic Controlled Lighting (Decay = 2, prevents scene blowout) */}
      <pointLight
        ref={neonSignPulseRef}
        position={[-3.4, 9.4, 0]}
        color="#FF0055"
        intensity={2.8}
        distance={18}
        decay={2}
      />
      <pointLight position={[-3.2, 3.0, 0]} color="#FFAA00" intensity={2.0} distance={12} decay={2} />
      <pointLight position={[-2.8, 13.0, 3.5]} color="#00F3FF" intensity={1.5} distance={10} decay={2} />
    </group>
  );
}
