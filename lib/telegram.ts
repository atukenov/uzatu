import { RSVP_CHOICES, type RsvpChoice } from './event';

interface RsvpEntry {
  name: string;
  choice: RsvpChoice;
  submittedAt: string;
}

function choiceLabel(choice: RsvpChoice): string {
  return RSVP_CHOICES.find((c) => c.value === choice)?.label ?? choice;
}

// Best-effort notification to the host's Telegram — set TELEGRAM_BOT_TOKEN and
// TELEGRAM_CHAT_ID (see .env.example) to enable it. Silently does nothing if
// unconfigured, so RSVPs still work before this is set up.
export async function notifyTelegram(entry: RsvpEntry): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const submittedAtLocal = new Date(entry.submittedAt).toLocaleString('kk-KZ', {
    timeZone: 'Asia/Almaty',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const text = [
    '🎉 Жаңа RSVP жауабы',
    `Аты-жөні: ${entry.name}`,
    `Жауабы: ${choiceLabel(entry.choice)}`,
    `Уақыты: ${submittedAtLocal}`,
  ].join('\n');

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!response.ok) {
    throw new Error(`Telegram API responded with ${response.status}`);
  }
}
