'use server';

import { promises as fs } from 'fs';
import path from 'path';
import type { RsvpChoice } from './event';
import { notifyTelegram } from './telegram';

// Local JSON store — fine for a self-hosted/Node deployment of a one-off invitation
// site. If this ever moves to a serverless/edge host with a read-only filesystem,
// swap this for a real datastore; the submitRsvp() contract below wouldn't need to change.
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
  } catch {
    return { ok: false, error: 'Жауапты жіберу мүмкін болмады. Кейінірек қайталап көріңіз.' };
  }

  try {
    await notifyTelegram(entry);
  } catch (err) {
    // The RSVP is already saved — a failed notification shouldn't fail the submission.
    console.error('Failed to notify Telegram', err);
  }

  return { ok: true };
}
