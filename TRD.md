# Technical Requirements Document (TRD)

**Project Title:** Cyberpunk Neon Street 3D Scroll Experience  
**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Derived From:** [PRD.md](file:///c:/Users/OM/Desktop/Programs/Projects/showcase/PRD.md) & [design.md](file:///c:/Users/OM/Desktop/Programs/Projects/showcase/design.md)  

---

## 1. System Architecture & High-Level Overview

The system architecture partitions the experience into three isolated layers:
1. **Virtual Smooth Scroll & Timeline Engine (DOM Layer):** Handles window scrolling, touch gestures, momentum smoothing (Lenis), and timeline scrub mapping (GSAP ScrollTrigger).
2. **WebGL Scene Graph & Post-Processing Pipeline (Canvas Layer):** Managed declaratively by `@react-three/fiber` and `@react-three/drei`, rendering procedural geometries, instanced particle systems, and the `@react-three/postprocessing` chain.
3. **Cyberpunk HUD & Audio Engine (UI Layer):** High-tech React HTML overlays positioned on top of the 3D canvas via CSS pointer-events management, synchronized reactively through a lightweight Zustand store.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             NEXT.JS 15 CLIENT                              │
│                                                                             │
│  ┌────────────────────────┐                   ┌──────────────────────────┐  │
│  │   Lenis Scroll Engine  │                   │      Zustand Store       │  │
│  │  GSAP ScrollTrigger    │ ─── t [0.0 - 1.0] ──► │  - scrollProgress        │  │
│  │  (Scrubbing Controller)│   (scrollVelocity)│  - activeLandmark        │  │
│  └───────────┬────────────┘                   │  - isAudioMuted          │  │
│              │                                └────────────┬─────────────┘  │
│              ▼                                             │                │
│  ┌──────────────────────────────────────────────┐          │                │
│  │           React Three Fiber Canvas           │          ▼                │
│  │                                              │ ┌───────────────────────┐ │
│  │  ┌─────────────────┐  ┌───────────────────┐  │ │ Cyberpunk HUD Overlay │ │
│  │  │  CameraRig      │  │ CharacterBoy      │  │ │ - Top Coordinates    │ │
│  │  │  (Piecewise     │  │ (AnimationMixer / │  │ │ - Holographic Cards   │ │
│  │  │   Camera Lerp)  │  │  Velocity Scrub)  │  │ │ - Milestone Tracker   │ │
│  │  └─────────────────┘  └───────────────────┘  │ │ - Audio Controller    │ │
│  │                                              │ └───────────────────────┘ │
│  │  ┌────────────────────────────────────────┐  │                           │
│  │  │ 3D World (Street, Rain, Steam)         │  │                           │
│  │  │ - Spaceship Cafe (Z: -30)              │  │                           │
│  │  │ - Star Clothing Store (Z: -70)         │  │                           │
│  │  │ - Debris Pawn Shop (Z: -110)           │  │                           │
│  │  │ - Nova Motel (Z: -150)                 │  │                           │
│  │  └────────────────────────────────────────┘  │                           │
│  │                                              │                           │
│  │  ┌────────────────────────────────────────┐  │                           │
│  │  │ PostProcessing (Bloom, Vignette, CA)   │  │                           │
│  │  └────────────────────────────────────────┘  │                           │
│  └──────────────────────────────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory & Project Structure

The project follows the standard Next.js 15 App Router architecture with modular component isolation:

```
showcase/
├── docs/
├── public/
│   ├── audio/
│   │   ├── ambient_synth.mp3       # Background rain & dark synth drone
│   │   └── neon_buzz.mp3           # Subtle positional electrical buzz
│   ├── textures/
│   │   ├── asphalt_normal.jpg      # High-frequency road bump map
│   │   └── smoke_puff.png          # Alpha mask for steam vents
│   └── models/
│       └── cyberpunk_boy.glb       # Optional external rigged character asset
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root HTML shell, fonts (Orbitron, JetBrains)
│   │   ├── page.tsx                # Client wrapper hosting Canvas & Scroll Track
│   │   └── globals.css             # CRT scanlines, custom scrollbars, animations
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── SceneCanvas.tsx     # Suspense + R3F Canvas wrapper (SSR disabled)
│   │   │   ├── CameraRig.tsx       # Dynamic camera trajectory & look-at controller
│   │   │   ├── CharacterBoy.tsx    # Cyberpunk boy procedural/GLTF avatar
│   │   │   ├── StreetEnvironment.tsx# Wet road, sidewalks, rain, fog & steam
│   │   │   ├── PostEffects.tsx     # Unreal bloom, chromatic aberration, vignette
│   │   │   └── landmarks/
│   │   │       ├── SpaceshipCafe.tsx# Fuselage, thruster glow & holographic mug
│   │   │       ├── StarClothing.tsx # Glass boutique & constellation lighting
│   │   │       ├── DebrisPawn.tsx   # Scrap cages, CRT pyramid & hazard beacon
│   │   │       └── NovaMotel.tsx    # Stasis pods, vertical neon & elevator
│   │   └── ui/
│   │       ├── CyberpunkHUD.tsx    # Master HUD overlay container
│   │       ├── HeaderStatus.tsx    # Coordinates, live status, district tags
│   │       ├── LandmarkCard.tsx    # Holographic slide-in card for active shop
│   │       ├── ProgressTracker.tsx # Milestone breadcrumbs & scroll indicator
│   │       ├── AudioPlayer.tsx     # Web Audio API ambient drone & volume toggle
│   │       └── ScanlineOverlay.tsx # Toggleable CRT scanline & flicker effect
│   ├── hooks/
│   │   ├── useScrollController.ts  # Lenis + GSAP timeline sync hook
│   │   └── useCyberpunkAudio.ts    # Web Audio synthesis / audio buffer controller
│   ├── store/
│   │   └── useCyberpunkStore.ts    # Zustand state: progress, active landmark, audio
│   └── lib/
│       ├── constants.ts            # Street coordinates, milestone ranges & colors
│       └── mathUtils.ts            # Smoothstep, damp, and spline interpolation
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## 3. Core Systems & Implementation Details

### 3.1. Scroll Engine & Timeline Synchronization

We use `@studio-freight/lenis` for smooth inertia scrolling combined with `gsap/ScrollTrigger` to track normalized scroll progression `t ∈ [0, 1]`.

#### Virtual Scroll Container Strategy
- A fixed 3D Canvas sits at `position: fixed; inset: 0; z-index: 0; pointer-events: none;`.
- A transparent scroll spacer `div` sits inside the document body with `height: 500vh` to yield a fluid 5-screen scroll length.
- The `useScrollController` hook synchronizes Lenis with GSAP:

```typescript
// src/hooks/useScrollController.ts
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';

gsap.registerPlugin(ScrollTrigger);

export function useScrollController() {
  const setScrollProgress = useCyberpunkStore((s) => s.setScrollProgress);
  const setScrollVelocity = useCyberpunkStore((s) => s.setScrollVelocity);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update();
      setScrollVelocity(e.velocity || 0);
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
      lenis.destroy();
    };
  }, [setScrollProgress, setScrollVelocity]);
}
```

---

### 3.2. Camera Choreography & Mathematical Interpolation

Camera movement is driven per-frame inside `useFrame` via `CameraRig.tsx`. Rather than jump cuts, camera positions and look-at targets are computed as continuous piecewise splines with smoothstep transition zones.

#### Landmark Coordinate Definitions:
- **Street Length:** `160 meters` (`Z = 0` to `Z = -160`)
- **Spaceship Cafe:** $Z_{\text{cafe}} = -32.0$ (Activation: $t \in [0.18, 0.32]$)
- **Star Clothing:** $Z_{\text{store}} = -70.0$ (Activation: $t \in [0.48, 0.62]$)
- **Debris Pawn:** $Z_{\text{pawn}} = -110.0$ (Activation: $t \in [0.77, 0.88]$)
- **Nova Motel:** $Z_{\text{motel}} = -152.0$ (Activation: $t \in [0.92, 1.00]$)

#### Mathematical Camera Interpolation (`CameraRig.tsx`):
```typescript
// src/components/3d/CameraRig.tsx
'use client';
import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';
import { STREET_LENGTH, LANDMARKS } from '@/lib/constants';

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function getZoneWeight(t: number, start: number, peakStart: number, peakEnd: number, end: number) {
  if (t < start || t > end) return 0;
  if (t >= peakStart && t <= peakEnd) return 1;
  if (t < peakStart) return smoothstep(start, peakStart, t);
  return 1 - smoothstep(peakEnd, end, t);
}

