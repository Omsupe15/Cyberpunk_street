'use client';
import * as THREE from 'three';

// Cache generated textures so they are created once and reused efficiently
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Procedural Wet Asphalt Texture with aggregate noise and lane wear
 */
export function getAsphaltTexture(): THREE.CanvasTexture {
  const key = 'asphalt_road';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Base dark wet asphalt tone
    ctx.fillStyle = '#181b22';
    ctx.fillRect(0, 0, 1024, 1024);

    // Fine aggregate noise
    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 22;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise + 2)); // slight cool blue tint
    }
    ctx.putImageData(imgData, 0, 0);

    // Subtle tire wear lanes (darker, smoother strips)
    ctx.fillStyle = 'rgba(12, 14, 18, 0.4)';
    ctx.fillRect(200, 0, 160, 1024);
    ctx.fillRect(664, 0, 160, 1024);

    // Subtle asphalt seam cracks
    ctx.strokeStyle = 'rgba(8, 10, 14, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(512, 0);
    ctx.lineTo(512, 1024);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 24);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Concrete Sidewalk Paving Slabs Texture
 */
export function getSidewalkTexture(): THREE.CanvasTexture {
  const key = 'sidewalk_paving';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#222630';
    ctx.fillRect(0, 0, 512, 512);

    // Grain
    const imgData = ctx.getImageData(0, 0, 512, 512);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 16;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise + 3));
    }
    ctx.putImageData(imgData, 0, 0);

    // Paving slab grid joints
    ctx.strokeStyle = '#12141a';
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
  texture.repeat.set(3, 40);
  textureCache.set(key, texture);
  return texture;
}

/**
 * Realistic Skyscraper Office Window Matrix with randomized illuminated rooms
 */
export function getSkyscraperFacadeTexture(seed = 1): THREE.CanvasTexture {
  const key = `facade_${seed}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Structural curtain wall panels (dark obsidian/gunmetal)
    ctx.fillStyle = '#10131b';
    ctx.fillRect(0, 0, 512, 1024);

    const cols = 12;
    const rows = 32;
    const padX = 8;
    const padY = 6;
    const cellW = (512 - padX * (cols + 1)) / cols;
    const cellH = (1024 - padY * (rows + 1)) / rows;

    for (let r = 0; r < rows; r++) {
      // Spandrel beam horizontal line
      ctx.fillStyle = '#0a0c12';
      ctx.fillRect(0, r * (cellH + padY), 512, padY);

      for (let c = 0; c < cols; c++) {
        const x = padX + c * (cellW + padX);
        const y = padY + r * (cellH + padY);

        // Window frame
        ctx.fillStyle = '#080a0f';
        ctx.fillRect(x - 1, y - 1, cellW + 2, cellH + 2);

        // Deterministic room lighting based on coordinates and seed
        const hash = Math.sin(r * 43.1 + c * 17.7 + seed * 91.3) * 10000;
        const rand = hash - Math.floor(hash);

        if (rand > 0.52) {
          // Lit office room
          if (rand > 0.88) {
            ctx.fillStyle = '#d8f0ff'; // Cool corporate daylight LED
          } else if (rand > 0.74) {
            ctx.fillStyle = '#ffdfa0'; // Warm late-night desk lamp
          } else if (rand > 0.62) {
            ctx.fillStyle = '#00f3ff'; // Cyber cyan lab terminal
          } else {
            ctx.fillStyle = '#ff66aa'; // Neon purple/magenta penthouse accent
          }
          ctx.fillRect(x, y, cellW, cellH);

          // Horizontal window blinds shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
          for (let b = 4; b < cellH; b += 4) {
            ctx.fillRect(x, y + b, cellW, 1.2);
          }
        } else {
          // Dark unlit office reflecting night sky
          ctx.fillStyle = '#121622';
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
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#222521';
    ctx.fillRect(0, 0, 256, 256);

    // Vertical corrugated ridges
    for (let x = 0; x < 256; x += 16) {
      const grad = ctx.createLinearGradient(x, 0, x + 16, 0);
      grad.addColorStop(0, '#161915');
      grad.addColorStop(0.5, '#353a33');
      grad.addColorStop(1, '#161915');
      ctx.fillStyle = grad;
      ctx.fillRect(x, 0, 16, 256);
    }

    // Rust oxidation spots
    ctx.fillStyle = 'rgba(90, 45, 20, 0.35)';
    for (let i = 0; i < 20; i++) {
      const rx = Math.random() * 256;
      const ry = Math.random() * 256;
      ctx.beginPath();
      ctx.arc(rx, ry, 6 + Math.random() * 12, 0, Math.PI * 2);
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
 * Green Phosphor CRT Terminal Scanline Screen
 */
export function getCrtTerminalTexture(type: 'green' | 'amber' = 'green'): THREE.CanvasTexture {
  const key = `crt_${type}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Screen background
    ctx.fillStyle = type === 'green' ? '#04140a' : '#140c04';
    ctx.fillRect(0, 0, 256, 256);

    // Phosphor text lines
    ctx.fillStyle = type === 'green' ? '#05ffa1' : '#ffaa00';
    ctx.font = 'bold 11px monospace';

    const lines =
      type === 'green'
        ? [
            'SYS_BOOT v9.42 [OK]',
            'MEM_ALLOC: 0x8F9C4',
            'CYBER_NEURAL: ONLINE',
            'SEC_LVL: BLACK_MARKET',
            '>> DEBRIS RECOVERY',
            'SCANNING CHIPS... 98%',
            'DATA: 104.2 TB LINKED',
            'WARNING: TRACE DETECTED',
            'KERNEL_PANIC: NONE',
            'ADDR: 00:1A:79:B4:EF',
          ]
        : [
            'BIOS ERROR: 0x992B',
            'FUSION CELL #4: CHARGING',
            'VOLT: 1.21 GW [STANDBY]',
            'TEMP: 450 K [OPTIMAL]',
            'CRYPTO KEY REJECTED',
            'OVERRIDE: ENGAGED',
            'CIRCUIT TEST: PASS',
            'PAWN VALUATION: $8,450',
            'NO REFUNDS / ALL SALES',
            'TERMINAL: 04-SECTOR-7',
          ];

    lines.forEach((line, idx) => {
      ctx.fillText(line, 14, 28 + idx * 22);
    });

    // Horizontal scanline overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    for (let y = 0; y < 256; y += 3) {
      ctx.fillRect(0, y, 256, 1.2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  textureCache.set(key, texture);
  return texture;
}

