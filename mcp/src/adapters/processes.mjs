// Starts a project command as a background job, keeps its last output lines (masked), stops it after a time limit.
// Only commands from config.commands (npm scripts) are ever started; tools cannot pass a command or a shell string.
import { spawn, spawnSync } from 'node:child_process';

const KEEP_LINES = 300;
const KEEP_ERRORS = 25;
// lines worth showing when a run fails (WebdriverIO / Appium errors), kept apart so the summary does not push them out
const ERROR_LINE = /\bERROR\b|\b[Ee]rror:|\bfailed to\b|\bCould not\b|ECONNREFUSED|EADDRINUSE/;

/** Stop a process and everything it started (npm -> wdio -> Appium -> ...). */
export function killTree(child) {
  if (!child || child.exitCode !== null || child.killed) return;
  if (process.platform === 'win32') { spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { windowsHide: true }); return; }
  try { process.kill(-child.pid, 'SIGTERM'); } catch { try { child.kill('SIGTERM'); } catch {} }
  setTimeout(() => { try { process.kill(-child.pid, 'SIGKILL'); } catch {} }, 5000).unref();
}

let seq = 0;
/**
 * @returns a job: { id, kind, label, status: running|passed|failed|stopped|timed out, exitCode, lines, done, stop() }
 */
export function startJob({ kind, label, cmd, args, cwd, env = process.env, timeoutMs, mask, onLine }) {
  const job = { id: `${kind}-${++seq}`, kind, label, startedAt: new Date().toISOString(), startedMs: Date.now(), status: 'running', exitCode: null, endedAt: null, lines: [], errors: [] };
  // A shell only for npm on Windows (npm.cmd cannot start without one); cmd and args come from config, never from tool
  // input. Any other program (node itself, in the server's tests) starts directly: through cmd.exe its path and
  // arguments with spaces or quotes were split (19 Nov 2026: "C:\Program Files\nodejs\node.exe" and "App test Automation").
  const shell = process.platform === 'win32' && /^(npm|npx)$/.test(cmd);
  const child = spawn(cmd, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'], shell, detached: process.platform !== 'win32', windowsHide: true });
  const take = (buf) => {
    for (const raw of String(buf).split(/\r?\n/)) {
      const line = mask(raw.replace(/\x1b\[[0-9;]*m/g, '')).trimEnd();
      if (!line) continue;
      job.lines.push(line); if (job.lines.length > KEEP_LINES) job.lines.shift();
      if (ERROR_LINE.test(line)) { job.errors.push(line.slice(0, 400)); if (job.errors.length > KEEP_ERRORS) job.errors.shift(); }
      onLine?.(line);
    }
  };
  child.stdout.on('data', take); child.stderr.on('data', take);
  const timer = setTimeout(() => { job.status = 'timed out'; job.lines.push(`[mcp] stopped: over the time limit of ${Math.round(timeoutMs / 6000) / 10} min`); killTree(child); }, timeoutMs);
  job.done = new Promise((resolve) => child.on('close', (code) => {
    clearTimeout(timer);
    job.exitCode = code; job.endedAt = new Date().toISOString();
    if (job.status === 'running') job.status = code === 0 ? 'passed' : 'failed';
    resolve(job);
  }));
  job.stop = () => { if (job.status === 'running') { job.status = 'stopped'; killTree(child); } };
  return job;
}
