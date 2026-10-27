import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import rsvpHandler from './api/rsvp';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '16kb' }));

// Exercise the same validation and spreadsheet contract locally and on Vercel.
app.post('/api/rsvp', (req: Request, res: Response) => rsvpHandler(req, res));
app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'Unknown API endpoint. Use Google Sheets for the registry and exports.' });
});

async function start() {
  // Serve public static assets (images, avatars, audio)
  app.use('/assets', express.static(path.resolve(process.cwd(), 'public/assets')));
  app.use('/audio', express.static(path.resolve(process.cwd(), 'public/audio')));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[St Cletus Server] Running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[St Cletus Server] Failed to start:', err);
  process.exit(1);
});
