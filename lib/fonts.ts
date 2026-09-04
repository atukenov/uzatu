import { Caveat, Yeseva_One, PT_Serif, PT_Sans, Bad_Script } from 'next/font/google';

// cyrillic-ext is required — it carries the Kazakh-specific letters (ұ қ ә ң ө ү і).
// Marck Script, Playfair Display and Manrope were tried in the prototype and do not
// cover these glyphs; the five faces below were verified to render them correctly.

export const caveat = Caveat({
  subsets: ['cyrillic-ext'],
  weight: ['600'],
  variable: '--font-caveat',
  display: 'swap',
});

export const yesevaOne = Yeseva_One({
  subsets: ['cyrillic-ext'],
  weight: ['400'],
  variable: '--font-yeseva',
  display: 'swap',
});

export const ptSerif = PT_Serif({
  subsets: ['cyrillic-ext'],
  weight: ['400', '700'],
  variable: '--font-pt-serif',
  display: 'swap',
});

export const ptSans = PT_Sans({
  subsets: ['cyrillic-ext'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

export const badScript = Bad_Script({
  subsets: ['cyrillic-ext'],
  weight: ['400'],
  variable: '--font-bad-script',
  display: 'swap',
});

export const fontVariables = [
  caveat.variable,
  yesevaOne.variable,
  ptSerif.variable,
  ptSans.variable,
  badScript.variable,
].join(' ');
