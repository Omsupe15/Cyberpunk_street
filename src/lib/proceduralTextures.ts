'use client';
import * as THREE from 'three';

// Cache generated textures so they are created once and reused efficiently
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Procedural 14m 4-Lane Grand Boulevard Asphalt Texture
 * Features double yellow centerline, dashed white lane lines, and road wear
 */
export function getAsphaltTexture(): THREE.CanvasTexture {
  const key = 'asphalt_road_14m';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Base dark wet slate asphalt
    ctx.fillStyle = '#1c202a';
    ctx.fillRect(0, 0, 1024, 1024);

    // Fine asphalt aggregate noise
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 18;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise + 2));
    }
    ctx.putImageData(imgData, 0, 0);

    // 4 Traffic Lane Tire Wear Strips (Subtle dark sheen)
    ctx.fillStyle = 'rgba(12, 14, 20, 0.4)';
    ctx.fillRect(110, 0, 140, 1024); // Lane 1
    ctx.fillRect(330, 0, 140, 1024); // Lane 2
    ctx.fillRect(554, 0, 140, 1024); // Lane 3
    ctx.fillRect(774, 0, 140, 1024); // Lane 4

    // Center Double Solid Yellow Median Lines
    ctx.strokeStyle = '#FFAA00';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(506, 0);
    ctx.lineTo(506, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(518, 0);
    ctx.lineTo(518, 1024);
    ctx.stroke();

    // Dashed White Lane Divider Lines (Lanes 1-2 and Lanes 3-4)
    ctx.strokeStyle = '#e2f0ff';
    ctx.lineWidth = 4;
    ctx.setLineDash([48, 48]);

    ctx.beginPath();
    ctx.moveTo(256, 0);
    ctx.lineTo(256, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(768, 0);
    ctx.lineTo(768, 1024);
    ctx.stroke();

    // Solid White Outer Curb Shoulder Lines
    ctx.setLineDash([]);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(32, 0);
    ctx.lineTo(32, 1024);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(992, 0);
    ctx.lineTo(992, 1024);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 24);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Concrete Sidewalk Paving Slabs Texture
 */
export function getSidewalkTexture(): THREE.CanvasTexture {
  const key = 'sidewalk_paving_4_5m';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#222632';
    ctx.fillRect(0, 0, 512, 512);

    // Grain
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 16;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise + 2));
    }
    ctx.putImageData(imgData, 0, 0);

    // Paving slab grid joints
    ctx.strokeStyle = '#10131a';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, 256, 256);
    ctx.strokeRect(256, 0, 256, 256);
    ctx.strokeRect(0, 256, 256, 256);
    ctx.strokeRect(256, 256, 256, 256);

    // Bevel highlights on paving joints
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, 252, 252);
    ctx.strokeRect(258, 2, 252, 252);
    ctx.strokeRect(2, 258, 252, 252);
    ctx.strokeRect(258, 258, 252, 252);
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
 */
