'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';
import { STREET_LENGTH, LANDMARKS } from '@/lib/constants';
import { getZoneWeight } from '@/lib/mathUtils';

export function CameraRig() {
  const currentTarget = useRef(new THREE.Vector3(0, 1.6, -5));
  const currentCamPos = useRef(new THREE.Vector3(0, 2.2, 5.5));
  const progress = useCyberpunkStore((s) => s.scrollProgress);

  useFrame((state, delta) => {
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    const boyZ = -t * STREET_LENGTH;

    // 1. Default Follow Perspective (Over-The-Shoulder)
    const defaultCamPos = new THREE.Vector3(0, 2.2, boyZ + 5.5);
    const defaultTarget = new THREE.Vector3(0, 1.6, boyZ - 3.0);

    // 2. Compute Landmark Zone Transition Weights
    const wCafe = getZoneWeight(t, 0.15, 0.19, 0.30, 0.35);
    const wStar = getZoneWeight(t, 0.45, 0.49, 0.60, 0.65);
    const wPawn = getZoneWeight(t, 0.74, 0.78, 0.86, 0.90);
    const wMotel = getZoneWeight(t, 0.90, 0.93, 1.00, 1.00);

    const desiredCamPos = defaultCamPos.clone();
    const desiredTarget = defaultTarget.clone();

    if (wCafe > 0) {
      // Spaceship Cafe: Sweep left (-X), pan right (+LookAt.X)
      const cafeCam = new THREE.Vector3(-2.8, 2.0, LANDMARKS.CAFE.z + 2.0);
      const cafeLook = new THREE.Vector3(5.5, 2.4, LANDMARKS.CAFE.z - 1.0);
      desiredCamPos.lerp(cafeCam, wCafe);
      desiredTarget.lerp(cafeLook, wCafe);
    } else if (wStar > 0) {
      // Star Clothing: Sweep right (+X), pan left (-LookAt.X)
      const starCam = new THREE.Vector3(2.8, 2.2, LANDMARKS.STAR.z + 2.0);
      const starLook = new THREE.Vector3(-5.5, 2.2, LANDMARKS.STAR.z - 1.0);
      desiredCamPos.lerp(starCam, wStar);
      desiredTarget.lerp(starLook, wStar);
    } else if (wPawn > 0) {
      // Debris Pawn: Drop low to curb (+X, low Y), pan left (-LookAt.X)
      const pawnCam = new THREE.Vector3(2.2, 1.3, LANDMARKS.PAWN.z + 1.5);
      const pawnLook = new THREE.Vector3(-4.8, 1.2, LANDMARKS.PAWN.z - 0.5);
      desiredCamPos.lerp(pawnCam, wPawn);
      desiredTarget.lerp(pawnLook, wPawn);
    } else if (wMotel > 0) {
      // Nova Motel: Low-angle sweep left, pan right & pitch up (+LookAt.Y)
      const motelCam = new THREE.Vector3(-3.2, 1.1, LANDMARKS.MOTEL.z + 2.0);
      const motelLook = new THREE.Vector3(5.0, 6.0, LANDMARKS.MOTEL.z - 2.0);
      desiredCamPos.lerp(motelCam, wMotel);
      desiredTarget.lerp(motelLook, wMotel);
    }

    // 3. Smooth Damping to Prevent Jerking
    const dampFactor = 1 - Math.exp(-6 * delta);
    currentCamPos.current.lerp(desiredCamPos, dampFactor);
    currentTarget.current.lerp(desiredTarget, dampFactor);

    state.camera.position.copy(currentCamPos.current);
    state.camera.lookAt(currentTarget.current);
  });

  return null;
}

