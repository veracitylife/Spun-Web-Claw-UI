# Skill Usage Guide

## OpenClaw Dashboard (Original)
- Header → “OpenClaw Dashboard” opens the BuddyClaw skill view
- Route: `/skill/buddyclaw`

## OpenClaw Chat (Enhanced)
- Header → “OpenClaw Chat”
- Scripts panel: click buttons to send predefined commands; edit with “Customize” then “Save”
- Chat panel: see conversation with BuddyClaw

## Brave Search
- Modes:
  - Search: build with operators; Save Current Query (persists to server), load from Saved Queries
  - Scrape: choose Text/Links/Images or CSS selector; results show in the panel
  - Login: set credentials and optional selectors; server attempts login via Puppeteer
- Tips:
  - Use specific selectors (e.g., `#content`, `.article h2`) for targeted extraction
  - Saved queries survive server restarts

## Browser Use
- Enter URL → Go to navigate (Puppeteer)
- Run Agent: send free-form instructions (acknowledged server-side)
- Refresh: capture a fresh screenshot
- Stop: stop and reset the browser session

## VAPI Calls (Call Center)
- Dialer: keypad, connect/hang-up, call log
- Campaigns: create, start/pause, view progress
- Contacts: add/edit/delete (CSV import placeholder)
- Scripts: templates with `{variable}` placeholders

## X / Twitter
- Connect Twitter: OAuth2 flow in a new tab; status saved server-side
- Home: compose and send a tweet (`post_tweet`)
- Automation:
  - Thread Composer: one tweet per line; posts sequentially (`post_thread`)
  - Schedule Tweet: choose time and text (demo posts immediately, tag includes time)
- Disconnect: clears saved tokens server-side

## Other Skills (Notion, Calendly, Google Calendar, Spotify, WhatsApp, YouTube*, OpenAI*)
- UIs present actions and placeholders
- Wire provider OAuth and API calls on the server following Brave/Twitter patterns
- Replace mock lists with real results when credentials are configured

## Troubleshooting
- If scraping fails:
  - Disable headless in Settings to debug visually
  - Verify proxy settings if pages are geo-locked
- If Twitter actions fail:
  - Re-run Connect; ensure correct client ID/secret and callback URL

