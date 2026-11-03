'use client';

import { useEffect } from 'react';

export default function AudioPlayer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Singleton global audio instance so music never restarts or cuts off across pages
    if (!window._kinetikGlobalAudio) {
      const audio = new Audio('/audio/glory-glory-man-united.webm');
      audio.loop = true;
      audio.volume = 0.5;
      audio.preload = 'auto';

      // Fallback format for Safari or older iOS browsers
      audio.onerror = () => {
        if (!audio.src.endsWith('.m4a')) {
          audio.src = '/audio/glory-glory-man-united.m4a';
          audio.play().catch(() => {});
        }
      };

      window._kinetikGlobalAudio = audio;
    }

    const audio = window._kinetikGlobalAudio;

    const tryPlay = () => {
      if (audio && audio.paused) {
        audio.play().catch(() => {
          // Browser autoplay policy blocks unprompted audio until user gesture
        });
      }
    };

    // 1. Try immediate playback
    tryPlay();

    // 2. Capture any gesture (click, tap, key) anywhere on document or window
    const events = ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'click', 'keydown'];

    const handleGesture = () => {
      tryPlay();
      if (audio && !audio.paused) {
        events.forEach((ev) => {
          document.removeEventListener(ev, handleGesture, true);
          window.removeEventListener(ev, handleGesture, true);
        });
      }
    };

    events.forEach((ev) => {
      document.addEventListener(ev, handleGesture, { capture: true, passive: true });
      window.addEventListener(ev, handleGesture, { capture: true, passive: true });
    });

    return () => {
      events.forEach((ev) => {
        document.removeEventListener(ev, handleGesture, true);
        window.removeEventListener(ev, handleGesture, true);
      });
    };
  }, []);

  return null;
}
