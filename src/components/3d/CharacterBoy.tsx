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

      // Slight natural stance width
      leftLegRef.current.rotation.z = 0.04;
      rightLegRef.current.rotation.z = -0.04;
    }

    // 4. Opposing Arm Swings
    if (leftArmRef.current && rightArmRef.current) {
      const leftArmAngle = -Math.sin(phase) * 0.55 * walkWeight;
      const rightArmAngle = Math.sin(phase) * 0.55 * walkWeight;

      leftArmRef.current.rotation.x = leftArmAngle + 0.1;
      rightArmRef.current.rotation.x = rightArmAngle + 0.1;

      // Natural arm outward rest angle
      leftArmRef.current.rotation.z = 0.12 + Math.sin(time * 1.5) * 0.02 * (1 - walkWeight);
      rightArmRef.current.rotation.z = -0.12 - Math.sin(time * 1.5) * 0.02 * (1 - walkWeight);
    }

    // 5. Vertical Pelvis Bob & Idle Chest Breathing
    if (rootRef.current && chestRef.current) {
      const walkBob = Math.abs(Math.sin(phase)) * 0.06 * walkWeight;
      const idleBreathing = Math.sin(time * 2.2) * 0.02 * (1 - walkWeight);
      rootRef.current.position.y = 0.92 + walkBob + idleBreathing;

      // Subtle torso forward lean during walking
      chestRef.current.rotation.x = THREE.MathUtils.lerp(0.02, 0.12, walkWeight);
    }

    // 6. Contextual Head Tracking Toward Landmarks
    let targetYaw = 0;
    let targetPitch = 0;

    if (activeLandmark === 'CAFE') {
      targetYaw = 0.45; // Turn head right toward cafe
    } else if (activeLandmark === 'STAR') {
      targetYaw = -0.45; // Turn head left toward boutique
    } else if (activeLandmark === 'PAWN') {
      targetYaw = -0.50; // Turn head left toward pawn shop
      targetPitch = -0.10; // Glance down toward curb salvage
    } else if (activeLandmark === 'MOTEL') {
      targetYaw = 0.45; // Turn head right toward motel
      targetPitch = 0.25; // Look up at towering neon sign
    }

    currentHeadYaw.current = THREE.MathUtils.lerp(currentHeadYaw.current, targetYaw, 1 - Math.exp(-5 * delta));
    currentHeadPitch.current = THREE.MathUtils.lerp(currentHeadPitch.current, targetPitch, 1 - Math.exp(-5 * delta));

    if (headRef.current) {
      headRef.current.rotation.y = currentHeadYaw.current;
      headRef.current.rotation.x = currentHeadPitch.current;
    }

    // 7. Visor Scanline Glow Modulation
    if (visorMatRef.current) {
      visorMatRef.current.opacity = 0.85 + Math.sin(time * 4) * 0.15;
    }
  });

  return (
    <group ref={rootRef} position={[0, 0.92, 0]}>
      {/* Upper Body Hierarchy */}
      <group ref={chestRef}>
        {/* Cyber Hoodie Main Torso */}
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.55, 0.65, 0.36]} />
          <meshStandardMaterial color="#14161f" roughness={0.65} metalness={0.2} />
        </mesh>

        {/* Glowing Magenta Piping Along Hoodie Center Zip */}
        <mesh position={[0, 0.15, 0.185]}>
          <planeGeometry args={[0.03, 0.62]} />
          <meshBasicMaterial color="#FF0055" />
        </mesh>

        {/* Hoodie Back Cowl / Drape */}
        <mesh position={[0, 0.42, -0.16]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.42, 0.22, 0.22]} />
          <meshStandardMaterial color="#10121a" roughness={0.7} />
        </mesh>

        {/* Head & Neck Hierarchy */}
        <group ref={headRef} position={[0, 0.62, 0]}>
          {/* Face Base */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial color="#c5b09f" roughness={0.8} />
          </mesh>

          {/* Spiky Cyberpunk Hair */}
          <mesh position={[0, 0.12, -0.04]} rotation={[-0.2, 0, 0]}>
            <coneGeometry args={[0.22, 0.26, 7]} />
            <meshStandardMaterial color="#111318" roughness={0.9} />
          </mesh>

          {/* Cyber Visor Base Frame */}
          <mesh position={[0, 0.02, 0.14]}>
            <boxGeometry args={[0.32, 0.09, 0.12]} />
            <meshStandardMaterial color="#1c202a" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Glowing Cyber Cyan Visor Lens */}
          <mesh position={[0, 0.02, 0.205]}>
            <planeGeometry args={[0.29, 0.065]} />
            <meshBasicMaterial
              ref={visorMatRef}
              color="#00F3FF"
              transparent
              opacity={0.95}
            />
          </mesh>

          {/* Ear Communication Nodes */}
          <mesh position={[0.19, 0.02, 0.02]}>
            <cylinderGeometry args={[0.04, 0.04, 0.04, 8]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          <mesh position={[-0.19, 0.02, 0.02]}>
            <cylinderGeometry args={[0.04, 0.04, 0.04, 8]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
        </group>

        {/* Left Arm Assembly */}
        <group ref={leftArmRef} position={[-0.34, 0.42, 0]}>
          {/* Shoulder Cap */}
          <mesh position={[0, -0.06, 0]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color="#1a1c26" roughness={0.5} />
          </mesh>
          {/* Arm Sleeve */}
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.09, 0.08, 0.38, 12]} />
            <meshStandardMaterial color="#14161f" roughness={0.65} />
          </mesh>
          {/* Sleeve Neon Stripe */}
          <mesh position={[-0.085, -0.28, 0]}>
            <boxGeometry args={[0.015, 0.36, 0.03]} />
            <meshBasicMaterial color="#FF0055" />
          </mesh>
          {/* Cyber Glove */}
          <mesh position={[0, -0.52, 0]}>
            <boxGeometry args={[0.1, 0.12, 0.1]} />
            <meshStandardMaterial color="#0c0e14" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* Right Arm Assembly */}
        <group ref={rightArmRef} position={[0.34, 0.42, 0]}>
          {/* Shoulder Cap */}
          <mesh position={[0, -0.06, 0]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color="#1a1c26" roughness={0.5} />
          </mesh>
          {/* Arm Sleeve */}
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.09, 0.08, 0.38, 12]} />
            <meshStandardMaterial color="#14161f" roughness={0.65} />
          </mesh>
          {/* Sleeve Neon Stripe */}
          <mesh position={[0.085, -0.28, 0]}>
            <boxGeometry args={[0.015, 0.36, 0.03]} />
            <meshBasicMaterial color="#FF0055" />
          </mesh>
          {/* Cyber Glove */}
          <mesh position={[0, -0.52, 0]}>
            <boxGeometry args={[0.1, 0.12, 0.1]} />
            <meshStandardMaterial color="#0c0e14" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* Lower Body Hierarchy */}
      {/* Left Leg Assembly */}
      <group ref={leftLegRef} position={[-0.16, -0.15, 0]}>
        {/* Cargo Pants Thigh with Pocket */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.11, 0.095, 0.42, 12]} />
          <meshStandardMaterial color="#1e212b" roughness={0.8} />
        </mesh>
        <mesh position={[-0.11, -0.22, 0]}>
          <boxGeometry args={[0.05, 0.16, 0.14]} />
          <meshStandardMaterial color="#171922" roughness={0.85} />
        </mesh>

        {/* Knee Guard */}
        <mesh position={[0, -0.42, 0.08]}>
          <boxGeometry args={[0.12, 0.1, 0.05]} />
          <meshStandardMaterial color="#0d0e14" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Shin */}
        <mesh position={[0, -0.56, 0]}>
          <cylinderGeometry args={[0.085, 0.08, 0.36, 12]} />
          <meshStandardMaterial color="#1e212b" roughness={0.8} />
        </mesh>

        {/* Cyber Sneaker Foot */}
        <group position={[0, -0.78, 0.06]}>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.15, 0.12, 0.32]} />
            <meshStandardMaterial color="#12141a" roughness={0.5} />
          </mesh>
          {/* Glowing Cyan Sole Tread */}
          <mesh position={[0, -0.03, 0]}>
            <boxGeometry args={[0.16, 0.03, 0.34]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          {/* Glowing Amber Heel Damper */}
          <mesh position={[0, 0.04, -0.14]}>
            <boxGeometry args={[0.13, 0.06, 0.05]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>
      </group>

      {/* Right Leg Assembly */}
      <group ref={rightLegRef} position={[0.16, -0.15, 0]}>
        {/* Cargo Pants Thigh with Pocket */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.11, 0.095, 0.42, 12]} />
          <meshStandardMaterial color="#1e212b" roughness={0.8} />
        </mesh>
        <mesh position={[0.11, -0.22, 0]}>
          <boxGeometry args={[0.05, 0.16, 0.14]} />
          <meshStandardMaterial color="#171922" roughness={0.85} />
        </mesh>

        {/* Knee Guard */}
        <mesh position={[0, -0.42, 0.08]}>
          <boxGeometry args={[0.12, 0.1, 0.05]} />
          <meshStandardMaterial color="#0d0e14" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Shin */}
        <mesh position={[0, -0.56, 0]}>
          <cylinderGeometry args={[0.085, 0.08, 0.36, 12]} />
          <meshStandardMaterial color="#1e212b" roughness={0.8} />
        </mesh>

        {/* Cyber Sneaker Foot */}
        <group position={[0, -0.78, 0.06]}>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.15, 0.12, 0.32]} />
            <meshStandardMaterial color="#12141a" roughness={0.5} />
          </mesh>
          {/* Glowing Cyan Sole Tread */}
          <mesh position={[0, -0.03, 0]}>
            <boxGeometry args={[0.16, 0.03, 0.34]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          {/* Glowing Amber Heel Damper */}
          <mesh position={[0, 0.04, -0.14]}>
            <boxGeometry args={[0.13, 0.06, 0.05]} />
            <meshBasicMaterial color="#FFAA00" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

