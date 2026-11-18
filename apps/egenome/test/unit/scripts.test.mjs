// scripts/run-with-env.mjs: "VAR=value command" on Windows, macOS and Linux (used by npm run layout:baseline).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../../scripts/run-with-env.mjs', import.meta.url));
const helper = fileURLToPath(new URL('./helpers/exit-with.mjs', import.meta.url)); // the project path has spaces: also checked
const run = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', timeout: 60000 });

test('the variable reaches the command, also when its value contains "="', () => {
  const r = run('UNIT_VAR=a=b', '--', 'node', helper, 'UNIT_VAR', 'a=b');
  assert.equal(r.status, 0, r.stderr);
});

test("the command's exit code is passed on (so a failing test run fails the npm script)", () => {
  assert.equal(run('X=1', '--', 'node', helper, '7').status, 7);
});
