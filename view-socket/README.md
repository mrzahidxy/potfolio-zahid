# portfolio-view-socket

Realtime visit counter served over Express + WebSocket. The REST API owns all visit count mutations while the WebSocket layer only broadcasts whatever value is already stored.

## Development

```bash
npm install
npm run dev
```

## API

- `POST /api/visit`: increments the visit counter (call once when someone loads the site).
- `GET /api/visit`: returns the current visit counter without mutating it.
- WebSocket clients receive `{ type: "visit_count", count: number }` payloads whenever the counter changes.

## Production / Render

The repo includes `render.yaml` which provisions a Render web service with `npm start` as the start command. The `prestart` script compiles TypeScript before boot so no custom build hook is necessary. Copy `.env.sample` to `.env.local` locally and set `MONGODB_URI` there, plus `ALLOWED_ORIGINS` if you need a restricted CORS allowlist.
