// npm run doctor: checks everything the two steps need, and says what to fix.
//   Step 1 (compile): Git Bash/bash, git, Java, ANDROID_HOME
//   Step 2 (test):    an APK in out/, adb, a running device, Appium's UiAutomator2 driver
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { resolveApk } from '../test/support/apk.js';

dotenv.config({ quiet: true });

let problems = 0;
const ok = (msg) => console.log(`  OK    ${msg}`);
const bad = (msg, fix) => { problems++; console.log(`  FIX   ${msg}\n        -> ${fix}`); };
const run = (cmd) => execSync(cmd, { stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();

console.log('\nStep 1: compile the APK');
try { ok(`git ${run('git --version').replace('git version ', '')}`); } catch { bad('git not found', 'install Git for Windows'); }
try { run('java -version 2>&1'); ok(`Java found (JAVA_HOME=${process.env.JAVA_HOME || 'not set'})`); }
catch { bad('Java not found', 'install a JDK 17+ or set JAVA_HOME (Android Studio\'s jbr folder works)'); }
const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
if (sdk && existsSync(sdk)) ok(`ANDROID_HOME=${sdk}`); else bad('ANDROID_HOME not set or wrong', 'set it to your Android SDK folder');

console.log('\nStep 2: run the tests');
try {
  const apk = resolveApk();
  ok(`APK: ${path.basename(apk.path)} (commit ${(apk.info.commit || '?').slice(0, 10)}, ${apk.info.application_id || '?'})`);
} catch (e) { bad(e.message.split('\n')[0], 'npm run build:apk'); }

const adb = sdk ? path.join(sdk, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb') : 'adb';
try {
  const devices = run(`"${adb}" devices`).split('\n').slice(1).filter((l) => /\tdevice$/.test(l));
  if (devices.length === 0) bad('no running emulator/phone', 'start an emulator (Android Studio > Device Manager > Play)');
  else if (devices.length > 1 && !process.env.DEVICE_UDID) bad(`${devices.length} devices connected`, 'set DEVICE_UDID in .env to the one to use');
  else ok(`device: ${devices.map((d) => d.split('\t')[0]).join(', ')}`);
} catch { bad('adb not found', 'install Android SDK platform-tools'); }

try {
  const drivers = run('npx --no-install appium driver list --installed 2>&1');
  if (/uiautomator2/i.test(drivers)) ok('Appium UiAutomator2 driver installed');
  else bad('UiAutomator2 driver missing', 'npm run appium:setup');
} catch { bad('Appium not installed', 'npm install'); }

console.log(problems ? `\n${problems} thing(s) to fix.\n` : '\nAll good: npm run test:smoke\n');
process.exit(problems ? 1 : 0);
