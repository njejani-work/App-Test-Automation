// Finds the APK the tests should install: the link between "compile" and "test".
//
// Order:
//   1. APK_PATH in .env / environment  -> use exactly that file
//   2. otherwise the newest build in out/ made by scripts/build-apk.sh
//      (read from its .build-info.txt receipt, and the APK's SHA-256 is checked
//       against the receipt so we never test a half-copied or swapped file)
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const OUT_DIR = path.join(PROJECT_ROOT, 'out');

/** Parse a key=value build-info file into an object. */
export function readBuildInfo(file) {
  const info = {};
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const i = line.indexOf('=');
    if (i > 0) info[line.slice(0, i)] = line.slice(i + 1);
  }
  return info;
}

function sha256(file) {
  return createHash('sha256').update(readFileSync(file)).digest('hex');
}

let cached;

/** Returns { path, info } for the APK under test. Throws with a helpful message if none. */
export function resolveApk() {
  if (cached) return cached;

  if (process.env.APK_PATH) {
    const p = path.resolve(PROJECT_ROOT, process.env.APK_PATH);
    if (!existsSync(p)) throw new Error(`APK_PATH points to a file that does not exist: ${p}`);
    const receipt = p.replace(/\.apk$/, '.build-info.txt');
    cached = { path: p, info: existsSync(receipt) ? readBuildInfo(receipt) : {} };
    return cached;
  }

  const receipts = existsSync(OUT_DIR)
    ? readdirSync(OUT_DIR).filter((f) => f.endsWith('.build-info.txt'))
    : [];
  if (receipts.length === 0) {
    throw new Error('No APK found in out/. Build one first:  npm run build:apk   (or set APK_PATH in .env)');
  }

  // Newest receipt = newest build
  const newest = receipts
    .map((f) => path.join(OUT_DIR, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0];
  const info = readBuildInfo(newest);
  const apkPath = path.join(OUT_DIR, info.apk_file || '');
  if (!info.apk_file || !existsSync(apkPath)) {
    throw new Error(`Receipt ${path.basename(newest)} names ${info.apk_file}, but that APK is missing. Rebuild with npm run build:apk.`);
  }
  if (info.apk_sha256 && sha256(apkPath) !== info.apk_sha256) {
    throw new Error(`${info.apk_file} does not match the SHA-256 in its receipt (file changed or copy incomplete). Rebuild with npm run build:apk.`);
  }
  cached = { path: apkPath, info };
  return cached;
}
