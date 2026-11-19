// All settings in one place: environment variables + defaults, checked once at start-up.
// Files are only read from a fixed allowlist of project folders; no tool takes a free-form path.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { secretsFrom, deviceFrom } from './adapters/env-file.mjs';
import { suiteEnv } from './adapters/tool-env.mjs';

/** The workspace (app-tests/): this server is app-tests/mcp, the apps are app-tests/apps/<id>. */
export const WORKSPACE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const VERSION = '0.4.0';

/**
 * Which app this server is for: MCP_APP (egenome, instagram, wikipedia...; default egenome). One server per app: the
 * shared dashboard code reads one app's folder per process. Its apps/<id>/mcp.json says what the server needs to know.
 */
export function appFrom(env = process.env, workspace = WORKSPACE) {
  const id = env.MCP_APP || 'egenome';
  const apps = () => { try { return fs.readdirSync(path.join(workspace, 'apps')).filter((d) => fs.existsSync(path.join(workspace, 'apps', d, 'mcp.json'))); } catch { return []; } };
  if (!/^[a-z0-9-]+$/.test(id) || !apps().includes(id)) throw new Error(`MCP_APP="${id}" is not an app with an mcp.json; apps: ${apps().join(', ') || 'none'}`);
  const root = path.join(workspace, 'apps', id);
  const info = JSON.parse(fs.readFileSync(path.join(root, 'mcp.json'), 'utf8'));
  return Object.freeze({ id, root, name: info.name, package: info.package, deviceVar: info.deviceVar || 'DEVICE_UDID', suites: info.suites || {}, effects: info.effects || [] });
}

export const APP = appFrom();
export const ROOT = APP.root;
// the shared dashboard code (@apptest/toolkit) reads this app's reports/ and test/ settings from here, about this package
process.env.DASHBOARD_PROJECT_ROOT ||= ROOT;
process.env.DASHBOARD_APP_PACKAGE ||= APP.package;

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
/** The app's npm scripts: which unit-test commands it has (Instagram has none). */
const scriptsOf = (root) => { try { return JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).scripts || {}; } catch { return {}; } };

/** Settings for one server. `overrides` is for tests (other folders, pretend commands, short limits). */
export function loadConfig(env = process.env, overrides = {}) {
  const parsed = Env.safeParse(env);
  if (!parsed.success) throw new Error(`Bad MCP setting: ${parsed.error.issues.map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`);
  const e = parsed.data;
  const envFile = path.join(ROOT, '.env');
  const app = overrides.app || APP;
  const scripts = scriptsOf(ROOT);
  return Object.freeze({
    app,
    root: ROOT,
    reportsDir: overrides.reportsDir || allowedReportsDir(e.DASHBOARD_DIR),
    specsDir: path.join(ROOT, 'test', 'layout', 'specs'),
    docs: { readme: path.join(ROOT, 'README.md'), triage: path.join(ROOT, 'test', 'triage.json'), budgets: path.join(ROOT, 'test', 'budgets.json') },
    limits: overrides.limits || { unitMs: e.MCP_UNIT_TIMEOUT_MIN * 60000, suiteMs: e.MCP_SUITE_TIMEOUT_MIN * 60000 },
    // the ONLY commands the server can start: npm scripts of the project, chosen by name
    commands: overrides.commands || { unit: (coverage) => npm(coverage ? 'test:unit:coverage' : 'test:unit'), suite: (name) => npm(`test:${name}`) },
    unitScripts: overrides.unitScripts || { unit: !!scripts['test:unit'], coverage: !!scripts['test:unit:coverage'] },
    // ANDROID_HOME / JAVA_HOME for the device suites (filled in when the app that started us did not pass them)
    suiteEnv: overrides.suiteEnv || suiteEnv,
    deviceUdid: overrides.deviceUdid || deviceFrom(envFile, app.deviceVar) || 'emulator-5554',
    secrets: overrides.secrets || secretsFrom(envFile),
    logLevel: e.MCP_LOG_LEVEL,
    // also send the data as structuredContent. Off by default: when it is sent, Claude's apps show that JSON instead of
    // the readable text. Programs and the server's tests turn it on.
    structured: overrides.structured ?? e.MCP_STRUCTURED_OUTPUT === '1',
  });
}