export function getSkyscraperFacadeTexture(typeIndex = 0): THREE.CanvasTexture {
  const key = `facade_archetype_${typeIndex}`;
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
    // Structural curtain wall (dark graphite / obsidian)
    ctx.fillStyle = '#0c0f18';
    ctx.fillRect(0, 0, 1024, 2048);

    // Prominent Crown Marquee Signboard on Top Floors
    ctx.fillStyle = '#080a12';
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

    // Office Window Matrix across 40 floors
    const cols = 16;
    const rows = 40;
    const startY = 240;
    const padX = 12;
    const padY = 8;
    const cellW = (1024 - padX * (cols + 1)) / cols;
    const cellH = (2048 - startY - padY * (rows + 1)) / rows;

    for (let r = 0; r < rows; r++) {
      // Horizontal structural spandrel beam
      ctx.fillStyle = '#060810';
      ctx.fillRect(0, startY + r * (cellH + padY), 1024, padY);

      // Aluminum spandrel highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, startY + r * (cellH + padY) + 1, 1024, 1.5);

      for (let c = 0; c < cols; c++) {
        const x = padX + c * (cellW + padX);
        const y = startY + padY + r * (cellH + padY);

        ctx.fillStyle = '#04060a';
        ctx.fillRect(x - 1, y - 1, cellW + 2, cellH + 2);

        // Deterministic room lighting pattern
        const hash = Math.sin(r * 47.3 + c * 19.1 + typeIndex * 89.7) * 10000;
        const rand = hash - Math.floor(hash);

        if (rand > 0.44) {
          if (rand > 0.88) {
            ctx.fillStyle = '#e6f4ff'; // Cool corporate LED
          } else if (rand > 0.70) {
            ctx.fillStyle = '#ffdba0'; // Warm late-night desk lamp
          } else if (rand > 0.58) {
            ctx.fillStyle = '#00f3ff'; // Cyber cyan lab terminal
          } else {
            ctx.fillStyle = '#ff60aa'; // Neon magenta accent
          }
          ctx.fillRect(x, y, cellW, cellH);

          // Horizontal window blinds
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          for (let b = 5; b < cellH; b += 5) {
            ctx.fillRect(x, y + b, cellW, 1.5);
          }
        } else {
          ctx.fillStyle = '#0d111c';
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
 * Corrugated Rusted Industrial Metal Siding
 */
export function getCorrugatedMetalTexture(): THREE.CanvasTexture {
  const key = 'corrugated_metal';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#1c1f1b';
    ctx.fillRect(0, 0, 512, 512);

    for (let x = 0; x < 512; x += 32) {
      const grad = ctx.createLinearGradient(x, 0, x + 32, 0);
      grad.addColorStop(0, '#111410');
      grad.addColorStop(0.5, '#30352e');
      grad.addColorStop(1, '#111410');
      ctx.fillStyle = grad;
      ctx.fillRect(x, 0, 32, 512);
    }

    ctx.fillStyle = 'rgba(85, 42, 18, 0.4)';
    for (let i = 0; i < 30; i++) {
      const rx = Math.random() * 512;
      const ry = Math.random() * 512;
      ctx.beginPath();
      ctx.arc(rx, ry, 8 + Math.random() * 16, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 2);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Green/Amber Phosphor CRT Terminal Scanline Screen (English System Telemetry)
 */
export function getCrtTerminalTexture(type: 'green' | 'amber' = 'green'): THREE.CanvasTexture {
  const key = `crt_en_${type}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = type === 'green' ? '#031008' : '#120a03';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = type === 'green' ? '#05ffa1' : '#ffaa00';
    ctx.font = 'bold 20px monospace';

    const lines =
      type === 'green'
        ? [
            'SYSTEM BOOT v9.42 [ONLINE]',
            'MEMORY ALLOC: 0x8F9C4 [OK]',
            'CYBER-NEURAL LINK: ESTABLISHED',
            'SECURITY: BLACK MARKET ACTIVE',
            '>> DEBRIS RECOVERY IN PROGRESS',
            'SCANNING MICRO-CHIPS: 98.4%',
            'DATA LINKED: 104.2 TB BUFFER',
            'WARNING: TRACE DETECTED',
            'KERNEL INTEGRITY: VERIFIED',
            'MAC ADDR: 00:1A:79:B4:EF',
          ]
        : [
            'BIOS DIAGNOSTIC: ERROR 0x992B',
            'FUSION CELL #4: CHARGING 94%',
            'VOLTAGE: 1.21 GW [STANDBY]',
            'CORE TEMP: 450 K [OPTIMAL]',
            'ENCRYPTION KEY: OVERRIDDEN',
            'CIRCUIT DIAGNOSTIC: PASS',
            'PAWN VALUATION: $8,450.00',
            'ALL SALES FINAL // NO REFUNDS',
            'TERMINAL ID: SECTOR-07-MAIN',
            'NETWORK: DEBRIS NET ACTIVE',
          ];

    lines.forEach((line, idx) => {
      ctx.fillText(line, 24, 48 + idx * 42);
    });

    // Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
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
 */
export function getNeonBladeSignTexture(
  englishText: string,
  asianSubText: string,
  neonColor: string,
  accentColor = '#ffffff'
): THREE.CanvasTexture {
  const key = `blade_sign_${englishText}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Dark metal housing
    ctx.fillStyle = '#060810';
    ctx.fillRect(0, 0, 256, 512);

    // Glowing outer neon border
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(12, 12, 232, 488);

    // Inner accent line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, 216, 472);

    // English Headline (Bold Vertical Stack or Large Text)
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

    // Asian Subtitle (Authentic Shanghai / Neo-Tokyo atmospheric accent)
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
  const key = `marquee_${englishTitle}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Dark metallic chassis
    ctx.fillStyle = '#080a12';
    ctx.fillRect(0, 0, 1024, 256);

    // Outer glowing neon border
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 1004, 236);

    // Inner subtle border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
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
  const key = `vert_sign_${englishWords.join('_')}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#0a0812';
    ctx.fillRect(0, 0, 256, 1024);

    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 236, 1004);

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
