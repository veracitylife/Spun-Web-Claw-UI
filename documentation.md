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
4. Start the server (TypeScript runtime):
   - `npx ts-node src/index.ts`
5. API base (default): `http://localhost:3001/api`

Notes:
- First run may download a compatible Chromium for Puppeteer.
- The server persists state in `server/data/state.json` (skills, Brave saved queries, Twitter tokens, Puppeteer settings).

## 4) Web Installation
1. Open a terminal in `web/`
2. Install dependencies:
   - `npm install`
3. Start dev server:
   - `npm run dev`
4. Open the UI at the printed Vite URL (e.g., `http://localhost:5173`)

## 5) Initial Configuration (Settings page)
Open “Settings” in the top nav.
- OpenClaw API URL
  - Set to your server base; the UI auto-appends “/api” if missing, but prefer entering the full URL, e.g., `http://localhost:3001/api`.
- API Access Token
  - If `CLAWHUB_TOKEN` is set on the server, paste the same value here. All requests include it in `X-Claw-Token`.
- Puppeteer Settings
  - Headless: run without a visible window
  - Proxy: optional proxy URL (`http://user:pass@host:port`)
  - Click “Save & Connect” to persist
- Test Connection
  - Verifies the UI can reach the server with your settings
- Skills Table
  - Install/Uninstall: change installed status
  - Enabled: toggle availability

## 6) Security
- Server-only secrets: keep `.env` out of source control
- Token auth: set `CLAWHUB_TOKEN` server-side and mirror it in Settings
- The UI never logs credentials; avoid storing provider passwords unless required

## 7) Skill Overview and Usage

### OpenClaw Dashboard (original BuddyClaw)
- Top bar → “OpenClaw Dashboard”
- Provides the original BuddyClaw chat/skill view mounted by skill id (`/skill/buddyclaw`)

### OpenClaw Chat (Enhanced)
- Top bar → “OpenClaw Chat”
- Left panel: 12+ script buttons with default commands
  - Click to send the script to BuddyClaw
  - “Customize” to edit the script content, then “Save”
- Right panel: chat history with BuddyClaw
- Use cases: list skills, enable a skill, run CLI commands via TRAE, quick web tasks

### Brave Search
- Location: “Brave Search” skill
- Modes (sidebar):
  - Search: build queries using operator buttons; “Save Current Query” persists to backend; load from “Saved Queries”
  - Scrape: extract Text, Links, Images, or content by CSS selector on `url`
    - Results show in a scrollable panel; copy as needed
  - Login: attempt site login with username/password and optional custom selectors
- Backend:
  - `scrape` and `login` use Puppeteer; outputs are returned as JSON and formatted by the UI
  - Saved queries persist via `/api/brave/saved-queries`

### Browser Use
- Location: “Browser Use” skill
- Controls:
  - Enter URL and click Go to navigate (Puppeteer)
  - “Run Agent” sends free-form instructions (acknowledged by server for now)
  - “Refresh” captures a new screenshot
- Viewport:
  - Shows live screenshots (`get_screenshot`); use Refresh to update
- Stop:
  - Stops and closes the Puppeteer browser session

### VAPI Calls (Call Center)
- Tabs:
  - Dialer: keypad, connect/hang-up, recent calls (mock log)
  - Campaigns: create/start/pause campaigns, view progress
  - Contacts: add/edit/delete contacts; CSV import placeholder
  - Scripts: author templates with `{variable}` placeholders
- Notes:
  - Replace mock call endpoints with your VAPI provider when ready

### X / Twitter
- Connection:
  - “Connect Twitter” opens the OAuth2 flow; upon success, the server stores tokens
  - “Disconnect” revokes local tokens
- Compose:
  - Home tab: quick single tweet via `post_tweet`
- Automation:
  - Thread Composer: one tweet per line; posts sequentially via `post_thread`
  - Schedule Tweet: select date/time and text; demo posts immediately with scheduled time noted
- Requirements:
  - Set `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`, `TWITTER_CALLBACK_URL` in server `.env`

### Notion, Calendly, Google Calendar, Spotify, WhatsApp, YouTube*, OpenAI*
- The UIs present provider-specific actions and placeholders
- Wire provider OAuth and API calls to the server registry following the Brave/Twitter patterns
- Replace mock lists with real data once credentials are configured

## 8) Advanced Configuration
- Server Persistence
  - State file: `server/data/state.json` (skills, Brave queries, Twitter, Puppeteer)
- Puppeteer
  - Headless and proxy are adjustable in Settings
  - For troubleshooting, disable headless and observe behavior
- Networking
  - If hosting remotely, expose the server port and ensure CORS allows your web origin

## 9) Troubleshooting
- UI can’t connect
  - Verify API URL includes `/api` or rely on auto-append
  - Use “Test Connection” in Settings
  - Check server port and machine firewall
- Puppeteer errors
  - First run downloads Chromium; ensure internet is available
  - Disable headless in Settings for debugging
  - Set a proxy if pages are blocked regionally
- Twitter
  - Ensure correct OAuth2 credentials and callback URL
  - Re-run “Connect Twitter” if token expired or removed

## 10) Extending Skills
1. Add server handlers in the command registry (`server/src/index.ts`)
   - Validate inputs, call provider SDKs/services, and return `{ success, output }`
2. Add client actions using `runSkillCommand(skillId, command, args)` in the corresponding UI
3. Persist any per-skill configuration using `server/src/state.ts` and create lightweight endpoints for CRUD

## 11) Quick Commands (Reference)
- Server (dev): `npx ts-node src/index.ts`
- Web (dev): `npm run dev`
- Default API base: `http://localhost:3001/api`

You now have a working OpenClaw UI with real browser automation via Puppeteer and Twitter automation via OAuth. Configure provider credentials, tune Puppeteer, and continue wiring additional skills using the provided patterns.

