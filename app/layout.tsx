import type { Metadata, Viewport } from 'next';
import { fontVariables } from '@/lib/fonts';
import { event } from '@/lib/event';
import './globals.css';

export const metadata: Metadata = {
  title: `${event.brideName} — Қыз ұзату`,
  description: `${event.ceremonyTitle}. ${event.dateLine}, ${event.timeLine}. ${event.venueName}.`,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="kk" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
