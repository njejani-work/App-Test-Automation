// The environment a device suite needs: Appium's UiAutomator2 driver must find the Android SDK (ANDROID_HOME) and Java
// (JAVA_HOME). A terminal has them from the user's settings; an app like Claude Desktop may start this server
// without them (17 Nov: runs from the assistant failed at session start, the same runs in a terminal worked).
// Missing ones are filled in from the usual install folders, and the plan says what was used.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const exists = (p) => { try { return !!p && fs.existsSync(p); } catch { return false; } };
const children = (dir) => { try { return fs.readdirSync(dir).map((d) => path.join(dir, d)); } catch { return []; } };

function sdkGuesses(env) {
  const home = os.homedir();
  return process.platform === 'win32'
    ? [path.join(env.LOCALAPPDATA || path.join(home, 'AppData', 'Local'), 'Android', 'Sdk')]
    : process.platform === 'darwin' ? [path.join(home, 'Library', 'Android', 'sdk')] : [path.join(home, 'Android', 'Sdk')];
}

function javaGuesses(env) {
  if (process.platform === 'win32') {
    const pf = env.ProgramFiles || 'C:\\Program Files';
    return [path.join(pf, 'Android', 'Android Studio', 'jbr'), ...['Java', 'Eclipse Adoptium', 'Microsoft', 'Zulu'].flatMap((v) => children(path.join(pf, v)).reverse())];
  }
  if (process.platform === 'darwin') return ['/Applications/Android Studio.app/Contents/jbr/Contents/Home'];
  return ['/opt/android-studio/jbr', ...children('/usr/lib/jvm')];
}

const javaOk = (dir) => exists(path.join(dir, 'bin', process.platform === 'win32' ? 'java.exe' : 'java'));

/** @returns {{ env: object, notes: string[], missing: string[] }} */
export function suiteEnv(base = process.env) {
  const env = { ...base };
  const notes = [], missing = [];
  const sdk = [base.ANDROID_HOME, base.ANDROID_SDK_ROOT].find(exists);
  if (sdk) { env.ANDROID_HOME ||= sdk; env.ANDROID_SDK_ROOT ||= sdk; notes.push(`Android SDK: ${sdk}`); }
  else {
    const found = sdkGuesses(base).find(exists);
    if (found) { env.ANDROID_HOME = env.ANDROID_SDK_ROOT = found; notes.push(`Android SDK: ${found} (ANDROID_HOME was not set for this server; using the usual folder)`); }
    else missing.push('ANDROID_HOME (the Android SDK folder)');
  }
  if (javaOk(base.JAVA_HOME || '')) notes.push(`Java: ${base.JAVA_HOME}`);
  else {
    const found = javaGuesses(base).find(javaOk);
    if (found) { env.JAVA_HOME = found; notes.push(`Java: ${found} (JAVA_HOME was not set for this server; using the one found)`); }
    else missing.push('JAVA_HOME (a Java JDK, e.g. Android Studio\'s jbr folder)');
  }
  // adb and Java on PATH too, for tools that look there
  const key = Object.keys(env).find((k) => k.toUpperCase() === 'PATH') || 'PATH';
  const extra = [env.ANDROID_HOME && path.join(env.ANDROID_HOME, 'platform-tools'), env.JAVA_HOME && path.join(env.JAVA_HOME, 'bin')].filter(exists);
  env[key] = [...extra, env[key] || ''].join(path.delimiter);
  return { env, notes, missing };
}
