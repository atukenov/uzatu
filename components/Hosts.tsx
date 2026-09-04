import Image from 'next/image';
import Reveal from './Reveal';
import styles from './Hosts.module.css';
import { event } from '@/lib/event';

export default function Hosts() {
  return (
    <Reveal className={styles.hosts}>
      <Image
        src="/images/hosts-yurt-roof.jpg"
        alt="Киіз үй іші"
        fill
        sizes="(max-width: 430px) 100vw, 430px"
        style={{ objectFit: 'cover', filter: 'saturate(.72) contrast(.92) brightness(1.06)' }}
      />
      <div className={styles.veil} />
      <div className={styles.hostsLabel}>Той иелері</div>
      <div className={styles.namesWrap}>
        <div className={styles.names}>{event.hostNames}</div>
      </div>
    </Reveal>
  );
}
