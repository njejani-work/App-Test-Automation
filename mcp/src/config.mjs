// All settings in one place: environment variables + defaults, checked once at start-up.
// Files are only read from a fixed allowlist of project folders; no tool takes a free-form path.
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { secretsFrom, deviceFrom } from './adapters/env-file.mjs';
import { suiteEnv } from './adapters/tool-env.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const VERSION = '0.3.0';

const Env = z.object({
  DASHBOARD_DIR: z.string().default('reports'),
  MCP_UNIT_TIMEOUT_MIN: z.coerce.number().positive().max(30).default(5),
  MCP_SUITE_TIMEOUT_MIN: z.coerce.number().positive().max(180).default(60),
  MCP_LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  MCP_STRUCTURED_OUTPUT: z.enum(['0', '1']).default('0'),
});

/** True when `p` is `dir` or inside it. */
export const isInside = (p, dir) => { const r = path.relative(dir, p); return r === '' || (!r.startsWith('..') && !path.isAbsolute(r)); };

/** The reports folder must be in the project (or the OS temp folder, which the server's own tests use). */
export function allowedReportsDir(dir, root = ROOT) {
  const abs = path.resolve(root, dir);
  if (isInside(abs, root) || isInside(abs, os.tmpdir())) return abs;
  throw new Error(`DASHBOARD_DIR must be inside the project folder (${root}); got ${abs}`);
}

const npm = (script) => ({ cmd: 'npm', args: ['run', script] });

/** Settings for one server. `overrides` is for tests (other folders, pretend commands, short limits). */
export function loadConfig(env = process.env, overrides = {}) {
  const parsed = Env.safeParse(env);
  if (!parsed.success) throw new Error(`Bad MCP setting: ${parsed.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`);
  const e = parsed.data;
  const envFile = path.join(ROOT, '.env');
  return Object.freeze({
    root: ROOT,
    reportsDir: overrides.reportsDir || allowedReportsDir(e.DASHBOARD_DIR),
    specsDir: path.join(ROOT, 'test', 'layout', 'specs'),
    docs: { readme: path.join(ROOT, 'README.md'), triage: path.join(ROOT, 'test', 'triage.json'), budgets: path.join(ROOT, 'test', 'budgets.json') },
    limits: overrides.limits || { unitMs: e.MCP_UNIT_TIMEOUT_MIN * 60000, suiteMs: e.MCP_SUITE_TIMEOUT_MIN * 60000 },
    // the ONLY commands the server can start: npm scripts of the project, chosen by name
    commands: overrides.commands || { unit: (coverage) => npm(coverage ? 'test:unit:coverage' : 'test:unit'), suite: (name) => npm(`test:${name}`) },
    // ANDROID_HOME / JAVA_HOME for the device suites (filled in when the app that started us did not pass them)
    suiteEnv: overrides.suiteEnv || suiteEnv,
    deviceUdid: overrides.deviceUdid || deviceFrom(envFile) || 'emulator-5554',
    secrets: overrides.secrets || secretsFrom(envFile),
    logLevel: e.MCP_LOG_LEVEL,
    // also send the data as structuredContent. Off by default: when it is sent, Claude's apps show that JSON instead of
    // the readable text. Programs and the server's tests turn it on.
    structured: overrides.structured ?? e.MCP_STRUCTURED_OUTPUT === '1',
  });
}
