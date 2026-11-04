'use client';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LANDMARKS } from '@/lib/constants';

export function StarClothing() {
  const mannequin1Ref = useRef<THREE.Group>(null);
  const mannequin2Ref = useRef<THREE.Group>(null);
  const starsGroupRef = useRef<THREE.Group>(null);
  const starCrestRef = useRef<THREE.Mesh>(null);

  // Pre-generate constellation star coordinates & phases
  const starPoints = useMemo(() => {
    const list = [];
    for (let i = 0; i < 45; i++) {
      list.push({
        x: (Math.random() - 0.5) * 3.2,
        z: (Math.random() - 0.5) * 11,
        phase: Math.random() * Math.PI * 2,
        speed: 1.5 + Math.random() * 2.5,
      });
    }
    return list;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Rotate wireframe holographic mannequins
    if (mannequin1Ref.current) {
      mannequin1Ref.current.rotation.y = time * 0.5;
    }
    if (mannequin2Ref.current) {
      mannequin2Ref.current.rotation.y = -time * 0.45;
    }

    // 2. Pulse 8-pointed star crest
    if (starCrestRef.current) {
      starCrestRef.current.rotation.z = time * 0.2;
    }

    // 3. Twinkle constellation fiber-optics
    if (starsGroupRef.current) {
      starsGroupRef.current.children.forEach((child, i) => {
        const star = starPoints[i];
        if (star) {
          const brightness = 0.3 + Math.sin(time * star.speed + star.phase) * 0.7;
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) mat.opacity = Math.max(0.1, brightness);
        }
      });
    }
  });

  return (
    <group position={[-7.5, 0, LANDMARKS.STAR.z]}>
      {/* 1. Main Boutique Architecture */}
      <mesh position={[0, 3.2, 0]} receiveShadow>
        <boxGeometry args={[4.8, 6.4, 13]} />
        <meshStandardMaterial color="#161420" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* 2. Floor-to-Ceiling Showroom Glass Window */}
      <mesh position={[2.42, 2.5, 0]}>
        <planeGeometry args={[11.5, 4.6]} />
        <meshStandardMaterial
          color="#8A2BE2"
          roughness={0.05}
          metalness={0.9}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Chrome Mullions & Frames */}
      {[-5.2, -2.6, 0, 2.6, 5.2].map((zPos, idx) => (
        <mesh key={idx} position={[2.44, 2.5, zPos]}>
          <boxGeometry args={[0.08, 4.8, 0.08]} />
          <meshStandardMaterial color="#a0b0d0" metalness={0.95} roughness={0.15} />
        </mesh>
      ))}

      {/* 3. Overhanging Constellation Canopy */}
      <group position={[1.6, 5.0, 0]} rotation={[0, 0, 0.1]}>
        {/* Canopy Slab */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.4, 0.25, 12.6]} />
          <meshStandardMaterial color="#110f17" roughness={0.6} metalness={0.8} />
        </mesh>

        {/* Constellation Star Matrix */}
        <group ref={starsGroupRef} position={[0, -0.14, 0]}>
          {starPoints.map((pt, idx) => (
            <mesh key={idx} position={[pt.x, 0, pt.z]}>
              <sphereGeometry args={[0.035, 6, 6]} />
              <meshBasicMaterial color="#00F3FF" transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 4. Display Window: Rotating Wireframe Mannequins */}
      {/* Mannequin 1: Astra Violet Wireframe Jacket */}
      <group ref={mannequin1Ref} position={[1.4, 1.4, -2.4]}>
        {/* Torso */}
        <mesh position={[0, 0.4, 0]}>
          <coneGeometry args={[0.38, 0.9, 8]} />
          <meshBasicMaterial color="#8A2BE2" wireframe />
        </mesh>
        {/* Head Sphere */}
        <mesh position={[0, 0.95, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        {/* Stand Base */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.04, 16]} />
          <meshStandardMaterial color="#333" metalness={0.9} />
        </mesh>
      </group>

      {/* Mannequin 2: Cyber Cyan Wireframe Gown */}
      <group ref={mannequin2Ref} position={[1.4, 1.4, 2.4]}>
        {/* Gown Cone */}
        <mesh position={[0, 0.35, 0]}>
          <coneGeometry args={[0.42, 1.1, 10]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        {/* Head Sphere */}
        <mesh position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial color="#8A2BE2" wireframe />
        </mesh>
        {/* Stand Base */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.04, 16]} />
          <meshStandardMaterial color="#333" metalness={0.9} />
        </mesh>
      </group>

      {/* 5. 8-Pointed Star Neon Crest & Boutique Signage */}
      <group position={[2.46, 5.7, 0]}>
        {/* Star Crest */}
        <mesh ref={starCrestRef}>
          <octahedronGeometry args={[0.45, 0]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        {/* Sign Backplate */}
        <mesh position={[-0.05, -0.7, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[5.2, 0.65]} />
          <meshBasicMaterial color="#8A2BE2" />
        </mesh>
      </group>

      {/* 6. Dynamic Purple / Cyan Spotlights Casting Reflections */}
      <pointLight position={[2.6, 3.2, 0]} color="#8A2BE2" intensity={4.5} distance={16} />
      <pointLight position={[1.8, 5.0, 0]} color="#00F3FF" intensity={2.5} distance={12} />
    </group>
  );
}

