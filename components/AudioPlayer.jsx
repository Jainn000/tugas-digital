'use client';

import { useEffect, useRef } from 'react';

export default function AudioPlayer() {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    // 1. Try immediate autoplay
    const startAudio = () => {
      audio.play().catch(() => {
        // Autoplay blocked by browser policy without user gesture
      });
    };

    startAudio();

    // 2. Fallback: start on first user interaction anywhere on the document
    const handleFirstInteraction = () => {
      if (audio.paused) {
        audio.play().then(() => {
          cleanup();
        }).catch(() => {});
      }
    };

    const events = ['click', 'touchstart', 'scroll', 'keydown'];
    events.forEach((ev) => {
      window.addEventListener(ev, handleFirstInteraction, { passive: true });
    });

    const cleanup = () => {
      events.forEach((ev) => {
        window.removeEventListener(ev, handleFirstInteraction);
      });
    };

    return () => {
      cleanup();
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      loop
      autoPlay
      preload="auto"
      className="hidden"
      aria-hidden="true"
    >
      <source src="/audio/glory-glory-man-united.webm" type="audio/webm" />
      <source src="/audio/glory-glory-man-united.m4a" type="audio/mp4" />
    </audio>
  );
}
