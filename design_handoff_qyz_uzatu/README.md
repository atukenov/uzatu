# Handoff: Qyz Uzatu (Қыз ұзату) digital invitation — Next.js implementation

## Overview
A single-page mobile digital invitation for a Kazakh bride send-off ceremony (қыз ұзату). One continuous vertical scroll — no tab bar, no routing between screens. Sections fade and drift upward as they enter the viewport. Contains a live countdown to the ceremony and a working RSVP form.

Event data currently in the design:
- Bride: **Нұрай**
- Ceremony title: **Ұядан ұшқан күн**
- Date/time: **23 қазан, 2026 жыл, сағат 18:00** (`2026-10-23T18:00:00`)
- Venue: **Атамұра** мейрамханасы, Махамбет ауданы
- Map link: `https://2gis.kz/atyrau/search/%D0%B0%D1%82%D0%B0%D0%BC%D1%83%D1%80%D0%B0%20%D1%80%D0%B5%D1%81%D1%82%D0%BE%D1%80%D0%B0%D0%BD/geo/70030077131277612/51.583544%2C47.675258?m=51.583942%2C47.676526%2F17.81`
- Hosts (той иелері): **Қайрат & Роза**

## About the design files
`reference/Qyz Uzatu Invitation.dc.html` is a **design reference created in HTML** — a prototype showing the intended look and behavior, not production code to copy. `reference/ios-frame.jsx` is only a preview device bezel used to show the design at phone size; **do not port it**. In Next.js the invitation is the page itself, rendered full-viewport on a real phone.

The task is to recreate this design in Next.js (App Router assumed) using the project's own conventions. Target: mobile portrait only, 375–430px wide viewports. No desktop layout is designed; center the column at `max-width: 430px` on wider screens.

## Fidelity
**High-fidelity.** Colors, typography, spacing and interactions below are final. Recreate pixel-for-pixel at 375px width; everything scales with normal flow above that.

## Suggested Next.js structure

```
app/
  layout.tsx            // fonts, <html lang="kk">, viewport meta
  page.tsx              // server component; renders sections in order, passes event data
  globals.css           // linen background, reveal classes, resets
components/
  Reveal.tsx            // 'use client' — IntersectionObserver fade-in wrapper
  ArchPhoto.tsx         // arched-top double-framed photo
  Ornament.tsx          // divider flourish (inline SVG)
  Cover.tsx
  Verse.tsx
  Greeting.tsx
  DateSection.tsx       // month grid + circled day + date/time lines
  Venue.tsx
  Rsvp.tsx              // 'use client' — form + submitted state
  Countdown.tsx         // 'use client' — ticking circles
  Hosts.tsx             // full-bleed photo with overlaid names
  Closing.tsx
lib/event.ts            // single source of truth for the event data above
public/images/…         // the four photos from assets/
```

Notes for the port:
- **Fonts** — use `next/font/google` and include the `cyrillic-ext` subset; Kazakh letters (ұ қ ә ң ө ү і) are in that subset and most script faces lack them entirely. This was the single biggest pitfall in the prototype. Verified working: `Caveat`, `Yeseva One`, `PT Serif`, `PT Sans`, `Bad Script`. Verified **broken** for Kazakh (do not use): Marck Script, Playfair Display, Manrope.
  ```ts
  import { Caveat, Yeseva_One, PT_Serif, PT_Sans, Bad_Script } from 'next/font/google';
  const caveat = Caveat({ subsets: ['cyrillic-ext'], weight: ['600'], variable: '--font-script' });
  ```
- **Countdown** — compute in a `useEffect` interval and render `null`/dashes on first paint, or seed from a server-passed timestamp, to avoid hydration mismatch.
- **Reveal** — one `IntersectionObserver` with `threshold: 0.12`, `rootMargin: '0px 0px -8% 0px'`, `root: null` (the window is the scroller in the real app; in the prototype it was the device frame). Unobserve after reveal; respect `prefers-reduced-motion` by skipping the transform.
- **Images** — `next/image` with `fill` + `object-fit: cover` inside the arch containers; the photos are 736×1197-ish portraits. Mark the cover photo `priority`.
- **RSVP** — currently local state only. Wire the submit to a route handler / server action; the design has no error or loading state yet, so add one consistent with the palette (see “Gaps”).

## Sections, in scroll order

Page background everywhere: `#F7F1E4` with a woven linen grain:
```css
background-color:#F7F1E4;
background-image:
  repeating-linear-gradient(90deg, rgba(138,122,78,.055) 0 1px, transparent 1px 3px),
  repeating-linear-gradient(0deg,  rgba(138,122,78,.045) 0 1px, transparent 1px 3px),
  radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,.5), transparent 60%);
```
Page padding: `74px` top, `64px` bottom. All measurements below are at 375px width.

