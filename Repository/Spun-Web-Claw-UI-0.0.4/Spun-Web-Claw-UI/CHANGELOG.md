# Changelog

## 0.0.4
- **Conflict Resolution**: Fixed invalid slug/URL for `vapi-calls` to prevent installation conflicts.
- **Server Update**: Added missing `start_call` and `end_call` handlers for VAPI Calls in the server registry.
- **Metadata**: Bumped version to 0.0.4.

## 0.0.3
- **Metadata Fix**: Added `skill.json` for proper OpenClaw skill discovery.
- **Gateway Integration**: Enhanced `openclaw-plugin/package.json` with `openclaw` metadata (icon, route, displayName) to ensure listing on the Gateway dashboard.
- **Plugin Logging**: Added startup logging to `openclaw-plugin` for easier debugging.
- **Core**: Bumped version to 0.0.3.

## 0.0.2
- **New Feature**: Added `openclaw-plugin` for direct integration into OpenClaw Gateway.
- **Enhancement**: Implemented proper Twitter OAuth2 PKCE flow.
- **Fix**: Resolved build errors in skill interfaces.
- **Documentation**: Updated `SKILL.md` with plugin installation instructions.
- **Core**: Bumped version to 0.0.2 across web, server, and plugin modules.

## 0.0.1
- Initial release with basic skill UI and server.
- Support for Brave Search, VAPI Calls, and Twitter basics.
