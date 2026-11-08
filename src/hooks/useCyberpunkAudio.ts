'use client';
import { useEffect, useRef } from 'react';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';

export function useCyberpunkAudio() {
  const isAudioMuted = useCyberpunkStore((s) => s.isAudioMuted);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Only initialize Web Audio once user unmutes
    if (!isAudioMuted && !isInitializedRef.current) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        // Master Gain
        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0, ctx.currentTime);
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // 1. Procedural Low-Frequency City Ambient Hum
        const bufferSize = ctx.sampleRate * 4;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.992 * b0 + white * 0.05;
          b1 = 0.985 * b1 + white * 0.08;
          b2 = 0.95 * b2 + white * 0.12;
          output[i] = (b0 + b1 + b2) * 0.02;
        }

        const citySource = ctx.createBufferSource();
        citySource.buffer = noiseBuffer;
        citySource.loop = true;

        const cityFilter = ctx.createBiquadFilter();
        cityFilter.type = 'lowpass';
        cityFilter.frequency.setValueAtTime(320, ctx.currentTime);
        cityFilter.Q.setValueAtTime(1.8, ctx.currentTime);

        const cityGain = ctx.createGain();
        cityGain.gain.setValueAtTime(0.35, ctx.currentTime);

        citySource.connect(cityFilter);
        cityFilter.connect(cityGain);
        cityGain.connect(masterGain);
        citySource.start();

        // 2. Procedural Synthwave Bass Drone (55Hz / 110Hz)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1

        const osc2 = ctx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(110.4, ctx.currentTime); // A2 slightly detuned

        const synthFilter = ctx.createBiquadFilter();
        synthFilter.type = 'lowpass';
        synthFilter.frequency.setValueAtTime(260, ctx.currentTime);
        synthFilter.Q.setValueAtTime(2.8, ctx.currentTime);

        // Slow LFO filter pulse
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime);

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(90, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(synthFilter.frequency);
        lfo.start();

        const synthGain = ctx.createGain();
        synthGain.gain.setValueAtTime(0.24, ctx.currentTime);

        osc1.connect(synthFilter);
        osc2.connect(synthFilter);
        synthFilter.connect(synthGain);
        synthGain.connect(masterGain);

        osc1.start();
        osc2.start();

        isInitializedRef.current = true;
      } catch (err) {
        console.warn('Web Audio initialization error:', err);
      }
    }

    // Handle mute / unmute transitions
    if (audioCtxRef.current && masterGainRef.current) {
      const ctx = audioCtxRef.current;
      const gain = masterGainRef.current.gain;

      if (ctx.state === 'suspended' && !isAudioMuted) {
        ctx.resume();
      }

      const now = ctx.currentTime;
      gain.cancelScheduledValues(now);

      if (isAudioMuted) {
        gain.setTargetAtTime(0, now, 0.2);
      } else {
        gain.setTargetAtTime(0.3, now, 0.4);
      }
    }
  }, [isAudioMuted]);

  return null;
}
