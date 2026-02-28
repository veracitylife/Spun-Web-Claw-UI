# Changelog

All notable changes to this project will be documented in this file.

## [0.0.1] - 2026-03-01

### Initial Release
*   **Core Architecture**:
    *   Split architecture: Express backend (`server/`) + React frontend (`web/`).
    *   OpenClaw Plugin wrapper (`openclaw-plugin/`) for gateway integration.
    *   Shared versioning logic (`version.ts`) across all packages.

### Features
*   **Browser Automation**:
    *   Integrated Puppeteer in backend for `navigate`, `scrape`, `screenshot` actions.
    *   "Brave Search" skill UI with scraping and login capabilities.
    *   "Browser Use" skill UI with live viewport (screenshot) and navigation controls.
    *   Lazy browser initialization to reduce startup overhead.
*   **Twitter/X Integration**:
    *   Implemented OAuth2 PKCE flow (`/api/twitter/auth`, `/api/twitter/callback`).
    *   Token persistence in `server/data/state.json`.
    *   UI for "Connect X", posting tweets, threading, and scheduling.
*   **Dashboard Integration**:
    *   Consolidated header links to single "OpenClaw Dashboard".
    *   Configurable dashboard URL in Settings (defaults to `http://localhost:18789`).
*   **Documentation**:
    *   Comprehensive guides for Installation, Settings, and Skills.
    *   Versioning and Packaging rules defined.

### Infrastructure
*   **Deployment**:
    *   "No Zip" policy enforcement.
    *   `save_version.ps1` script for uncompressed version backups.
    *   Git-ready folder structure (`GIT/`) excluding dev artifacts.
