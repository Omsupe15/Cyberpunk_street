'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';
import { STREET_LENGTH, LANDMARKS } from '@/lib/constants';
import { getZoneWeight } from '@/lib/mathUtils';

export function CameraRig() {
  const currentTarget = useRef(new THREE.Vector3(0, 1.8, -5));
  const currentCamPos = useRef(new THREE.Vector3(0, 2.4, 6.0));
  const progress = useCyberpunkStore((s) => s.scrollProgress);

  useFrame((state, delta) => {
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    const boyZ = -t * STREET_LENGTH;

    // 1. Default Follow Perspective on 14m Grand Avenue (Smooth Over-The-Shoulder)
    const defaultCamPos = new THREE.Vector3(0, 2.4, boyZ + 6.0);
    const defaultTarget = new THREE.Vector3(0, 1.8, boyZ - 3.5);

    // 2. Compute Landmark Zone Transition Weights
    const wCafe = getZoneWeight(t, 0.15, 0.19, 0.30, 0.35);
    const wStar = getZoneWeight(t, 0.45, 0.49, 0.60, 0.65);
    const wPawn = getZoneWeight(t, 0.74, 0.78, 0.86, 0.90);
    const wMotel = getZoneWeight(t, 0.90, 0.93, 1.00, 1.00);

    const desiredCamPos = defaultCamPos.clone();
    const desiredTarget = defaultTarget.clone();

    if (wCafe > 0) {
      // Spaceship Cafe (Right side at X = 10.5m): Sweep left (-X), pan right towards cafe pavilion
      const cafeCam = new THREE.Vector3(-3.8, 2.2, LANDMARKS.CAFE.z + 2.5);
      const cafeLook = new THREE.Vector3(8.0, 2.6, LANDMARKS.CAFE.z - 1.0);
      desiredCamPos.lerp(cafeCam, wCafe);
      desiredTarget.lerp(cafeLook, wCafe);
    } else if (wStar > 0) {
      // Star Clothing (Left side at X = -10.5m): Sweep right (+X), pan left towards boutique glass
      const starCam = new THREE.Vector3(3.8, 2.4, LANDMARKS.STAR.z + 2.5);
      const starLook = new THREE.Vector3(-8.0, 2.4, LANDMARKS.STAR.z - 1.0);
      desiredCamPos.lerp(starCam, wStar);
      desiredTarget.lerp(starLook, wStar);
    } else if (wPawn > 0) {
      // Debris Pawn (Left side at X = -10.5m): Drop to curb level (+X, low Y), pan left towards salvage depot
      const pawnCam = new THREE.Vector3(3.2, 1.4, LANDMARKS.PAWN.z + 2.0);
      const pawnLook = new THREE.Vector3(-7.2, 1.4, LANDMARKS.PAWN.z - 0.5);
      desiredCamPos.lerp(pawnCam, wPawn);
      desiredTarget.lerp(pawnLook, wPawn);
    } else if (wMotel > 0) {
      // Nova Motel (Right side at X = 10.5m): Low-angle sweep left, pan right & pitch up (+LookAt.Y)
      const motelCam = new THREE.Vector3(-4.2, 1.3, LANDMARKS.MOTEL.z + 2.5);
      const motelLook = new THREE.Vector3(7.5, 7.5, LANDMARKS.MOTEL.z - 2.0);
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