### 1. Cover
- Bride name: Caveat 600, **68px**, line-height 1.05, color `#6F6238`, centered.
- Kicker: Yeseva One, **12.5px**, letter-spacing `.3em`, uppercase, `#8A7A4E`, margin-top 12px — “Ұядан ұшқан күн”.
- Arched hero photo (`saukele-hero.jpg`), margin `24px 28px 0`:
  - Outer frame: `padding:9px; border:1px solid #BFA184; border-radius:145px 145px 16px 16px`
  - Inner: `border-radius:138px 138px 10px 10px; aspect-ratio:.74; overflow:hidden`
  - Image: `object-fit:cover; object-position:50% 22%; filter:saturate(.82) contrast(.94) brightness(1.03)`
  - Two mirrored corner scroll SVGs at the bottom corners, `32×32`, `color:#A9846A`, offset `-4px`.
- Scroll cue: PT Sans 10px, letter-spacing `.2em`, uppercase, `#8A7A4E` — “Төмен жүргізіңіз” + chevron SVG (15×9, stroke 1.2), gap 7px, padding-top 26px.
- Reveal stagger: name → kicker (`.12s`) → photo (`.24s`) → cue (`.36s`).

### 2. Ornament divider (reused, 3 places)
Flex row, gap 12px, centered: 56px 1px gradient line (`transparent → #A9846A`), a 44×14 flourish SVG (`stroke #8A7A4E`, width .9), mirrored line. A simpler variant used near the venue and RSVP: 40–50px lines with a 6–7px `#8A7A4E` 1px square rotated 45°.

### 3. Verse (four-line script poem)
Full-bleed block, `margin-top:26px`, `aspect-ratio:736/1197`, flex column centered, `padding:0 30px`, background = `verse-background.jpg` at `background-size:100% 100%` (the whole photo, uncropped — this was an explicit request).
Text: Bad Script, 20px, line-height 2.05, `#5E5230`, centered; four lines, 10px gaps:
```
Шаңырақтың шырағысың, шаттығы,
Текті жердің тұяғысың, ақ гүлі.
Мың жыл құда болуға да атты күн,
Екі жасқа құдай берсін бақ бүгін.
```

### 4. Greeting
- “Құрметті қонақтар!” — Bad Script 33px, `#7A5A42`.
- Paragraph, PT Serif **12px**, line-height 2.1, letter-spacing `.11em`, uppercase, `#3A342B`, `text-wrap:pretty`, padding `34px 30px 0`:
  “Аяулы қызымыз Нұрайдың аялы алақанымыздан құтты босағасына шығарып салу рәсіміне арналған салтанатты тойымызға шақырамыз”

### 5. Date (Той салтанаты)
- Heading: Bad Script 36px `#7A5A42`, padding-top 54px.
- Calendar card: `margin:18px 24px 0; padding:18px 16px 20px; border:1px solid rgba(169,132,106,.45); border-radius:22px; background:rgba(255,255,255,.34)`
  - Month label: PT Serif 11.5px, letter-spacing `.3em`, uppercase, `#8A7A4E` — “Қазан 2026”.
  - Weekday row: 7-col grid, PT Serif 11px, `#8A7A4E` — Дс Сс Ср Бс Жұ Сн Жк (Monday-first).
  - Day grid: 7-col, `gap:9px 0`, PT Serif 13.5px, `#3A342B`; October 2026 starts Thursday → 3 leading blanks.
  - Circled day **23**: absolutely positioned span `29×26px`, `border:1.4px solid #A9846A; border-radius:50%; transform:rotate(-8deg)`, number color `#6F6238`.
- Date line: Yeseva One 15px, letter-spacing `.18em`, uppercase, `#3A342B` — “23 қазан, 2026 жыл”.
- Time line: Yeseva One 14px, letter-spacing `.2em`, uppercase, `#6F6238`, margin-top 8px — “Сағат 18:00”.

### 6. Venue
Two-column flex, `padding:22px 24px 0`, gap 16px:
- Left: arched photo (`venue-yurt.jpg`), `flex:0 0 120px`, frame `padding:7px; border:1px solid #BFA184; border-radius:74px 74px 12px 12px`, inner radius `68px 68px 7px 7px`, `aspect-ratio:.7`.
- Right, left-aligned: pin icon (Lucide `map-pin`, 17×21, stroke 2.75, `#A9846A`); label Yeseva One 10.5px letter-spacing `.18em` uppercase `#8A7A4E` — “Мекен-жайымыз”; name Bad Script 30px `#7A5A42` — “Атамұра”; PT Serif 12.5px `#3A342B` — “мейрамханасы / Махамбет ауданы”.
- Map button (`<a target="_blank" rel="noopener">`), `padding:20px 24px 0`: height 52px, `border-radius:999px`, `border:1px solid #A9846A`, `background:rgba(255,255,255,.4)`, PT Sans 500 11.5px, letter-spacing `.16em`, uppercase, `#6F6238`, map icon 16×16 + label “Картадан көру”, gap 9px.

