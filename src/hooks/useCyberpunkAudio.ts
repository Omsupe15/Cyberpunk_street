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

        // 1. Procedural Pink Noise Rain Generator
        const bufferSize = ctx.sampleRate * 4;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const rainSource = ctx.createBufferSource();
        rainSource.buffer = noiseBuffer;
        rainSource.loop = true;

        const rainFilter = ctx.createBiquadFilter();
        rainFilter.type = 'bandpass';
        rainFilter.frequency.setValueAtTime(850, ctx.currentTime);
        rainFilter.Q.setValueAtTime(1.4, ctx.currentTime);

        const rainGain = ctx.createGain();
        rainGain.gain.setValueAtTime(0.5, ctx.currentTime);

        rainSource.connect(rainFilter);
        rainFilter.connect(rainGain);
        rainGain.connect(masterGain);
        rainSource.start();

        // 2. Procedural Synthwave Bass Drone (55Hz / 110Hz)
        const osc1 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1

        const osc2 = ctx.createOscillator();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(110.4, ctx.currentTime); // A2 slightly detuned

        const synthFilter = ctx.createBiquadFilter();
        synthFilter.type = 'lowpass';
        synthFilter.frequency.setValueAtTime(280, ctx.currentTime);
        synthFilter.Q.setValueAtTime(3.0, ctx.currentTime);

        // Slow LFO filter pulse
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.15, ctx.currentTime);

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(100, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(synthFilter.frequency);
        lfo.start();

        const synthGain = ctx.createGain();
        synthGain.gain.setValueAtTime(0.22, ctx.currentTime);

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

      if (isAudioMuted) {
        // Fade out
        gain.cancelScheduledValues(ctx.currentTime);
        gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      } else {
        // Fade in
        gain.cancelScheduledValues(ctx.currentTime);
        gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.2);
      }
    }
  }, [isAudioMuted]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);
}

