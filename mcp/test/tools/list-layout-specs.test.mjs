// Unit test of list_layout_specs: two pretend spec files in a temporary folder, then call run() directly.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import tool from '../../src/tools/list-layout-specs.mjs';

// Arrange: a folder with one reviewed and one not-reviewed spec
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-specs-'));
after(() => fs.rmSync(dir, { recursive: true, force: true }));
const write = (name, spec) => fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(spec));
write('Login', { spec: 'Login', page: 'LoginPage', reviewed: false, generatedAt: '2026-11-13T10:30:12Z', baseline: { w: 720, h: 1280 }, elements: { headline: {}, phoneInput: {}, sendOtpBtn: {} }, rules: [{}] }); // elements: an object, as in the real files
write('Home', { spec: 'Home', page: 'HomePage', reviewed: true, generatedAt: '2026-11-13T10:31:00Z', baseline: { w: 720, h: 1280 }, elements: { greeting: {} }, rules: [] });
const ctx = { config: { specsDir: dir } }; // the only part of ctx this tool uses

test('lists every spec with its counts, screen size and review state', async () => {
  const { text, data } = await tool.run({ onlyNotReviewed: false, limit: 20, offset: 0 }, ctx);  // Act
  assert.equal(data.total, 2);                                             // Assert
  assert.equal(data.reviewed, 1);
  const login = data.specs.find((s) => s.screen === 'Login');
  assert.deepEqual([login.elements, login.rules, login.recordedOn, login.recordedAt], [3, 1, '720x1280', '2026-11-13']);
  assert.match(text, /^## 2 layout spec\(s\), 1 reviewed/);
  assert.match(text, /\| Login \| LoginPage \| 3 \| 1 \| 720x1280 \| 2026-11-13 \| ✖ no \|/);
});

test('onlyNotReviewed: true leaves out the reviewed ones', async () => {
  const { data } = await tool.run({ onlyNotReviewed: true, limit: 20, offset: 0 }, ctx);
  assert.deepEqual(data.specs.map((s) => s.screen), ['Login']);
});

test('limit: 1 shows one spec and says how to get the next', async () => {
  const { text, data } = await tool.run({ onlyNotReviewed: false, limit: 1, offset: 0 }, ctx);
  assert.equal(data.specs.length, 1);
  assert.match(text, /Showing 1-1 of 2; call again with offset: 1/);
});
