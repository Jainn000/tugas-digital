'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music, ChevronDown, ChevronUp } from 'lucide-react';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    // Try auto-play on first user interaction with the window
    const enableAudioOnGesture = () => {
      if (!hasInteracted && audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        }).catch(() => {
          // Autoplay blocked by browser policy until explicit click
        });
      }
    };

    window.addEventListener('click', enableAudioOnGesture, { once: true });
    window.addEventListener('keydown', enableAudioOnGesture, { once: true });

    return () => {
      window.removeEventListener('click', enableAudioOnGesture);
      window.removeEventListener('keydown', enableAudioOnGesture);
    };
  }, [hasInteracted, volume]);

  const togglePlay = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setHasInteracted(true);
      }).catch((err) => {
        console.error('Audio playback error:', err);
      });
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      if (newVol === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  return (
    <div data-ui="kinetik-audioplayer" className="fixed bottom-6 left-6 z-40 select-none">
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/glory-glory-man-united.webm" type="audio/webm" />
        <source src="/audio/glory-glory-man-united.m4a" type="audio/mp4" />
      </audio>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#242424] border border-[#383838] rounded-[10px] overflow-hidden text-white"
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 flex flex-col gap-3 min-w-[260px] sm:min-w-[280px]"
            >
              {/* Top Row: Track Badge & Collapse Button */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[6px] bg-[#DA020E]/20 border border-[#DA020E]/40 flex items-center justify-center text-[#ff4d4d] shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-poppins font-semibold text-[12px] text-white leading-tight">
                      Glory Glory Man United
                    </span>
                    <span className="font-inter text-[10px] text-[#bdbdbd] leading-none mt-0.5">
                      Backsound Lagu Resmi
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1 text-[#8d8d8d] hover:text-white transition-colors"
                  aria-label="Kecilkan pemutar musik"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Middle Row: Animated Equalizer Visualizer & Status */}
              <div className="bg-[#171717] rounded-[6px] px-3 py-2 flex items-center justify-between border border-[#383838]/60">
                <div className="flex items-center gap-1.5 h-4">
                  {[40, 75, 55, 90, 60].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={isPlaying ? { height: ['20%', `${h}%`, '30%'] } : { height: '25%' }}
                      transition={
                        isPlaying
                          ? { repeat: Infinity, duration: 0.6 + i * 0.15, ease: 'easeInOut' }
                          : { duration: 0.2 }
                      }
                      className={`w-[3px] rounded-full ${
                        isPlaying ? 'bg-[#ff6b35]' : 'bg-[#555555]'
                      }`}
                    />
                  ))}
                </div>

                <span className="text-[10px] font-inter font-medium tracking-wide text-[#8d8d8d]">
                  {isPlaying ? 'MEMUTAR MUSIK' : 'JEDA'}
                </span>
              </div>

              {/* Bottom Row: Control Buttons & Volume */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#383838]/80">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full bg-[#ff6b35] text-[#171717] flex items-center justify-center hover:bg-[#e5531e] transition-colors"
                    aria-label={isPlaying ? 'Jeda backsound' : 'Putar backsound'}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1.5 text-[#bdbdbd] hover:text-white transition-colors"
                    aria-label={isMuted ? 'Nyalakan suara' : 'Bisukan suara'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Volume Slider */}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 sm:w-24 h-1.5 bg-[#383838] rounded-lg appearance-none cursor-pointer accent-[#ff6b35]"
                  aria-label="Pengatur volume"
                />
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(true)}
              className="p-2.5 flex items-center gap-2.5 hover:bg-[#2e2e2e] transition-colors"
              aria-label="Buka pemutar musik"
            >
              <div
                onClick={togglePlay}
                role="button"
                tabIndex={0}
                className="w-7 h-7 rounded-full bg-[#ff6b35] text-[#171717] flex items-center justify-center hover:bg-[#e5531e] transition-colors"
                aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
              >
                {isPlaying ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                )}
              </div>

              <div className="flex items-center gap-2 pr-1">
                <span className="font-poppins text-xs font-semibold text-white">
                  Glory Glory Man United
                </span>
                <div className="flex items-center gap-1 h-3">
                  {[50, 80, 40].map((h, i) => (
                    <motion.span
                      key={i}
                      animate={isPlaying ? { height: ['20%', `${h}%`, '30%'] } : { height: '25%' }}
                      transition={
                        isPlaying
                          ? { repeat: Infinity, duration: 0.5 + i * 0.15, ease: 'easeInOut' }
                          : { duration: 0.2 }
                      }
                      className={`w-[2.5px] rounded-full ${
                        isPlaying ? 'bg-[#ff6b35]' : 'bg-[#555555]'
                      }`}
                    />
                  ))}
                </div>
                <ChevronUp className="w-3.5 h-3.5 text-[#8d8d8d]" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
