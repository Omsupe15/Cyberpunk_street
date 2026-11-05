'use client';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LANDMARKS } from '@/lib/constants';
import { getCorrugatedMetalTexture, getCrtTerminalTexture } from '@/lib/proceduralTextures';

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

  useEffect(() => {
    setMetalTex(getCorrugatedMetalTexture());
    setCrtGreenTex(getCrtTerminalTexture('green'));
    setCrtAmberTex(getCrtTerminalTexture('amber'));
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Dual alternating amber hazard strobe beacons (sharp tactical flash)
    const strobe1 = (Math.sin(time * 10) + 1) / 2 > 0.65 ? 1 : 0.08;
    const strobe2 = (Math.cos(time * 10) + 1) / 2 > 0.65 ? 1 : 0.08;

    if (strobeLightRef.current) {
      strobeLightRef.current.intensity = strobe1 * 2.5;
    }
    if (beaconMeshRef.current) {
      const mat = beaconMeshRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = strobe1 > 0.5 ? 1 : 0.25;
    }

    if (strobeLight2Ref.current) {
      strobeLight2Ref.current.intensity = strobe2 * 2.2;
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
      sparkFlashRef.current.intensity = Math.random() > 0.94 ? 1.8 : 0;
    }

    // 3. Floating holographic salvage crest rotation
    if (holoSkullRef.current) {
      holoSkullRef.current.rotation.y = time * 0.7;
      holoSkullRef.current.position.y = 4.3 + Math.sin(time * 1.5) * 0.06;
    }
  });

  return (
    <group position={[-7.0, 0, LANDMARKS.PAWN.z]}>
      {/* 1. Grungy Salvage Den Facade (Weathered Concrete & Cast-Iron) */}
      <mesh position={[0, 2.7, 0]} receiveShadow>
        <boxGeometry args={[4.8, 5.4, 11.5]} />
        <meshStandardMaterial color="#161814" roughness={0.92} metalness={0.4} />
      </mesh>

      {/* Industrial Roof Parapet */}
      <mesh position={[2.3, 5.3, 0]}>
        <boxGeometry args={[0.35, 0.45, 11.6]} />
        <meshStandardMaterial color="#1e201b" roughness={0.8} metalness={0.6} />
      </mesh>

      {/* Weathered Corrugated Security Shutter with Procedural Ribbed Texture */}
      <mesh position={[2.32, 3.1, 0]}>
        <planeGeometry args={[8.0, 2.4]} />
        <meshStandardMaterial
          map={metalTex || undefined}
          color="#282d24"
          roughness={0.85}
          metalness={0.65}
        />
      </mesh>
      {/* Heavy Steel Shutter Roller Drum */}
      <mesh position={[2.25, 4.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, 8.2, 16]} />
        <meshStandardMaterial color="#1a1d17" metalness={0.85} roughness={0.4} />
      </mesh>

      {/* Dark Salvage Interior Void */}
      <mesh position={[2.28, 1.1, 0]}>
        <planeGeometry args={[7.8, 2.1]} />
        <meshBasicMaterial color="#060805" />
      </mesh>

      {/* Interior Clutter Ambient Point Lights */}
      <pointLight position={[0.5, 1.4, 0]} color="#FFAA00" intensity={1.5} distance={7} decay={2} />
      <pointLight position={[0.5, 1.4, -2.5]} color="#05FFA1" intensity={1.2} distance={7} decay={2} />

      {/* Tangled Cable Bundles Spilling Out from Under Shutter */}
      {[-2.2, -1.0, 0.8, 2.2].map((zPos, idx) => (
        <group key={`cables-${idx}`} position={[2.4 + idx * 0.1, 0.04, zPos]} rotation={[0, (idx - 1.5) * 0.3, 0]}>
          <mesh>
            <cylinderGeometry args={[0.032, 0.032, 2.2, 8]} />
            <meshStandardMaterial color="#0e100e" roughness={0.9} />
          </mesh>
          <mesh position={[0.05, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 2.0, 8]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#FFAA00' : '#05FFA1'} />
          </mesh>
        </group>
      ))}

      {/* 2. Sidewalk Wire Mesh Security Cages */}
      {/* Cage 1: Salvaged Android Torsos & Cyber-arms */}
      <group position={[1.5, 0.75, -2.8]}>
        <mesh>
          <boxGeometry args={[1.4, 1.5, 1.4]} />
          <meshBasicMaterial color="#05FFA1" wireframe />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[1.45, 0.1, 1.45]} />
          <meshStandardMaterial color="#161814" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.15, 0]} rotation={[0.2, 0.4, 0]}>
          <boxGeometry args={[0.55, 0.7, 0.35]} />
          <meshStandardMaterial color="#262d25" metalness={0.85} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.2, 0.19]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#05FFA1" />
        </mesh>
        <mesh position={[0.45, 0.0, 0.2]} rotation={[0, 0, -0.6]}>
          <cylinderGeometry args={[0.055, 0.045, 0.7, 8]} />
          <meshStandardMaterial color="#778" metalness={0.95} roughness={0.15} />
        </mesh>
      </group>

      {/* Cage 2: Salvaged Mechanical Actuators & Glowing Power Cells */}
      <group position={[1.5, 0.75, 2.8]}>
        <mesh>
          <boxGeometry args={[1.4, 1.5, 1.4]} />
          <meshBasicMaterial color="#FFAA00" wireframe />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <boxGeometry args={[1.45, 0.1, 1.45]} />
          <meshStandardMaterial color="#161814" metalness={0.8} />
        </mesh>
        <mesh position={[-0.2, 0.05, 0]} rotation={[0, 0, 0.35]}>
          <cylinderGeometry args={[0.22, 0.22, 0.85, 14]} />
          <meshStandardMaterial color="#28241a" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[-0.2, 0.25, 0]}>
          <cylinderGeometry args={[0.24, 0.24, 0.07, 14]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>
      </group>

      {/* 3. Crooked Pyramid of Stacked CRT Monitors with Terminal Screens */}
      <group position={[1.65, 0, 0]}>
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[1.3, 0.14, 2.6]} />
          <meshStandardMaterial color="#1f1d18" roughness={0.9} metalness={0.2} />
        </mesh>

        {/* Monitor 1: Bottom Left (Green Phosphor Terminal Text) */}
        <mesh position={[0, 0.58, -0.7]}>
          <boxGeometry args={[0.68, 0.58, 0.68]} />
          <meshStandardMaterial color="#161814" roughness={0.6} />
        </mesh>
        <mesh position={[0.35, 0.58, -0.7]}>
          <planeGeometry args={[0.48, 0.38]} />
          <meshStandardMaterial
            map={crtGreenTex || undefined}
            color="#ffffff"
            emissive="#ffffff"
            emissiveMap={crtGreenTex || undefined}
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Monitor 2: Bottom Right (Amber Phosphor Bios Text) */}
        <mesh position={[0, 0.58, 0.7]}>
          <boxGeometry args={[0.68, 0.58, 0.68]} />
          <meshStandardMaterial color="#161814" roughness={0.6} />
        </mesh>
        <mesh position={[0.35, 0.58, 0.7]}>
          <planeGeometry args={[0.48, 0.38]} />
          <meshStandardMaterial
            map={crtAmberTex || undefined}
            color="#ffffff"
            emissive="#ffffff"
            emissiveMap={crtAmberTex || undefined}
            emissiveIntensity={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Monitor 3: Top Center (Crooked Green Terminal) */}
        <group position={[0, 1.12, -0.15]} rotation={[0, 0.08, -0.04]}>
          <mesh>
            <boxGeometry args={[0.64, 0.54, 0.64]} />
            <meshStandardMaterial color="#161814" roughness={0.6} />
          </mesh>
          <mesh position={[0.33, 0, 0]}>
            <planeGeometry args={[0.44, 0.34]} />
            <meshStandardMaterial
              map={crtGreenTex || undefined}
              color="#ffffff"
              emissive="#ffffff"
              emissiveMap={crtGreenTex || undefined}
              emissiveIntensity={0.85}
              roughness={0.2}
            />
          </mesh>
        </group>
      </group>

      {/* 4. Roof Edge Dual Blinking Hazard Strobe Beacons */}
      <group position={[2.35, 5.2, -4.6]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.16, 0.28, 12]} />
          <meshStandardMaterial color="#181818" metalness={0.9} />
        </mesh>
        <mesh ref={beaconMeshRef} position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshBasicMaterial color="#FFAA00" transparent opacity={1} />
        </mesh>
        <pointLight ref={strobeLightRef} position={[0, 0.25, 0]} color="#FFAA00" intensity={2.5} distance={12} decay={2} />
      </group>

      <group position={[2.35, 5.2, 4.6]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.16, 0.28, 12]} />
          <meshStandardMaterial color="#181818" metalness={0.9} />
        </mesh>
        <mesh ref={beaconMesh2Ref} position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshBasicMaterial color="#FFAA00" transparent opacity={1} />
        </mesh>
        <pointLight ref={strobeLight2Ref} position={[0, 0.25, 0]} color="#FFAA00" intensity={2.2} distance={12} decay={2} />
      </group>

      {/* 5. Damaged Faulty Neon Sign: "DEBRIS PAWN // 屑物市場" */}
      <group position={[2.38, 4.0, -2.6]}>
        <mesh position={[-0.04, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4.2, 0.95]} />
          <meshStandardMaterial color="#121410" roughness={0.7} metalness={0.6} />
        </mesh>
        <mesh position={[-0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4.35, 1.1]} />
          <meshBasicMaterial color="#FFAA00" wireframe />
        </mesh>
        <mesh ref={neonSignRef} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4.0, 0.75]} />
          <meshBasicMaterial color="#05FFA1" transparent opacity={0.92} />
        </mesh>
        <pointLight ref={sparkFlashRef} position={[0.2, 0, 0]} color="#00F3FF" intensity={0} distance={8} decay={2} />
      </group>

      {/* 6. Floating Holographic Salvage Biohazard Crest */}
      <group ref={holoSkullRef} position={[2.3, 4.3, 2.5]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.42, 0.035, 8, 20]} />
          <meshBasicMaterial color="#05FFA1" wireframe />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.18, 0.3, 3]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>
      </group>

      {/* 7. Realistic Controlled Lighting (Decay = 2, prevents scene blowout) */}
      <pointLight position={[2.6, 2.2, 0]} color="#05FFA1" intensity={2.2} distance={14} decay={2} />
      <pointLight position={[2.6, 0.8, -2.8]} color="#05FFA1" intensity={1.5} distance={8} decay={2} />
      <pointLight position={[2.6, 0.8, 2.8]} color="#FFAA00" intensity={1.6} distance={8} decay={2} />
    </group>
  );
}