export function CameraRig() {
  const currentTarget = useRef(new THREE.Vector3(0, 1.6, -5));
  const currentCamPos = useRef(new THREE.Vector3(0, 2.2, 5.5));
  const progress = useCyberpunkStore((s) => s.scrollProgress);

  useFrame((state, delta) => {
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    const boyZ = -t * STREET_LENGTH;

    // Default Over-The-Shoulder Follow Parameters
    const defaultCamPos = new THREE.Vector3(0, 2.2, boyZ + 5.5);
    const defaultTarget = new THREE.Vector3(0, 1.6, boyZ - 3.0);

    // Calculate Landmark Weights
    const wCafe = getZoneWeight(t, 0.15, 0.19, 0.30, 0.35);
    const wStar = getZoneWeight(t, 0.45, 0.49, 0.60, 0.65);
    const wPawn = getZoneWeight(t, 0.74, 0.78, 0.86, 0.90);
    const wMotel = getZoneWeight(t, 0.90, 0.93, 1.00, 1.00);

    // Desired Camera Position & LookAt Target
    let desiredCamPos = defaultCamPos.clone();
    let desiredTarget = defaultTarget.clone();

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
      // Nova Motel: Low angle sweep left, tilt upward (+LookAt.Y)
      const motelCam = new THREE.Vector3(-3.2, 1.1, LANDMARKS.MOTEL.z + 2.0);
      const motelLook = new THREE.Vector3(5.0, 6.0, LANDMARKS.MOTEL.z - 2.0);
      desiredCamPos.lerp(motelCam, wMotel);
      desiredTarget.lerp(motelLook, wMotel);
    }

    // Smooth Damping to Prevent Jerks
    currentCamPos.current.lerp(desiredCamPos, 1 - Math.exp(-5 * delta));
    currentTarget.current.lerp(desiredTarget, 1 - Math.exp(-5 * delta));

    state.camera.position.copy(currentCamPos.current);
    state.camera.lookAt(currentTarget.current);
  });

  return null;
}
```

---

### 3.3. Character Boy Locomotion Controller (`CharacterBoy.tsx`)

The character has two implementation tiers:
1. **High-Fidelity Procedural Mesh Fallback:** Instantly renders without any external network model downloads (cyberpunk hoodie, glowing visor, cargo pants, neon boots, animated arm/leg limb swings).
2. **GLTF Rigged Model Support:** Can seamlessly drop in a `.glb` character with Mixamo animation clips (`Walk`, `Idle`, `TurnHead`) if an external model file is provided in `public/models/cyberpunk_boy.glb`.

#### Locomotion Animation Sync Logic:
- As scroll occurs, the boy's $Z$ position moves to $-t \times 160$.
- In procedural mode, limb rotation angles are modulated by:
  $$\theta_{\text{limb}} = \sin(\text{scrollDistance} \times 4.0) \times 0.6$$
- In GLTF mode, `AnimationMixer.timeScale` is driven by:
  $$\text{timeScale} = \text{clamp}(|\text{scrollVelocity}| \times 0.08, 0.0, 2.0)$$
  When velocity $< 0.05$, cross-fade from `walkAction` to `idleAction`.

---

### 3.4. Wet Road Shader & Puddle Reflections (`StreetEnvironment.tsx`)

To achieve the Blade Runner reflection aesthetic without expensive real-time planar mirror passes, we use:
- A `MeshStandardMaterial` with:
  - `roughness: 0.18` (high specular mirror effect for puddles).
  - `metalness: 0.35` (picks up colored point lights strongly).
- **Point Light Rig:** Strategic point lights attached to each landmark facade that cast colored specular pools on the asphalt:
  - Spaceship Cafe: Amber point light (`#FFAA00`, intensity `3.0`, distance `12m`).
  - Star Clothing: Violet/Cyan point lights (`#8A2BE2`, `#00F3FF`, intensity `3.5`, distance `14m`).
  - Debris Pawn: Toxic green / amber strobe (`#05FFA1`, intensity `2.5`, distance `10m`).
  - Nova Motel: Magenta wash point light (`#FF0055`, intensity `4.5`, distance `18m`).

