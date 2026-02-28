$ErrorActionPreference = "Stop"

param(
  [string]$AppName = "ClawSkillUI",
  [string]$Version = "0.0.1",
  [string]$RepoRoot = "C:\Users\disru\Documents\clawhub\ClawSkillUI\Repository"
)

$destBase = Join-Path $RepoRoot ("{0}-{1}" -f $AppName, $Version)
$dest = Join-Path $destBase $AppName

if (!(Test-Path $dest)) {
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
}

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $here

robocopy $projectRoot $dest /MIR /XD "node_modules" ".git" ".turbo" "dist" ".vite" /XF "pnpm-lock.yaml" "yarn.lock" "package-lock.json" /R:1 /W:1 | Out-Null

Write-Host "Saved uncompressed version to: $dest"

