import ArchPhoto from './ArchPhoto';
import Reveal from './Reveal';
import styles from './Venue.module.css';
import { event } from '@/lib/event';

export default function Venue() {
  return (
    <section>
      <Reveal delay={1} className={styles.row}>
        <ArchPhoto src="/images/venue-yurt.jpg" alt="Той залы" size="small" className={styles.photo} />
        <div className={styles.info}>
          <svg width="17" height="21" viewBox="0 0 24 24" fill="none" stroke="#A9846A" strokeWidth="2.75" className={styles.pin}>
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1116 0z" />
            <circle cx="12" cy="10" r="2.6" />
          </svg>
          <div className={styles.label}>Мекен-жайымыз</div>
          <div className={styles.name}>{event.venueName}</div>
          <div className={styles.line}>
            {event.venueLine}
            <br />
            {event.venueDistrict}
          </div>
        </div>
      </Reveal>
      <Reveal delay={2} className={styles.mapButtonWrap}>
        <a href={event.mapUrl} target="_blank" rel="noopener" className={styles.mapButton}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.75">
            <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
            <path d="M9 4v14M15 6v14" />
          </svg>
          Картадан көру
        </a>
      </Reveal>
    </section>
  );
}
