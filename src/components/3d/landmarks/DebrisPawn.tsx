'use client';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LANDMARKS } from '@/lib/constants';
import { getCorrugatedMetalTexture, getCrtTerminalTexture, getHorizontalMarqueeTexture } from '@/lib/proceduralTextures';

export function DebrisPawn() {
  const strobeLightRef = useRef<THREE.PointLight>(null);
  const strobeLight2Ref = useRef<THREE.PointLight>(null);
  const beaconMeshRef = useRef<THREE.Mesh>(null);
  const beaconMesh2Ref = useRef<THREE.Mesh>(null);
  const neonSignRef = useRef<THREE.Mesh>(null);
  const holoSkullRef = useRef<THREE.Group>(null);
  const sparkFlashRef = useRef<THREE.PointLight>(null);

  const [metalTex, setMetalTex] = useState<THREE.CanvasTexture | null>(null);
  const [crtGreenTex, setCrtGreenTex] = useState<THREE.CanvasTexture | null>(null);
  const [crtAmberTex, setCrtAmberTex] = useState<THREE.CanvasTexture | null>(null);
  const [marqueeTex, setMarqueeTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    setMetalTex(getCorrugatedMetalTexture());
    setCrtGreenTex(getCrtTerminalTexture('green'));
    setCrtAmberTex(getCrtTerminalTexture('amber'));
    setMarqueeTex(
      getHorizontalMarqueeTexture(
        'DEBRIS SALVAGE & PAWN',
        '屑物市場 // HARDWARE BROKERS',
        '#05ffa1',
        '#f59e0b'
      )
    );
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Dual alternating amber hazard strobe beacons
    const strobe1 = (Math.sin(time * 10) + 1) / 2 > 0.65 ? 1 : 0.08;
    const strobe2 = (Math.cos(time * 10) + 1) / 2 > 0.65 ? 1 : 0.08;

    if (strobeLightRef.current) {
      strobeLightRef.current.intensity = strobe1 * 0.9;
    }
    if (beaconMeshRef.current) {
      const mat = beaconMeshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = strobe1 > 0.5 ? 1 : 0.25;
    }

    if (strobeLight2Ref.current) {
      strobeLight2Ref.current.intensity = strobe2 * 0.8;
    }
    if (beaconMesh2Ref.current) {
      const mat = beaconMesh2Ref.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = strobe2 > 0.5 ? 1 : 0.25;
    }

    // 2. Flickering faulty neon sign
    if (neonSignRef.current) {
      const flicker = Math.random() > 0.12 ? 1 : Math.random() > 0.5 ? 0.2 : 0.0;
      const mat = neonSignRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = flicker;
    }

    // Occasional electric arc spark flash
    if (sparkFlashRef.current) {
      sparkFlashRef.current.intensity = Math.random() > 0.94 ? 2.5 : 0;
    }

    // 3. Floating holographic salvage crest rotation
    if (holoSkullRef.current) {
      holoSkullRef.current.rotation.y = time * 0.7;
      holoSkullRef.current.position.y = 4.3 + Math.sin(time * 1.5) * 0.06;
    }
  });

  return (
    <group position={[LANDMARKS.PAWN.x, 0, LANDMARKS.PAWN.z]}>
      {/* 1. Grungy Salvage Den Facade (Matte Industrial Slate) */}
      <mesh position={[0, 2.7, 0]} receiveShadow>
        <boxGeometry args={[4.8, 5.4, 11.5]} />
        <meshStandardMaterial color="#202636" roughness={0.85} metalness={0.2} />
      </mesh>

      {/* Industrial Roof Parapet (Matte Industrial Steel) */}
      <mesh position={[2.3, 5.3, 0]}>
        <boxGeometry args={[0.35, 0.45, 11.6]} />
        <meshStandardMaterial color="#2a3348" roughness={0.75} metalness={0.35} />
      </mesh>

      {/* Weathered Corrugated Security Shutter with Procedural Rusted Texture */}
      <mesh position={[2.32, 3.1, 0]}>
        <planeGeometry args={[8.0, 2.4]} />
        <meshStandardMaterial
          map={metalTex || undefined}
          color="#42362b"
          roughness={0.85}
          metalness={0.35}
        />
      </mesh>

      {/* Heavy Steel Shutter Roller Drum & Manual Chain Hoist */}
      <mesh position={[2.25, 4.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, 8.2, 16]} />
        <meshStandardMaterial color="#262d3e" metalness={0.35} roughness={0.75} />
      </mesh>
      {/* Heavy Master Padlock on Shutter Base */}
      <group position={[2.34, 1.95, -1.5]}>
        <mesh>
          <boxGeometry args={[0.04, 0.1, 0.08]} />
          <meshStandardMaterial color="#d4af37" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <torusGeometry args={[0.035, 0.008, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.4} />
        </mesh>
      </group>

      {/* Subterranean Salvage Interior (Deep Slate Shadow, Not Void Black) */}
      <mesh position={[2.28, 1.1, 0]}>
        <planeGeometry args={[7.8, 2.1]} />
        <meshBasicMaterial color="#161c28" />
      </mesh>

      {/* Interior Clutter Ambient Point Lights */}
      <pointLight position={[0.5, 1.4, 0]} color="#f59e0b" intensity={0.9} distance={5} decay={2} />
      <pointLight position={[0.5, 1.4, -2.5]} color="#05ffa1" intensity={0.7} distance={5} decay={2} />

      {/* Tangled Cable Bundles with Amber Zip-Ties Spilling Out from Under Shutter */}
      {[-2.2, -1.0, 0.8, 2.2].map((zPos, idx) => (
        <group key={`cables-${idx}`} position={[2.4 + idx * 0.1, 0.04, zPos]} rotation={[0, (idx - 1.5) * 0.3, 0]}>
          <mesh>
            <cylinderGeometry args={[0.032, 0.032, 2.2, 8]} />
            <meshStandardMaterial color="#202534" roughness={0.8} />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2.0, 8]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#f59e0b' : '#05ffa1'} />
          </mesh>
          {/* Amber Zip Ties */}
          {[-0.6, 0, 0.6].map((tZ, tIdx) => (
            <mesh key={`tie-${tIdx}`} position={[0.02, 0, tZ]}>
              <torusGeometry args={[0.04, 0.008, 6, 12]} />
              <meshBasicMaterial color="#f59e0b" />
            </mesh>
          ))}
        </group>
      ))}

      {/* 2. Sidewalk Wire Mesh Security Cages with Distinct Salvage Parts */}
      {/* Cage 1: Salvaged Android Endoskeleton & Cybernetic Limbs */}
      <group position={[1.5, 0.75, -2.8]}>
        <mesh>
          <boxGeometry args={[1.4, 1.5, 1.4]} />
          <meshBasicMaterial color="#05ffa1" wireframe />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[1.45, 0.1, 1.45]} />
          <meshStandardMaterial color="#242c3e" metalness={0.3} roughness={0.8} />
        </mesh>
        {/* Robot Torso */}
        <mesh position={[0, 0.15, 0]} rotation={[0.2, 0.4, 0]}>
          <boxGeometry args={[0.55, 0.7, 0.35]} />
          <meshStandardMaterial color="#323a4e" metalness={0.4} roughness={0.7} />
        </mesh>
        {/* Robot Skull Endoskeleton */}
        <group position={[-0.2, 0.6, 0.1]} rotation={[0.1, 0.5, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.35} />
          </mesh>
          {/* Glowing Red Optical Socket */}
          <mesh position={[0.05, 0.02, 0.1]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color="#ff2a6d" />
          </mesh>
        </group>
        {/* Prosthetic Arm Hanging Out */}
        <mesh position={[0.45, 0.0, 0.2]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.055, 0.045, 0.7, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.35} />
        </mesh>
      </group>

      {/* Cage 2: Salvaged Mechanical Actuators & Glowing Fusion Power Cells */}
      <group position={[1.5, 0.75, 2.8]}>
        <mesh>
          <boxGeometry args={[1.4, 1.5, 1.4]} />
          <meshBasicMaterial color="#f59e0b" wireframe />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[1.45, 0.1, 1.45]} />
          <meshStandardMaterial color="#242c3e" metalness={0.3} roughness={0.8} />
        </mesh>
        {/* Fusion Power Canister */}
        <mesh position={[-0.2, 0.05, 0]} rotation={[0, 0, 0.35]}>
          <cylinderGeometry args={[0.22, 0.22, 0.85, 14]} />
          <meshStandardMaterial color="#2a3348" metalness={0.35} roughness={0.7} />
        </mesh>
        <mesh position={[-0.2, 0.25, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.07, 14]} />
          <meshBasicMaterial color="#05ffa1" />
        </mesh>
      </group>

      {/* 3. Crooked Pyramid of Stacked CRT Monitors with Dials & Bezels */}
      <group position={[1.65, 0, 0]}>
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[1.3, 0.14, 2.6]} />
          <meshStandardMaterial color="#222938" roughness={0.8} metalness={0.25} />
        </mesh>

        {/* Monitor 1: Bottom Left (Green Phosphor Terminal Text) */}
        <group position={[0, 0.58, -0.7]}>
          <mesh>
            <boxGeometry args={[0.68, 0.58, 0.68]} />
            <meshStandardMaterial color="#283246" roughness={0.8} />
          </mesh>
          {/* Screen with Bezel */}
          <mesh position={[0.35, 0, 0]}>
            <planeGeometry args={[0.48, 0.38]} />
            <meshStandardMaterial
              map={crtGreenTex || undefined}
              color="#ffffff"
              emissive="#ffffff"
              emissiveMap={crtGreenTex || undefined}
              emissiveIntensity={0.95}
              roughness={0.5}
            />
          </mesh>
          {/* Power Switch & Contrast Dial */}
          <mesh position={[0.35, -0.22, 0.18]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
            <meshBasicMaterial color="#05ffa1" />
          </mesh>
        </group>

        {/* Monitor 2: Bottom Right (Amber Phosphor Bios Text) */}
        <group position={[0, 0.58, 0.7]}>
          <mesh>
            <boxGeometry args={[0.68, 0.58, 0.68]} />
            <meshStandardMaterial color="#283246" roughness={0.8} />
          </mesh>
          <mesh position={[0.35, 0, 0]}>
            <planeGeometry args={[0.48, 0.38]} />
            <meshStandardMaterial
              map={crtAmberTex || undefined}
              color="#ffffff"
              emissive="#ffffff"
              emissiveMap={crtAmberTex || undefined}
              emissiveIntensity={0.95}
              roughness={0.5}
            />
          </mesh>
        </group>

        {/* Monitor 3: Top Center (Crooked Green Terminal) */}
        <group position={[0, 1.12, -0.15]} rotation={[0, 0.08, -0.04]}>
          <mesh>
            <boxGeometry args={[0.64, 0.54, 0.64]} />
            <meshStandardMaterial color="#283246" roughness={0.8} />
          </mesh>
          <mesh position={[0.33, 0, 0]}>
            <planeGeometry args={[0.44, 0.34]} />
            <meshStandardMaterial
              map={crtGreenTex || undefined}
              color="#ffffff"
              emissive="#ffffff"
              emissiveMap={crtGreenTex || undefined}
              emissiveIntensity={0.95}
              roughness={0.5}
            />
          </mesh>
        </group>
      </group>

      {/* 4. Roof Edge Dual Blinking Hazard Strobe Beacons */}
      <group position={[2.35, 5.2, -4.6]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.16, 0.28, 12]} />
          <meshStandardMaterial color="#2a3348" metalness={0.3} roughness={0.75} />
        </mesh>
        <mesh ref={beaconMeshRef} position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={1} />
        </mesh>
        <pointLight ref={strobeLightRef} position={[0, 0.25, 0]} color="#f59e0b" intensity={0.9} distance={6} decay={2} />
      </group>

      <group position={[2.35, 5.2, 4.6]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.16, 0.28, 12]} />
          <meshStandardMaterial color="#2a3348" metalness={0.3} roughness={0.75} />
        </mesh>
        <mesh ref={beaconMesh2Ref} position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={1} />
        </mesh>
        <pointLight ref={strobeLight2Ref} position={[0, 0.25, 0]} color="#f59e0b" intensity={0.8} distance={6} decay={2} />
      </group>

      {/* 5. Bilingual Industrial Neon Marquee Sign: English First + Asian Subtext */}
      <group position={[2.38, 4.4, 0]}>
        <mesh position={[-0.04, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[6.8, 1.3]} />
          <meshStandardMaterial color="#1e2538" roughness={0.75} metalness={0.25} />
        </mesh>
        <mesh position={[-0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[6.95, 1.45]} />
          <meshBasicMaterial color="#f59e0b" wireframe />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[6.6, 1.15]} />
          <meshStandardMaterial
            map={marqueeTex || undefined}
            emissive="#05ffa1"
            emissiveMap={marqueeTex || undefined}
            emissiveIntensity={0.95}
            roughness={0.6}
          />
        </mesh>
        <pointLight ref={sparkFlashRef} position={[0.2, 0, 0]} color="#00e5ff" intensity={0} distance={5} decay={2} />
      </group>

      {/* 6. Floating Holographic Salvage Biohazard Crest */}
      <group ref={holoSkullRef} position={[2.3, 4.3, 2.5]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.42, 0.035, 8, 20]} />
          <meshBasicMaterial color="#05ffa1" wireframe />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.18, 0.3, 3]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* 7. Localized Architectural Accent Lights */}
      <pointLight position={[2.4, 4.0, 0]} color="#05ffa1" intensity={1.0} distance={7} decay={2} />
      <pointLight position={[2.0, 1.8, 0]} color="#f59e0b" intensity={0.9} distance={6} decay={2} />
    </group>
  );
}
