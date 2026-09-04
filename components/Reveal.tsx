'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type RevealTag = 'div' | 'p';

interface RevealProps {
  children: ReactNode;
  delay?: 1 | 2 | 3;
  as?: RevealTag;
  className?: string;
  style?: CSSProperties;
}

// One IntersectionObserver per instance, matching the prototype's threshold/rootMargin/
// one-shot behavior. `root: null` targets the window, since the real page scrolls the
// document (the prototype scrolled an inner device-frame element instead).
export default function Reveal({ children, delay, as = 'div', className, style }: RevealProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = as === 'p' ? pRef.current : divRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        }
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [as]);

  const classes = ['rv', delay ? `rv-d${delay}` : null, className].filter(Boolean).join(' ');

  if (as === 'p') {
    return (
      <p ref={pRef} className={classes} style={style}>
        {children}
      </p>
    );
  }

  return (
    <div ref={divRef} className={classes} style={style}>
      {children}
    </div>
  );
}
