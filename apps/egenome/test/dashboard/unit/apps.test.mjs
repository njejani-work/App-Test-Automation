// The app switcher at the top left: Test Dashboard/apps.json -> reports/data/apps.js of each app (lib/apps.js).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { readApps, writeAppsData } from '../../support/dashboard/lib/apps.js';

// App test Automation/ { Test Dashboard/apps.json, eGenome.ai/reports, Instagram/reports }
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-apps-'));
after(() => fs.rmSync(root, { recursive: true, force: true }));
const hub = path.join(root, 'Test Dashboard');
const eg = path.join(root, 'eGenome.ai', 'reports');
const ig = path.join(root, 'Instagram', 'reports');
for (const d of [hub, path.join(eg, 'data'), ig]) fs.mkdirSync(d, { recursive: true });
fs.writeFileSync(path.join(eg, 'index.html'), '');
fs.writeFileSync(path.join(eg, 'data', 'index.js'), 'window.DASH_INDEX={"runs":[{"id":"20261118-100822","summary":{"status":"passed","failed":0,"total":8}}]};');
const appsFile = path.join(hub, 'apps.json');
fs.writeFileSync(appsFile, JSON.stringify({ apps: [{ id: 'egenome', name: 'eGenome.ai', project: '../eGenome.ai' }, { id: 'instagram', name: 'Instagram', project: '../Instagram' }, { id: 'broken' }] }));
const load = (dir) => { const w = {}; new Function('window', fs.readFileSync(path.join(dir, 'data', 'apps.js'), 'utf8'))(w); return w.DASH_APPS; };

test('reads the shared list; entries without id, name or project are left out', () => {
  assert.deepEqual(readApps(appsFile).map((a) => [a.id, a.reportsDir]), [['egenome', eg], ['instagram', ig]]);
  assert.deepEqual(readApps(path.join(hub, 'missing.json')), []);
});

test('each app gets links to the others relative to its own page (works from disk, spaces encoded)', () => {
  const A = writeAppsData(ig, appsFile);
  assert.equal(A.current, 'instagram');
  assert.equal(A.apps[0].href, '../../eGenome.ai/reports/index.html');
  assert.equal(A.home, '../../Test%20Dashboard/index.html');
  assert.deepEqual(A.apps[0].latest, { run: '20261118-100822', status: 'passed', failed: 0, total: 8 });
  assert.equal(A.apps[1].ready, false, 'Instagram has no page yet');
  assert.deepEqual(load(ig), A, 'the same data is in reports/data/apps.js');
});

test('no shared list: no apps.js, so the page shows the plain title', () => {
  writeAppsData(eg, appsFile);
  assert.ok(fs.existsSync(path.join(eg, 'data', 'apps.js')));
  assert.equal(writeAppsData(eg, path.join(hub, 'missing.json')), null);
  assert.ok(!fs.existsSync(path.join(eg, 'data', 'apps.js')));
});

test('the logo at the top left: an image file when there is one, otherwise a badge with a colour', () => {
  fs.mkdirSync(path.join(hub, 'logos'), { recursive: true });
  fs.writeFileSync(path.join(hub, 'logos', 'eg.png'), '');
  fs.writeFileSync(appsFile, JSON.stringify({ apps: [
    { id: 'egenome', name: 'eGenome.ai', project: '../eGenome.ai', logo: 'logos/eg.png', color: '#6d4bd8' },
    { id: 'instagram', name: 'Instagram', project: '../Instagram', badge: 'IGRAM', color: '#d6336c', logo: 'logos/missing.png' },
  ] }));
  const [eg1, ig1] = writeAppsData(ig, appsFile).apps;
  assert.equal(eg1.logo, '../../Test%20Dashboard/logos/eg.png');
  assert.deepEqual([ig1.logo, ig1.badge, ig1.color], [null, 'IGR', '#d6336c'], 'a missing image falls back to the badge (3 letters at most)');
});