---

### 3.5. Post-Processing Pipeline (`PostEffects.tsx`)

Built with `@react-three/postprocessing`:
```tsx
// src/components/3d/PostEffects.tsx
'use client';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

export function PostEffects() {
  return (
    <EffectComposer multisampling={4} disableNormalPass>
      {/* Glow for high-intensity neon elements */}
      <Bloom
        luminanceThreshold={0.82}
        luminanceSmoothing={0.25}
        intensity={1.85}
        mipmapBlur
      />
      {/* Subtle lens chromatic fringe */}
      <ChromaticAberration
        offset={new THREE.Vector2(0.0015, 0.0015)}
        radialModulation={true}
        modulationOffset={0.3}
      />
      {/* Dystopian perimeter vignette */}
      <Vignette eskil={false} offset={0.28} darkness={0.75} />
    </EffectComposer>
  );
}
```

---

### 3.6. State Management Store (`useCyberpunkStore.ts`)

A Zustand store coordinates state between the WebGL Canvas and the 2D React DOM UI:

```typescript
// src/store/useCyberpunkStore.ts
import { create } from 'zustand';

export type LandmarkId = 'NONE' | 'CAFE' | 'STAR' | 'PAWN' | 'MOTEL';

interface CyberpunkState {
  scrollProgress: number;
  scrollVelocity: number;
  activeLandmark: LandmarkId;
  isAudioMuted: boolean;
  scanlinesEnabled: boolean;
  
  setScrollProgress: (progress: number) => void;
  setScrollVelocity: (velocity: number) => void;
  setActiveLandmark: (landmark: LandmarkId) => void;
  toggleAudio: () => void;
  toggleScanlines: () => void;
}

export const useCyberpunkStore = create<CyberpunkState>((set) => ({
  scrollProgress: 0,
  scrollVelocity: 0,
  activeLandmark: 'NONE',
  isAudioMuted: true, // Default muted for browser autoplay policies
  scanlinesEnabled: true,

  setScrollProgress: (scrollProgress) => {
    // Determine active landmark based on normalized progress
    let activeLandmark: LandmarkId = 'NONE';
    if (scrollProgress >= 0.16 && scrollProgress <= 0.34) activeLandmark = 'CAFE';
    else if (scrollProgress >= 0.46 && scrollProgress <= 0.64) activeLandmark = 'STAR';
    else if (scrollProgress >= 0.75 && scrollProgress <= 0.89) activeLandmark = 'PAWN';
    else if (scrollProgress >= 0.91) activeLandmark = 'MOTEL';

    set({ scrollProgress, activeLandmark });
  },
  setScrollVelocity: (scrollVelocity) => set({ scrollVelocity }),
  setActiveLandmark: (activeLandmark) => set({ activeLandmark }),
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  toggleScanlines: () => set((state) => ({ scanlinesEnabled: !state.scanlinesEnabled })),
}));
```

