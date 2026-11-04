'use client';
import dynamic from 'next/dynamic';
import { useScrollController } from '@/hooks/useScrollController';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';
import { LANDMARKS } from '@/lib/constants';

// Dynamic import for WebGL Canvas with SSR disabled
const SceneCanvas = dynamic(
  () => import('@/components/3d/SceneCanvas').then((mod) => mod.SceneCanvas),
  { ssr: false }
);

export default function HomePage() {
  useScrollController();
  const { scrollProgress, scrollVelocity, activeLandmark, scanlinesEnabled } = useCyberpunkStore();

  const boyZ = (-scrollProgress * 160).toFixed(1);

  return (
    <main className="relative min-h-[500vh] bg-cyber-void">
      {/* 3D WebGL Canvas Layer */}
      <SceneCanvas />

      {/* Cyberpunk HUD Overlay Layer */}
      <div className="fixed inset-0 pointer-events-none flex flex-col justify-between p-6 z-10">
        {/* Header Telemetry */}
        <div className="flex justify-between items-center text-xs font-mono tracking-widest text-cyber-cyan border-b border-cyber-cyan/30 pb-3">
          <div className="flex items-center space-x-3">
            <span className="inline-block w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
            <span>SECTOR 07 // DISTRICT 04</span>
          </div>
          <div className="flex space-x-6">
            <span>VELOCITY: {Math.abs(scrollVelocity).toFixed(2)}</span>
            <span>BOY_Z: {boyZ}m</span>
            <span className="text-white font-bold">PROGRESS: {(scrollProgress * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* Center Active Landmark Announcement */}
        <div className="text-center font-orbitron transition-all duration-300">
          {activeLandmark !== 'NONE' ? (
            <div className="inline-block bg-cyber-panel border border-cyber-cyan/50 backdrop-blur-md px-6 py-4 rounded-lg shadow-neon-cyan">
              <span className="text-xs font-mono text-cyber-amber block tracking-widest mb-1">
                APPROACHING MILESTONE
              </span>
              <h2 className="text-2xl font-black text-white tracking-wider">
                {LANDMARKS[activeLandmark].name}
              </h2>
              <p className="text-xs font-mono text-gray-300 mt-1 max-w-md">
                {LANDMARKS[activeLandmark].description}
              </p>
            </div>
          ) : (
            <div className="text-xs font-mono text-gray-500 tracking-widest">
              TRANSIT CORRIDOR // SCROLL TO ADVANCE
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="text-xs font-mono text-gray-400 border-t border-gray-800 pt-3 flex justify-between items-center">
          <span>COORDINATES: 34.0522° N, 118.2437° W</span>
          <div className="flex space-x-4">
            <span className={activeLandmark === 'CAFE' ? 'text-cyber-amber font-bold' : ''}>[01 CAFE]</span>
            <span className={activeLandmark === 'STAR' ? 'text-cyber-violet font-bold' : ''}>[02 STAR]</span>
            <span className={activeLandmark === 'PAWN' ? 'text-cyber-green font-bold' : ''}>[03 PAWN]</span>
            <span className={activeLandmark === 'MOTEL' ? 'text-cyber-magenta font-bold' : ''}>[04 MOTEL]</span>
          </div>
          <span className="text-cyber-amber animate-pulse">SCROLL TO COMMUTE ↓</span>
        </div>
      </div>

      {/* CRT Scanline Overlay */}
      {scanlinesEnabled && (
        <div className="fixed inset-0 pointer-events-none scanlines z-30 opacity-60" />
      )}
    </main>
  );
}
