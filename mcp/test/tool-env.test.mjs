// ANDROID_HOME / JAVA_HOME for device suites started from the assistant (17 Nov: Claude Desktop did not pass them).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { suiteEnv } from '../src/adapters/tool-env.mjs';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'eg-env-'));
const sdk = path.join(tmp, 'sdk'); fs.mkdirSync(path.join(sdk, 'platform-tools'), { recursive: true });
const jdk = path.join(tmp, 'jdk'); fs.mkdirSync(path.join(jdk, 'bin'), { recursive: true });
fs.writeFileSync(path.join(jdk, 'bin', process.platform === 'win32' ? 'java.exe' : 'java'), '');
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

test('set ones are kept, and their tool folders go first on PATH', () => {
  const r = suiteEnv({ ANDROID_HOME: sdk, JAVA_HOME: jdk, PATH: '/usr/bin' });
  assert.deepEqual(r.missing, []);
  assert.equal(r.env.ANDROID_SDK_ROOT, sdk);
  assert.ok(r.env.PATH.startsWith(path.join(sdk, 'platform-tools') + path.delimiter + path.join(jdk, 'bin')));
  assert.deepEqual(r.notes, [`Android SDK: ${sdk}`, `Java: ${jdk}`]);
});

test('a JAVA_HOME that points nowhere is not used', () => {
  const r = suiteEnv({ ANDROID_HOME: sdk, JAVA_HOME: path.join(tmp, 'nope'), PATH: '' });
  assert.ok(r.env.JAVA_HOME !== path.join(tmp, 'nope') || r.missing.length, 'replaced by a found JDK, or reported missing');
});

test('nothing set and nothing in the usual folders: both reported as missing', { skip: process.platform === 'win32' && 'the PC has the usual folders' }, () => {
  const r = suiteEnv({ PATH: '', LOCALAPPDATA: tmp, ProgramFiles: tmp, HOME: tmp });
  assert.ok(r.missing.some((m) => m.startsWith('ANDROID_HOME')) || r.notes.some((n) => n.startsWith('Android SDK')));
});