---

### 3.7. Audio Synthesis & Immersion (`useCyberpunkAudio.ts`)

To avoid broken external audio files, the audio system utilizes the **Web Audio API** with procedural synth oscillators and filtered noise generators:
- **Rain Audio Generator:** Pink noise generator through a bandpass filter (`frequency: 800Hz, Q: 1.5`) simulating falling rain.
- **Synthwave Drone:** Dual low-frequency sawtooth oscillators (`55Hz` / A1 and `110Hz` / A2) through a resonant lowpass filter with slow LFO pulse.
- **Neon Buzz Generator:** Subtle `60Hz` mains hum with 2nd harmonic (`120Hz`) triggered at landmarks.

---

## 4. Dependencies & Version Manifest

```json
{
  "name": "cyberpunk-street-showcase",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "three": "^0.170.0",
    "@types/three": "^0.170.0",
    "@react-three/fiber": "^9.0.0-rc.1",
    "@react-three/drei": "^10.0.0",
    "@react-three/postprocessing": "^3.0.0",
    "@studio-freight/lenis": "^1.0.42",
    "gsap": "^3.12.5",
    "zustand": "^5.0.0",
    "lucide-react": "^0.460.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.15"
  }
}
```

---

## 5. Performance, Memory & Optimization Strategies

1. **Next.js Dynamic SSR Bypass:**
   - The 3D Scene canvas must be loaded via `next/dynamic` with `{ ssr: false }` to prevent server-side WebGL window reference errors.
