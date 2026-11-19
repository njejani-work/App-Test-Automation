#!/usr/bin/env node
// npm run dashboard          -> rebuild data and open reports/index.html
// npm run dashboard:build    -> rebuild data only (e.g. after an interrupted run)
import { exec } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import dotenv from 'dotenv';

// Load .env before options.js reads DASHBOARD_* settings
const PROJECT_ROOT = path.resolve(process.env.DASHBOARD_PROJECT_ROOT || process.cwd()); // the app folder (as options.js)
dotenv.config({ path: path.join(PROJECT_ROOT, '.env'), quiet: true });
// the app's package and title from its app.config.js (as createConfig() sets them for a test run)
const appConfig = path.join(PROJECT_ROOT, 'app.config.js');
if (fs.existsSync(appConfig)) {
  try {
    const app = (await import(pathToFileURL(appConfig).href)).default;
    process.env.DASHBOARD_APP_PACKAGE ||= app.package;
    if (app.dashboard?.title) process.env.DASHBOARD_TITLE ||= app.dashboard.title;
  } catch (e) { console.warn(`[dashboard] app.config.js not read: ${e.message}`); }
}
const { options } = await import('./options.js');
const { buildIndex } = await import('./builder.js');

const idx = buildIndex(options.reportsDir, { keepRuns: options.keepRuns, projectName: options.projectName, rebuildRuns: true });
const file = path.join(options.reportsDir, 'index.html');
console.log(`  Dashboard rebuilt: ${idx.runs.length} run(s) -> ${file}`);

if (process.argv.includes('--open') && fs.existsSync(file)) {
  const cmd = process.platform === 'win32' ? `start "" "${file}"` : process.platform === 'darwin' ? `open "${file}"` : `xdg-open "${file}"`;
  exec(cmd, (err) => { if (err) console.log(`  Open it in your browser: ${file}`); });
}
