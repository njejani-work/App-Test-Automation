// npm run dashboard        -> rebuild the shared test dashboard for this project and open it (reports/index.html)
// npm run dashboard:build  -> rebuild only
// The dashboard code lives in the eGenome.ai project (DASHBOARD_LIB, default ../eGenome.ai/test/support/dashboard);
// it is the same dashboard as eGenome's, and its App filter switches between the apps.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import 'dotenv/config';

const HERE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lib = path.resolve(HERE, process.env.DASHBOARD_LIB || '../eGenome.ai/test/support/dashboard');
if (!fs.existsSync(path.join(lib, 'cli.mjs'))) {
  console.error(`The shared dashboard was not found at ${lib}. Put the eGenome.ai project next to this one, or set DASHBOARD_LIB in .env.\nThe old report still works: npm run dashboard:old`);
  process.exit(1);
}
process.env.DASHBOARD_PROJECT_ROOT = HERE;
process.env.DASHBOARD_APP_PACKAGE ||= 'com.instagram.android';
process.env.DASHBOARD_TITLE ||= 'Instagram App Tests';
await import(pathToFileURL(path.join(lib, 'cli.mjs')).href);
