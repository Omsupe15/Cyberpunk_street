'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LANDMARKS } from '@/lib/constants';

export function DebrisPawn() {
  const strobeLightRef = useRef<THREE.PointLight>(null);
  const beaconMeshRef = useRef<THREE.Mesh>(null);
  const crtScreensRef = useRef<THREE.Group>(null);
  const neonSignRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Blinking amber hazard strobe beacon (1.5 Hz sharp pulse)
    const strobe = (Math.sin(time * 9) + 1) / 2 > 0.6 ? 1 : 0.1;
    if (strobeLightRef.current) {
      strobeLightRef.current.intensity = strobe * 4.0;
    }
    if (beaconMeshRef.current) {
      const mat = beaconMeshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = strobe > 0.5 ? 1 : 0.3;
    }

    // 2. Flickering faulty neon sign (intermittent voltage drop)
    if (neonSignRef.current) {
      const flicker = Math.random() > 0.08 ? 1 : 0.2;
      const mat = neonSignRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = flicker;
    }

    // 3. CRT monitor phosphor scanline sweep
    if (crtScreensRef.current) {
      crtScreensRef.current.children.forEach((child, i) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) {
          const scan = 0.6 + Math.sin(time * 12 + i * 2) * 0.4;
          mat.opacity = scan;
        }
      });
    }
  });

  return (
    <group position={[-7.0, 0, LANDMARKS.PAWN.z]}>
      {/* 1. Grungy Salvage Den Facade */}
      <mesh position={[0, 2.5, 0]} receiveShadow>
        <boxGeometry args={[4.6, 5.0, 11]} />
        <meshStandardMaterial color="#171916" roughness={0.9} metalness={0.4} />
      </mesh>

      {/* Weathered Corrugated Security Shutter (Partially Rolled Up) */}
      <mesh position={[2.32, 2.8, 0]}>
        <planeGeometry args={[7.5, 2.2]} />
        <meshStandardMaterial color="#2c3029" roughness={0.8} metalness={0.6} />
      </mesh>

      {/* Dark Salvage Interior Void */}
      <mesh position={[2.30, 0.85, 0]}>
        <planeGeometry args={[7.2, 1.7]} />
        <meshBasicMaterial color="#080908" />
      </mesh>

      {/* 2. Sidewalk Wire Mesh Security Cages */}
      {/* Cage 1: Salvaged Android Torsos & Cyber-arms */}
      <group position={[1.4, 0.7, -2.6]}>
        {/* Wire Cage Frame */}
        <mesh>
          <boxGeometry args={[1.3, 1.4, 1.3]} />
          <meshBasicMaterial color="#05FFA1" wireframe />
        </mesh>
        {/* Salvaged Robot Torso */}
        <mesh position={[0, 0.1, 0]} rotation={[0.2, 0.4, 0]}>
          <boxGeometry args={[0.5, 0.6, 0.3]} />
          <meshStandardMaterial color="#2d332c" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Optical Glowing Core */}
        <mesh position={[0, 0.15, 0.16]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#05FFA1" />
        </mesh>
      </group>

      {/* Cage 2: Salvaged Mechanical Actuators & Power Cells */}
      <group position={[1.4, 0.7, 2.6]}>
        <mesh>
          <boxGeometry args={[1.3, 1.4, 1.3]} />
          <meshBasicMaterial color="#FFAA00" wireframe />
        </mesh>
        {/* Salvaged Power Cell Tube */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.22, 0.22, 0.8, 12]} />
          <meshStandardMaterial color="#302b20" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Blinking Amber LED Ring */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.08, 12]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>
      </group>

      {/* 3. Crooked Pyramid of 5 CRT Monitors */}
      <group position={[1.5, 0, 0]}>
        {/* Metal Cargo Pallet Base */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[1.2, 0.15, 2.4]} />
          <meshStandardMaterial color="#202220" roughness={0.8} />
        </mesh>

        <group ref={crtScreensRef}>
          {/* Monitor 1: Bottom Left */}
          <mesh position={[0, 0.45, -0.6]}>
            <boxGeometry args={[0.65, 0.55, 0.65]} />
            <meshStandardMaterial color="#1a1c19" roughness={0.6} />
          </mesh>
          <mesh position={[0.33, 0.45, -0.6]}>
            <planeGeometry args={[0.45, 0.35]} />
            <meshBasicMaterial color="#05FFA1" transparent opacity={0.8} />
          </mesh>

          {/* Monitor 2: Bottom Right */}
          <mesh position={[0, 0.45, 0.6]}>
            <boxGeometry args={[0.65, 0.55, 0.65]} />
            <meshStandardMaterial color="#1a1c19" roughness={0.6} />
          </mesh>
          <mesh position={[0.33, 0.45, 0.6]}>
            <planeGeometry args={[0.45, 0.35]} />
            <meshBasicMaterial color="#05FFA1" transparent opacity={0.8} />
          </mesh>

          {/* Monitor 3: Top Center (Crooked) */}
          <group position={[0, 0.95, 0]} rotation={[0, 0.12, -0.05]}>
            <mesh>
              <boxGeometry args={[0.62, 0.52, 0.62]} />
              <meshStandardMaterial color="#1a1c19" roughness={0.6} />
            </mesh>
            <mesh position={[0.32, 0, 0]}>
              <planeGeometry args={[0.42, 0.32]} />
              <meshBasicMaterial color="#05FFA1" transparent opacity={0.9} />
            </mesh>
          </group>
        </group>
      </group>

      {/* 4. Roof Edge Blinking Hazard Strobe Beacon */}
      <group position={[2.35, 4.8, 4.5]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.15, 0.25, 12]} />
          <meshStandardMaterial color="#222" metalness={0.9} />
        </mesh>
        <mesh ref={beaconMeshRef} position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshBasicMaterial color="#FFAA00" transparent opacity={1} />
        </mesh>
        <pointLight
          ref={strobeLightRef}
          position={[0, 0.2, 0]}
          color="#FFAA00"
          intensity={3.5}
          distance={12}
        />
      </group>

      {/* 5. Damaged Faulty Neon Sign: "DEBRIS PAWN" */}
      <group position={[2.36, 3.8, -3.2]}>
        {/* Metal Backing Panel with Hazard Stripes */}
        <mesh position={[-0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[3.2, 0.7]} />
          <meshStandardMaterial color="#1b1c18" roughness={0.7} />
        </mesh>
        {/* Flickering Green Neon Tube */}
        <mesh ref={neonSignRef} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[3.0, 0.5]} />
          <meshBasicMaterial color="#05FFA1" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* 6. Dynamic Toxic Green Ambient Floor Light */}
      <pointLight position={[2.4, 2.0, 0]} color="#05FFA1" intensity={3.5} distance={14} />
    </group>
  );
}

