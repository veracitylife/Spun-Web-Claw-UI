# Install: ClawSkillUI + OpenClaw

## Prerequisites
- Node.js 18+ and npm
- Windows/macOS/Linux
- Optional: Twitter developer app (OAuth2)

## Clone & Layout
- server/ — Express API (Puppeteer, Twitter OAuth, persistence)
- web/ — Vite React UI (skills and settings)

## Server Setup
1. In `server/`:
   - `npm install`
2. Create `server/.env`:
   - `PORT=3001` (optional)
   - `CLAWHUB_TOKEN=<optional_api_token>`
   - `TWITTER_CLIENT_ID=<from developer portal>`
   - `TWITTER_CLIENT_SECRET=<from developer portal>`
   - `TWITTER_CALLBACK_URL=http://localhost:3001/api/twitter/callback`
3. Start:
   - `npx ts-node src/index.ts`
4. Default API base: `http://localhost:3001/api`

Notes:
- First run downloads Chromium for Puppeteer.
- State persists in `server/data/state.json`.

## Web Setup
1. In `web/`:
   - `npm install`
2. Start:
   - `npm run dev`
3. Open Vite URL (e.g., `http://localhost:5173`)

## OpenClaw Integration
You can link to your existing OpenClaw Gateway and Better Gateway directly from the UI header.

### Better Gateway Plugin
- Package: @thisisjeron/openclaw-better-gateway
- Install on your Gateway:
  - `openclaw plugins install @thisisjeron/openclaw-better-gateway`
  - Restart your gateway
- Visit after install: `https://<YOUR_GATEWAY>/better-gateway/`
- Config example (openclaw.json):
```json
{
  "plugins": {
    "entries": {
      "openclaw-better-gateway": {
        "enabled": true,
        "reconnectIntervalMs": 3000,
        "maxReconnectAttempts": 10,
        "maxFileSize": 10485760
      }
    }
  }
}
```

### Header Links
- In Settings, set:
  - Gateway URL (default local gateway: `http://localhost:18789`)
  - Better Gateway URL (e.g., `http://localhost:18789/better-gateway/`)
- The top bar shows “Gateway” and “Better Gateway” links that open in a new tab.

## Default Gateway and Security
- Default host/port: `http://localhost:18789` bound to `127.0.0.1`
- Rationale: the gateway can access your system (files, shell, etc.), so binding to localhost by default is a critical safety measure.
- Do not expose port 18789 directly to the public internet without hardening:
  - Use TLS and authentication
  - Prefer secure tunnels (e.g., SSH) when remote access is required
