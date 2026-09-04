# Қыз ұзату — Нұрай

A single-page mobile digital invitation for a Kazakh bride send-off ceremony (қыз ұзату), built with Next.js App Router. One continuous vertical scroll with scroll-triggered reveals, a live countdown, and a working RSVP form.

Recreated from the design handoff in [`design_handoff_qyz_uzatu/`](./design_handoff_qyz_uzatu) — see that folder's `README.md` for the full design spec.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The design targets mobile portrait, 375–430px wide.

## Structure

- `app/` — root layout (fonts, `lang="kk"`) and the page that composes all sections
- `components/` — one component per section, plus shared `Reveal`, `Ornament`, `ArchPhoto`
- `lib/event.ts` — event data (bride name, date, venue, verse, etc.)
- `lib/actions.ts` — RSVP server action; submissions are appended to `data/rsvp.json` (gitignored)
- `public/images/` — the four event photographs

## Notes

- Fonts use `next/font/google` with the `cyrillic-ext` subset, required for Kazakh letters (ұ қ ә ң ө ү і).
- The countdown and RSVP form are client components; everything else is a server component.
- `data/rsvp.json` is a simple local JSON store, fine for a self-hosted Node deployment. Swap `lib/actions.ts` for a real datastore if this ever moves to a serverless/edge host with a read-only filesystem.

## Telegram RSVP notifications

Copy `.env.example` to `.env.local` and fill in:

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

1. Message [@BotFather](https://t.me/BotFather) on Telegram, run `/newbot`, and copy the token it gives you.
2. Send your new bot any message, then open `https://api.telegram.org/bot<TOKEN>/getUpdates` in a browser and read `"chat":{"id":...}` from the response — that's your chat ID.

Without these two variables set, RSVPs still save to `data/rsvp.json` as normal; the Telegram notification is just skipped (see `lib/telegram.ts`).

## Background music

Drop a royalty-free (or licensed) track at `public/audio/background-music.mp3` to enable the play/pause button in the top-right corner (`components/MusicToggle.tsx`). The button checks for the file on load and hides itself automatically if it's missing, so the site works fine without one.
