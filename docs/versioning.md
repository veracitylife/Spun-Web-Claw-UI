# Versioning & Packaging

## Version
- Current version: 0.0.1
- Update markers:
  - web/package.json
  - server/package.json
  - web/src/version.ts
  - server/src/version.ts (logged on server start)

## Repository Packaging
- Repository root for versions:
  - `C:\Users\disru\Documents\clawhub\ClawSkillUI\Repository`
- Folder layout:
  - `{name}-{version}\{name}`
  - Example: `ClawSkillUI-0.0.1\ClawSkillUI\`
- Uncompressed only (no archives)

## Save Script
- Run PowerShell:
  - `./scripts/save_version.ps1 -AppName ClawSkillUI -Version 0.0.1`
- Output folder contains a mirrored copy excluding `node_modules` and build caches.

