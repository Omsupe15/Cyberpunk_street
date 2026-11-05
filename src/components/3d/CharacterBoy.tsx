'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';
import { STREET_LENGTH } from '@/lib/constants';
import { clamp } from '@/lib/mathUtils';

export function CharacterBoy() {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const chestRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const visorMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const backpackVentsRef = useRef<THREE.Group>(null);

  const scrollProgress = useCyberpunkStore((s) => s.scrollProgress);
  const scrollVelocity = useCyberpunkStore((s) => s.scrollVelocity);
  const activeLandmark = useCyberpunkStore((s) => s.activeLandmark);

  // Stride phase tracker and smoothing refs
  const stridePhase = useRef(0);
  const currentHeadYaw = useRef(0);
  const currentHeadPitch = useRef(0);
  const walkBlend = useRef(0); // 0 = Idle, 1 = Full Walk

  useFrame((state, delta) => {
    const t = clamp(scrollProgress, 0, 1);
    const boyZ = -t * STREET_LENGTH;
    const absVelocity = Math.abs(scrollVelocity);
    const time = state.clock.getElapsedTime();

    // 1. Root Position along the street
    if (rootRef.current) {
      rootRef.current.position.z = boyZ;
    }

    // 2. Blend between Idle and Walk
    const targetWalkBlend = absVelocity > 0.04 ? 1 : 0;
    walkBlend.current = THREE.MathUtils.lerp(walkBlend.current, targetWalkBlend, 1 - Math.exp(-8 * delta));

    // Stride phase advances with velocity
    if (absVelocity > 0.02) {
      stridePhase.current += Math.sign(scrollVelocity) * absVelocity * delta * 8;
    }

    const phase = stridePhase.current;
    const walkWeight = walkBlend.current;

    // 3. Leg Swings with Knee Flexion
    if (leftLegRef.current && rightLegRef.current) {
      const leftAngle = Math.sin(phase) * 0.65 * walkWeight;
      const rightAngle = -Math.sin(phase) * 0.65 * walkWeight;

      leftLegRef.current.rotation.x = leftAngle;
      rightLegRef.current.rotation.x = rightAngle;

      leftLegRef.current.rotation.z = 0.04;
      rightLegRef.current.rotation.z = -0.04;
    }

    // 4. Opposing Arm Swings
    if (leftArmRef.current && rightArmRef.current) {
      const leftArmAngle = -Math.sin(phase) * 0.55 * walkWeight;
      const rightArmAngle = Math.sin(phase) * 0.55 * walkWeight;

      leftArmRef.current.rotation.x = leftArmAngle + 0.1;
      rightArmRef.current.rotation.x = rightArmAngle + 0.1;

      leftArmRef.current.rotation.z = 0.12;
      rightArmRef.current.rotation.z = -0.12;
    }

    // 5. Vertical Pelvis Bob & Body Sway
    if (chestRef.current) {
      const walkBob = Math.abs(Math.sin(phase)) * 0.06 * walkWeight;
      const idleBreathe = Math.sin(time * 2.2) * 0.015 * (1 - walkWeight);
      chestRef.current.position.y = walkBob + idleBreathe;

      const bodyRoll = Math.sin(phase) * 0.04 * walkWeight;
      chestRef.current.rotation.z = bodyRoll;
      chestRef.current.rotation.y = -Math.sin(phase) * 0.06 * walkWeight;
    }

    // 6. Contextual Landmark Head Tracking
    let targetYaw = 0;
    let targetPitch = 0;

    if (activeLandmark === 'CAFE') {
      targetYaw = -0.42; // Turn right towards Spaceship Cafe
      targetPitch = 0.12;
    } else if (activeLandmark === 'STAR') {
      targetYaw = 0.42; // Turn left towards Star Clothing
      targetPitch = 0.15;
    } else if (activeLandmark === 'PAWN') {
      targetYaw = 0.48; // Turn left towards Debris Pawn
      targetPitch = -0.1;
    } else if (activeLandmark === 'MOTEL') {
      targetYaw = -0.45; // Turn right towards Nova Motel
      targetPitch = 0.35; // Look up at 12m sign
    } else {
      targetYaw = Math.sin(time * 0.8) * 0.08 * (1 - walkWeight);
      targetPitch = Math.cos(time * 1.2) * 0.04 * (1 - walkWeight);
    }

    currentHeadYaw.current = THREE.MathUtils.lerp(currentHeadYaw.current, targetYaw, 1 - Math.exp(-6 * delta));
    currentHeadPitch.current = THREE.MathUtils.lerp(currentHeadPitch.current, targetPitch, 1 - Math.exp(-6 * delta));

    if (headRef.current) {
      headRef.current.rotation.y = currentHeadYaw.current;
      headRef.current.rotation.x = currentHeadPitch.current;
    }

    // 7. Visor Subtle Pulse
    if (visorMatRef.current) {
      const pulse = 0.85 + Math.sin(time * 3.5) * 0.15;
      visorMatRef.current.opacity = pulse;
    }

    // 8. Tech backpack subtle vent glow
    if (backpackVentsRef.current) {
      const ventPulse = 0.75 + Math.sin(time * 4) * 0.25;
      backpackVentsRef.current.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = ventPulse;
      });
    }
  });

  return (
    <group ref={rootRef} position={[0, 0.92, 0]}>
      {/* Subtle, non-intrusive Character Rim Lighting */}
      <pointLight position={[0, 1.2, 0.8]} color="#00F3FF" intensity={0.55} distance={4} decay={2} />
      <pointLight position={[0, 0.8, -0.6]} color="#FF0055" intensity={0.4} distance={3.5} decay={2} />

      {/* Upper Body Hierarchy */}
      <group ref={chestRef}>
        {/* Sculpted Cyber Techwear Storm Jacket */}
        <mesh position={[0, 0.15, 0]} receiveShadow>
          <boxGeometry args={[0.54, 0.65, 0.36]} />
          <meshStandardMaterial color="#181b24" roughness={0.65} metalness={0.2} />
        </mesh>

        {/* High Stand-up Wind Collar */}
        <mesh position={[0, 0.5, 0.02]}>
          <cylinderGeometry args={[0.18, 0.22, 0.14, 16]} />
          <meshStandardMaterial color="#12141c" roughness={0.7} metalness={0.3} />
        </mesh>

        {/* Tactical Cross-Straps & Chest Rig */}
        <mesh position={[0, 0.2, 0.184]}>
          <boxGeometry args={[0.42, 0.08, 0.02]} />
          <meshStandardMaterial color="#0b0d12" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.12, 0.184]}>
          <boxGeometry args={[0.44, 0.04, 0.02]} />
          <meshStandardMaterial color="#0b0d12" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Compact Glowing Cyan Arc Reactor Badge */}
        <mesh position={[0.12, 0.26, 0.188]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color="#00F3FF" />
        </mesh>

        {/* Thin Magenta Reflective 3M Piping along Asymmetrical Jacket Zip */}
        <mesh position={[-0.04, 0.15, 0.185]}>
          <planeGeometry args={[0.025, 0.62]} />
          <meshBasicMaterial color="#FF0055" />
        </mesh>

        {/* Tactical Shoulder Epaulet Guards */}
        <mesh position={[-0.25, 0.44, 0]}>
          <boxGeometry args={[0.11, 0.035, 0.26]} />
          <meshStandardMaterial color="#11131a" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0.25, 0.44, 0]}>
          <boxGeometry args={[0.11, 0.035, 0.26]} />
          <meshStandardMaterial color="#11131a" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Ergonomic Molded Tech Backpack */}
        <group position={[0, 0.18, -0.24]}>
          {/* Main Chassis */}
          <mesh>
            <boxGeometry args={[0.36, 0.46, 0.13]} />
            <meshStandardMaterial color="#0e1017" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Top Grab Handle */}
          <mesh position={[0, 0.25, 0]}>
            <torusGeometry args={[0.08, 0.015, 6, 12]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* Subtle Amber Heat Exhaust Vents */}
          <group ref={backpackVentsRef} position={[0, -0.04, -0.07]} rotation={[0, Math.PI, 0]}>
            {[-0.08, 0, 0.08].map((yOff, i) => (
              <mesh key={i} position={[0, yOff, 0]}>
                <planeGeometry args={[0.22, 0.035]} />
                <meshBasicMaterial color="#FFAA00" transparent opacity={0.8} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Head & Neck Hierarchy */}
        <group ref={headRef} position={[0, 0.62, 0]}>
          {/* Realistic Stylized Face/Head Base */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial color="#bda897" roughness={0.75} />
          </mesh>

          {/* Cyberpunk Undercut & Spiky Hair Strands */}
          <mesh position={[0, 0.12, -0.04]} rotation={[-0.2, 0, 0]}>
            <coneGeometry args={[0.21, 0.26, 8]} />
            <meshStandardMaterial color="#141622" roughness={0.9} />
          </mesh>
          {/* Front Fringe Bangs */}
          <mesh position={[-0.05, 0.14, 0.11]} rotation={[0.4, 0, -0.2]}>
            <coneGeometry args={[0.09, 0.15, 6]} />
            <meshStandardMaterial color="#141622" roughness={0.9} />
          </mesh>
          <mesh position={[0.06, 0.13, 0.11]} rotation={[0.35, 0, 0.15]}>
            <coneGeometry args={[0.08, 0.14, 6]} />
            <meshStandardMaterial color="#141622" roughness={0.9} />
          </mesh>

          {/* Temple Neural Interface Port */}
          <mesh position={[0.165, 0.02, 0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.02, 8]} />
            <meshStandardMaterial color="#00F3FF" metalness={0.9} />
          </mesh>

          {/* AR Visor Glasses Frame */}
          <mesh position={[0, 0.02, 0.13]}>
            <boxGeometry args={[0.32, 0.09, 0.12]} />
            <meshStandardMaterial color="#141722" metalness={0.95} roughness={0.15} />
          </mesh>

          {/* Glowing Translucent HUD Visor Lens */}
          <mesh position={[0, 0.02, 0.192]}>
            <planeGeometry args={[0.29, 0.07]} />
            <meshBasicMaterial
              ref={visorMatRef}
              color="#00F3FF"
              transparent
              opacity={0.88}
            />
          </mesh>

          {/* Optical Targeting Reticle Stripe */}
          <mesh position={[0.04, 0.02, 0.194]}>
            <planeGeometry args={[0.18, 0.012]} />
            <meshBasicMaterial color="#FFFFFF" />
          </mesh>
        </group>

        {/* Left Arm Assembly (Fabric Storm Sleeve with Magenta Piping) */}
        <group ref={leftArmRef} position={[-0.32, 0.42, 0]}>
          <mesh position={[0, -0.05, 0]}>
            <sphereGeometry args={[0.1, 12, 12]} />
            <meshStandardMaterial color="#1c202c" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.26, 0]}>
            <cylinderGeometry args={[0.085, 0.075, 0.36, 12]} />
            <meshStandardMaterial color="#181b24" roughness={0.7} />
          </mesh>
          {/* Magenta Sleeve Piping */}
          <mesh position={[-0.078, -0.26, 0]}>
            <boxGeometry args={[0.015, 0.34, 0.025]} />
            <meshBasicMaterial color="#FF0055" />
          </mesh>
          {/* Tactical Fingerless Glove */}
          <mesh position={[0, -0.48, 0]}>
            <boxGeometry args={[0.09, 0.11, 0.09]} />
            <meshStandardMaterial color="#0e1017" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>

        {/* Right Arm Assembly (Segmented Chrome Cybernetic Prosthetic) */}
        <group ref={rightArmRef} position={[0.32, 0.42, 0]}>
          {/* Titanium Ball-and-Socket Shoulder Joint */}
          <mesh position={[0, -0.05, 0]}>
            <sphereGeometry args={[0.1, 14, 14]} />
            <meshStandardMaterial color="#353c4d" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Upper Arm Carbon Chassis */}
          <mesh position={[0, -0.26, 0]}>
            <cylinderGeometry args={[0.08, 0.07, 0.36, 12]} />
            <meshStandardMaterial color="#222735" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Exposed Hydraulic Piston Cylinder */}
          <mesh position={[0.03, -0.26, 0.05]}>
            <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
            <meshStandardMaterial color="#8899aa" metalness={0.98} roughness={0.1} />
          </mesh>
          {/* Cyan Circuit Trace along Cyber-Arm */}
          <mesh position={[0.075, -0.26, 0]}>
            <boxGeometry args={[0.012, 0.32, 0.02]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          {/* Articulated Chrome Hand & Knuckles */}
          <mesh position={[0, -0.48, 0]}>
            <boxGeometry args={[0.088, 0.11, 0.088]} />
            <meshStandardMaterial color="#424b5e" metalness={0.96} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* Lower Body Hierarchy */}
      {/* Left Leg Assembly */}
      <group ref={leftLegRef} position={[-0.15, -0.15, 0]}>
        {/* Cargo Utility Pants Thigh with Pocket */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.105, 0.09, 0.4, 12]} />
          <meshStandardMaterial color="#202533" roughness={0.75} />
        </mesh>
        <mesh position={[-0.1, -0.2, 0]}>
          <boxGeometry args={[0.045, 0.15, 0.13]} />
          <meshStandardMaterial color="#181c26" roughness={0.8} />
        </mesh>
        {/* Amber Flap Pull Tab */}
        <mesh position={[-0.125, -0.2, 0]}>
          <planeGeometry args={[0.018, 0.1]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>

        {/* Knee Armor Guard */}
        <mesh position={[0, -0.4, 0.075]}>
          <boxGeometry args={[0.11, 0.09, 0.045]} />
          <meshStandardMaterial color="#0e1017" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Shin & Ankle Cuff */}
        <mesh position={[0, -0.54, 0]}>
          <cylinderGeometry args={[0.08, 0.075, 0.34, 12]} />
          <meshStandardMaterial color="#202533" roughness={0.75} />
        </mesh>

        {/* High-Top Futuristic Cyber Sneaker */}
        <group position={[0, -0.76, 0.05]}>
          {/* Sculpted Midsole & Upper */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.15, 0.12, 0.32]} />
            <meshStandardMaterial color="#141722" roughness={0.4} />
          </mesh>
          {/* Glowing Cyan Quick-Tie Laces */}
          <mesh position={[0, 0.09, 0.04]}>
            <boxGeometry args={[0.08, 0.02, 0.12]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          {/* Air-Cushioned Glowing Cyan Outsole */}
          <mesh position={[0, -0.028, 0]}>
            <boxGeometry args={[0.16, 0.035, 0.34]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          {/* Amber Heel Counter */}
          <mesh position={[0, 0.045, -0.14]}>
            <boxGeometry args={[0.13, 0.05, 0.045]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>
      </group>

      {/* Right Leg Assembly */}
      <group ref={rightLegRef} position={[0.15, -0.15, 0]}>
        {/* Cargo Utility Pants Thigh with Pocket */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.105, 0.09, 0.4, 12]} />
          <meshStandardMaterial color="#202533" roughness={0.75} />
        </mesh>
        <mesh position={[0.1, -0.2, 0]}>
          <boxGeometry args={[0.045, 0.15, 0.13]} />
          <meshStandardMaterial color="#181c26" roughness={0.8} />
        </mesh>
        {/* Amber Flap Pull Tab */}
        <mesh position={[0.125, -0.2, 0]}>
          <planeGeometry args={[0.018, 0.1]} />
          <meshBasicMaterial color="#FFAA00" />
        </mesh>

        {/* Knee Armor Guard */}
        <mesh position={[0, -0.4, 0.075]}>
          <boxGeometry args={[0.11, 0.09, 0.045]} />
          <meshStandardMaterial color="#0e1017" metalness={0.8} roughness={0.25} />
        </mesh>

        {/* Shin & Ankle Cuff */}
        <mesh position={[0, -0.54, 0]}>
          <cylinderGeometry args={[0.08, 0.075, 0.34, 12]} />
          <meshStandardMaterial color="#202533" roughness={0.75} />
        </mesh>

        {/* High-Top Futuristic Cyber Sneaker */}
        <group position={[0, -0.76, 0.05]}>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.15, 0.12, 0.32]} />
            <meshStandardMaterial color="#141722" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.09, 0.04]}>
            <boxGeometry args={[0.08, 0.02, 0.12]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          <mesh position={[0, -0.028, 0]}>
            <boxGeometry args={[0.16, 0.035, 0.34]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          <mesh position={[0, 0.045, -0.14]}>
            <boxGeometry args={[0.13, 0.05, 0.045]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
