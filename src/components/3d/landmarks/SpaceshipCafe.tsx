'use client';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { LANDMARKS } from '@/lib/constants';
import { getHorizontalMarqueeTexture } from '@/lib/proceduralTextures';

export function SpaceshipCafe() {
  const holoMugRef = useRef<THREE.Group>(null);
  const steamRingsRef = useRef<THREE.Group>(null);
  const thrustersLightRef = useRef<THREE.PointLight>(null);
  const plasmaExhaustRef = useRef<THREE.Group>(null);
  const holoMenuRef = useRef<THREE.Group>(null);
  const beaconRef = useRef<THREE.Mesh>(null);

  const [marqueeTex, setMarqueeTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    setMarqueeTex(
      getHorizontalMarqueeTexture(
        'SPACESHIP CAFE & RECHARGE',
        '宇宙船 カフェ // FREIGHTER DOCK',
        '#FFAA00',
        '#ffffff'
      )
    );
  }, []);

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
      thrustersLightRef.current.intensity = 2.4 + Math.sin(time * 12) * 0.4;
    }
    if (plasmaExhaustRef.current) {
      const flicker = 0.92 + Math.sin(time * 18) * 0.1;
      plasmaExhaustRef.current.scale.set(flicker, flicker, flicker);
    }

    // 4. Hovering holographic menu subtle float
    if (holoMenuRef.current) {
      holoMenuRef.current.position.y = 1.9 + Math.sin(time * 1.4) * 0.04;
      holoMenuRef.current.rotation.y = Math.sin(time * 0.7) * 0.06;
    }

    // 5. Tail warning beacon flash
    if (beaconRef.current) {
      const flash = Math.sin(time * 4) > 0.4 ? 1 : 0.15;
      const mat = beaconRef.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = flash;
    }
  });

  return (
    <group position={[LANDMARKS.CAFE.x, 0, LANDMARKS.CAFE.z]}>
      {/* 1. Cafe Main Two-Story Building Structure */}
      <mesh position={[0, 3.2, 0]} receiveShadow>
        <boxGeometry args={[5.2, 6.4, 13.5]} />
        <meshStandardMaterial color="#141720" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* Roofline Glowing Amber Neon Ribbon */}
      <mesh position={[-2.62, 6.42, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[13.5, 0.08]} />
        <meshBasicMaterial color="#FFAA00" />
      </mesh>

      {/* Recessed Ground Floor Cafe Bistro Interior */}
      <mesh position={[-0.4, 1.8, 0]}>
        <boxGeometry args={[4.2, 3.4, 12.2]} />
        <meshStandardMaterial color="#0e1017" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Ground Floor Panoramic Anti-Reflective Storefront Glass */}
      <mesh position={[-2.42, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12.2, 3.4]} />
        <meshStandardMaterial
          color="#FFAA00"
          roughness={0.05}
          metalness={0.9}
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* Storefront Structural Mullions & Bevelled Metal Frames */}
      {[-5.4, -2.7, 0, 2.7, 5.4].map((zPos, idx) => (
        <mesh key={idx} position={[-2.44, 1.8, zPos]}>
          <boxGeometry args={[0.08, 3.5, 0.08]} />
          <meshStandardMaterial color="#1e2230" metalness={0.95} roughness={0.2} />
        </mesh>
      ))}

      {/* Interior Bar Counter with Warm Golden Under-glow */}
      <group position={[-1.2, 0.9, 0]}>
        {/* Main Bar Top */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 0.1, 7.5]} />
          <meshStandardMaterial color="#090b10" roughness={0.15} metalness={0.9} />
        </mesh>
        {/* Glowing Under-Counter Accent Slat */}
        <mesh position={[-0.41, -0.06, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[7.5, 0.05]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>

        {/* Detailed Chrome Espresso Machine with Dual Steam Wands & Gauges */}
        <group position={[0, 0.28, -2.2]}>
          <mesh>
            <boxGeometry args={[0.45, 0.42, 0.65]} />
            <meshStandardMaterial color="#8899aa" metalness={0.95} roughness={0.1} />
          </mesh>
          {/* Pressure Gauge */}
          <mesh position={[-0.23, 0.1, 0.1]} rotation={[0, -Math.PI / 2, 0]}>
            <circleGeometry args={[0.045, 12]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          {/* Chrome Portafilter Handles */}
          <mesh position={[-0.26, -0.05, -0.12]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[-0.26, -0.05, 0.12]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>

        {/* Back-bar Shelving with Glowing Liquor / Synth-Drink Bottles */}
        {[-1.8, -0.9, 0, 0.9, 1.8].map((zVal, bIdx) => (
          <group key={`bottle-${bIdx}`} position={[0.8, 0.6, zVal]}>
            <mesh>
              <cylinderGeometry args={[0.045, 0.045, 0.26, 8]} />
              <meshBasicMaterial color={bIdx % 3 === 0 ? '#00F3FF' : bIdx % 2 === 0 ? '#FFAA00' : '#FF0055'} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 2. Docked Retro-Futuristic Spaceship Fuselage on Upper Deck (Z = -32m) */}
      <group position={[-0.6, 6.5, 0]}>
        {/* Main Aerodynamic Titanium Hull Plating */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, -0.04]}>
          <cylinderGeometry args={[1.5, 1.7, 9.8, 20]} />
          <meshStandardMaterial color="#282e3f" roughness={0.28} metalness={0.88} />
        </mesh>

        {/* Hull Seam Division Ring Strips (Contrasting dark graphite) */}
        {[-3.0, -1.0, 1.0, 3.0].map((zRing, rIdx) => (
          <mesh key={`seam-${rIdx}`} position={[0, 0, zRing]}>
            <torusGeometry args={[1.62, 0.02, 8, 24]} />
            <meshStandardMaterial color="#0f1118" metalness={0.9} />
          </mesh>
        ))}

        {/* Cantilever Landing Gear Hydraulic Struts Supporting Hull */}
        <mesh position={[-1.2, -1.1, -2.5]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.06, 0.08, 1.5, 8]} />
          <meshStandardMaterial color="#556" metalness={0.95} />
        </mesh>
        <mesh position={[-1.2, -1.1, 2.5]} rotation={[0, 0, 0.3]}>
          <cylinderGeometry args={[0.06, 0.08, 1.5, 8]} />
          <meshStandardMaterial color="#556" metalness={0.95} />
        </mesh>

        {/* Maintenance Fuel Intake Port with Hazard Ring */}
        <group position={[-1.6, 0.2, 1.5]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 0.04, 16]} />
            <meshStandardMaterial color="#111" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.025, 0]}>
            <ringGeometry args={[0.12, 0.18, 16]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>

        {/* Cockpit Tapered Nose Cone */}
        <mesh position={[0, 0, 5.4]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[1.5, 2.0, 20]} />
          <meshStandardMaterial color="#1e2230" roughness={0.3} metalness={0.85} />
        </mesh>

        {/* Tinted Cockpit Observation Dome */}
        <mesh position={[0, 0.75, 4.2]} rotation={[0.4, 0, 0]}>
          <sphereGeometry args={[1.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#00F3FF"
            roughness={0.05}
            metalness={0.95}
            transparent
            opacity={0.38}
          />
        </mesh>

        {/* Interior Cockpit Flight Instrument Dial Display */}
        <mesh position={[0, 0.65, 4.1]}>
          <boxGeometry args={[0.55, 0.06, 0.28]} />
          <meshBasicMaterial color="#00F3FF" />
        </mesh>

        {/* Aerodynamic Delta Winglets with Nav Lights & Rivets */}
        <mesh position={[-2.2, -0.3, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[2.0, 0.08, 3.5]} />
          <meshStandardMaterial color="#1c202c" metalness={0.8} />
        </mesh>
        <mesh position={[-3.2, -0.15, -1.2]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#FF0055" />
        </mesh>

        <mesh position={[2.2, -0.3, 0]} rotation={[0, 0, -0.15]}>
          <boxGeometry args={[2.0, 0.08, 3.5]} />
          <meshStandardMaterial color="#1c202c" metalness={0.8} />
        </mesh>
        <mesh position={[3.2, -0.15, -1.2]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshBasicMaterial color="#05FFA1" />
        </mesh>

        {/* Tail Fin with Beacon */}
        <mesh position={[0, 2.0, -4.0]} rotation={[-0.2, 0, 0]}>
          <boxGeometry args={[0.08, 1.4, 1.2]} />
          <meshStandardMaterial color="#282e3f" metalness={0.85} />
        </mesh>
        <mesh ref={beaconRef} position={[0, 2.7, -4.2]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#FFAA00" transparent opacity={1} />
        </mesh>

        {/* Dual High-Bypass Ion Thruster Nacelles with Intake Blades */}
        <group position={[1.4, -0.85, -2.2]} rotation={[0, 0, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.44, 0.54, 1.6, 18]} />
            <meshStandardMaterial color="#161822" metalness={0.95} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.78, 0]}>
            <cylinderGeometry args={[0.36, 0.36, 0.12, 18]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>

        <group position={[1.4, -0.85, 2.2]} rotation={[0, 0, 0.2]}>
          <mesh>
            <cylinderGeometry args={[0.44, 0.54, 1.6, 18]} />
            <meshStandardMaterial color="#161822" metalness={0.95} roughness={0.2} />
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

      {/* 4. Prominent Bilingual Neon Brand Marquee: English First + Asian Subtext */}
      <group position={[-2.65, 4.8, 0]}>
        {/* Metal Backplate Frame with Standoff Bolts */}
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[7.2, 1.3]} />
          <meshStandardMaterial color="#090c12" metalness={0.9} roughness={0.3} />
        </mesh>
        {/* Mounting Standoff Brackets */}
        {[-3.4, -1.7, 1.7, 3.4].map((zB, idx) => (
          <mesh key={`bolt-${idx}`} position={[0.02, 0.55, zB]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 0.06, 8]} />
            <meshStandardMaterial color="#666" metalness={0.9} />
          </mesh>
        ))}
        {/* Outer Neon Wireframe Border */}
        <mesh position={[-0.02, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[7.35, 1.45]} />
          <meshBasicMaterial color="#FFAA00" wireframe />
        </mesh>
        {/* Main Neon Faceplate with English-First Bilingual Canvas Texture */}
        <mesh position={[-0.04, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[7.0, 1.15]} />
          <meshStandardMaterial
            map={marqueeTex || undefined}
            emissive="#FFAA00"
            emissiveMap={marqueeTex || undefined}
            emissiveIntensity={0.95}
            roughness={0.2}
          />
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

      {/* 6. Street-level Dining Patio: Tables, Stools & Espresso Cups */}
      {[-3.5, 0, 3.5].map((zPos, sIdx) => (
        <group key={`patio-${sIdx}`} position={[-2.9, 0.14, zPos]}>
          {/* Chrome Bistro Table */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.04, 16]} />
            <meshStandardMaterial color="#202534" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.44, 8]} />
            <meshStandardMaterial color="#444" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.04, 16]} />
            <meshStandardMaterial color="#222" metalness={0.8} />
          </mesh>
          {/* Miniature Espresso Cup & Saucer on Table */}
          <group position={[0.08, 0.49, 0.05]}>
            <mesh position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.08, 0.06, 0.02, 12]} />
              <meshStandardMaterial color="#e0e8f0" />
            </mesh>
            <mesh position={[0, 0.045, 0]}>
              <cylinderGeometry args={[0.05, 0.04, 0.06, 12]} />
              <meshStandardMaterial color="#00F3FF" metalness={0.8} />
            </mesh>
          </group>
        </group>
      ))}

      {/* 7. Dedicated Architectural Facade Floodlights (Decay = 2) */}
      {/* Front Entrance / Marquee Wash Floodlight */}
      <pointLight position={[-3.6, 4.6, 0]} color="#FFAA00" intensity={3.5} distance={16} decay={2} />
      {/* Fuselage & Rooftop Wash Light */}
      <pointLight position={[-1.5, 7.8, 0]} color="#FFE082" intensity={2.8} distance={14} decay={2} />
      {/* Street Bistro Patio Warm Glow */}
      <pointLight position={[-3.2, 1.8, 0]} color="#FFAA00" intensity={2.2} distance={10} decay={2} />
      {/* Ion Thrusters Glow */}
      <pointLight ref={thrustersLightRef} position={[0.8, 5.0, 0]} color="#FFAA00" intensity={2.4} distance={12} decay={2} />
    </group>
  );
}
