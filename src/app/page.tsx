'use client';
import dynamic from 'next/dynamic';
import { useScrollController } from '@/hooks/useScrollController';
import { useCyberpunkAudio } from '@/hooks/useCyberpunkAudio';
import { CyberpunkHUD } from '@/components/ui/CyberpunkHUD';

// Dynamic import for WebGL Canvas with SSR disabled
const SceneCanvas = dynamic(
  () => import('@/components/3d/SceneCanvas').then((mod) => mod.SceneCanvas),
  { ssr: false }
);

export default function HomePage() {
  useScrollController();
  useCyberpunkAudio();

  return (
    <main className="relative min-h-[500vh] bg-cyber-void">
      {/* 3D WebGL Canvas Layer */}
      <SceneCanvas />

      {/* Cyberpunk HUD & Audio Layer */}
      <CyberpunkHUD />
    </main>
  );
}
