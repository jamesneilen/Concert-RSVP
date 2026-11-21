import type { IncomingMessage, ServerResponse } from 'node:http';

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  const send = (status: number, success: boolean) => {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify({ success }));
  };
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(405, false);
  }
  let body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); }
  catch { return send(400, false); }
  const record = body as Record<string, unknown> | undefined;
  const id = record?.id;
  const performer = typeof record?.performer === 'string' ? record.performer.trim() : '';
  const role = typeof record?.role === 'string' ? record.role.trim() : '';
  if (typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id) ||
      !performer || performer.length > 90 || !role || role.length > 42) return send(400, false);

  const url = process.env.PERFORMER_SHEET_WEBHOOK_URL;
  const token = process.env.PERFORMER_SHEET_TOKEN;
  if (!url || !token) return send(503, false);

  try {
    const upstream = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ id, performer, role, token }), signal: AbortSignal.timeout(8000),
    });
    const result = await upstream.json();
    return upstream.ok && result.success === true ? send(200, true) : send(502, false);
  } catch {
    return send(502, false);
  }
}
