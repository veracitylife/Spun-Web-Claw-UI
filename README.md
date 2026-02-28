# ClawSkillUI

A comprehensive UI and skill integration platform for OpenClaw, featuring advanced browser automation (Puppeteer), social media management (Twitter/X OAuth2), and a suite of productivity skills.

## Overview
ClawSkillUI extends the OpenClaw ecosystem by providing:
1.  **A Rich Web Interface**: Manage skills, settings, and automation workflows visually.
2.  **Backend Skill Server**: Dedicated Express server handling Puppeteer browser automation, Twitter OAuth2 flow, and persistent state.
3.  **OpenClaw Plugin**: Seamless integration into the OpenClaw gateway as a native plugin.

## Key Features
*   **Browser Automation**: Built-in Puppeteer support for scraping, navigation, and screenshot capture (via Brave Search & Browser Use skills).
*   **Twitter/X Integration**: Full OAuth2 authentication flow, tweet posting, threading, and scheduling.
*   **Dashboard Integration**: Unified access to the OpenClaw Dashboard and Chat.
*   **Skill Management**: Visual interface to enable/disable/configure skills like Google Calendar, Notion, Spotify, and more.
*   **Developer Friendly**: TypeScript backend, React frontend, and easy plugin installation.

## Installation
For detailed installation instructions, please refer to [documentation.md](./documentation.md).

### Quick Start
1.  **Server**: Run `npm start` in the `server` directory.
2.  **Plugin**: Install the `openclaw-plugin` folder into your OpenClaw instance.
3.  **UI**: Access at `http://localhost:18789/claw-skill-ui`.

## Documentation
Full documentation is available in [documentation.md](./documentation.md), covering:
*   Prerequisites & Setup
*   Configuration & Settings
*   Skill Usage Guides (Brave Search, Browser Use, Twitter, etc.)
*   Security Best Practices

## Versioning
This project follows strict versioning rules.
*   **Current Version**: 0.0.1
*   **Versioning Policy**: Increment by 0.0.1 for every change.
*   **Packaging**: Always saved as uncompressed folders. **Never zipped.**

## License
MIT
