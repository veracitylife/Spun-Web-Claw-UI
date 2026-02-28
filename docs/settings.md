# Settings Guide

Open “Settings” in the top navigation to connect and configure.

## Connection
- OpenClaw API URL: your server base (UI auto-appends `/api` if missing). Example: `http://localhost:3001/api`
- API Access Token: if the server sets `CLAWHUB_TOKEN`, paste it here (used in `X-Claw-Token`)
- Save & Connect: persists values and reloads the skills list
- Test Connection: validates server reachability with current settings

## Gateway Links
- Gateway URL: default local gateway is `http://localhost:18789` (binds to 127.0.0.1)
- Better Gateway URL: e.g., `http://localhost:18789/better-gateway/`
- These render as header links (“Gateway”, “Better Gateway”), opening in a new tab

Security note: The default gateway port 18789 is intentionally local-only. Avoid exposing it publicly without TLS, authentication, or a secure tunnel.

## Puppeteer
- Headless: run without a visible window (recommended for servers)
- Proxy: optional proxy URL `http://user:pass@host:port` (applies at browser launch)
- Saved server-side and used by Puppeteer on next session

## Skills Management
- Install/Uninstall: toggle installation state
- Enabled: quickly enable or disable a skill

## Paths
- Screenshot path (client-side hint) used by Brave Search UI for guidance
