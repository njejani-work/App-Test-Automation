// The devices adb sees (read-only adb, through the dashboard's device module).
import { device } from '../adapters/project.mjs';

/** @returns {Promise<null | {id: string, state: string}[]>} null when adb is not installed */
export async function adbDevices() {
  const out = await (await device()).listDevices();
  if (out == null) return null;
  return out.split(/\r?\n/).slice(1).map((l) => l.trim().split(/\s+/)).filter((p) => p[0]).map(([id, state]) => ({ id, state }));
}

export const ADB_MISSING = 'adb was not found: install Android platform-tools and put adb on PATH (or set ANDROID_HOME).';
export const notReadyHint = (state) => (state === 'unauthorized' ? ': accept the USB debugging prompt on the phone' : '');
