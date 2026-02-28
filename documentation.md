# ClawSkillUI + OpenClaw: Installation, Configuration, and Skill Guide

This document explains how to run the ClawSkillUI (web + server), connect it to your OpenClaw environment, configure security and automation settings, and use each skill interface.

## 1) Prerequisites
- Node.js 18+ and npm
- Windows, macOS, or Linux
- Outbound network access (for provider APIs and Puppeteer downloads)
- Optional: Twitter developer app (OAuth2)

## 2) Project Layout
- server/ — Express API with command registry, persistence, Puppeteer handlers, and Twitter OAuth
- web/ — Vite React application with skill UIs and settings
- openclaw-plugin/ — Plugin entry point for OpenClaw gateway integration

## 3) Server Installation
1. Open a terminal in `server/`
2. Install dependencies:
   - `npm install`
3. Configure environment (create `.env` in `server/`):
   - `PORT=3001` (optional)
   - `CLAWHUB_TOKEN=<optional_api_token>`
   - `TWITTER_CLIENT_ID=<from developer portal>`
   - `TWITTER_CLIENT_SECRET=<from developer portal>`
   - `TWITTER_CALLBACK_URL=http://localhost:3001/api/twitter/callback` (or your public URL)
4. Start the server:
   - `npm start` (runs `ts-node src/index.ts`)
5. API base (default): `http://localhost:3001/api`

Notes:
- First run may download a compatible Chromium for Puppeteer.
- The server persists state in `server/data/state.json` (skills, Brave saved queries, Twitter tokens, Puppeteer settings).

## 4) Web Installation & Plugin Setup
The Web UI is deployed as an OpenClaw plugin.

1. **Build the Web UI**:
   - Open a terminal in `web/`
   - Run `npm install`
   - Run `npm run build`
   - Copy the contents of `web/dist` to `openclaw-plugin/dist` (create folder if missing).

2. **Install Plugin**:
   - Run `openclaw plugins install /path/to/ClawSkillUI/openclaw-plugin`
   - Restart OpenClaw.

3. **Access**:
   - Open `http://localhost:18789/claw-skill-ui` (or your gateway URL).

## 5) Initial Configuration (Settings page)
Open “Settings” in the top nav.
- OpenClaw Dashboard URL
  - Set to your OpenClaw dashboard location (default: `http://localhost:18789`).
- OpenClaw API URL
  - Set to your server base; e.g., `http://localhost:3001/api`.
- API Access Token
  - If `CLAWHUB_TOKEN` is set on the server, paste the same value here.
- Puppeteer Settings
  - Headless: run without a visible window
  - Proxy: optional proxy URL
  - Click “Save & Connect” to persist
- Skills Table
  - Install/Uninstall: change installed status
  - Enabled: toggle availability

## 6) Security
- Server-only secrets: keep `.env` out of source control
- Token auth: set `CLAWHUB_TOKEN` server-side and mirror it in Settings
- The UI never logs credentials; avoid storing provider passwords unless required
- **Gateway Binding**: By default, OpenClaw binds to localhost. Do not expose to public internet without TLS/Auth.

## 7) Skill Overview and Usage

### OpenClaw Dashboard
- Top bar → “OpenClaw Dashboard”
- Opens your main OpenClaw dashboard in a new tab.

### OpenClaw Chat (Enhanced)
- Top bar → “OpenClaw Chat”
- Left panel: Script buttons with default commands (customizable).
- Right panel: Chat interface for direct interaction.

### Brave Search
- Location: “Brave Search” skill
- **Search**: Build queries, save them to backend.
- **Scrape**: Extract text/links/images via Puppeteer.
- **Login**: Automated login helper (requires selectors).

### Browser Use
- Location: “Browser Use” skill
- **Navigation**: Enter URL and go.
- **Viewport**: Live screenshots from the server's Puppeteer instance.
- **Run Agent**: Send instructions for browser automation tasks.

### Twitter/X
- Location: "Twitter" skill
- **Connect**: Click "Connect X" to authenticate via OAuth2.
- **Post**: Send tweets directly.
- **Thread**: Create threaded conversations.
- **Schedule**: Plan tweets for later.

### Other Skills
- **VAPI Calls**: Dialer interface.
- **Spotify**: Playback control.
- **Notion**: Page management.
- **Google Calendar**: Event scheduling.
