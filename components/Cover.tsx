import ArchPhoto from './ArchPhoto';
import Reveal from './Reveal';
import styles from './Cover.module.css';
import { event } from '@/lib/event';

export default function Cover() {
  return (
    <section>
      <div className={styles.textBlock}>
        <Reveal className={styles.name}>{event.brideName}</Reveal>
        <Reveal delay={1} className={styles.kicker}>
          {event.ceremonyTitle}
        </Reveal>
      </div>
      <Reveal delay={2} className={styles.photoWrap}>
        <ArchPhoto
          src="/images/saukele-hero.jpg"
          alt="Сәукеле"
          size="large"
          priority
          objectPosition="50% 22%"
          filter="saturate(.82) contrast(.94) brightness(1.03)"
          corners
        />
      </Reveal>
      <Reveal delay={3} className={styles.scrollCue}>
        <span className={styles.scrollCueLabel}>Төмен жүргізіңіз</span>
        <svg width="15" height="9" viewBox="0 0 16 10">
          <path d="M1 1l7 7 7-7" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </Reveal>
    </section>
  );
}
