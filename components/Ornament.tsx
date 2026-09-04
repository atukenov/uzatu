import styles from './Ornament.module.css';

interface OrnamentProps {
  variant: 'flourish' | 'diamond';
  lineWidth?: number;
  squareSize?: number;
  className?: string;
}

export default function Ornament({ variant, lineWidth, squareSize, className }: OrnamentProps) {
  const width = lineWidth ?? (variant === 'flourish' ? 56 : 50);
  const classes = [styles.ornament, className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <span className={styles.lineLeft} style={{ width }} />
      {variant === 'flourish' ? (
        <svg width="44" height="14" viewBox="0 0 46 14" className={styles.flourish}>
          <path
            d="M23 2c-3 0-5 2-5 5s2 5 5 5 5-2 5-5-2-5-5-5z"
            fill="none"
            stroke="currentColor"
            strokeWidth=".9"
          />
          <path
            d="M18 7C15 3 10 4 8 7c2 3 7 4 10 0zM28 7c3-4 8-3 10 0-2 3-7 4-10 0z"
            fill="none"
            stroke="currentColor"
            strokeWidth=".9"
          />
        </svg>
      ) : (
        <span className={styles.diamond} style={{ width: squareSize ?? 7, height: squareSize ?? 7 }} />
      )}
      <span className={styles.lineRight} style={{ width }} />
    </div>
  );
}
