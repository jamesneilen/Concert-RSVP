import { PatronPassData } from '../data/concertData';

// The public site submits a visitor's RSVP; it never reads the attendee registry.
export async function submitRsvpToSpreadsheet(patron: PatronPassData): Promise<{
  success: boolean;
  message: string;
}> {
  const res = await fetch('/api/rsvp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patron),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Could not save your RSVP. Please try again.');
  }
  return { success: true, message: data.message };
}
