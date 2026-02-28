# Spun Web Claw UI

A comprehensive UI dashboard and skill interface for OpenClaw.

## Description
This skill provides a web-based interface for managing OpenClaw skills, including VAPI Calls, Brave Search, Browser Use, Twitter automation, and more. It integrates seamlessly with the OpenClaw ecosystem.

## Features
- **Interactive Dashboard**: Monitor skill status and activity.
- **Skill Management**: Enable/disable and configure skills.
- **VAPI Calls**: Voice API integration with dialer and campaign management.
- **Brave Search & Browser Use**: Web scraping and browsing capabilities.
- **Twitter/X Automation**: OAuth2 integration for posting and scheduling.

## Installation

### Manual Server & Web UI
1. Clone the repository into your OpenClaw skills directory.
2. Run `npm install` in the `web` directory.
3. Run `npm run build` in the `web` directory.
4. Run `npm install` in the `server` directory.
5. Start the server with `npm start`.

### OpenClaw Gateway Plugin (Optional)
To integrate the UI directly into your OpenClaw Gateway (similar to Better Gateway):
1. Ensure you have built the web UI (steps 1-3 above).
2. Run: `openclaw plugins install ./openclaw-plugin` (from the project root).
3. Restart your OpenClaw Gateway.
4. The UI will be available at `/claw-skill-ui` on your Gateway.

## Configuration
Refer to `docs/settings.md` for detailed configuration instructions.

## License
ISC
