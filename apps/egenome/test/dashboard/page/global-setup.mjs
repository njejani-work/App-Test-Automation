// Runs once before the page tests: writes the demo runs into .dashboard-test/reports (a fresh copy every time).
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(here, '..', '..', '..');
export const REPORTS = path.join(ROOT, '.dashboard-test', 'reports');

export default async function globalSetup() {
  execFileSync(process.execPath, [path.join(here, '..', 'fixtures.mjs'), REPORTS], { stdio: 'ignore' });
  mkdirSync(path.join(ROOT, '.dashboard-test', 'screenshots'), { recursive: true });
}
