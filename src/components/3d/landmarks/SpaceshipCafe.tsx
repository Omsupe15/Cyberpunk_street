'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LANDMARKS } from '@/lib/constants';

export function SpaceshipCafe() {
  const holoMugRef = useRef<THREE.Group>(null);
  const steamRingsRef = useRef<THREE.Group>(null);
  const thrustersLightRef = useRef<THREE.PointLight>(null);
  const plasmaExhaustRef = useRef<THREE.Group>(null);
  const holoMenuRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // 1. Rotate holographic coffee mug smoothly
    if (holoMugRef.current) {
      holoMugRef.current.rotation.y = time * 0.7;
      holoMugRef.current.position.y = 5.8 + Math.sin(time * 1.8) * 0.08;
    }

    // 2. Animate rising steam rings
    if (steamRingsRef.current) {
      steamRingsRef.current.children.forEach((child, idx) => {
        const ring = child as THREE.Mesh;
        const phase = (time * 0.85 + idx * 0.65) % 2.0;
        ring.position.y = phase * 0.6;
        const scale = 0.4 + phase * 0.4;
        ring.scale.set(scale, scale, scale);
        const mat = ring.material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = Math.max(0, 1 - phase / 2.0) * 0.75;
      });
    }

    // 3. Realistic ion thruster pulse
    if (thrustersLightRef.current) {
      thrustersLightRef.current.intensity = 2.2 + Math.sin(time * 12) * 0.4;
    }
    if (plasmaExhaustRef.current) {
      const flicker = 0.9 + Math.sin(time * 18) * 0.1;
      plasmaExhaustRef.current.scale.set(flicker, flicker, flicker);
    }

    // 4. Hovering holographic menu subtle float
    if (holoMenuRef.current) {
      holoMenuRef.current.position.y = 1.9 + Math.sin(time * 1.4) * 0.04;
      holoMenuRef.current.rotation.y = Math.sin(time * 0.7) * 0.06;
    }
  });

  return (
    <group position={[7.5, 0, LANDMARKS.CAFE.z]}>
      {/* 1. Cafe Main Two-Story Building Structure */}
      <mesh position={[0, 3.2, 0]} receiveShadow>
        <boxGeometry args={[5.2, 6.4, 13.5]} />
        <meshStandardMaterial color="#161822" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Recessed Ground Floor Cafe Bistro Interior */}
      <mesh position={[-0.4, 1.8, 0]}>
        <boxGeometry args={[4.2, 3.4, 12.2]} />
        <meshStandardMaterial color="#10121a" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Ground Floor Panoramic Anti-Reflective Storefront Glass */}
      <mesh position={[-2.42, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12.2, 3.4]} />
        <meshStandardMaterial
          color="#FFAA00"
          roughness={0.05}
          metalness={0.9}
          transparent
          opacity={0.25}
        />
      </mesh>

      {/* Storefront Structural Mullions & Bevelled Metal Frames */}
      {[-5.4, -2.7, 0, 2.7, 5.4].map((zPos, idx) => (
        <mesh key={idx} position={[-2.44, 1.8, zPos]}>
          <boxGeometry args={[0.08, 3.5, 0.08]} />
          <meshStandardMaterial color="#222634" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}

      {/* Interior Bar Counter with Warm Golden Under-glow */}
      <group position={[-1.2, 0.9, 0]}>
        {/* Main Bar Top */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.1, 7.5]} />
          <meshStandardMaterial color="#0b0d13" roughness={0.15} metalness={0.9} />
        </mesh>
        {/* Glowing Under-Counter Accent Slat */}
        <mesh position={[-0.41, -0.06, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[7.5, 0.05]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>
        {/* Chrome Espresso Machine */}
        <mesh position={[0, 0.28, -2.2]}>
          <boxGeometry args={[0.45, 0.42, 0.65]} />
          <meshStandardMaterial color="#8899aa" metalness={0.95} roughness={0.1} />
        </mesh>
        {/* Back-bar Shelving with Glowing Liquor / Synth-Drink Bottles */}
        {[-1.5, 0, 1.5].map((zVal, bIdx) => (
          <group key={`bottle-${bIdx}`} position={[0.8, 0.6, zVal]}>
            <mesh>
              <cylinderGeometry args={[0.05, 0.05, 0.28, 8]} />
              <meshBasicMaterial color={bIdx === 0 ? '#00F3FF' : bIdx === 1 ? '#FFAA00' : '#FF0055'} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 2. Docked Retro-Futuristic Spaceship Fuselage on Upper Deck (Z = -32m) */}
      <group position={[-0.6, 6.5, 0]}>
        {/* Aerodynamic Cockpit & Fuselage Shell */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, -0.04]}>
          <cylinderGeometry args={[1.5, 1.7, 9.8, 20]} />
          <meshStandardMaterial color="#262b3a" roughness={0.3} metalness={0.85} />
        </mesh>

        {/* Cockpit Tapered Nose Cone */}
        <mesh position={[0, 0, 5.4]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[1.5, 2.0, 20]} />
          <meshStandardMaterial color="#1e2230" roughness={0.3} metalness={0.85} />
        </mesh>

        {/* Tinted Panoramic Cockpit Glass Canopy */}
        <mesh position={[0, 0.75, 4.2]} rotation={[0.4, 0, 0]}>
          <sphereGeometry args={[1.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#00F3FF"
            roughness={0.05}
            metalness={0.95}
            transparent
            opacity={0.4}
          />
        </mesh>

        {/* Cockpit Interior Avionics Glow */}
        <mesh position={[0, 0.65, 4.1]}>
          <boxGeometry args={[0.6, 0.08, 0.3]} />
          <meshBasicMaterial color="#00F3FF" />
        </mesh>

        {/* Aerodynamic Delta Winglets with Nav Lights */}
        <mesh position={[-2.2, -0.3, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[2.0, 0.08, 3.5]} />
          <meshStandardMaterial color="#1e2230" metalness={0.8} />
        </mesh>
        <mesh position={[-3.2, -0.15, -1.2]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#FF0055" />
        </mesh>

        <mesh position={[2.2, -0.3, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[2.0, 0.08, 3.5]} />
          <meshStandardMaterial color="#1e2230" metalness={0.8} />
        </mesh>
        <mesh position={[3.2, -0.15, -1.2]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#05FFA1" />
        </mesh>

        {/* Dual High-Bypass Ion Thruster Nacelles */}
        <group position={[1.4, -0.85, -2.2]} rotation={[0, 0, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.44, 0.54, 1.6, 18]} />
            <meshStandardMaterial color="#181b24" metalness={0.95} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.78, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 0.12, 18]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>

        <group position={[1.4, -0.85, 2.2]} rotation={[0, 0, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.44, 0.54, 1.6, 18]} />
            <meshStandardMaterial color="#181b24" metalness={0.95} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.78, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 0.12, 18]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>

        {/* Realistic Ion Plasma Flare Cones */}
        <group ref={plasmaExhaustRef}>
          <mesh position={[1.4, -1.8, -2.2]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.36, 1.2, 12]} />
            <meshBasicMaterial color="#FFAA00" transparent opacity={0.65} />
          </mesh>
          <mesh position={[1.4, -1.8, 2.2]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.36, 1.2, 12]} />
            <meshBasicMaterial color="#FFAA00" transparent opacity={0.65} />
          </mesh>
        </group>
      </group>

      {/* 3. 3D Rotating Holographic Coffee Mug Sign */}
      <group ref={holoMugRef} position={[-2.8, 5.8, 0]}>
        <mesh>
          <cylinderGeometry args={[0.48, 0.4, 0.95, 18]} />
          <meshBasicMaterial color="#00F3FF" wireframe />
        </mesh>
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.25, 0.05, 8, 16]} />
          <meshBasicMaterial color="#00F3FF" />
        </mesh>

        {/* Rising Holographic Steam Rings */}
        <group ref={steamRingsRef} position={[0, 0.55, 0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.18, 0.26, 16]} />
              <meshBasicMaterial color="#00F3FF" transparent opacity={0.7} />
            </mesh>
          ))}
        </group>
      </group>

      {/* 4. Prominent Illuminated Neon Brand Marquee: "SPACESHIP CAFE // 宇宙船" */}
      <group position={[-2.65, 4.8, 0]}>
        {/* Heavy Backplate Panel */}
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[7.2, 1.2]} />
          <meshStandardMaterial color="#0b0e15" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Outer Neon Wireframe Border */}
        <mesh position={[-0.02, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[7.4, 1.35]} />
          <meshBasicMaterial color="#FFAA00" wireframe />
        </mesh>
        {/* Main Neon Faceplate */}
        <mesh position={[-0.04, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[7.0, 1.0]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>
      </group>

      {/* 5. Hovering Holographic Menu Projection on Patio */}
      <group ref={holoMenuRef} position={[-2.6, 1.9, -1.8]}>
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.4, 2.0]} />
          <meshBasicMaterial color="#00F3FF" transparent opacity={0.65} wireframe />
        </mesh>
        <mesh position={[-0.02, 0.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[1.2, 0.15]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>
      </group>

      {/* 6. Street-level Dining Patio: Bar Stools & Circular Tables */}
      {[-3.5, 0, 3.5].map((zPos, sIdx) => (
        <group key={`patio-${sIdx}`} position={[-2.9, 0.14, zPos]}>
          {/* Chrome Bistro Table */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.04, 16]} />
            <meshStandardMaterial color="#222838" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.44, 8]} />
            <meshStandardMaterial color="#444" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.04, 16]} />
            <meshStandardMaterial color="#222" metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 7. Realistic Controlled Lighting (Decay = 2, prevents scene blowout) */}
      <pointLight position={[-3.2, 2.8, 0]} color="#FFAA00" intensity={2.2} distance={15} decay={2} />
      <pointLight ref={thrustersLightRef} position={[0.8, 5.0, 0]} color="#FFAA00" intensity={2.0} distance={12} decay={2} />
      <pointLight position={[-2.8, 5.8, 0]} color="#00F3FF" intensity={1.5} distance={10} decay={2} />
    </group>
  );
}
