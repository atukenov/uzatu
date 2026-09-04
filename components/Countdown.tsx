'use client';

import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import styles from './Countdown.module.css';

interface Remaining {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

function computeRemaining(targetMs: number, nowMs: number): Remaining {
  const diff = Math.max(0, targetMs - nowMs);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    days: String(Math.floor(diff / 86400000)),
    hours: pad(Math.floor(diff / 3600000) % 24),
    minutes: pad(Math.floor(diff / 60000) % 60),
    seconds: pad(Math.floor(diff / 1000) % 60),
  };
}

const PLACEHOLDER: Remaining = { days: '—', hours: '--', minutes: '--', seconds: '--' };

export default function Countdown({ targetISO }: { targetISO: string }) {
  const target = new Date(targetISO).getTime();
  // Renders placeholder dashes on first paint (server + initial client render match),
  // then switches to the live value after mount to avoid a hydration mismatch.
  const [remaining, setRemaining] = useState<Remaining>(PLACEHOLDER);

  useEffect(() => {
    // Deliberately syncing on mount, not just subscribing: the page is statically
    // prerendered, so there's no meaningful server-computed value to seed with —
    // the first real remaining-time value can only exist once we're on the client.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(computeRemaining(target, Date.now()));
    const id = setInterval(() => {
      setRemaining(computeRemaining(target, Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <section>
      <Reveal className={styles.heading}>Тойға дейін:</Reveal>
      <Reveal delay={1} className={styles.row}>
        <div className={styles.circle}>
          <span className={styles.value}>{remaining.days}</span>
          <span className={styles.label}>күн</span>
        </div>
        <div className={styles.circle}>
          <span className={styles.value}>{remaining.hours}</span>
          <span className={styles.label}>сағат</span>
        </div>
        <div className={styles.circle}>
          <span className={styles.value}>{remaining.minutes}</span>
          <span className={styles.label}>минут</span>
        </div>
        <div className={`${styles.circle} ${styles.seconds}`}>
          <span className={`${styles.value} ${styles.secondsValue}`}>{remaining.seconds}</span>
          <span className={`${styles.label} ${styles.secondsLabel}`}>секунд</span>
        </div>
      </Reveal>
    </section>
  );
}
