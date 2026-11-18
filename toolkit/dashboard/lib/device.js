// Read-only device information through adb on this computer (not through Appium, so Appium's settings stay as
// they are). Used by the dashboard hooks: app version and build fingerprint per run, process id, memory and frame
// stats per test, device details. Nothing here changes the app or the device, except `gfxinfo reset`, which only
// restarts Android's frame counter for the app so each test gets its own numbers.
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { logTime } from './network.js';

/** adb from ANDROID_HOME / ANDROID_SDK_ROOT when there, else the one on PATH. */
export function adbPath(env = process.env) {
  for (const root of [env.ANDROID_HOME, env.ANDROID_SDK_ROOT]) {
    if (!root) continue;
    const p = path.join(root, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb');
    if (existsSync(p)) return p;
  }
  return 'adb';
}

/** Output of `adb devices`, or null when adb cannot be run. */
export function listDevices() {
  if (runner) return Promise.resolve(runner(['devices']));
  return new Promise((resolve) => execFile(adbPath(), ['devices'], { timeout: 10000, windowsHide: true }, (err, out) => resolve(err ? null : String(out))));
}

// The dashboard's own tests replace adb with canned answers: setAdbRunner((args) => 'output' | null)
let runner = null;
export function setAdbRunner(fn) { runner = fn; }

/** Run `adb [-s udid] shell <args>`; resolves to stdout, or null when adb or the device is not there (never throws). */
export function shell(udid, args, { timeout = 15000 } = {}) {
  if (runner) return Promise.resolve(runner(args));
  return new Promise((resolve) => {
    const all = [...(udid ? ['-s', udid] : []), 'shell', ...args];
    execFile(adbPath(), all, { timeout, maxBuffer: 16 * 1024 * 1024, windowsHide: true }, (err, stdout) => resolve(err ? null : String(stdout)));
  });
}

/**
 * The installed app: versionName, versionCode, install/update time, and a fingerprint of the APK file itself
 * (sha256 of base.apk). Two installs of the "same" version with different code get different fingerprints, so the
 * dashboard can tell real app changes (regressions) from test changes.
 */
export async function appInfo(udid, pkg) {
  const dump = await shell(udid, ['dumpsys', 'package', pkg]);
  if (!dump) return { application_id: pkg, reason: 'adb could not read the app details (adb not on PATH, or the device is not connected).' };
  const pick = (re) => (dump.match(re) || [])[1] || null;
  const info = {
    application_id: pkg,
    version_name: pick(/versionName=(\S+)/),
    version_code: pick(/versionCode=(\d+)/),
    installed_at: pick(/firstInstallTime=([^\r\n]+)/),
    updated_at: pick(/lastUpdateTime=([^\r\n]+)/),
  };
  const apkPath = ((await shell(udid, ['pm', 'path', pkg])) || '').split(/\r?\n/).map((l) => l.replace(/^package:/, '').trim()).find((l) => l.endsWith('base.apk'));
  if (apkPath) {
    const sum = await shell(udid, ['sha256sum', apkPath], { timeout: 60000 });
    const sha = (String(sum || '').match(/^([0-9a-f]{64})/) || [])[1];
    if (sha) {
      info.apk_sha256 = sha;
      info.build_id = `${info.version_name || 'v?'}-${sha.slice(0, 10)}`;
    }
  }
  if (!info.build_id) info.build_id = info.version_name ? `${info.version_name}-${info.version_code || '?'}-${(info.updated_at || '').replace(/\D/g, '').slice(0, 12)}` : null;
  return info;
}

/**
 * How far the device's log clock is from this computer's clock, in ms (Android log times have no year or time zone).
 * The dashboard uses it to put each API call from the app's log in the test step that was running at the time.
 * Read-only (`date` on the device); null when adb or the device is not there.
 */
export async function clockOffsetMs(udid) {
  const before = Date.now();
  const out = await shell(udid, ['date', "'+%m-%d %H:%M:%S.%N'"]);
  const after = Date.now();
  const device = logTime(String(out || '').trim());
  return device == null ? null : device - Math.round((before + after) / 2);
}

/** Process id of the app, or null when it is not running. */
export async function pidOf(udid, pkg) {
  const out = await shell(udid, ['pidof', pkg]);
  return (String(out || '').trim().split(/\s+/)[0] || null);
}

/** Emulator or phone, Android build, security patch, CPU, WebView version. */
export async function deviceDetails(udid) {
  const prop = async (name) => String((await shell(udid, ['getprop', name])) || '').trim() || null;
  const webview = String((await shell(udid, ['dumpsys', 'package', 'com.google.android.webview'])) || '').match(/versionName=(\S+)/);
  return {
    emulator: (await prop('ro.kernel.qemu')) === '1' || /emulator|sdk_gphone/i.test((await prop('ro.product.model')) || ''),
    buildFingerprint: await prop('ro.build.fingerprint'),
    securityPatch: await prop('ro.build.version.security_patch'),
    abi: await prop('ro.product.cpu.abi'),
    webview: webview ? webview[1] : null,
  };
}

/** Restart Android's frame counter for the app (so the next numbers are for one test only). */
export const resetFrames = (udid, pkg) => shell(udid, ['dumpsys', 'gfxinfo', pkg, 'reset']);

/** Frames drawn, janky frames and the 90th percentile frame time since the last reset. */
export async function frameStats(udid, pkg) {
  const gfx = await shell(udid, ['dumpsys', 'gfxinfo', pkg]);
  if (!gfx) return null;
  const n = (re) => { const m = String(gfx).match(re); return m ? Number(m[1]) : null; };
  const total = n(/Total frames rendered:\s*(\d+)/);
  const janky = n(/Janky frames:\s*(\d+)/);
  return { total, janky, jankyPct: total ? Math.round((janky / total) * 1000) / 10 : null, p90Ms: n(/90th percentile:\s*(\d+)ms/) };
}

/** Memory the app uses (PSS, KB) from `dumpsys meminfo`. */
export async function memoryPssKb(udid, pkg) {
  const out = await shell(udid, ['dumpsys', 'meminfo', pkg]);
  const m = String(out || '').match(/TOTAL PSS:\s*(\d+)/i) || String(out || '').match(/^\s*TOTAL\s+(\d+)/m);
  return m ? Number(m[1]) : null;
}
