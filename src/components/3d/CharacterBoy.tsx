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
  const leftKneeRef = useRef<THREE.Group>(null);
  const rightKneeRef = useRef<THREE.Group>(null);
  const visorMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const backpackVentsRef = useRef<THREE.Group>(null);

  const scrollProgress = useCyberpunkStore((s) => s.scrollProgress);
  const scrollVelocity = useCyberpunkStore((s) => s.scrollVelocity);
  const activeLandmark = useCyberpunkStore((s) => s.activeLandmark);

  // Stride phase tracker and critically damped velocity smoothing
  const stridePhase = useRef(0);
  const smoothedVelocity = useRef(0);
  const currentHeadYaw = useRef(0);
  const currentHeadPitch = useRef(0);

  useFrame((state, delta) => {
    const t = clamp(scrollProgress, 0, 1);
    const boyZ = -t * STREET_LENGTH;
    const absVelocity = Math.abs(scrollVelocity);
    const time = state.clock.getElapsedTime();

    // 1. Root Position along the street
    if (rootRef.current) {
      rootRef.current.position.z = boyZ;
    }

    // 2. Critically Damped Velocity Smoothing (Eliminates mouse-wheel stutter)
    smoothedVelocity.current = THREE.MathUtils.damp(
      smoothedVelocity.current,
      absVelocity,
      5.5,
      delta
    );

    // Continuous smooth stride phase accumulation
    const walkDirection = Math.sign(scrollVelocity) || 1;
    stridePhase.current += walkDirection * smoothedVelocity.current * delta * 7.0;

    const phase = stridePhase.current;
    // Smoothstep walk blend: 0 = Idle, 1 = Full stride
    const walkWeight = THREE.MathUtils.smoothstep(smoothedVelocity.current, 0.005, 0.12);

    // 3. Natural Human Biomechanical Leg Swings with Knee Flexion
    if (leftLegRef.current && rightLegRef.current) {
      // Hip upper-leg swing
      const leftHipAngle = Math.sin(phase) * 0.52 * walkWeight;
      const rightHipAngle = -Math.sin(phase) * 0.52 * walkWeight;

      leftLegRef.current.rotation.x = leftHipAngle;
      rightLegRef.current.rotation.x = rightHipAngle;

      leftLegRef.current.rotation.z = 0.03;
      rightLegRef.current.rotation.z = -0.03;

      // Knee flexion: natural bending during backswing
      if (leftKneeRef.current) {
        const leftKneeBend = Math.max(0, -Math.sin(phase)) * 0.6 * walkWeight;
        leftKneeRef.current.rotation.x = leftKneeBend;
      }
      if (rightKneeRef.current) {
        const rightKneeBend = Math.max(0, Math.sin(phase)) * 0.6 * walkWeight;
        rightKneeRef.current.rotation.x = rightKneeBend;
      }
    }

    // 4. Opposing Fluid Arm Swings with Natural Forward Flexion
    if (leftArmRef.current && rightArmRef.current) {
      const leftArmAngle = -Math.sin(phase) * 0.45 * walkWeight;
      const rightArmAngle = Math.sin(phase) * 0.45 * walkWeight;

      leftArmRef.current.rotation.x = leftArmAngle + 0.08;
      rightArmRef.current.rotation.x = rightArmAngle + 0.08;

      leftArmRef.current.rotation.z = 0.1;
      rightArmRef.current.rotation.z = -0.1;
    }

    // 5. Smooth Pelvis Bobbing & Subtle Body Sway
    if (chestRef.current) {
      const walkBob = Math.abs(Math.sin(phase)) * 0.04 * walkWeight;
      const idleBreathe = Math.sin(time * 2.0) * 0.012 * (1 - walkWeight);
      chestRef.current.position.y = walkBob + idleBreathe;

      const bodyRoll = Math.sin(phase) * 0.03 * walkWeight;
      chestRef.current.rotation.z = bodyRoll;
      chestRef.current.rotation.y = -Math.sin(phase) * 0.04 * walkWeight;
    }

    // 6. Smooth Damped Landmark Head Tracking (Clamped angular speed)
    let targetYaw = 0;
    let targetPitch = 0;

    if (activeLandmark === 'CAFE') {
      targetYaw = -0.4;
      targetPitch = 0.1;
    } else if (activeLandmark === 'STAR') {
      targetYaw = 0.4;
      targetPitch = 0.12;
    } else if (activeLandmark === 'PAWN') {
      targetYaw = 0.45;
      targetPitch = -0.08;
    } else if (activeLandmark === 'MOTEL') {
      targetYaw = -0.42;
      targetPitch = 0.32;
    } else {
      targetYaw = Math.sin(time * 0.7) * 0.06 * (1 - walkWeight);
      targetPitch = Math.cos(time * 1.1) * 0.03 * (1 - walkWeight);
    }

    currentHeadYaw.current = THREE.MathUtils.damp(currentHeadYaw.current, targetYaw, 4.5, delta);
    currentHeadPitch.current = THREE.MathUtils.damp(currentHeadPitch.current, targetPitch, 4.5, delta);

    if (headRef.current) {
      headRef.current.rotation.y = currentHeadYaw.current;
      headRef.current.rotation.x = currentHeadPitch.current;
    }

    // 7. Visor Subtle Pulse
    if (visorMatRef.current) {
      const pulse = 0.85 + Math.sin(time * 3.0) * 0.15;
      visorMatRef.current.opacity = pulse;
    }

    // 8. Tech backpack subtle vent glow
    if (backpackVentsRef.current) {
      const ventPulse = 0.7 + Math.sin(time * 3.5) * 0.2;
      backpackVentsRef.current.children.forEach((child) => {
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (mat) mat.opacity = ventPulse;
      });
    }
  });

  return (
    <group ref={rootRef} position={[0, 0.92, 0]}>
      {/* Upper Body Hierarchy */}
      <group ref={chestRef}>
        {/* Sculpted Cyber Techwear Storm Jacket (Dark Charcoal) */}
        <mesh position={[0, 0.15, 0]} receiveShadow>
          <boxGeometry args={[0.54, 0.65, 0.36]} />
          <meshStandardMaterial color="#13151c" roughness={0.65} metalness={0.25} />
        </mesh>

        {/* High Stand-up Wind Collar */}
        <mesh position={[0, 0.5, 0.02]}>
          <cylinderGeometry args={[0.18, 0.22, 0.14, 16]} />
          <meshStandardMaterial color="#0c0e14" roughness={0.7} metalness={0.2} />
        </mesh>

        {/* Tactical Cross-Straps & Chest Rig */}
        <mesh position={[0, 0.2, 0.184]}>
          <boxGeometry args={[0.42, 0.08, 0.02]} />
          <meshStandardMaterial color="#1a1c26" metalness={0.7} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.12, 0.184]}>
          <boxGeometry args={[0.44, 0.04, 0.02]} />
          <meshStandardMaterial color="#1a1c26" metalness={0.7} roughness={0.4} />
        </mesh>

        {/* Compact Glowing Cyan Arc Reactor Badge */}
        <mesh position={[0.12, 0.26, 0.188]}>
          <circleGeometry args={[0.038, 16]} />
          <meshBasicMaterial color="#00F3FF" />
        </mesh>

        {/* Thin Neon Magenta Reflective Piping along Asymmetrical Jacket Zip */}
        <mesh position={[-0.04, 0.15, 0.185]}>
          <planeGeometry args={[0.022, 0.62]} />
          <meshBasicMaterial color="#FF0055" />
        </mesh>

        {/* Tactical Shoulder Epaulet Guards */}
        <mesh position={[-0.25, 0.44, 0]}>
          <boxGeometry args={[0.11, 0.035, 0.26]} />
          <meshStandardMaterial color="#1e212c" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.25, 0.44, 0]}>
          <boxGeometry args={[0.11, 0.035, 0.26]} />
          <meshStandardMaterial color="#1e212c" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Ergonomic Molded Tech Backpack (Dark Charcoal / Titanium) */}
        <group position={[0, 0.18, -0.24]}>
          {/* Main Chassis */}
          <mesh>
            <boxGeometry args={[0.36, 0.46, 0.13]} />
            <meshStandardMaterial color="#161822" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Top Grab Handle */}
          <mesh position={[0, 0.25, 0]}>
            <torusGeometry args={[0.08, 0.015, 6, 12]} />
            <meshStandardMaterial color="#222532" />
          </mesh>
          {/* Subtle Amber Heat Exhaust Vents */}
          <group ref={backpackVentsRef} position={[0, -0.04, -0.07]} rotation={[0, Math.PI, 0]}>
            {[-0.08, 0, 0.08].map((yOff, i) => (
              <mesh key={i} position={[0, yOff, 0]}>
                <planeGeometry args={[0.22, 0.032]} />
                <meshBasicMaterial color="#FFAA00" transparent opacity={0.7} />
              </mesh>
            ))}
          </group>
        </group>

        {/* Head & Neck Hierarchy */}
        <group ref={headRef} position={[0, 0.62, 0]}>
          {/* Stylized Face/Head Base */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.17, 16, 16]} />
            <meshStandardMaterial color="#c4a482" roughness={0.7} />
          </mesh>

          {/* Cyberpunk Undercut & Spiky Dark Hair */}
          <mesh position={[0, 0.12, -0.04]} rotation={[-0.2, 0, 0]}>
            <coneGeometry args={[0.21, 0.26, 8]} />
            <meshStandardMaterial color="#14161f" roughness={0.8} />
          </mesh>
          {/* Front Fringe Bangs */}
          <mesh position={[-0.05, 0.14, 0.11]} rotation={[0.4, 0, -0.2]}>
            <coneGeometry args={[0.09, 0.15, 6]} />
            <meshStandardMaterial color="#14161f" roughness={0.8} />
          </mesh>
          <mesh position={[0.06, 0.13, 0.11]} rotation={[0.35, 0, 0.15]}>
            <coneGeometry args={[0.08, 0.14, 6]} />
            <meshStandardMaterial color="#14161f" roughness={0.8} />
          </mesh>

          {/* Temple Neural Interface Port */}
          <mesh position={[0.165, 0.02, 0.02]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.022, 0.022, 0.02, 8]} />
            <meshStandardMaterial color="#00F3FF" metalness={0.9} />
          </mesh>

          {/* AR Visor Glasses Frame */}
          <mesh position={[0, 0.02, 0.13]}>
            <boxGeometry args={[0.32, 0.09, 0.12]} />
            <meshStandardMaterial color="#1c1f2b" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Glowing Translucent HUD Visor Lens */}
          <mesh position={[0, 0.02, 0.192]}>
            <planeGeometry args={[0.29, 0.07]} />
            <meshBasicMaterial
              ref={visorMatRef}
              color="#00F3FF"
              transparent
              opacity={0.85}
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
            <meshStandardMaterial color="#13151c" roughness={0.65} />
          </mesh>
          <mesh position={[0, -0.26, 0]}>
            <cylinderGeometry args={[0.085, 0.075, 0.36, 12]} />
            <meshStandardMaterial color="#13151c" roughness={0.7} />
          </mesh>
          {/* Neon Magenta Sleeve Piping */}
          <mesh position={[-0.078, -0.26, 0]}>
            <boxGeometry args={[0.015, 0.34, 0.025]} />
            <meshBasicMaterial color="#FF0055" />
          </mesh>
          {/* Tactical Fingerless Glove */}
          <mesh position={[0, -0.48, 0]}>
            <boxGeometry args={[0.09, 0.11, 0.09]} />
            <meshStandardMaterial color="#1c1f2b" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>

        {/* Right Arm Assembly (Segmented Chrome Cybernetic Prosthetic) */}
        <group ref={rightArmRef} position={[0.32, 0.42, 0]}>
          {/* Titanium Ball-and-Socket Shoulder Joint */}
          <mesh position={[0, -0.05, 0]}>
            <sphereGeometry args={[0.1, 14, 14]} />
            <meshStandardMaterial color="#00F0FF" metalness={0.95} roughness={0.15} />
          </mesh>
          {/* Upper Arm Titanium Chassis */}
          <mesh position={[0, -0.26, 0]}>
            <cylinderGeometry args={[0.08, 0.07, 0.36, 12]} />
            <meshStandardMaterial color="#252936" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Exposed Hydraulic Piston Cylinder */}
          <mesh position={[0.03, -0.26, 0.05]}>
            <cylinderGeometry args={[0.015, 0.015, 0.28, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.98} roughness={0.1} />
          </mesh>
          {/* Cyan Circuit Trace along Cyber-Arm */}
          <mesh position={[0.075, -0.26, 0]}>
            <boxGeometry args={[0.012, 0.32, 0.02]} />
            <meshBasicMaterial color="#00F3FF" />
          </mesh>
          {/* Articulated Chrome Hand & Knuckles */}
          <mesh position={[0, -0.48, 0]}>
            <boxGeometry args={[0.088, 0.11, 0.088]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.96} roughness={0.15} />
          </mesh>
        </group>
      </group>

      {/* Lower Body Hierarchy */}
      {/* Left Leg Assembly */}
      <group ref={leftLegRef} position={[-0.15, -0.15, 0]}>
        {/* Cargo Utility Pants Thigh with Pocket */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.105, 0.09, 0.4, 12]} />
          <meshStandardMaterial color="#14161f" roughness={0.8} />
        </mesh>
        <mesh position={[-0.1, -0.2, 0]}>
          <boxGeometry args={[0.045, 0.15, 0.13]} />
          <meshStandardMaterial color="#10121a" roughness={0.85} />
        </mesh>
        {/* Magenta Flap Pull Tab */}
        <mesh position={[-0.125, -0.2, 0]}>
          <planeGeometry args={[0.018, 0.1]} />
          <meshBasicMaterial color="#FF0055" />
        </mesh>

        {/* Knee Armor Guard (Gunmetal Steel) */}
        <mesh position={[0, -0.4, 0.075]}>
          <boxGeometry args={[0.11, 0.09, 0.045]} />
          <meshStandardMaterial color="#252936" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Lower Leg / Knee Joint Pivot */}
        <group ref={leftKneeRef} position={[0, -0.4, 0]}>
          {/* Shin & Ankle Cuff */}
          <mesh position={[0, -0.14, 0]}>
            <cylinderGeometry args={[0.08, 0.075, 0.34, 12]} />
            <meshStandardMaterial color="#14161f" roughness={0.8} />
          </mesh>

          {/* High-Top Futuristic Cyber Sneaker */}
          <group position={[0, -0.36, 0.05]}>
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.15, 0.12, 0.32]} />
              <meshStandardMaterial color="#1a1c26" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.09, 0.04]}>
              <boxGeometry args={[0.08, 0.02, 0.12]} />
              <meshBasicMaterial color="#FF0055" />
            </mesh>
            <mesh position={[0, -0.028, 0]}>
              <boxGeometry args={[0.16, 0.035, 0.34]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>
            <mesh position={[0, 0.045, -0.14]}>
              <boxGeometry args={[0.13, 0.05, 0.045]} />
              <meshBasicMaterial color="#00F0FF" />
            </mesh>
          </group>
        </group>
      </group>

      {/* Right Leg Assembly */}
      <group ref={rightLegRef} position={[0.15, -0.15, 0]}>
        {/* Cargo Utility Pants Thigh with Pocket */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.105, 0.09, 0.4, 12]} />
          <meshStandardMaterial color="#14161f" roughness={0.8} />
        </mesh>
        <mesh position={[0.1, -0.2, 0]}>
          <boxGeometry args={[0.045, 0.15, 0.13]} />
          <meshStandardMaterial color="#10121a" roughness={0.85} />
        </mesh>
        {/* Magenta Flap Pull Tab */}
        <mesh position={[0.125, -0.2, 0]}>
          <planeGeometry args={[0.018, 0.1]} />
          <meshBasicMaterial color="#FF0055" />
        </mesh>

        {/* Knee Armor Guard (Gunmetal Steel) */}
        <mesh position={[0, -0.4, 0.075]}>
          <boxGeometry args={[0.11, 0.09, 0.045]} />
          <meshStandardMaterial color="#252936" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Lower Leg / Knee Joint Pivot */}
        <group ref={rightKneeRef} position={[0, -0.4, 0]}>
          {/* Shin & Ankle Cuff */}
          <mesh position={[0, -0.14, 0]}>
            <cylinderGeometry args={[0.08, 0.075, 0.34, 12]} />
            <meshStandardMaterial color="#14161f" roughness={0.8} />
          </mesh>

          {/* High-Top Futuristic Cyber Sneaker */}
          <group position={[0, -0.36, 0.05]}>
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.15, 0.12, 0.32]} />
              <meshStandardMaterial color="#1a1c26" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.09, 0.04]}>
              <boxGeometry args={[0.08, 0.02, 0.12]} />
              <meshBasicMaterial color="#FF0055" />
            </mesh>
            <mesh position={[0, -0.028, 0]}>
              <boxGeometry args={[0.16, 0.035, 0.34]} />
              <meshBasicMaterial color="#00F3FF" />
            </mesh>
            <mesh position={[0, 0.045, -0.14]}>
              <boxGeometry args={[0.13, 0.05, 0.045]} />
              <meshBasicMaterial color="#00F0FF" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
