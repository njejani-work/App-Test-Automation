// Dashboard settings. Override with environment variables (e.g. in .env).
// Values are read on access, so settings loaded from .env after import still apply.
import path from 'node:path';

// The app project whose tests are recorded (shared toolkit: every app uses this code): DASHBOARD_PROJECT_ROOT, else the
// folder the command runs in (apps/<id> for every npm script). Its reports/, .env, test/triage.json, budgets.json and
// layout specs are used.
export const PROJECT_ROOT = path.resolve(process.env.DASHBOARD_PROJECT_ROOT || process.cwd());
/**
 * The Android app under test (DASHBOARD_APP_PACKAGE): its version, its log lines and its API calls are read.
 * createConfig() sets it from the app's app.config.js (setAppPackage): this module may be imported before that (an
 * app's hooks import the recorder), so it is a live value, read when used, never copied at import.
 */
export let APP_PACKAGE = process.env.DASHBOARD_APP_PACKAGE || 'com.egenome.app';
export function setAppPackage(pkg) { if (pkg) APP_PACKAGE = pkg; }

const env = process.env;
const num = (v, d) => (v != null && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : d);

export const options = {
  /** Where runs + the dashboard are written (DASHBOARD_DIR, default "reports"). */
  get reportsDir() { return path.resolve(PROJECT_ROOT, env.DASHBOARD_DIR || 'reports'); },
  /** DASHBOARD_SCREENSHOTS: 'all' = after every step (default), 'failures' = failed steps/tests only, 'none'. */
  get screenshots() { return (env.DASHBOARD_SCREENSHOTS || 'all').toLowerCase(); },
  /** DASHBOARD_LOGCAT=false turns off attaching Android logcat to failed tests. */
  get logcat() { return env.DASHBOARD_LOGCAT !== 'false'; },
  /** DASHBOARD_KEEP_RUNS: how many runs to keep (older run folders are deleted). */
  get keepRuns() { return num(env.DASHBOARD_KEEP_RUNS, 30); },
  /** DASHBOARD_VERBOSE=true echoes each step to the console as well as the run log. */
  get verbose() { return env.DASHBOARD_VERBOSE === 'true'; },
  /** TEST_ENV: label shown on the dashboard, e.g. "staging". */
  get environment() { return env.TEST_ENV || 'staging'; },
  /** DASHBOARD_VIDEO: screen recording of each test - 'failed' = keep only failures (default), 'all', 'off'. */
  get video() { return (env.DASHBOARD_VIDEO || 'failed').toLowerCase(); },
  /** DASHBOARD_PERF=off turns off memory and frame stats (read with adb from this computer). */
  get perf() { return (env.DASHBOARD_PERF || 'on').toLowerCase() !== 'off'; },
  /** The device adb reads from: DEVICE_UDID (as in wdio.conf.js); empty = the only connected device. */
  get udid() { return env.DEVICE_UDID || ''; },
  /** DASHBOARD_TITLE: name in the dashboard header. */
  get projectName() { return env.DASHBOARD_TITLE || 'eGenome.ai App Tests'; },
  /** The list of apps for the App filter (DASHBOARD_APPS; default: the workspace's dashboard/apps.json, from apps/<id>). */
  get appsFile() { return env.DASHBOARD_APPS ? path.resolve(PROJECT_ROOT, env.DASHBOARD_APPS) : path.resolve(PROJECT_ROOT, '..', '..', 'dashboard', 'apps.json'); },
};
