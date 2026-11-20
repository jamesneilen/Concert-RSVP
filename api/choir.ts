import { createHash } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { page, editor } from '../choir/page.js';

export default function choir(req: IncomingMessage & {body?: unknown}, res: ServerResponse) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  const cookies = req.headers.cookie?.split(/;\s*/) ?? [];
  const cookie = cookies.find(s => s.startsWith('choir_member='))?.slice('choir_member='.length);
  const form = typeof req.body === 'string' ? Object.fromEntries(new URLSearchParams(req.body)) : req.body as Record<string,unknown> | undefined;
  const flags = 'Path=/api/choir; HttpOnly; SameSite=Strict' + (process.env.NODE_ENV === 'production' || process.env.VERCEL ? '; Secure' : '');
  const login = (message: string) => res.end(page('<h1>Choir member access</h1><p>Enter the personal access code issued to you by the choir.</p><form method="post"><label>Member code<input name="code" type="password" required autocomplete="current-password" maxlength="64"></label><button>Open my flyer studio</button></form><p role="status">'+message+'</p><a href="/">Concert home</a>'));
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST');
    return res.end();
  }
  if (req.method === 'POST' && form?.action === 'logout') {
    res.setHeader('Set-Cookie', 'choir_member=; Max-Age=0; '+flags);
    res.writeHead(303, {Location:'/api/choir'});
    return res.end();
  }
  const code = req.method === 'POST' ? form?.code : cookie;
  const allowed = new Set((process.env.CHOIR_MEMBER_HASHES ?? '').split(',').map(s => s.trim()).filter(Boolean));
  if (typeof code !== 'string' || !/^[A-Za-z0-9_-]{32}$/.test(code) || !allowed.has(createHash('sha256').update(code).digest('hex'))) {
    if (req.method === 'POST') res.statusCode = 403;
    return login(req.method === 'POST' ? 'That code was not recognised. Check with the choir secretariat.' : '');
  }
  if (req.method === 'POST') {
    res.setHeader('Set-Cookie', 'choir_member='+code+'; Max-Age=14400; '+flags);
    res.writeHead(303, {Location:'/api/choir'});
    return res.end();
  }
  res.end(page(editor));
}
