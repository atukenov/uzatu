import Reveal from './Reveal';
import styles from './DateSection.module.css';
import { event } from '@/lib/event';

const WEEKDAY_LABELS = ['Дс', 'Сс', 'Ср', 'Бс', 'Жұ', 'Сн', 'Жк'];

function getCalendarGrid(dateISO: string) {
  const date = new Date(dateISO);
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
  const leadingBlanks = (firstWeekday + 6) % 7; // shift to Monday-first
  return { leadingBlanks, daysInMonth };
}

export default function DateSection() {
  const { leadingBlanks, daysInMonth } = getCalendarGrid(event.dateISO);
  const cells: Array<number | null> = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <section>
      <Reveal className={styles.heading}>Той салтанаты:</Reveal>
      <Reveal delay={1} className={styles.card}>
        <div className={styles.monthLabel}>{event.calendarMonthLabel}</div>
        <div className={styles.weekdayRow}>
          {WEEKDAY_LABELS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className={styles.dayGrid}>
          {cells.map((day, i) =>
            day === null ? (
              <span key={`blank-${i}`} />
            ) : day === event.calendarDay ? (
              <span key={day} className={styles.circledDay}>
                <span className={styles.circle} />
                {day}
              </span>
            ) : (
              <span key={day}>{day}</span>
            )
          )}
        </div>
      </Reveal>
      <Reveal delay={2} className={styles.dateLines}>
        <div className={styles.dateLine}>{event.dateLine}</div>
        <div className={styles.timeLine}>{event.timeLine}</div>
      </Reveal>
    </section>
  );
}
