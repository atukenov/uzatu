'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { RsvpChoice } from './event';
import { notifyTelegram } from './telegram';

// Local JSON store — works for a self-hosted/Node deployment, but a serverless host
// like Vercel has a read-only filesystem outside /tmp, so this write is best-effort
// (see below) and Telegram is the actual source of truth for who responded there.
const DATA_FILE = path.join(process.cwd(), 'data', 'rsvp.json');

interface RsvpEntry {
  name: string;
  choice: RsvpChoice;
  submittedAt: string;
}

export type SubmitRsvpResult = { ok: true } | { ok: false; error: string };

export async function submitRsvp(input: { name: string; choice: RsvpChoice | null }): Promise<SubmitRsvpResult> {
  const name = input.name.trim();
  if (!name) {
    return { ok: false, error: 'Аты-жөніңізді жазыңыз.' };
  }
  if (input.choice !== 'alone' && input.choice !== 'spouse' && input.choice !== 'no') {
    return { ok: false, error: 'Жауабыңызды таңдаңыз.' };
  }

  const entry: RsvpEntry = { name, choice: input.choice, submittedAt: new Date().toISOString() };

  try {
    let entries: RsvpEntry[] = [];
    try {
      const raw = await fs.readFile(DATA_FILE, 'utf-8');
      entries = JSON.parse(raw);
    } catch {
      entries = [];
    }
    entries.push(entry);
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  } catch (err) {
    // Read-only filesystem on serverless hosts, most likely — not fatal, since
    // notifyTelegram() below is the actual "who responded" record there.
    console.error('Failed to persist RSVP to local file', err);
  }

  try {
    await notifyTelegram(entry);
  } catch (err) {
    console.error('Failed to notify Telegram', err);
  }

  return { ok: true };
}
