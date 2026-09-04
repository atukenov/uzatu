import Reveal from './Reveal';
import styles from './Closing.module.css';
import { event } from '@/lib/event';

export default function Closing() {
  return (
    <Reveal delay={3} className={styles.closing}>
      {event.closingLine}
    </Reveal>
  );
}
