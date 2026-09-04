import Image from 'next/image';
import styles from './ArchPhoto.module.css';

interface ArchPhotoProps {
  src: string;
  alt: string;
  size: 'large' | 'small';
  priority?: boolean;
  objectPosition?: string;
  filter?: string;
  corners?: boolean;
  className?: string;
}

// All content photos sit back into the cream page at saturate(.8) contrast(.93)
// brightness(1.04) by default; the cover and hosts photos override this per the spec.
const DEFAULT_FILTER = 'saturate(.8) contrast(.93) brightness(1.04)';

export default function ArchPhoto({
  src,
  alt,
  size,
  priority,
  objectPosition = '50% 50%',
  filter = DEFAULT_FILTER,
  corners = false,
  className,
}: ArchPhotoProps) {
  const frameClass = size === 'large' ? styles.frameLarge : styles.frameSmall;
  const innerClass = size === 'large' ? styles.innerLarge : styles.innerSmall;

  return (
    <div className={[styles.frame, frameClass, className].filter(Boolean).join(' ')}>
      <div className={[styles.inner, innerClass].filter(Boolean).join(' ')}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 430px) 90vw, 430px"
          style={{ objectFit: 'cover', objectPosition, filter }}
          priority={priority}
        />
      </div>
      {corners && (
        <>
          <svg width="32" height="32" viewBox="0 0 34 34" className={styles.cornerLeft}>
            <path d="M2 32V18c0-9 7-16 16-16h14" fill="none" stroke="currentColor" strokeWidth="1" />
            <path
              d="M8 32c0-8 2-14 8-18 4-3 9-4 14-4"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              opacity=".65"
            />
          </svg>
          <svg width="32" height="32" viewBox="0 0 34 34" className={styles.cornerRight}>
            <path d="M2 32V18c0-9 7-16 16-16h14" fill="none" stroke="currentColor" strokeWidth="1" />
            <path
              d="M8 32c0-8 2-14 8-18 4-3 9-4 14-4"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              opacity=".65"
            />
          </svg>
        </>
      )}
    </div>
  );
}