### 7. RSVP
- Heading: Yeseva One 13px, line-height 2, letter-spacing `.16em`, uppercase, `#3A342B`, two lines — “Тойға қатысуыңызды / растауыңызды сұраймыз”, padding-top 56px, then a small ornament divider.
- Helper text: PT Serif 12px, line-height 1.7, `rgba(46,42,36,.7)` — “Аты-жөніңізді жазыңыз (жұбайыңызбен келетін болсаңыз, есімдеріңізді бірге жазуды өтінеміз)”.
- Text input: height 52px, `padding:0 20px`, `border-radius:999px`, `border:1px solid #BFA184`, `background:rgba(255,255,255,.75)`, PT Serif 15px `#2E2A24`, placeholder “Есіміңіз”. Add a themed `:focus-visible` ring (`2px solid #8A7A4E`, offset 2px) — the prototype removes the outline, which must not ship.
- Question label: PT Serif 12px, letter-spacing `.14em`, uppercase, `#8A7A4E` — “Тойға келесіз бе?”.
- Three radio rows, `min-height:46px`, `padding:0 6px`, `border-radius:14px`, hover `background:rgba(169,132,106,.09)` (transition `.3s`), gap 13px:
  - Marker: 20×20 circle, `border:1.3px solid #A9846A`; selected fills a 10px `#8A7A4E` dot.
  - Labels PT Serif 14px `#3A342B`: “Ия, әрине келемін” / “Жұбайыммен келемін” / “Өкінішке орай, келе алмаймын”.
  - Use real `<input type="radio">` + `<label>` in production (the prototype uses divs).
- Submit: height 56px, `border-radius:999px`, `background:linear-gradient(180deg,#9A7452,#7E5B3E)`, `box-shadow:0 8px 20px rgba(126,91,62,.28)`, PT Sans 500 12.5px, letter-spacing `.16em`, uppercase, `#FBF6EC`; hover `filter:brightness(1.07)`, active `translateY(1px)` — “Жауапты жіберу”.
- Submitted state replaces the form: 60px circle `border:1px solid #A9846A` with a 25px check (stroke `#8A7A4E`, 2.4); “Рахмет!” Bad Script 34px `#7A5A42`; PT Serif 13px `#3A342B` — “Жауабыңыз қабылданды. Той иелері сізді қуана күтеді.”; a text button PT Sans 500 10.5px, letter-spacing `.16em`, uppercase, `#8A7A4E` — “Жауапты өзгерту”.

### 8. Countdown (Тойға дейін)
- Heading: Bad Script 36px `#7A5A42`, padding-top 54px.
- Four circles, flex gap 8px, each **75×75**, `border-radius:50%`, `border:1.6px solid #8A7A4E` (the seconds circle uses `#A9846A`), `background:rgba(255,255,255,.3)`:
  - Value: PT Serif 22px `#3A342B` (seconds `#7A5A42`). Days is a plain integer; hours/minutes/seconds are zero-padded to 2 digits.
  - Label: PT Sans 500 8.5px, letter-spacing `.12em`, uppercase, `#8A7A4E` (seconds `#A9846A`) — күн / сағат / минут / секунд.
- Clamp at zero once the ceremony starts (`Math.max(0, target - now)`).

### 9. Hosts (full-bleed photo)
Full-bleed block, `margin-top:52px`, `aspect-ratio:.8`, `overflow:hidden`:
- `hosts-yurt-roof.jpg`, absolutely filled, `object-fit:cover`, `filter:saturate(.72) contrast(.92) brightness(1.06)`.
- Cream veil on top: `linear-gradient(180deg, rgba(247,241,228,.92) 0%, rgba(247,241,228,.28) 26%, rgba(247,241,228,.34) 62%, rgba(247,241,228,.94) 100%)` — blends the photo into the linen page at both edges.
- “Той иелері” — absolutely positioned at `top:58%; transform:translateY(-50%)`, Yeseva One 15px, letter-spacing `.22em`, uppercase, `#7A6A40`, `text-shadow:0 1px 10px rgba(247,241,228,.85)`.
- “Қайрат & Роза” — anchored to the bottom with `padding:0 28px 96px`, Bad Script 42px, line-height 1.2, `#5E5230`, `text-shadow:0 1px 12px rgba(247,241,228,.9)`.

### 10. Closing
Ornament divider (margin-top 40px), then Bad Script 26px `#7A5A42`, padding `18px 30px 0` — “Сіздің келуіңіз — біздің қуанышымыз”.

