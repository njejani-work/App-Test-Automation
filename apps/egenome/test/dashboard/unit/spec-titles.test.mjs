// Tests that never ran are listed as "skipped", from the spec source. A title written as a template string
// (`... ${SEARCH_TERM} ...`) is only known when it runs, so it is matched as a pattern (19 Nov 2026: Wikipedia).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { specTests } from '@apptest/toolkit/dashboard/hooks.js';

test('a template-string title becomes a pattern that matches the title it ran under', () => {
  const file = path.join(mkdtempSync(path.join(os.tmpdir(), 'spec-')), 'a.e2e.js');
  writeFileSync(file, "describe('Smoke', () => {\n  it('SMK-01 plain', async () => {});\n  it(`SMK-04 searching for \"${SEARCH_TERM}\" (a.b)`, async () => {});\n});\n");
  const [plain, templ] = specTests(file);
  assert.equal(plain.title, 'SMK-01 plain');
  assert.equal(plain.pattern, undefined);
  assert.ok(templ.pattern.test('SMK-04 searching for "Albert Einstein" (a.b)'));
  assert.ok(!templ.pattern.test('SMK-04 searching for "Albert Einstein" (aXb)'), 'the rest of the title is matched literally');
});
