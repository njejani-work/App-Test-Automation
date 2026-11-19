// Runs a Bash script from npm on any OS.
//
// Why: on Windows, npm runs scripts with cmd.exe, and plain "bash" there can start WSL
// (a separate Linux with no Windows Android SDK) instead of Git Bash. This picks Git Bash
// on Windows and normal bash elsewhere, then passes the exit code straight through.
//
// Usage (from package.json): node scripts/run-bash.mjs scripts/build-apk.sh [args...]
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const [script, ...args] = process.argv.slice(2);
if (!script) {
  console.error('usage: node scripts/run-bash.mjs <script.sh> [args...]');
  process.exit(1);
}

function findBash() {
  if (process.platform !== 'win32') return 'bash';
  const candidates = [
    process.env.GIT_BASH,
    'C:\\Program Files\\Git\\bin\\bash.exe',
    'C:\\Program Files (x86)\\Git\\bin\\bash.exe',
    `${process.env.LOCALAPPDATA}\\Programs\\Git\\bin\\bash.exe`,
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    console.error('Git Bash not found. Install Git for Windows, or set GIT_BASH to the full path of bash.exe.');
    process.exit(2);
  }
  return found;
}

// Pass settings from .env (APP_REPO, APP_REF, GRADLE_ARGS ...) to the script.
// Values already set in the real environment win, like dotenv does.
const env = { ...process.env };
if (existsSync('.env')) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !line.trimStart().startsWith('#') && env[m[1]] === undefined) {
      env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
}

// npm passes extra words after "--", e.g. npm run build:apk -- alphaDebug
const result = spawnSync(findBash(), [script, ...args], { stdio: 'inherit', env });
if (result.error) {
  console.error(result.error.message);
  process.exit(2);
}
process.exit(result.status ?? 1);