2. **Device Pixel Ratio (DPR) Clamping:**
   - `<Canvas dpr={[1, 2]}>` prevents Retina 3x and 4x mobile screens from rendering excessive pixel counts that cause frame drops.
3. **Instanced Rain Geometry:**
   - The 2,500 rain streaks are rendered in a single draw call using `THREE.InstancedMesh`.
4. **Frustum Culling & Bounding Spheres:**
   - Buildings and landmark assemblies have correctly computed bounding spheres, ensuring out-of-view geometry is culled automatically by Three.js.
5. **Memory Leak Prevention:**
   - Geometry and materials are memoized via `useMemo`.
   - ScrollTrigger instances and Lenis loops are explicitly destroyed inside `useEffect` cleanup routines.

---

## 6. Implementation Milestones & Roadmap

- **Phase 1: Project Setup & Core Scaffold**
  - Initialize Next.js 15, Tailwind CSS, TypeScript, and install dependencies.
  - Setup Zustand store, constants, and layout shell.
- **Phase 2: Scroll Engine & Camera Rig**
  - Implement Lenis + GSAP ScrollTrigger bridge.
  - Build `CameraRig.tsx` with smooth piecewise vector dampening.
- **Phase 3: 3D Environment & Atmospheric Systems**
  - Implement wet asphalt road with reflection pools and center glowing line.
  - Build instanced rain particle mesh and sidewalk steam vents.
  - Add dark towering skyscrapers and overhead cable networks.
- **Phase 4: Character Locomotion System**
  - Construct the Cyberpunk Boy with glowing visor, hoodie, and sneakers.
  - Bind walking motion and limb swing to scroll velocity.
- **Phase 5: The 4 Landmarks**
  - Build **Spaceship Cafe** with cantilevered fuselage, thrusters, and holographic coffee cup.
  - Build **Star Clothing Store** with constellation ceiling and holographic mannequins.
  - Build **Debris Pawn Shop** with scrap cages, CRT monitor stack, and hazard lights.
  - Build **Nova Motel** with stasis sleep pods, vertical neon sign, and elevator pod.
- **Phase 6: Post-Processing & HUD Polish**
  - Integrate Unreal Bloom, Chromatic Aberration, and Vignette.
  - Construct Cyberpunk HUD (Header, Landmark Cards, Progress Bar, Audio Toggle, Scanlines).
  - Verify 60 FPS performance and cross-browser rendering.

