import Reveal from './Reveal';
import styles from './Greeting.module.css';
import { event } from '@/lib/event';

export default function Greeting() {
  return (
    <div className={styles.wrap}>
      <Reveal className={styles.heading}>{event.greetingHeading}</Reveal>
      <Reveal as="p" delay={1} className={styles.paragraph}>
        {event.greetingParagraph}
      </Reveal>
    </div>
  );
}