## Interactions & behavior
- **Reveal on scroll** — every revealable block starts at `opacity:0; translateY(22px)` and transitions to `opacity:1; none` over **1.2s** `cubic-bezier(.22,.61,.36,1)`. Stagger delays inside a block: `.12s`, `.24s`, `.36s`. One-shot (unobserve after firing).
- **Countdown** — 1s interval, recomputed from `Date.now()`, not decremented, so tab-sleep doesn't drift.
- **RSVP** — name (free text) + one of three choices → submit swaps the form for the thank-you panel; “Жауапты өзгерту” returns to the form with values intact.
- **Map** — opens the 2GIS link in a new tab.
- No page transitions, no bottom nav, portrait only. Nothing snappy: keep easing long and soft.

## State
| State | Type | Where | Notes |
|---|---|---|---|
| `now` | number | Countdown | 1s tick |
| `name` | string | Rsvp | controlled input |
| `choice` | `'alone' \| 'spouse' \| 'no' \| null` | Rsvp | radio selection |
| `sent` | boolean | Rsvp | toggles thank-you panel |
| revealed | DOM class | Reveal | not React state; observer adds a class |

Event data (`lib/event.ts`) should be plain config: bride name, ceremony title, ISO date, venue name/line, map URL, host names, verse lines, greeting paragraph. Everything above is currently hard-coded in the prototype.

## Design tokens
Colors
| Token | Hex | Use |
|---|---|---|
| ground | `#F7F1E4` | page / linen base |
| grain | `rgba(138,122,78,.055)` / `.045` | woven texture lines |
| olive-gold | `#8A7A4E` | headers, circle outlines, labels |
| olive-deep | `#6F6238` | names, emphasis |
| olive-darkest | `#5E5230` | verse, host names |
| bronze | `#A9846A` | dividers, corner motifs, seconds ring |
| bronze-light | `#BFA184` | photo frames, input border |
| brown-script | `#7A5A42` | script headings |
| button gradient | `#9A7452 → #7E5B3E` | primary submit |
| button text | `#FBF6EC` | on bronze |
| text | `#3A342B` | body |
| text-strong | `#2E2A24` | input text |
| muted | `rgba(46,42,36,.7)` | helper text |

Type
| Role | Face | Sizes |
|---|---|---|
| Bride name | Caveat 600 | 68 |
| Script headings / verse / host names | Bad Script | 42, 36, 34, 33, 30, 26, 20 |
| Ceremonial uppercase labels | Yeseva One | 15, 14, 13, 12.5, 11.5, 10.5 |
| Body, calendar, form text | PT Serif | 15, 14, 13.5, 13, 12.5, 12, 11 |
| UI labels, buttons | PT Sans 500 | 12.5, 11.5, 10.5, 10, 8.5 |

Radii: `999px` (pills, inputs), `22px` (calendar card), `14px` (radio row), `145/138px` top arch (large photo), `74/68px` top arch (small photo), `16px`/`10px` bottom corners of arches.
Shadows: `0 8px 20px rgba(126,91,62,.28)` (submit only). Text shadows on the hosts photo as noted.
Spacing rhythm: section gaps `52–56px`; inner gaps `18–26px`; horizontal page padding `24–34px`.
Icons: Lucide, stroke-width 2.75 (map-pin, map, check, chevron-down).

## Assets
In `assets/` (user-supplied photographs — licensing is the user's):
| File | Used for | Notes |
|---|---|---|
| `saukele-hero.jpg` | Cover arch | crop `object-position:50% 22%` |
| `verse-background.jpg` | Verse background | shown whole, `background-size:100% 100%` |
| `venue-yurt.jpg` | Venue thumbnail | |
| `hosts-yurt-roof.jpg` | Hosts full-bleed | cream veil on top |
All content photos get `filter: saturate(.8) contrast(.93) brightness(1.04)` (cover uses `.82/.94/1.03`, hosts `.72/.92/1.06`) so they sit back into the cream page.

## Gaps to resolve during implementation
1. RSVP submit has no loading, success-failure or validation design — needs a backend and matching states.
2. Only Cover, Verse, Greeting, Date, Venue, RSVP, Countdown, Hosts and Closing exist. Gallery, share / add-to-calendar and background music (the reference invitations have a play button) are not designed yet.
3. Localization: strings are Kazakh only; if Russian is needed, plan an `lang` param and check line lengths — the uppercase letterspaced blocks are tight at 375px.
4. Accessibility: replace the div-based radios with native inputs, add themed focus rings, `alt` text is present in the prototype but should be reviewed, and honor `prefers-reduced-motion`.

## Files
- `reference/Qyz Uzatu Invitation.dc.html` — the full design (markup + logic) to read values from.
- `reference/ios-frame.jsx` — preview-only device bezel; do not port.
- `assets/*.jpg` — the four photographs.
