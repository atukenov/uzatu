'use client';

import { useState, useTransition } from 'react';
import Ornament from './Ornament';
import Reveal from './Reveal';
import styles from './Rsvp.module.css';
import { submitRsvp } from '@/lib/actions';
import { RSVP_CHOICES, type RsvpChoice } from '@/lib/event';

export default function Rsvp() {
  const [name, setName] = useState('');
  const [choice, setChoice] = useState<RsvpChoice | null>(null);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await submitRsvp({ name, choice });
      if (result.ok) {
        setSent(true);
      } else {
        setError(result.error);
      }
    });
  };

  const reset = () => {
    setSent(false);
    setError(null);
  };

  return (
    <section>
      <Reveal className={styles.heading}>
        Тойға қатысуыңызды
        <br />
        растауыңызды сұраймыз
        <Ornament variant="diamond" lineWidth={40} squareSize={6} className={styles.divider} />
      </Reveal>

      {!sent ? (
        <Reveal delay={1} className={styles.form}>
          <p className={styles.helper}>
            Аты-жөніңізді жазыңыз (жұбайыңызбен келетін болсаңыз, есімдеріңізді бірге жазуды өтінеміз)
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Есіміңіз"
            className={styles.input}
            disabled={isPending}
          />
          <p className={styles.question}>Тойға келесіз бе?</p>
          <div className={styles.radioGroup} role="radiogroup" aria-label="Тойға келесіз бе?">
            {RSVP_CHOICES.map((opt) => (
              <label key={opt.value} className={styles.radioRow}>
                <input
                  type="radio"
                  name="rsvp-choice"
                  value={opt.value}
                  checked={choice === opt.value}
                  onChange={() => setChoice(opt.value)}
                  className={styles.radioInput}
                  disabled={isPending}
                />
                <span className={styles.radioLabel}>{opt.label}</span>
              </label>
            ))}
          </div>
          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}
          <button type="button" onClick={handleSubmit} disabled={isPending} className={styles.submit}>
            {isPending ? 'Жіберілуде…' : 'Жауапты жіберу'}
          </button>
        </Reveal>
      ) : (
        <div className={styles.thankYou}>
          <div className={styles.checkCircle}>
            <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#8A7A4E" strokeWidth="2.4">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className={styles.thankYouTitle}>Рахмет!</p>
          <p className={styles.thankYouText}>Жауабыңыз қабылданды. Той иелері сізді қуана күтеді.</p>
          <button type="button" onClick={reset} className={styles.changeAnswer}>
            Жауапты өзгерту
          </button>
        </div>
      )}
    </section>
  );
}
