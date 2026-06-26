# Portfolio Monorepo

This repo contains three independent apps. Each app owns its dependencies, config, environment files, and deployment target.

## Structure

- `portfolio/`: Main Next.js portfolio app, deployed to Vercel.
- `chatbot/`: Standalone Next.js chatbot widget/API, deployed to Vercel.
- `view-socket/`: Express/WebSocket visit counter service, deployed separately on a VPS.

## Run locally

- Portfolio: `cd portfolio && npm install && npm run dev`
- Chatbot: `cd chatbot && npm install && npm run dev`
- View socket: `cd view-socket && npm install && npm run dev`

## GitHub Actions

- `ci.yaml`: builds/checks portfolio and chatbot.
- `preview.yaml`: deploys portfolio preview builds to Vercel for non-main branch changes under `portfolio/**`.
- `production.yaml`: deploys portfolio production builds to Vercel from `main` for changes under `portfolio/**`.
- `chatbot-preview.yaml`: deploys chatbot preview builds to Vercel for non-main branch changes under `chatbot/**`.
- `chatbot-production.yaml`: deploys chatbot production builds to Vercel from `main` for changes under `chatbot/**`.

## Environment examples

- Portfolio: copy `portfolio/.env.example` to `portfolio/.env.local` locally and add the same required values to the Portfolio Vercel project.
- Chatbot: copy `chatbot/.env.example` to `chatbot/.env.local` locally and add the same required values to the Chatbot Vercel project.
- View socket: copy `view-socket/.env.sample` to `view-socket/.env` locally and configure `MONGODB_URI` on the VPS/Render service.

## Required GitHub secrets

Portfolio Vercel deploys:

- `VERCEL_TOKEN`
- `PORTFOLIO_VERCEL_ORG_ID`
- `PORTFOLIO_VERCEL_PROJECT_ID`

Chatbot Vercel deploys:

- `VERCEL_TOKEN`
- `CHATBOT_VERCEL_ORG_ID`
- `CHATBOT_VERCEL_PROJECT_ID`
