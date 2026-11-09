'use client';
import * as THREE from 'three';

// Cache generated textures so they are created once and reused efficiently
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Procedural 14m 4-Lane Grand Boulevard Dry Matte Asphalt Texture
 * Features rich visible slate-charcoal asphalt (#242838), dry aggregate grain, subtle tire wear,
 * double amber centerline, dashed white dividers, cyber lane stencils (MAX 50, arrows, 専),
 * and tarmac sealant seams. Completely dry matte finish with no water puddles.
 */
export function getAsphaltTexture(): THREE.CanvasTexture {
  const key = 'asphalt_road_dry_slate_14m';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Base dry matte slate asphalt (Lifted out of void darkness)
    ctx.fillStyle = '#242838';
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. High-frequency dry asphalt aggregate noise
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 16;
      data[i] = Math.min(255, Math.max(0, data[i] + noise + 6));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise + 8));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise + 12));
    }
    ctx.putImageData(imgData, 0, 0);

    // 3. Smooth dry worn tire tracks in each of the 4 lanes (soft matte wear)
    ctx.fillStyle = 'rgba(26, 30, 42, 0.40)';
    ctx.fillRect(95, 0, 70, 1024);   // Lane 1 Left Track
    ctx.fillRect(195, 0, 70, 1024);  // Lane 1 Right Track
    ctx.fillRect(315, 0, 70, 1024);  // Lane 2 Left Track
    ctx.fillRect(415, 0, 70, 1024);  // Lane 2 Right Track
    ctx.fillRect(540, 0, 70, 1024);  // Lane 3 Left Track
    ctx.fillRect(640, 0, 70, 1024);  // Lane 3 Right Track
    ctx.fillRect(760, 0, 70, 1024);  // Lane 4 Left Track
    ctx.fillRect(860, 0, 70, 1024);  // Lane 4 Right Track

    // 4. Dry tarmac sealant cracks / tar repair seams (no pure black)
    ctx.strokeStyle = '#1c202e';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(120, 120);
    ctx.bezierCurveTo(180, 160, 240, 140, 310, 210);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(680, 520);
    ctx.bezierCurveTo(720, 580, 780, 560, 840, 620);
    ctx.stroke();

    // 5. Center Double Solid Amber Thermoplastic Median Lines
    ctx.shadowColor = 'rgba(245, 158, 11, 0.35)';
    ctx.shadowBlur = 8;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(507, 0);
    ctx.lineTo(507, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(517, 0);
    ctx.lineTo(517, 1024);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 6. Dashed Off-White Lane Dividers (Lanes 1-2 & Lanes 3-4)
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.85)';
    ctx.lineWidth = 5;
    ctx.setLineDash([54, 42]);

    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(768, 0);
    ctx.lineTo(768, 1024);
    ctx.stroke();

    // 7. Solid Neon Cyan Outer Shoulder Edge Lines
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.75)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.lineTo(32, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(992, 0);
    ctx.lineTo(992, 1024);
    ctx.stroke();

    // 8. Cyber Road Stencils & Directional Markings
    ctx.fillStyle = 'rgba(226, 232, 240, 0.72)';
    ctx.font = '900 28px monospace';
    ctx.textAlign = 'center';

    // Speed limit stencils in Lane 2 and Lane 3
    ctx.fillText('MAX 50', 380, 220);
    ctx.fillText('MAX 50', 644, 760);

    // Japanese Cyber Transit Stencil in Lane 1 (Leftmost Transit Lane)
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = 'rgba(0, 240, 255, 0.75)';
    ctx.fillText('専 // BUS', 145, 480);

    // Directional sci-fi chevron lane arrows in Lane 2 and Lane 4
    const drawChevronArrow = (cx: number, cy: number) => {
      ctx.save();
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.8)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      // Arrow shaft
      ctx.moveTo(cx, cy + 30);
      ctx.lineTo(cx, cy - 20);
      // Chevron head
      ctx.lineTo(cx - 16, cy - 6);
      ctx.moveTo(cx, cy - 20);
      ctx.lineTo(cx + 16, cy - 6);
      ctx.stroke();
      ctx.restore();
    };

    drawChevronArrow(380, 680);
    drawChevronArrow(890, 320);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 24);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Deep Charcoal Concrete Sidewalk Paving Slabs Texture
 * Features dark granite pavers with beveled joints and subtle rain sheen
 */
