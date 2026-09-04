'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './MusicToggle.module.css';

const TRACK_SRC = '/audio/background-music.mp3';

// Renders nothing until a HEAD check confirms the track exists, so the button
// doesn't sit there dead when no file has been added at
// public/audio/background-music.mp3 yet (see README).
export default function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(TRACK_SRC, { method: 'HEAD' })
      .then((res) => {
        if (cancelled || !res.ok) return;
        const audio = new Audio(TRACK_SRC);
        audio.loop = true;
        audio.volume = 0.6;
        audioRef.current = audio;
        setIsAvailable(true);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(
        () => setIsPlaying(true),
        () => setIsAvailable(false)
      );
    }
  };

  if (!isAvailable) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.button}
      aria-label={isPlaying ? 'Әуенді тоқтату' : 'Әуенді қосу'}
      aria-pressed={isPlaying}
    >
      {isPlaying ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="5" width="4" height="14" rx="1" />
          <rect x="14" y="5" width="4" height="14" rx="1" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
    </button>
  );
}
