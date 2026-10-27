import { test } from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/rsvp';
import type { IncomingMessage, ServerResponse } from 'node:http';

test('RSVP validates input and requires upstream confirmation', async () => {
  const savedFetch = globalThis.fetch;
  const savedWebhook = process.env.GOOGLE_SHEET_WEBHOOK_URL;
  const payload = { fullName: 'Test Attendee', passCode: `CK-2026-XMAS-${crypto.randomUUID()}`, guestCount: 2 };
  let writes: Record<string, unknown>[] = [];
  async function invoke(body: unknown, method = 'POST', type = 'application/json') {
    let result: {success?: boolean} = {};
    const res = { statusCode: 200, setHeader() {}, end(value: string) { result = JSON.parse(value); } };
    await handler({ method, headers: {'content-type': type}, body } as unknown as IncomingMessage, res as unknown as ServerResponse);
    return {status: res.statusCode, body: result};
  }
  try {
    process.env.GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/test/exec';
    globalThis.fetch = async (_url, init) => {
      writes.push(JSON.parse(init!.body as string));
      return new Response(JSON.stringify({success: true}));
    };
    assert.equal((await invoke(payload, 'GET')).status, 405);
    assert.equal((await invoke(payload, 'POST', 'text/plain')).status, 415);
    assert.equal((await invoke('{')).status, 400);
    assert.equal((await invoke({...payload, passCode: 'legacy'})).status, 400);
    assert.equal((await invoke({...payload, guestCount: 21})).status, 400);
    assert.equal((await invoke({...payload, fullName: 'x'.repeat(151)})).status, 400);
    assert.equal((await invoke({...payload, photoUrl: 'x'.repeat(17000)})).status, 413);
    assert.equal(writes.length, 0);
    assert.equal((await invoke(payload)).body.success, true);
    assert.equal((await invoke(payload)).body.success, true);
    assert.equal(writes[0].passCode, writes[1].passCode);
    assert.equal('photoUrl' in writes[0], false);
    globalThis.fetch = async () => new Response('<html>Login</html>');
    assert.equal((await invoke(payload)).status, 502);
    globalThis.fetch = async () => new Response(JSON.stringify({success: false}));
    assert.equal((await invoke(payload)).status, 502);
    delete process.env.GOOGLE_SHEET_WEBHOOK_URL;
    assert.equal((await invoke(payload)).status, 503);
  } finally {
    globalThis.fetch = savedFetch;
    if (savedWebhook === undefined) delete process.env.GOOGLE_SHEET_WEBHOOK_URL;
    else process.env.GOOGLE_SHEET_WEBHOOK_URL = savedWebhook;
  }
});

test('client excludes photos and does not confirm failed saves locally', async () => {
  const { submitRsvpToSpreadsheet } = await import('../src/services/rsvpRegistryService');
  const { INITIAL_PATRON } = await import('../src/data/concertData');
  const savedFetch = globalThis.fetch;
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  const stored = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, value),
  }});
  const patron = {...INITIAL_PATRON, passCode: `CK-2026-XMAS-${crypto.randomUUID()}`, photoUrl: 'data:image/jpeg;base64,large-photo'};
  try {
    globalThis.fetch = async (_url, init) => {
      const payload = JSON.parse(init!.body as string);
      assert.equal('photoUrl' in payload, false);
      assert.equal(payload.passCode, patron.passCode);
      return new Response(JSON.stringify({error: 'Contact organizers before retrying.'}), {status: 502});
    };
    const failure = await submitRsvpToSpreadsheet(patron);
    assert.equal(failure.success, false);
    assert.match(failure.message, /before retrying/);
    assert.equal(stored.size, 0);
    globalThis.fetch = async () => new Response(JSON.stringify({success: true}));
    assert.equal((await submitRsvpToSpreadsheet(patron)).success, true);
    const backup = JSON.parse([...stored.values()][0]);
    assert.equal(backup[0].passCode, patron.passCode);
    assert.equal('photoUrl' in backup[0], false);
  } finally {
    globalThis.fetch = savedFetch;
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
});
