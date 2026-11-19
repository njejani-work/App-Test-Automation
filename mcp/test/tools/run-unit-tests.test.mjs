// run_unit_tests on an app without unit tests (Instagram) says so instead of starting a command that does not exist.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import runUnitTests from '../../src/tools/run-unit-tests.mjs';
import { answer } from '../../src/registry.mjs';
import { fakeCtx } from '../helpers/fake-ctx.mjs';

test('an app without a test:unit script gets a clear answer, and nothing is started', async () => {
  const ctx = fakeCtx('runs-small.json');
  let started = false;
  ctx.jobs = { running: () => null, startUnit: () => { started = true; } };
  ctx.config = { ...ctx.config, app: { id: 'instagram', name: 'Instagram' }, unitScripts: { unit: false, coverage: false } };
  const r = await answer(runUnitTests, ctx)({ coverage: false });
  assert.equal(r.isError, true);
  assert.match(r.content[0].text, /Instagram has no unit tests \(no "test:unit" script in apps\/instagram\/package\.json\)/);
  assert.equal(started, false);
});
