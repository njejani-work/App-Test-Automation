// Plays a device test suite for the MCP server's tests (no phone, nothing cleared): writes what the dashboard
// recorder writes (reports/.current-run, runs/<id>/meta.json and a live run.log), prints a "secret", then ends.
//   node fake-suite.mjs <reportsDir> <runId> <msPerTest> <exitCode>
import fs from 'node:fs';
import path from 'node:path';

const [reports, id, ms, exit] = process.argv.slice(2);
const dir = path.join(reports, 'runs', id);
fs.mkdirSync(dir, { recursive: true });
const meta = { id, startedAt: Date.now(), args: 'run ./wdio.conf.js --suite smoke', recorder: 1 };
fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(meta));
fs.writeFileSync(path.join(reports, '.current-run'), id);
const log = (t) => fs.appendFileSync(path.join(dir, 'run.log'), `${new Date().toISOString()} [0-0] ${t}\n`);
console.error('2026-11-17T11:45:20.000Z ERROR webdriver: Request failed with status 500 due to session not created'); // must be shown
for (let i = 0; i < 40; i++) console.log(`[0-0] summary line ${i}`); // pushes it out of the last lines
console.log('[0-0] logging in with the test phone 9876543210 and OTP 482913'); // must reach the assistant masked
const tests = [['✔', 'SMK-01 [P0] intro and login screen'], ['✔', 'SMK-02 [P0] login with mobile number and OTP'], ['✖', 'SMK-03 [P0] Home loads']];
const wait = (t) => new Promise((r) => setTimeout(r, t));
log('✔ HOOK before (1.0s)');
for (const [mark, title] of tests) {
  log(`▶ TEST Smoke › ${title}`);
  await wait(Number(ms));
  log(`${mark} TEST ${title} (1.0s)${mark === '✖' ? ' - HomePage did not open within 30000ms' : ''}`);
}
fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ ...meta, finishedAt: Date.now(), exitCode: Number(exit) }));
process.exit(Number(exit));
