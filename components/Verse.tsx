import Reveal from './Reveal';
import styles from './Verse.module.css';
import { event } from '@/lib/event';

export default function Verse() {
  return (
    <Reveal className={styles.verse}>
      {event.verseLines.map((line, i) => (
        <div key={line} className={i > 0 ? styles.line : undefined}>
          {line}
        </div>
      ))}
    </Reveal>
  );
}
