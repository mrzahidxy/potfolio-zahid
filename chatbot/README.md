# Portfolio Chatbot

Standalone MVP chatbot for Zahid's portfolio. It uses Next.js App Router, TypeScript, Tailwind CSS, and the Groq Chat Completions API. The app can be deployed independently and embedded into the main portfolio later.

## Features

- Landing/test page at `/`
- Embeddable iframe-ready widget at `/widget`
- POST API route at `/api/chat`
- Groq model defaults to `llama-3.1-8b-instant`
- Portfolio-only assistant behavior using `src/data/portfolio-context.ts`
- Basic input validation, message limits, and IP rate limiting
- Optional Upstash Redis rate limiting with in-memory fallback

## Setup

```bash
npm install
cp .env.example .env.local
```

Add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant

# Optional Redis rate limiting for production/Vercel
UPSTASH_REDIS_REST_URL=your_upstash_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
```

## Redis rate limiting

Redis is optional but recommended for production deployments. If `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, the API uses Upstash Redis for shared IP-based rate limiting across Vercel instances.

If those variables are missing or Redis is temporarily unavailable, the app falls back to the local in-memory limiter so local development and simple deployments still work.

Default limit:

```txt
20 requests per IP per 60 seconds
```

### Why Upstash instead of a normal Redis connection?

A normal Redis setup usually uses a long-lived TCP connection from a server to Redis. That works well for VPS/Docker/long-running backend apps, but it is less ideal for Vercel serverless functions because functions start/stop often and multiple instances can create many connections.

Upstash provides Redis over HTTPS REST, so the app can call Redis with `fetch()` from a serverless function. This project uses that REST approach and does not require an extra Redis client package.

### Required Upstash values

Create an Upstash Redis database and copy these values into local `.env` or Vercel Environment Variables:

```env
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

Do not put real Upstash credentials in `.env.example` or commit them to git.

### Verify Redis is working

Direct Upstash check:

```bash
curl "$UPSTASH_REDIS_REST_URL/ping" \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
```

Expected response:

```json
{"result":"PONG"}
```

App rate-limit check:

```bash
for i in {1..25}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"messages":[]}'
done
```

Expected behavior: early requests return `400` because the body is invalid, then requests become `429` after the rate limit is reached. To confirm Redis specifically, check the Upstash dashboard for command activity or temporary keys beginning with `rate-limit:`.

## Local development

```bash
npm run dev
```

Open:

- `http://localhost:3000` for the test page
- `http://localhost:3000/widget` for the embeddable widget

## Portfolio context

Update Zahid's details in:

```txt
src/data/portfolio-context.ts
```

Replace placeholder GitHub, LinkedIn, portfolio, email, location, and project details before production use.

## API

`POST /api/chat`

Request:

```json
{
  "messages": [{ "role": "user", "content": "Who is Zahid?" }]
}
```

Response:

```json
{
  "reply": "..."
}
```

The Groq API key is read only on the server from `GROQ_API_KEY` and is never exposed to the browser.

## Deploy to Vercel

1. Push this project to GitHub.
2. Import it in Vercel.
3. Confirm Vercel uses Node.js `>=20.9.0`.
4. Add environment variables in Vercel Project Settings:
   - `GROQ_API_KEY` required
   - `GROQ_MODEL` optional, default: `llama-3.1-8b-instant`
   - `UPSTASH_REDIS_REST_URL` optional, recommended for production rate limiting
   - `UPSTASH_REDIS_REST_TOKEN` optional, recommended for production rate limiting
5. Deploy.
6. After deployment, test:
   - `https://YOUR_CHATBOT_DOMAIN/`
   - `https://YOUR_CHATBOT_DOMAIN/widget`
   - `POST https://YOUR_CHATBOT_DOMAIN/api/chat`

## Iframe integration

After deployment, embed the widget in the main portfolio:

```html
<iframe
  src="https://YOUR_CHATBOT_DOMAIN/widget"
  width="400"
  height="600"
  style="border:0;"
></iframe>
```

For mobile layouts, wrap the iframe in a responsive container or set `width="100%"` with a max width.

## Future improvements

- Add streaming responses
- Add a polished launcher button for embedded mode
- Replace placeholders with verified portfolio data
- Add analytics for common visitor questions
- Add persistent conversation storage if needed
- Add RAG/vector search when the portfolio content grows
