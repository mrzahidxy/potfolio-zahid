# Portfolio + View Socket

This repo now holds two independent apps: the Next.js portfolio front end and a small Express/WebSocket service that tracks visits. Each app keeps its own dependencies, config, and env files inside its directory.

## Structure
- `portfolio/`: Next.js app (Vercel); contains `src`, `public`, `scripts`, and `.env*` files.
- `view-socket/`: Express + WebSocket server (Render); contains `src`, `render.yaml`, and its own `.env*` files.

## Run locally
- Portfolio: `cd portfolio && npm install && npm run dev` (or `npm run seed` before dev if you need sample data). Uses `.env.local` in `portfolio/`.
- View socket: `cd view-socket && npm install && npm run dev`. Requires `MONGODB_URI` in `view-socket/.env.local`.

## Deploy
- GitHub Actions already target `./portfolio` for Vercel preview/production.
- Render deploy config for the socket service lives at `view-socket/render.yaml`.
