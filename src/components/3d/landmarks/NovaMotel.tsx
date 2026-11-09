'use client';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LANDMARKS } from '@/lib/constants';
import { getVerticalSignTexture } from '@/lib/proceduralTextures';

export function NovaMotel() {
  const elevatorRef = useRef<THREE.Group>(null);
  const neonSignPulseRef = useRef<THREE.PointLight>(null);
  const vacancySignRef = useRef<THREE.Mesh>(null);
  const radarDishRef = useRef<THREE.Group>(null);
  const elevatorLightRef = useRef<THREE.PointLight>(null);

  const [vertSignTex, setVertSignTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    setVertSignTex(
      getVerticalSignTexture(
        ['NOVA', 'STASIS', 'MOTEL'],
        '新星ホテル // 24H',
        '#FF0055',
        '#FFAA00'
      )
    );
  }, []);

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
      elevatorLightRef.current.intensity = 0.65 + Math.sin(time * 6) * 0.15;
    }

    // 2. Pulse vertical magenta neon sign
    if (neonSignPulseRef.current) {
      neonSignPulseRef.current.intensity = 1.2 + Math.sin(time * 3.0) * 0.25;
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
    <group position={[LANDMARKS.MOTEL.x, 0, LANDMARKS.MOTEL.z]}>
      {/* 1. Towering Brutalist Stasis Motel Tower (Dark Dystopian Concrete, Height: 16.5m) */}
      <mesh position={[0, 8.25, 0]} receiveShadow>
        <boxGeometry args={[5.4, 16.5, 12.5]} />
        <meshStandardMaterial color="#111218" roughness={0.7} metalness={0.4} />
      </mesh>

      {/* Vertical Cyan Neon Edge Ribbons on Tower Corners */}
      {[-6.2, 6.2].map((zEdge, idx) => (
        <mesh key={`ribbon-${idx}`} position={[-2.72, 8.25, zEdge]}>
          <boxGeometry args={[0.06, 16.5, 0.08]} />
          <meshBasicMaterial color="#00F3FF" />
        </mesh>
      ))}

      {/* Stepped Art-Deco Roof Crown (Dark Steel & Titanium) */}
      <mesh position={[0, 16.8, 0]}>
        <boxGeometry args={[4.4, 0.6, 11.5]} />
        <meshStandardMaterial color="#181a24" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 17.3, 0]}>
        <boxGeometry args={[3.4, 0.4, 10.0]} />
        <meshStandardMaterial color="#222532" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* Rooftop Communications Radar Dish & Antennas */}
      <group ref={radarDishRef} position={[0.5, 17.8, -3.0]}>
        <mesh rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.85, 0.1, 0.28, 16]} />
          <meshStandardMaterial color="#252936" metalness={0.9} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.28, 0.2]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.75, 8]} />
          <meshBasicMaterial color="#00F0FF" />
        </mesh>
      </group>
      <mesh position={[0.5, 18.5, 3.5]}>
        <cylinderGeometry args={[0.05, 0.1, 2.5, 8]} />
        <meshStandardMaterial color="#383d4e" metalness={0.9} />
      </mesh>
      <mesh position={[0.5, 19.8, 3.5]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshBasicMaterial color="#FF0055" />
      </mesh>

      {/* 2. Grid of 16 Modular Hexagonal Stasis Sleep Pods with Locking Pins & Telemetry */}
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
                <meshStandardMaterial color="#242836" metalness={0.85} roughness={0.3} />
              </mesh>

              {/* 3 Radial Hatch Locking Pins */}
              {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, pinIdx) => (
                <mesh
                  key={`pin-${pinIdx}`}
                  position={[-0.01, Math.sin(angle) * 0.65, Math.cos(angle) * 0.65]}
                  rotation={[angle, 0, 0]}
                >
                  <boxGeometry args={[0.04, 0.06, 0.08]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.95} />
                </mesh>
              ))}

              {/* Recessed Capsule Chamber */}
              <mesh position={[-0.03, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <circleGeometry args={[0.54, 6]} />
                <meshBasicMaterial color={podColor} transparent opacity={isOccupied ? 0.35 : 0.8} />
              </mesh>
              {/* Internal Biometric Vitals Pulse Ring */}
              <mesh position={[-0.04, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <ringGeometry args={[0.24, 0.36, 16]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={isOccupied ? 0.38 : 0.12} />
              </mesh>
              {/* Pod Diagnostic LED Indicator */}
              <mesh position={[0, 0.65, 0]}>
                <sphereGeometry args={[0.04, 6, 6]} />
                <meshBasicMaterial color={isOccupied ? '#FF0055' : '#05FFA1'} />
              </mesh>
              {/* Vitals Telemetry Display Strip */}
              <mesh position={[-0.01, -0.65, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[0.3, 0.06]} />
                <meshBasicMaterial color={podColor} />
              </mesh>
            </group>
          );
        })
      )}

      {/* 3. Massive 12-Meter Vertical Bilingual Neon Tower Sign */}
      <group position={[-2.85, 9.4, 0]}>
        {/* Steel Lattice Mast */}
        <mesh position={[-0.12, 0, 0]}>
          <boxGeometry args={[0.1, 13.0, 0.4]} />
          <meshStandardMaterial color="#1a1c26" metalness={0.95} />
        </mesh>

        <mesh position={[-0.08, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[2.0, 12.8]} />
          <meshStandardMaterial color="#10121a" metalness={0.95} roughness={0.2} />
        </mesh>
        <mesh position={[-0.03, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[2.15, 13.0]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        {/* Faceplate with Vertical Bilingual Neon Canvas Texture */}
        <mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.8, 12.4]} />
          <meshStandardMaterial
            map={vertSignTex || undefined}
            emissive="#FF0055"
            emissiveMap={vertSignTex || undefined}
            emissiveIntensity={0.95}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 4. Art-Deco Cantilevered Entrance Canopy & Ground Lobby */}
      <group position={[-2.85, 3.2, 0]}>
        <mesh position={[-0.5, 0, 0]} receiveShadow>
          <boxGeometry args={[2.4, 0.35, 8.0]} />
          <meshStandardMaterial color="#181a24" metalness={0.8} roughness={0.3} />
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
          <meshStandardMaterial color="#FF0055" roughness={0.08} metalness={0.8} transparent opacity={0.2} />
        </mesh>
        {/* Lobby Interior Reception Counter Glow & Automated Terminal */}
        <mesh position={[0.8, -2.4, 0]}>
          <boxGeometry args={[1.2, 0.9, 3.5]} />
          <meshStandardMaterial color="#141620" roughness={0.4} />
        </mesh>
        <mesh position={[0.8, -1.9, 0]}>
          <boxGeometry args={[1.3, 0.06, 3.6]} />
          <meshBasicMaterial color="#FF0055" />
        </mesh>
        {/* Holographic Check-In Kiosk */}
        <mesh position={[0.4, -2.1, 1.2]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.4, 0.6]} />
          <meshBasicMaterial color="#00F3FF" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* 5. Exterior Glass Elevator Shaft with Moving Cabin & Pulley Rig */}
      <group position={[-2.4, 0, -5.2]}>
        {/* Vertical Steel I-Beam Guide Rails */}
        <mesh position={[0, 8.2, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 16.5, 8]} />
          <meshStandardMaterial color="#303546" metalness={0.95} roughness={0.2} />
        </mesh>
        {/* Top Cable Hoist Pulley Drum */}
        <mesh position={[0, 16.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#222532" metalness={0.95} />
        </mesh>

        {/* Transparent Cylindrical Glass Shaft */}
        <mesh position={[0, 8.2, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 16.5, 12]} />
          <meshStandardMaterial
            color="#00F3FF"
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.18}
            wireframe
          />
        </mesh>

        {/* Moving Illuminated Elevator Cabin Pod */}
        <group ref={elevatorRef} position={[0, 2.0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.64, 0.64, 1.4, 16]} />
            <meshStandardMaterial color="#1a1c26" roughness={0.3} metalness={0.85} />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.66, 0.66, 0.85, 16, 1, true, 0, Math.PI]} />
            <meshStandardMaterial color="#00F3FF" roughness={0.05} transparent opacity={0.35} />
          </mesh>
          {/* Passenger Silhouette Inside Elevator */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.75, 8]} />
            <meshBasicMaterial color="#08090f" />
          </mesh>
          <mesh position={[0, -0.58, 0]}>
            <cylinderGeometry args={[0.58, 0.58, 0.08, 16]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
          <mesh position={[0, 0.68, 0]}>
            <torusGeometry args={[0.6, 0.03, 8, 18]} />
            <meshBasicMaterial color="#00F0FF" />
          </mesh>
          <pointLight ref={elevatorLightRef} position={[0, 0, 0]} color="#00F3FF" intensity={0.7} distance={5} decay={2} />
        </group>
      </group>

      {/* 6. Localized Architectural Accent Lights */}
      {/* 12m Vertical Sign Accent */}
      <pointLight
        ref={neonSignPulseRef}
        position={[-2.8, 10.0, 0]}
        color="#FF0055"
        intensity={1.2}
        distance={9}
        decay={2}
      />
      {/* Ground Lobby Ambient Accent */}
      <pointLight position={[-2.8, 3.2, 0]} color="#FFAA00" intensity={0.9} distance={7} decay={2} />
      {/* Stasis Pod Upper Accent */}
      <pointLight position={[-2.8, 8.5, 2.0]} color="#00F3FF" intensity={0.8} distance={7} decay={2} />
    </group>
  );
}
