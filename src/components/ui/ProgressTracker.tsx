'use client';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';
import { LANDMARKS } from '@/lib/constants';

interface MilestoneSpec {
  id: 'CAFE' | 'STAR' | 'PAWN' | 'MOTEL';
  label: string;
  name: string;
  targetT: number;
  color: string;
}

const MILESTONES: MilestoneSpec[] = [
  { id: 'CAFE', label: '01', name: 'CAFE', targetT: 0.24, color: LANDMARKS.CAFE.accentColor },
  { id: 'STAR', label: '02', name: 'STAR', targetT: 0.55, color: LANDMARKS.STAR.accentColor },
  { id: 'PAWN', label: '03', name: 'PAWN', targetT: 0.82, color: LANDMARKS.PAWN.accentColor },
  { id: 'MOTEL', label: '04', name: 'MOTEL', targetT: 0.96, color: LANDMARKS.MOTEL.accentColor },
];

export function ProgressTracker() {
  const scrollProgress = useCyberpunkStore((s) => s.scrollProgress);
  const activeLandmark = useCyberpunkStore((s) => s.activeLandmark);

  const scrollToMilestone = (targetT: number) => {
    if (typeof window === 'undefined') return;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const targetY = targetT * maxScroll;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <footer className="w-full flex flex-col space-y-2 pointer-events-auto">
      {/* 1. Neon Progress Bar Track */}
      <div className="relative w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
        <div
          className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-gold to-cyber-rose transition-all duration-150"
          style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
        />
      </div>

      {/* 2. Interactive Navigation Pips & Telemetry */}
      <div className="flex justify-between items-center text-xs font-mono tracking-widest text-gray-400 bg-cyber-panel/60 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-800">
        {/* District Geo-Coordinates */}
        <span className="hidden sm:inline text-gray-400 text-[10px]">
          GPS: <span className="text-gray-200">35.6595° N, 139.7004° E</span>
        </span>

        {/* 4 Clickable Landmark Milestone Buttons */}
        <div className="flex space-x-2">
          {MILESTONES.map((m) => {
            const isActive = activeLandmark === m.id;
            return (
              <button
                key={m.id}
                onClick={() => scrollToMilestone(m.targetT)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border ${
                  isActive
                    ? 'border-current text-white shadow-lg'
                    : 'border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
                }`}
                style={
                  isActive
                    ? {
                        color: m.color,
                        borderColor: m.color,
                        backgroundColor: `${m.color}20`,
                        boxShadow: `0 0 10px ${m.color}50`,
                      }
                    : {}
                }
              >
                [{m.label} {m.name}]
              </button>
            );
          })}
        </div>

        {/* Scroll Prompt */}
        <span className="text-cyber-amber animate-pulse text-[11px] font-bold">
          SCROLL TO COMMUTE ↓
        </span>
      </div>
    </footer>
  );
}

