'use client';
import { HeaderStatus } from './HeaderStatus';
import { LandmarkCard } from './LandmarkCard';
import { ProgressTracker } from './ProgressTracker';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';

export function CyberpunkHUD() {
  const scanlinesEnabled = useCyberpunkStore((s) => s.scanlinesEnabled);

  return (
    <>
      {/* 1. Master HUD Layer (pointer-events-none with interactive children) */}
      <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-4 sm:p-6 z-20">
        {/* Top Header */}
        <HeaderStatus />

        {/* Center Contextual Landmark Hologram */}
        <LandmarkCard />

        {/* Bottom Interactive Progress Navigation */}
        <ProgressTracker />
      </div>

      {/* 2. CRT Scanlines & Screen Texture */}
      {scanlinesEnabled && (
        <div className="fixed inset-0 pointer-events-none scanlines z-30 opacity-60" />
      )}
    </>
  );
}

