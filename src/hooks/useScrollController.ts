'use client';
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCyberpunkStore } from '@/store/useCyberpunkStore';

gsap.registerPlugin(ScrollTrigger);

export function useScrollController() {
  const setScrollProgress = useCyberpunkStore((s) => s.setScrollProgress);
  const setScrollVelocity = useCyberpunkStore((s) => s.setScrollVelocity);

  useEffect(() => {
    // 1. Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenis.on('scroll', (e: { velocity?: number }) => {
      ScrollTrigger.update();
      setScrollVelocity(e.velocity || 0);
    });

    // 2. Drive Lenis via GSAP ticker for frame-locked sync
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // 3. ScrollTrigger binding across entire scroll height
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, [setScrollProgress, setScrollVelocity]);
}

