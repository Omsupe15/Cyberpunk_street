# Design Specification: Sector 07 – Cyberpunk Neon Street

**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Derived From:** [PRD.md](file:///c:/Users/OM/Desktop/Programs/Projects/showcase/PRD.md)  

---

## 1. Visual Identity & Art Direction

The aesthetic of **Sector 07** merges high-tech futuristic architecture with low-life industrial decay—the classic cyberpunk duality. Visual inspiration stems from *Blade Runner 2049*, *Akira*, and *Ghost in the Shell*:
- **Atmosphere:** Deep obsidian nights, heavy industrial rain, rising ground steam, dense atmospheric fog, and wet reflective asphalt.
- **Lighting Contrast:** Pitch-black shadows pierced by vibrant, high-intensity neon signs and volumetric light cones.
- **Surface Quality:** Metallic sheen, weather-beaten industrial grunge, rusted steel beams, damp asphalt with pooled rainwater, and translucent holographic projections.

---

## 2. Color Palette & Design Tokens

### 2.1. Primary Neon Illuminations
| Color Name | Hex Code | RGB | Tone Mapping | Primary Use |
| :--- | :--- | :--- | :--- | :--- |
| **Cyber Cyan** | `#00F3FF` | `rgb(0, 243, 255)` | `false` (Bloom) | Holographic UI, Star Boutique accents, Cafe signage |
| **Neon Magenta** | `#FF0055` | `rgb(255, 0, 85)` | `false` (Bloom) | Nova Motel sign, street billboards, high-priority HUD |
| **Plasma Amber** | `#FFAA00` | `rgb(255, 170, 0)` | `false` (Bloom) | Spaceship Cafe thrusters, warning lights, warm windows |
| **Acid Toxic Green** | `#05FFA1` | `rgb(5, 255, 161)` | `false` (Bloom) | Debris Pawn shop terminals, CRT phosphor glow |
| **Astra Violet** | `#8A2BE2` | `rgb(138, 43, 226)` | `false` (Bloom) | Star Clothing canopy, constellation projections |

### 2.2. Environmental & Structural Base Tones
| Color Name | Hex Code | RGB | Properties | Primary Use |
| :--- | :--- | :--- | :--- | :--- |
| **Obsidian Void** | `#05050A` | `rgb(5, 5, 10)` | Matte | Sky backdrop, deep shadows, distant silhouettes |
| **Wet Asphalt** | `#111218` | `rgb(17, 18, 24)` | Roughness: `0.15`, Metalness: `0.3` | Street floor, puddle base |
| **Industrial Concrete** | `#1E2028` | `rgb(30, 32, 40)` | Roughness: `0.85`, Metalness: `0.1` | Curbs, sidewalks, building foundations |
| **Weathered Iron** | `#262A36` | `rgb(38, 42, 54)` | Roughness: `0.65`, Metalness: `0.8` | Structural girders, conduit pipes, fire escapes |

### 2.3. 2D UI & HUD Palette
- **HUD Glass Background:** `rgba(10, 14, 23, 0.75)` with `backdrop-filter: blur(16px)`
- **HUD Active Border:** `rgba(0, 243, 255, 0.45)` with subtle neon box-shadow
- **Text Primary:** `#F3F4F6` (Cool White)
- **Text Secondary / Coordinates:** `#67E8F9` (Cyan-300)
- **Text Warning:** `#FBBF24` (Amber-400)

---

## 3. Detailed 3D Elements Specification

### 3.1. Street & Environmental Architecture
The street runs linearly along the **Z-axis** from `Z = 0` (Street Entrance) to `Z = -160` (Nova Motel Terminal).

```
[Street Layout Top View]
Z = 0          Z = -30                 Z = -70                 Z = -110              Z = -160
 ├─── Entrance ─── Spaceship Cafe (R) ─── Star Clothing (L) ──── Debris Pawn (L) ──── Nova Motel (R) ───┤
                 [X = +6.0 to +14.0]     [X = -6.0 to -14.0]     [X = -6.0 to -13.0]   [X = +6.0 to +16.0]
```

#### A. Roadway & Sidewalks
- **Dimensions:** Road width = `8.0m` (`X = -4.0` to `X = +4.0`). Left & Right sidewalks = `3.0m` width each.
- **Material Specs (`MeshStandardMaterial`):**
  - Base Color: `#111218`
  - Roughness: `0.2` (smooth puddles reflect neon)
  - Metalness: `0.4`
  - Normal Map: High-frequency asphalt grain with subtle puddle ripple perturbation.
- **Lane Markings:** Broken glowing cyber-cyan strip down the center (`X = 0`) with emissive intensity `1.2`.

#### B. Atmospheric Weather & Particle FX
- **Rain Streak System:**
  - Instanced particle system of `2,500` elongated vertical lines (`0.02m` x `0.35m`).
  - Rain falls diagonally at an 8-degree slant to simulate wind along the canyon of skyscrapers.
  - Continuous loop with Y range `[0m, 20m]`.
  - Material: `MeshBasicMaterial`, Color: `#88CCFF`, Transparent, Opacity: `0.45`, Blending: `AdditiveBlending`.
- **Sidewalk Steam Vents:**
  - Billboard particles rising from round sewer grates (`Z = -15`, `Z = -50`, `Z = -90`, `Z = -135`).
  - Soft procedural radial gradient smoke textures fading upward from Y `0m` to `3.5m`.
  - Opacity: `0.25`, Color: `#A0B4C8`, gentle rotating swirl.

#### C. Megastructure Skyline & Overhead Infrastructure
- **Tower Silhouettes:** Procedurally generated towering skyscraper boxes (`Heights: 40m - 90m`) lining both flanks beyond the sidewalk boundaries (`X = ±15m`).
- **Facade Detailing:** Dark glass facades studded with random grid emissive windows (yellow, cyan, and unlit).
- **Overhead Cables:** Catmull-Rom curve cables strung diagonally between buildings across the street at heights of `6m - 12m`.
- **Industrial Pipes & AC Units:** Metal conduit boxes and ventilation pipes running vertically up exterior walls with flashing red aviation obstruction lights on top.

---

### 3.2. Character Boy (The Protagonist)

- **Position & Scale:**
  - Height: `1.75m`
  - Base Position: Centered on the street (`X = 0`, `Y = 0`).
  - Z Position is dynamically calculated from scroll progress: $Z_{\text{boy}} = -t \times 160$.
- **Appearance & Wardrobe:**
  - **Head:** High-tech cybernetic visor with horizontal cyan scanning line (`#00F3FF`). Spiky wind-swept dark hair.
  - **Torso:** Oversized dark charcoal cyberpunk hoodie (`#15161E`) with glowing neon-magenta piping along seams and sleeves.
  - **Legs:** Tactical multi-pocket cargo pants with reflective knee patches.
  - **Feet:** High-top cyber-sneakers with glowing cyan soles and amber heel dampers.
- **Locomotion & Animation States:**
  - **Walk Cycle:** Natural forward stride. Animation speed dynamically scales with scroll velocity.
  - **Idle State:** Relaxed breathing stance, arms lightly swaying, triggered whenever scroll velocity approaches zero.
  - **Look-Around Blending:** Subtle head rotation towards landmarks when pausing within milestone activation zones.

---

### 3.3. Landmark 1: The Spaceship Cafe (Right Side, Z: -25 to -38)

- **Architectural Concept:** A docked retro-futuristic light freighter converted into a cantilevered rooftop street cafe.
- **Exterior Elements:**
  - **Fuselage Body:** Aerodynamic brushed gunmetal hull (`#2A2F3D`, Metalness `0.85`, Roughness `0.25`) jutting out from the 2nd floor of a building over the sidewalk.
  - **Cockpit Canopy:** Tinted panoramic cyan glass window (`#00F3FF`, Opacity `0.4`, Roughness `0.05`). Behind the glass, an illuminated holographic display and a barista silhouette are visible.
  - **Dual Thrusters:** Cylindrical aft engines pointing diagonally downward, functioning as outdoor patio heaters. Glowing deep plasma amber (`#FFAA00`, Emissive `3.5`) with a pulsing corona.
  - **Holographic Signage:** Rotating 3D wireframe coffee cup above the roof with floating steam rings emitting soft cyan light.
  - **Outdoor Counter:** Floating stainless steel bar counter with 3 glowing neon barstools on the sidewalk.
- **Lighting Accent:** Warm golden interior lighting spilling through tinted glass (`Color: #FFB347, PointLight Distance: 8m, Intensity: 2.0`), contrasting against cool cyan exterior accents.

---

### 3.4. Landmark 2: Star Clothing Store (Left Side, Z: -65 to -78)

- **Architectural Concept:** An ultra-modern, high-fashion boutique specializing in wearable holographic textiles and deep-space apparel.
- **Exterior Elements:**
  - **Frameless Glass Facade:** Two-story floor-to-ceiling smart glass with subtle hexagonal grid reflection.
  - **Constellation Ceiling:** An overhead matrix of 80+ fiber-optic point lights embedded in the storefront overhang that pulse like twinkling stars in a nebula pattern.
  - **Floating Hologram Mannequins:** Two rotating semi-transparent wireframe mannequins displayed in display windows, adorned with shifting chromatic jackets that cycle from Astra Violet (`#8A2BE2`) to Cyber Cyan (`#00F3FF`).
  - **Signage:** Sleek minimalist signage: **"ASTRA // STAR CLOTHING"** with a glowing eight-pointed neon star emblem.
- **Lighting Accent:** Dreamy cosmic ambiance with purple spotlight cones and soft cyan floor uplights.

---

### 3.5. Landmark 3: Debris Pawn Shop (Left Side, Z: -105 to -118)

- **Architectural Concept:** A grimy, subterranean black-market cyberware pawn and salvage den.
- **Exterior Elements:**
  - **Storefront & Security:** Heavy corrugated iron roll-up shutter partially raised to reveal a cluttered, dimly lit salvage shop interior.
  - **Scrap Wire Cages:** Heavy wire mesh cages on the sidewalk filled with salvaged android torso frames, robotic arm actuators, and optical lens arrays.
  - **CRT Monitor Stack:** A crooked pyramid of 5 vintage cathode-ray monitors on a metal pallet, displaying green phosphor terminal code, scanlines, and diagnostic waveforms.
  - **Hazard Signage:** Yellow-and-black diagonal hazard stripes painted on the curb with a blinking yellow strobe beacon (`#FFAA00`, 1.5 Hz flash).
  - **Flickering Neon:** A damaged vertical sign: **"DEBRIS PAWN // 屑物"** where letters "B" and "S" periodically flicker and buzz with slight electrical arc sparks.
- **Lighting Accent:** Murky industrial green (`#05FFA1`) and amber warning lights with random intermittent voltage drops.

---

### 3.6. Landmark 4: Nova Motel (Right Side, Z: -145 to -160)

- **Architectural Concept:** A retro-futuristic high-density stasis pod motel towering into the smoggy stratosphere, reminiscent of vintage neon motels with a dystopian Blade Runner twist.
- **Exterior Elements:**
  - **Modular Pod Tower:** Vertical stack of hexagonal sleep capsules with rounded acrylic viewing hatches; select pods emit warm interior glow while others display red "OCCUPIED" indicators.
  - **Towering Vertical Neon Sign:** A massive 12-meter tall vertical neon sign reading:
    ```
    N
    O
    V
    A

    M
    O
    T
    E
    L
    新星
    ```
    Crafted in brilliant Neon Magenta (`#FF0055`) with a pulsing outer cyan border.
  - **Art-Deco Cantilever Canopy:** A tiered brass-and-concrete entrance canopy over the sidewalk with recessed golden strip lighting.
  - **Exterior Glass Elevator:** A transparent vertical elevator shaft running up the side of the tower, with an illuminated pod slowly ascending and descending.
  - **Flashing Vacancy Light:** A retro cursive neon sign below the canopy: *"NO VACANCY"* with the *"NO"* flickering intermittently.
- **Lighting Accent:** High-contrast neon magenta wash casting deep pink reflections across the wet asphalt.

---

## 4. Camera Choreography & Framing Matrix

The camera operates via a dual-vector interpolation system: `Camera Position (X, Y, Z)` and `LookAt Target (X, Y, Z)`. Transitions are calculated smoothly across normalized scroll distance $t \in [0.0, 1.0]$.

| Scroll Progress ($t$) | Street Zone | Camera Position $(X, Y, Z)$ | LookAt Target $(X, Y, Z)$ | Cinematic Goal |
| :---: | :--- | :--- | :--- | :--- |
| **0.00 – 0.15** | Street Intro | $(0.0, 2.2, Z_{\text{boy}} + 5.5)$ | $(0.0, 1.6, Z_{\text{boy}} - 3.0)$ | Classic over-the-shoulder hero perspective, establishing deep perspective of rain and neon alley. |
| **0.15 – 0.18** | *Entering Cafe* | Interpolates to Cafe vantage | Interpolates to Cafe vantage | Smooth ease-in curve. |
| **0.18 – 0.32** | **Spaceship Cafe** | $(-2.8, 2.0, Z_{\text{cafe}} + 2.0)$ | $(+5.5, 2.5, Z_{\text{cafe}} - 1.0)$ | **Camera pans Right (+40°)**. Boy in foreground; cafe fuselage, thrusters, and holographic coffee cup framed. |
| **0.32 – 0.36** | *Exiting Cafe* | Returns to center trail | Returns to center trail | Smooth ease-out curve. |
| **0.36 – 0.45** | Transit Corridor 1 | $(0.0, 2.0, Z_{\text{boy}} + 5.0)$ | $(0.0, 1.5, Z_{\text{boy}} - 4.0)$ | Centered follow camera, character resumes brisk walk through steam vent. |
| **0.45 – 0.48** | *Entering Star Shop* | Interpolates to Boutique vantage | Interpolates to Boutique vantage | Smooth ease-in curve. |
| **0.48 – 0.62** | **Star Clothing** | $(+2.8, 2.2, Z_{\text{store}} + 2.0)$ | $(-5.5, 2.2, Z_{\text{store}} - 1.0)$ | **Camera pans Left (-40°)**. Captures constellation roof, wireframe mannequins, and violet light canopy. |
| **0.62 – 0.66** | *Exiting Star Shop* | Returns to center trail | Returns to center trail | Smooth ease-out curve. |
| **0.66 – 0.75** | Transit Corridor 2 | $(0.0, 1.8, Z_{\text{boy}} + 4.5)$ | $(0.0, 1.5, Z_{\text{boy}} - 3.5)$ | Slightly lower, intimate camera height. Intensified rain and graffiti wall reflections. |
| **0.75 – 0.77** | *Entering Pawn Shop* | Drops to low curb height | Targets salvage cages | Smooth ease-in curve. |
| **0.77 – 0.88** | **Debris Pawn** | $(+2.2, 1.3, Z_{\text{pawn}} + 1.5)$ | $(-4.8, 1.2, Z_{\text{pawn}} - 0.5)$ | **Camera drops low and pans Left (-45°)**. Street-curb angle inspecting robot junk, CRT screens, and hazard signs. |
| **0.88 – 0.91** | *Exiting Pawn Shop* | Glides to final approach | Glides to final approach | Smooth ease-out curve. |
| **0.91 – 1.00** | **Nova Motel** | $(-3.2, 1.1, Z_{\text{motel}} + 2.0)$ | $(+5.0, 5.8, Z_{\text{motel}} - 2.0)$ | **Camera sweeps Right (+45°) and tilts Upward (+25°)**. Spectacular low-angle hero shot of the towering vertical magenta sign. |

---

## 5. Post-Processing & Shader Specifications

```
[Three.js Scene] ──► [EffectComposer]
                           ├──► [UnrealBloomPass]       (Selective threshold glow)
                           ├──► [ChromaticAberration]   (Fringe distortion at edges)
                           ├──► [Vignette]              (Darkened screen perimeter)
                           └──► [Render Output to Screen]
```

### 5.1. Selective Unreal Bloom
- **Luminance Threshold:** `0.82` (Ensures only pure emissive neon tubes and thrusters glow, keeping the street and character clothing sharp).
- **Luminance Smoothing:** `0.25`
- **Bloom Intensity:** `1.85`
- **Bloom Radius:** `0.65`

### 5.2. Chromatic Aberration & Lens Distortion
- **Offset:** `Vector2(0.0018, 0.0018)`
- **Radial Falloff:** Zero distortion in center 60% of screen; subtle color fringing (red/cyan separation) around perimeter.

### 5.3. Film Grain & Vignette
- **Vignette Offset:** `0.3`
- **Vignette Darkness:** `0.7`
- **Film Grain:** Subtle animated film noise at `0.12` opacity to recreate a cinematic 35mm film feel.

---

## 6. 2D UI & Cyberpunk HUD Design

The UI sits on a top layer (`z-index: 20`) with `pointer-events: none` on the container, allowing interactive elements (buttons, sliders) to accept input with `pointer-events: auto`.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [SECTOR 07 // 34.0522°N]         [STREET RADAR]              [AUDIO: ON/OFF]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                                                                             │
│   ┌──────────────────────────┐                                              │
│   │ ◆ SPACESHIP CAFE         │                                              │
│   │ ──────────────────────── │                                              │
│   │ DOCKED FREIGHTER CAFE    │                                              │
│   │ SPECIALTY: PLASMA BREW   │                                              │
│   │ STATUS: OPEN // STN 01   │                                              │
│   └──────────────────────────┘                                              │
│                                                                             │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ [MILESTONE 01 / 04]  ───────────●──────────────────────  [SCROLL TO TRAVEL] │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.1. Typography
- **Display / Headers:** `Orbitron`, `sans-serif` (Bold, uppercase, letter-spacing: `0.15em`)
- **Mono / Data / Coordinates:** `JetBrains Mono` or `Share Tech Mono`, `monospace`
- **Body / Descriptions:** `Inter` or `Rajdhani`, `sans-serif`

### 6.2. HUD Components
1. **Header HUD Bar:**
   - Left: District ID (`SECTOR 07 // REPLICANT ALLEY`), blinking live status pill (`ONLINE`).
   - Center: Real-time Z-coordinate tracker (`Z: -034.2m`).
   - Right: Sound toggle button (animated equalizer bars when active, muted icon when off) and Scanlines toggle.
2. **Contextual Landmark Cards:**
   - Appears via sleek slide-in and neon border fade when camera transitions into a landmark zone.
   - Contains:
     - Landmark code & icon (e.g. `STN_01 // CAFE`).
     - Neon Title with glitch text effect on appear.
     - 2-sentence lore description and key architectural highlights.
     - "SECTOR CATALOG" tag.
3. **Bottom Progress Nav:**
   - Sleek horizontal neon track showing 4 landmark milestone pips (`Cafe`, `Star Store`, `Pawn`, `Nova Motel`).
   - Active pip lights up in the landmark's corresponding neon color.
   - Pulsing scroll prompt: `SCROLL TO EXPLORE ↓`.
4. **CRT Scanlines & Glitch Layer:**
   - Semi-transparent CSS scanlines running at 2px vertical rhythm.
   - Micro-glitch horizontal displacement on text when entering a new landmark.

