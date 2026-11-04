import { create } from 'zustand';
import { LANDMARKS } from '@/lib/constants';

export type LandmarkId = 'NONE' | 'CAFE' | 'STAR' | 'PAWN' | 'MOTEL';

interface CyberpunkState {
  scrollProgress: number; // 0.0 to 1.0
  scrollVelocity: number;
  activeLandmark: LandmarkId;
  isAudioMuted: boolean;
  scanlinesEnabled: boolean;

  setScrollProgress: (progress: number) => void;
  setScrollVelocity: (velocity: number) => void;
  toggleAudio: () => void;
  toggleScanlines: () => void;
}

export const useCyberpunkStore = create<CyberpunkState>((set) => ({
  scrollProgress: 0,
  scrollVelocity: 0,
  activeLandmark: 'NONE',
  isAudioMuted: true,
  scanlinesEnabled: true,

  setScrollProgress: (scrollProgress) => {
    let activeLandmark: LandmarkId = 'NONE';
    if (scrollProgress >= LANDMARKS.CAFE.range[0] && scrollProgress <= LANDMARKS.CAFE.range[1]) {
      activeLandmark = 'CAFE';
    } else if (scrollProgress >= LANDMARKS.STAR.range[0] && scrollProgress <= LANDMARKS.STAR.range[1]) {
      activeLandmark = 'STAR';
    } else if (scrollProgress >= LANDMARKS.PAWN.range[0] && scrollProgress <= LANDMARKS.PAWN.range[1]) {
      activeLandmark = 'PAWN';
    } else if (scrollProgress >= LANDMARKS.MOTEL.range[0]) {
      activeLandmark = 'MOTEL';
    }

    set({ scrollProgress, activeLandmark });
  },
  setScrollVelocity: (scrollVelocity) => set({ scrollVelocity }),
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
  toggleScanlines: () => set((state) => ({ scanlinesEnabled: !state.scanlinesEnabled })),
}));

