'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LANDMARKS } from '@/lib/constants';

export function SpaceshipCafe() {
  const holoMugRef = useRef<THREE.Group>(null);
  const steamRingsRef = useRef<THREE.Group>(null);
  const thrustersLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Rotate holographic coffee mug
    if (holoMugRef.current) {
      holoMugRef.current.rotation.y = time * 0.8;
      holoMugRef.current.position.y = 5.6 + Math.sin(time * 2) * 0.08;
    }

    // 2. Animate floating steam rings
    if (steamRingsRef.current) {
      steamRingsRef.current.children.forEach((child, idx) => {
        const ring = child as THREE.Mesh;
        const phase = (time * 0.8 + idx * 0.7) % 2.0;
        ring.position.y = phase * 0.6;
        const scale = 0.4 + phase * 0.4;
        ring.scale.set(scale, scale, scale);
        const mat = ring.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = Math.max(0, 1 - phase / 2.0) * 0.7;
      });
    }

    // 3. Pulse thruster patio warmers
    if (thrustersLightRef.current) {
      thrustersLightRef.current.intensity = 3.2 + Math.sin(time * 8) * 0.6;
    }
  });

  return (
    <group position={[7.5, 0, LANDMARKS.CAFE.z]}>
      {/* 1. Cafe Ground Building Structure */}
      <mesh position={[0, 3, 0]} receiveShadow>
        <boxGeometry args={[4.8, 6, 12]} />
        <meshStandardMaterial color="#1a1d26" roughness={0.35} metalness={0.7} />
      </mesh>

      {/* Exterior Panel Detailing & Conduit Lines */}
      <mesh position={[-2.42, 3, 0]}>
        <boxGeometry args={[0.08, 5.6, 11.6]} />
        <meshStandardMaterial color="#12141c" roughness={0.6} metalness={0.8} />
      </mesh>

      {/* 2. Cantilevered Spaceship Fuselage (Jutting over sidewalk) */}
      <group position={[-1.6, 3.4, 0]}>
        {/* Main Aerodynamic Hull */}
        <mesh rotation={[0, 0, -Math.PI / 2]} position={[-0.5, 0, 0]}>
          <coneGeometry args={[1.5, 6.2, 10]} />
          <meshStandardMaterial color="#2A2F3D" roughness={0.25} metalness={0.85} />
        </mesh>

        {/* Cockpit Canopy (Tinted Cyan Glass) */}
        <mesh position={[-2.2, 0.4, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.5, 1.4, 8, 16]} />
          <meshStandardMaterial
            color="#00F3FF"
            roughness={0.05}
            transparent
            opacity={0.45}
            metalness={0.9}
          />
        </mesh>

        {/* Cockpit Interior Holographic Console Glow */}
        <mesh position={[-2.1, 0.35, 0]}>
          <boxGeometry args={[0.2, 0.15, 0.6]} />
          <meshBasicMaterial color="#00F3FF" />
        </mesh>

        {/* Dual Plasma Thruster Engines (Patio Warmers) */}
        <group position={[1.4, -0.8, -1.8]} rotation={[0, 0, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.38, 0.48, 1.4, 16]} />
            <meshStandardMaterial color="#1f232e" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Glowing Plasma Core */}
          <mesh position={[0, -0.65, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.15, 16]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>

        <group position={[1.4, -0.8, 1.8]} rotation={[0, 0, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.38, 0.48, 1.4, 16]} />
            <meshStandardMaterial color="#1f232e" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Glowing Plasma Core */}
          <mesh position={[0, -0.65, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.15, 16]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>
      </group>

      {/* 3. 3D Rotating Holographic Coffee Mug */}
      <group ref={holoMugRef} position={[-2.8, 5.6, 0]}>
        {/* Mug Body */}
        <mesh>
          <cylinderGeometry args={[0.45, 0.4, 0.9, 16]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        {/* Mug Handle */}
        <mesh position={[0.48, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.24, 0.05, 8, 16]} />
          <meshBasicMaterial color="#00F3FF" />
        </mesh>

        {/* Rising Holographic Steam Rings */}
        <group ref={steamRingsRef} position={[0, 0.55, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.18, 0.25, 16]} />
              <meshBasicMaterial color="#00F3FF" transparent opacity={0.6} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 4. Outdoor Counter & Neon Stools on Sidewalk */}
      <group position={[-2.7, 0, 0]}>
        {/* Floating Stainless Steel Bar Counter */}
        <mesh position={[0, 0.85, 0]} receiveShadow>
          <boxGeometry args={[0.7, 0.1, 4.2]} />
          <meshStandardMaterial color="#2d3342" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Counter Support Legs */}
        <mesh position={[0, 0.4, -1.8]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#111" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.4, 1.8]}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#111" metalness={0.9} />
        </mesh>

        {/* 3 Glowing Neon Barstools */}
        {[-1.2, 0, 1.2].map((zOffset, idx) => (
          <group key={idx} position={[-0.6, 0, zOffset]}>
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.03, 0.05, 0.6, 8]} />
              <meshStandardMaterial color="#222" metalness={0.8} />
            </mesh>
            {/* Glowing Amber Seat Cushion */}
            <mesh position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
              <meshBasicMaterial color="#FFAA00" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Storefront Neon Signage */}
      <mesh position={[-2.45, 1.8, 3.8]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[2.5, 0.6]} />
        <meshBasicMaterial color="#FFAA00" />
      </mesh>

      {/* 6. Dynamic Point Lighting Casting Reflections on Road */}
      <pointLight
        ref={thrustersLightRef}
        position={[-1.8, 2.2, 0]}
        color="#FFAA00"
        intensity={3.5}
        distance={15}
      />
      <pointLight position={[-2.6, 5.6, 0]} color="#00F3FF" intensity={2.0} distance={10} />
    </group>
  );
}