export function getSidewalkTexture(): THREE.CanvasTexture {
  const key = 'sidewalk_paving_slate_4_5m';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Industrial Slate Paving base (Clearly separates from road with matte finish)
    ctx.fillStyle = '#2d3346';
    ctx.fillRect(0, 0, 512, 512);

    // 2. Micro-stone mineral grain
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 16;
      data[i] = Math.min(255, Math.max(0, data[i] + noise + 10));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise + 11));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise + 16));
    }
    ctx.putImageData(imgData, 0, 0);

    // 3. Paving slab grid joints (Recessed slate seams, no obsidian)
    ctx.strokeStyle = '#1f2434';
    ctx.lineWidth = 4;
    ctx.strokeRect(0, 0, 256, 256);
    ctx.strokeRect(256, 0, 256, 256);
    ctx.strokeRect(0, 256, 256, 256);
    ctx.strokeRect(256, 256, 256, 256);

    // 4. Chamfered edge highlights with matte stone tone
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(3, 3, 250, 250);
    ctx.strokeRect(259, 3, 250, 250);
    ctx.strokeRect(3, 259, 250, 250);
    ctx.strokeRect(259, 259, 250, 250);

    // Tactile blind-guidance dots on one quadrant
    ctx.fillStyle = 'rgba(245, 158, 11, 0.28)';
    for (let bx = 280; bx < 490; bx += 32) {
      for (let by = 280; by < 490; by += 32) {
        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 36);
  textureCache.set(key, texture);
  return texture;
}

/**
 * High-Definition Skyscraper Facade Texture with English Header & Lit Office Windows
 * Matte titanium curtain walls with high-contrast office grids
 */
