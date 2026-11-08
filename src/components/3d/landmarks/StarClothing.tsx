'use client';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LANDMARKS } from '@/lib/constants';
import { getHorizontalMarqueeTexture } from '@/lib/proceduralTextures';

export function StarClothing() {
  const mannequin1Ref = useRef<THREE.Group>(null);
  const mannequin2Ref = useRef<THREE.Group>(null);
  const starsGroupRef = useRef<THREE.Group>(null);
  const starCrestRef = useRef<THREE.Mesh>(null);
  const holoRings1Ref = useRef<THREE.Group>(null);
  const holoRings2Ref = useRef<THREE.Group>(null);
  const signGlowRef = useRef<THREE.PointLight>(null);

  const [marqueeTex, setMarqueeTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    setMarqueeTex(
      getHorizontalMarqueeTexture(
        'ASTRA LUXURY HAUTE COUTURE',
        '恒星クチュール // COSMIC FASHION',
        '#8A2BE2',
        '#00F3FF'
      )
    );
  }, []);

  // Pre-generate constellation star coordinates & phases
  const starPoints = useMemo(() => {
    const list = [];
    for (let i = 0; i < 64; i++) {
      list.push({
        x: (Math.random() - 0.5) * 3.4,
        z: (Math.random() - 0.5) * 12,
        phase: Math.random() * Math.PI * 2,
        speed: 1.2 + Math.random() * 2.8,
        color: i % 3 === 0 ? '#8A2BE2' : i % 2 === 0 ? '#00F3FF' : '#FFFFFF',
      });
    }
    return list;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Rotate wireframe holographic mannequins
    if (mannequin1Ref.current) {
      mannequin1Ref.current.rotation.y = time * 0.45;
      mannequin1Ref.current.position.y = 1.45 + Math.sin(time * 1.8) * 0.03;
    }
    if (mannequin2Ref.current) {
      mannequin2Ref.current.rotation.y = -time * 0.4;
      mannequin2Ref.current.position.y = 1.45 + Math.cos(time * 1.6) * 0.03;
    }

    // 2. Gyroscopic holographic aura rings spinning around mannequins
    if (holoRings1Ref.current) {
      holoRings1Ref.current.rotation.x = time * 1.1;
      holoRings1Ref.current.rotation.z = time * 0.8;
    }
    if (holoRings2Ref.current) {
      holoRings2Ref.current.rotation.y = -time * 1.3;
      holoRings2Ref.current.rotation.z = time * 0.7;
    }

    // 3. Pulse 8-pointed star crest
    if (starCrestRef.current) {
      starCrestRef.current.rotation.z = time * 0.3;
      starCrestRef.current.rotation.y = time * 0.2;
    }

    // 4. Twinkle constellation fiber-optics
    if (starsGroupRef.current) {
      starsGroupRef.current.children.forEach((child, i) => {
        const star = starPoints[i];
        if (star) {
          const brightness = 0.25 + Math.sin(time * star.speed + star.phase) * 0.75;
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) mat.opacity = Math.max(0.12, brightness);
        }
      });
    }

    // 5. Sign glow subtle breath
    if (signGlowRef.current) {
      signGlowRef.current.intensity = 3.5 + Math.sin(time * 2.5) * 0.45;
    }
  });

  return (
    <group position={[LANDMARKS.STAR.x, 0, LANDMARKS.STAR.z]}>
      {/* 1. Main Boutique Architecture (Honed Black Basalt & Dark Bronze Profiles) */}
      <mesh position={[0, 3.2, 0]} receiveShadow>
        <boxGeometry args={[4.8, 6.4, 13.5]} />
        <meshStandardMaterial color="#0f0e16" roughness={0.35} metalness={0.7} />
      </mesh>

      {/* Vertical Violet Neon Architectural Pilasters */}
      {[-6.6, 6.6].map((zEdge, idx) => (
        <mesh key={`pilaster-${idx}`} position={[2.42, 3.2, zEdge]}>
          <boxGeometry args={[0.06, 6.4, 0.12]} />
          <meshBasicMaterial color="#8A2BE2" />
        </mesh>
      ))}

      {/* Recessed Interior Showroom Cavity */}
      <mesh position={[0.4, 2.5, 0]}>
        <boxGeometry args={[4.0, 4.8, 12]} />
        <meshStandardMaterial color="#14111d" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Interior Polished Marble Runway Floor */}
      <mesh position={[0.4, 0.12, 0]}>
        <boxGeometry args={[3.8, 0.05, 11.8]} />
        <meshStandardMaterial color="#08070d" roughness={0.12} metalness={0.9} />
      </mesh>
      {/* Glowing Violet Runway Center Slat */}
      <mesh position={[1.4, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.25, 11]} />
        <meshBasicMaterial color="#8A2BE2" />
      </mesh>

      {/* Interior Brushed Titanium Clothing Racks with Hanging Techwear Jackets */}
      {[-3.6, 0, 3.6].map((zPos, idx) => (
        <group key={`rack-${idx}`} position={[-1.2, 1.8, zPos]}>
          {/* Horizontal Titanium Hanging Rail */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2.4, 8]} />
            <meshStandardMaterial color="#aaa" metalness={0.95} />
          </mesh>
          {/* Side Floor Supports */}
          <mesh position={[0, 0, -1.15]}>
            <cylinderGeometry args={[0.025, 0.025, 1.3, 8]} />
            <meshStandardMaterial color="#333" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 1.15]}>
            <cylinderGeometry args={[0.025, 0.025, 1.3, 8]} />
            <meshStandardMaterial color="#333" metalness={0.9} />
          </mesh>
          {/* Sculpted Coats on Hangers */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((hPos, hIdx) => (
            <group key={`coat-${hIdx}`} position={[0, 0.2, hPos]}>
              <mesh position={[0, 0.35, 0]}>
                <torusGeometry args={[0.06, 0.008, 6, 8, Math.PI]} />
                <meshStandardMaterial color="#888" metalness={0.9} />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.28, 0.55, 0.12]} />
                <meshStandardMaterial
                  color={hIdx % 2 === 0 ? '#1a1c26' : '#261b30'}
                  roughness={0.6}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}

      {/* Recessed Ceiling Track Spotlight Canisters */}
      {[-4, -2, 0, 2, 4].map((zSpot, sIdx) => (
        <mesh key={`spot-${sIdx}`} position={[1.5, 4.6, zSpot]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 12]} />
          <meshStandardMaterial color="#222" metalness={0.9} />
        </mesh>
      ))}

      {/* 2. Floor-to-Ceiling Showroom Glass Window */}
      <mesh position={[2.42, 2.5, 0]}>
        <planeGeometry args={[12.2, 4.6]} />
        <meshStandardMaterial
          color="#8A2BE2"
          roughness={0.05}
          metalness={0.95}
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* Chrome Mullions & 4-Way Spider Glass Brackets */}
      {[-5.6, -3.2, 0, 3.2, 5.6].map((zPos, idx) => (
        <group key={idx}>
          <mesh position={[2.44, 2.5, zPos]}>
            <boxGeometry args={[0.08, 4.8, 0.08]} />
            <meshStandardMaterial color="#b0b8d0" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Spider Fitting Cross at Mid-Height */}
          <mesh position={[2.46, 2.5, zPos]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#d0d8e8" metalness={0.98} />
          </mesh>
        </group>
      ))}

      {/* 3. Overhanging Constellation Canopy */}
      <group position={[1.6, 5.0, 0]} rotation={[0, 0, 0.08]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.6, 0.28, 13.0]} />
          <meshStandardMaterial color="#0b0a12" roughness={0.5} metalness={0.8} />
        </mesh>
        <mesh position={[1.81, 0, 0]}>
          <boxGeometry args={[0.04, 0.1, 13.0]} />
          <meshBasicMaterial color="#8A2BE2" />
        </mesh>

        {/* Constellation Star Matrix */}
        <group ref={starsGroupRef} position={[0, -0.15, 0]}>
          {starPoints.map((pt, idx) => (
            <mesh key={idx} position={[pt.x, 0, pt.z]}>
              <sphereGeometry args={[0.035, 6, 6]} />
              <meshBasicMaterial color={pt.color} transparent opacity={0.8} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 4. Display Window: Rotating Wireframe Mannequins with Gyro Holograms */}
      {/* Mannequin 1: Astra Violet Wireframe Jacket */}
      <group ref={mannequin1Ref} position={[1.4, 1.4, -2.6]}>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.5, 0.55, 0.1, 20]} />
          <meshStandardMaterial color="#161220" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <ringGeometry args={[0.38, 0.48, 20]} />
          <meshBasicMaterial color="#8A2BE2" />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <coneGeometry args={[0.36, 0.92, 10]} />
          <meshBasicMaterial color="#8A2BE2" wireframe />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
          <sphereGeometry args={[0.15, 10, 10]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        <group ref={holoRings1Ref} position={[0, 0.6, 0]}>
          <mesh>
            <torusGeometry args={[0.62, 0.015, 8, 20]} />
            <meshBasicMaterial color="#00F3FF" transparent opacity={0.65} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.68, 0.015, 8, 20]} />
            <meshBasicMaterial color="#8A2BE2" transparent opacity={0.6} />
          </mesh>
        </group>
      </group>

      {/* Mannequin 2: Cyber Cyan Wireframe Gown */}
      <group ref={mannequin2Ref} position={[1.4, 1.4, 2.6]}>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.5, 0.55, 0.1, 20]} />
          <meshStandardMaterial color="#0e1a20" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.04, 0]}>
          <ringGeometry args={[0.38, 0.48, 20]} />
          <meshBasicMaterial color="#00F3FF" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <coneGeometry args={[0.42, 1.1, 12]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        <mesh position={[0, 1.05, 0]}>
          <sphereGeometry args={[0.15, 10, 10]} />
          <meshBasicMaterial color="#8A2BE2" wireframe />
        </mesh>
        <group ref={holoRings2Ref} position={[0, 0.65, 0]}>
          <mesh>
            <torusGeometry args={[0.65, 0.015, 8, 20]} />
            <meshBasicMaterial color="#8A2BE2" transparent opacity={0.7} />
          </mesh>
          <mesh rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[0.72, 0.015, 8, 20]} />
            <meshBasicMaterial color="#00F3FF" transparent opacity={0.6} />
          </mesh>
        </group>
      </group>

      {/* 5. 8-Pointed Star Neon Crest & Bilingual Haute Couture Marquee */}
      <group position={[2.46, 5.75, 0]}>
        <mesh ref={starCrestRef} position={[0, 0.4, 0]}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        <mesh position={[-0.05, -0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[7.2, 1.3]} />
          <meshStandardMaterial color="#08060f" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-0.03, -0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[7.35, 1.45]} />
          <meshBasicMaterial color="#8A2BE2" wireframe />
        </mesh>
        <mesh position={[0, -0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[7.0, 1.15]} />
          <meshStandardMaterial
            map={marqueeTex || undefined}
            emissive="#8A2BE2"
            emissiveMap={marqueeTex || undefined}
            emissiveIntensity={0.95}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 6. Sidewalk Entrance Runway Carpet */}
      <group position={[3.2, 0.02, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 4.0]} />
          <meshBasicMaterial color="#8A2BE2" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* 7. Dedicated Architectural Facade Floodlights (Decay = 2) */}
      <pointLight
        ref={signGlowRef}
        position={[3.6, 5.5, 0]}
        color="#8A2BE2"
        intensity={3.5}
        distance={16}
        decay={2}
      />
      {/* Canopy Downlight */}
      <pointLight position={[2.8, 4.2, 0]} color="#00F3FF" intensity={2.8} distance={14} decay={2} />
      {/* Showroom Display Lights */}
      <pointLight position={[2.2, 2.8, -2.6]} color="#8A2BE2" intensity={2.0} distance={11} decay={2} />
      <pointLight position={[2.2, 2.8, 2.6]} color="#00F3FF" intensity={2.0} distance={11} decay={2} />
    </group>
  );
}
