# OpenClaw Telegram Mini App

Mini app with three bottom navigation tabs: **Chat**, **Approvals**, and **Settings**. Clear separation of responsibilities: Chat for conversation and explanation, Approvals for fast swipe-based decisions, Settings for gesture configuration.

## Structure

- **Chat** — Full-screen conversational UI. AI agents explain reasoning, ask questions, and notify when actions need approval. They never force decisions inline; approvals are handled in the Approvals tab.
- **Approvals** — One card at a time. Each card is an AI-generated action requiring consent (title, priority tag, context, counter e.g. 1 of 12). Swipe right/left/up/down per Settings; tap to expand for full context, metrics, stakeholders, confidence, timeline, and action buttons. Swipe up opens the detail view with feedback field for human review.
- **Settings** — Configure what each swipe direction does globally (approve, reject, human review, snooze, dismiss). Changes apply immediately in Approvals and are persisted in `localStorage`.

## Setup

- Node 18+
- Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` and `VITE_TELEGRAM_BOT_USERNAME` (no hardcoded secrets).

```bash
cp .env.example .env
npm install
npm run dev
```

- **Build:** `npm run build` → output in `dist/`.
- **Preview:** `npm run preview` (serves `dist/`).

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL (optional for local UI). |
| `VITE_TELEGRAM_BOT_USERNAME` | Bot username for Telegram Web App context. |
| `PORT` | Dev server port (default 5173). |

## Docker

Build and run the static app with a small web server:

```bash
docker build -t openclaw-mini-app .
docker run -p 8080:8080 -e VITE_APP_URL=https://your-domain.com openclaw-mini-app
```

Serve the built files over HTTPS when opening as a Telegram Web App.

## Tech

- React 18, TypeScript, Vite
- Telegram Web App script loaded in `index.html` for theme/viewport
- Config in `src/config.ts` (env only); gesture settings in `src/hooks/useGestureSettings.ts` with `localStorage` persistence
