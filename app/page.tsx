import Closing from '@/components/Closing';
import Countdown from '@/components/Countdown';
import Cover from '@/components/Cover';
import DateSection from '@/components/DateSection';
import Greeting from '@/components/Greeting';
import Hosts from '@/components/Hosts';
import MusicToggle from '@/components/MusicToggle';
import Ornament from '@/components/Ornament';
import Reveal from '@/components/Reveal';
import Rsvp from '@/components/Rsvp';
import Venue from '@/components/Venue';
import Verse from '@/components/Verse';
import { event } from '@/lib/event';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={`linen ${styles.page}`}>
      <MusicToggle />
      <Cover />
      <Reveal className={styles.dividerTight}>
        <Ornament variant="flourish" />
      </Reveal>
      <Verse />
      <Greeting />
      <DateSection />
      <Reveal className={styles.dividerTight}>
        <Ornament variant="diamond" lineWidth={50} squareSize={7} />
      </Reveal>
      <Venue />
      <Rsvp />
      <Countdown targetISO={event.dateISO} />
      <Hosts />
      <Reveal delay={2} className={styles.dividerLoose}>
        <Ornament variant="flourish" />
      </Reveal>
      <Closing />
    </main>
  );
}