export function getSkyscraperFacadeTexture(typeIndex = 0): THREE.CanvasTexture {
  const key = `facade_archetype_matte_${typeIndex}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  const headers = [
    { eng: 'NEO SHANGHAI FINANCIAL', sub: '新上海金融 // HQ 01', color: '#00F3FF' },
    { eng: 'VEGAS HORIZON RESORT', sub: 'CASINO & HOTEL // 娯楽', color: '#FFAA00' },
    { eng: 'ORBITAL RECHARGE CORP', sub: 'STATION 07 // 軌道', color: '#05FFA1' },
    { eng: 'QUANTUM DYNAMICS INC', sub: 'NEURAL LABS // 量子', color: '#FF0055' },
    { eng: 'ASTRA LUXURY TOWER', sub: 'PENTHOUSE RESIDENCES', color: '#8A2BE2' },
  ];

  const headerInfo = headers[typeIndex % headers.length];

  if (ctx) {
    // 1. Matte titanium slate curtain wall (Clear visibility against sky)
    ctx.fillStyle = '#202538';
    ctx.fillRect(0, 0, 1024, 2048);

    // 2. Crown Marquee Signboard on Top Floors
    ctx.fillStyle = '#252c3e';
    ctx.fillRect(60, 40, 904, 160);
    ctx.strokeStyle = headerInfo.color;
    ctx.lineWidth = 6;
    ctx.strokeRect(60, 40, 904, 160);

    // English Corporate Marquee Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(headerInfo.eng, 512, 115);

    // Asian Subtext
    ctx.fillStyle = headerInfo.color;
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(headerInfo.sub, 512, 165);

    // Front facade vertical accent neon light strips on building edges
    ctx.fillStyle = headerInfo.color;
    ctx.fillRect(16, 220, 8, 1800);
    ctx.fillRect(1000, 220, 8, 1800);

    // Office Window Matrix across 42 floors
    const cols = 18;
    const rows = 42;
    const startY = 230;
    const padX = 10;
    const padY = 7;
    const cellW = (1024 - padX * (cols + 1)) / cols;
    const cellH = (2048 - startY - padY * (rows + 1)) / rows;

    for (let r = 0; r < rows; r++) {
      // Horizontal structural spandrel beam (Matte steel)
      ctx.fillStyle = '#283042';
      ctx.fillRect(0, startY + r * (cellH + padY), 1024, padY);

      // Subtle illuminated spandrel hairline
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, startY + r * (cellH + padY) + 1, 1024, 1.5);

      for (let c = 0; c < cols; c++) {
        const x = padX + c * (cellW + padX);
        const y = startY + padY + r * (cellH + padY);

        // Window frame
        ctx.fillStyle = '#1e2434';
        ctx.fillRect(x - 1, y - 1, cellW + 2, cellH + 2);

        // Deterministic room lighting pattern (~65% lit windows for realistic night skyline)
        const hash = Math.sin(r * 47.3 + c * 19.1 + typeIndex * 89.7) * 10000;
        const rand = hash - Math.floor(hash);

        if (rand > 0.35) {
          if (rand > 0.88) {
            ctx.fillStyle = '#ffffff'; // Pure brilliant white LED office
          } else if (rand > 0.70) {
            ctx.fillStyle = '#00F3FF'; // Electric cyan terminal room
          } else if (rand > 0.52) {
            ctx.fillStyle = '#ffb347'; // Warm golden amber interior
          } else if (rand > 0.42) {
            ctx.fillStyle = '#38bdf8'; // Soft sky blue window
          } else {
            ctx.fillStyle = '#c084fc'; // Violet holographic office
          }
          ctx.fillRect(x, y, cellW, cellH);

          // Horizontal window blinds / louvers
          ctx.fillStyle = 'rgba(26, 32, 48, 0.45)';
          for (let b = 4; b < cellH; b += 4) {
            ctx.fillRect(x, y + b, cellW, 1.2);
          }
        } else {
          // Unlit dark window with faint ambient slate reflection
          ctx.fillStyle = '#202636';
          ctx.fillRect(x, y, cellW, cellH);
        }
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  textureCache.set(key, texture);
  return texture;
}

/**
 * Weathered Industrial Corrugated Metal Texture for Debris Pawn Shutter
 * Features rusted ribbed iron, oxidized patina, and industrial stencils
 */
export function getCorrugatedMetalTexture(): THREE.CanvasTexture {
  const key = 'corrugated_metal_matte';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // 1. Weathered rusted iron base (Matte warm iron)
    ctx.fillStyle = '#4a3d34';
    ctx.fillRect(0, 0, 512, 512);

    // 2. Corrugated horizontal ribs
    for (let y = 0; y < 512; y += 24) {
      const grad = ctx.createLinearGradient(0, y, 0, y + 24);
      grad.addColorStop(0, '#3d322a');
      grad.addColorStop(0.3, '#5c4c3e');
      grad.addColorStop(0.6, '#6b5949');
      grad.addColorStop(1, '#3d322a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, y, 512, 24);
    }

    // 3. Rust spots & oxidized patina patches
    ctx.fillStyle = 'rgba(180, 80, 30, 0.35)';
    for (let i = 0; i < 40; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctx.beginPath();
      ctx.arc(rx, ry, 8 + Math.random() * 18, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Stenciled industrial warning markings on shutter
    ctx.fillStyle = 'rgba(234, 179, 8, 0.55)';
    ctx.font = '900 24px monospace';
    ctx.fillText('SECTOR 07 // RESTRICTED ACCESS', 30, 260);
    ctx.fillText('WARNING: AUTOMATED DEFENSES ACTIVE', 30, 300);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 4);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Green/Amber Phosphor CRT Terminal Scanline Screen (Authentic terminal graphics)
 */
export function getCrtTerminalTexture(type: 'green' | 'amber' = 'green'): THREE.CanvasTexture {
  const key = `crt_terminal_matte_${type}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // CRT glass interior (Lighter phosphor tint instead of black void)
    ctx.fillStyle = type === 'green' ? '#102618' : '#24180c';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = type === 'green' ? '#05ffa1' : '#ffaa00';
    ctx.font = 'bold 20px monospace';

    const lines =
      type === 'green'
        ? [
            'SECTOR-07 RECOVERY v9.42 [ONLINE]',
            'MEMORY ALLOC: 0x8F9C4 [OK]',
            'CYBER-NEURAL LINK: ESTABLISHED',
            'SECURITY: BLACK MARKET SALVAGE',
            '>> DEBRIS INVENTORY RECOVERED:',
            '- 4x ANDROID TORSO CHASSIS',
            '- 8x OPTIC OCULAR SENSORS',
            '- 2x FUSION CANISTERS 98%',
            'DATA BUFFER: 104.2 TB BUFFER',
            'STATUS: HARVESTING IN PROGRESS...',
          ]
        : [
            'BIOS DIAGNOSTIC: WARNING 0x992B',
            'FUSION CELL #4: CHARGING 94%',
            'OUTPUT: 1.21 GW [SURGE DETECTED]',
            'CORE TEMP: 450 K [WARNING]',
            'ENCRYPTION KEY: OVERRIDDEN',
            'CIRCUIT DIAGNOSTIC: PASS',
            'PAWN VALUATION: $8,450.00 CR',
            'ALL SALES FINAL // NO REFUNDS',
            'TERMINAL ID: SECTOR-07-MAIN',
            'NETWORK: UNDERGROUND SALVAGE NET',
          ];

    lines.forEach((line, idx) => {
      ctx.fillText(line, 24, 48 + idx * 42);
    });

    // Subtle CRT Scanlines (Softened contrast, no dark black lines)
    ctx.fillStyle = 'rgba(18, 28, 22, 0.40)';
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 512, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Perpendicular Street Neon Blade Sign Texture with English Headline + Asian Subtitle
 * Matte chassis with vibrant glowing neon typography
 */
export function getNeonBladeSignTexture(
  englishText: string,
  asianSubText: string,
  neonColor: string,
  accentColor = '#ffffff'
): THREE.CanvasTexture {
  const key = `blade_sign_matte_${englishText}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Matte dark slate chassis (Clearly visible against buildings)
    ctx.fillStyle = '#222738';
    ctx.fillRect(0, 0, 256, 512);

    // Glowing outer neon border
    ctx.shadowColor = neonColor;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, 232, 488);
    ctx.shadowBlur = 0;

    // Inner subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, 216, 472);

    // English Headline
    ctx.fillStyle = neonColor;
    ctx.textAlign = 'center';

    const words = englishText.split(' ');
    if (words.length > 1) {
      ctx.font = '900 36px sans-serif';
      words.forEach((word, wIdx) => {
        ctx.fillText(word, 128, 120 + wIdx * 54);
      });
    } else {
      ctx.font = '900 42px sans-serif';
      ctx.fillText(englishText, 128, 180);
    }

    // Horizontal Divider
    ctx.fillStyle = accentColor;
    ctx.fillRect(48, 290, 160, 4);

    // Asian Subtitle
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(asianSubText, 128, 360);

    // 24/7 Neon Badge
    ctx.fillStyle = '#FFAA00';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('OPEN 24H', 128, 440);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Horizontal Landmark Marquee Signboard Texture with English Title & Asian Subtext
 */
export function getHorizontalMarqueeTexture(
  englishTitle: string,
  subTitle: string,
  primaryColor: string,
  accentColor = '#ffffff'
): THREE.CanvasTexture {
  const key = `marquee_matte_${englishTitle}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Matte slate metallic chassis
    ctx.fillStyle = '#252c3e';
    ctx.fillRect(0, 0, 1024, 256);

    // Outer glowing neon border
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 14;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 1004, 236);
    ctx.shadowBlur = 0;

    // Inner subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, 988, 220);

    // Prominent English Headline
    ctx.fillStyle = accentColor;
    ctx.textAlign = 'center';
    ctx.font = '900 48px sans-serif';
    ctx.fillText(englishTitle, 512, 95);

    // Accent line divider
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(140, 126);
    ctx.lineTo(884, 126);
    ctx.stroke();

    // Asian atmospheric subtext
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(subTitle, 512, 190);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Vertical Landmark Neon Tower Signboard Texture with English Headline & Asian Subtext
 */
export function getVerticalSignTexture(
  englishWords: string[],
  subTitle: string,
  primaryColor: string,
  accentColor = '#ffffff'
): THREE.CanvasTexture {
  const key = `vert_sign_matte_${englishWords.join('_')}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Matte structural steel backplate
    ctx.fillStyle = '#222738';
    ctx.fillRect(0, 0, 256, 1024);

    // Glowing neon border
    ctx.shadowColor = primaryColor;
    ctx.shadowBlur = 16;
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 236, 1004);
    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(18, 18, 220, 988);

    ctx.fillStyle = accentColor;
    ctx.textAlign = 'center';
    ctx.font = '900 46px sans-serif';

    let y = 80;
    for (const word of englishWords) {
      for (const char of word) {
        ctx.fillText(char, 128, y);
        y += 46;
      }
      y += 24;
    }

    // Asian Subtext
    ctx.fillStyle = primaryColor;
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(subTitle, 128, 960);
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}
