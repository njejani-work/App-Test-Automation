// Run details: where a test run came from. Answers "which run, from where, started by what" on the dashboard.
// Launcher side (no device needed): branch and commit of THIS test project, CI job link, trigger, machine,
// time zone, versions of Node / WebdriverIO / Appium / UiAutomator2 driver.
// Device side (deviceDetails, once per session): emulator or real phone, Android build, WebView version.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const git = (root, args) => {
  try {
    return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000 }).trim();
  } catch {
    return '';
  }
};
const pkgVersion = (root, name) => {
  try {
    return JSON.parse(readFileSync(path.join(root, 'node_modules', name, 'package.json'), 'utf8')).version;
  } catch {
    return null;
  }
};

/** Which CI system started the run (GitHub Actions or Bitbucket Pipelines), with a link back to the job. */
export function ciInfo(env = process.env) {
  if (env.GITHUB_ACTIONS === 'true') {
    const repo = env.GITHUB_REPOSITORY || '';
    return {
      provider: 'GitHub Actions',
      url: repo && env.GITHUB_RUN_ID ? `${env.GITHUB_SERVER_URL || 'https://github.com'}/${repo}/actions/runs/${env.GITHUB_RUN_ID}` : null,
      job: [env.GITHUB_WORKFLOW, env.GITHUB_JOB].filter(Boolean).join(' / ') || null,
      runNumber: env.GITHUB_RUN_NUMBER || null,
      event: env.GITHUB_EVENT_NAME || null, // push, pull_request, schedule, workflow_dispatch
      actor: env.GITHUB_ACTOR || null,
      branch: env.GITHUB_HEAD_REF || env.GITHUB_REF_NAME || null,
    };
  }
  if (env.BITBUCKET_BUILD_NUMBER) {
    const repo = env.BITBUCKET_REPO_FULL_NAME || '';
    return {
      provider: 'Bitbucket Pipelines',
      url: repo ? `https://bitbucket.org/${repo}/pipelines/results/${env.BITBUCKET_BUILD_NUMBER}` : null,
      job: env.BITBUCKET_STEP_UUID ? 'step ' + env.BITBUCKET_STEP_UUID : null,
      runNumber: env.BITBUCKET_BUILD_NUMBER,
      event: env.BITBUCKET_PR_ID ? 'pull_request' : env.BITBUCKET_BRANCH ? 'push' : null,
      actor: env.BITBUCKET_STEP_TRIGGERER_UUID ? 'Bitbucket user' : null,
      branch: env.BITBUCKET_BRANCH || null,
    };
  }
  if (env.CI) return { provider: 'CI', url: null, job: null, runNumber: null, event: null, actor: null, branch: null };
  return null;
}

/** Everything about the run that doesn't need the device. Never throws. */
export function runDetails(projectRoot, env = process.env) {
  const ci = ciInfo(env);
  const commit = git(projectRoot, ['rev-parse', 'HEAD']);
  const dirty = commit ? git(projectRoot, ['status', '--porcelain', '--untracked-files=no']) !== '' : null;
  let user = null;
  try { user = os.userInfo().username; } catch {}
  const trigger = ci
    ? `${ci.provider}${ci.event ? ' · ' + ci.event.replace(/_/g, ' ') : ''}`
    : env.DASHBOARD_TRIGGER || 'manual (local)';
  return {
    trigger,
    startedBy: env.DASHBOARD_STARTED_BY || (ci && ci.actor) || user,
    ci,
    project: {
      branch: (ci && ci.branch) || git(projectRoot, ['rev-parse', '--abbrev-ref', 'HEAD']) || null,
      commit: commit || null,
      commitMessage: commit ? git(projectRoot, ['log', '-1', '--format=%s']) || null : null,
      dirty, // true = files changed since that commit (tests not exactly what is committed)
      remote: (git(projectRoot, ['remote', 'get-url', 'origin']) || '').replace(/\/\/[^@/]+@/, '//') || null, // never keep a token
    },
    host: { name: os.hostname(), os: `${os.type()} ${os.release()}`, arch: os.arch() },
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    utcOffsetMinutes: -new Date().getTimezoneOffset(),
    tools: {
      node: process.version,
      webdriverio: pkgVersion(projectRoot, 'webdriverio'),
      wdioCli: pkgVersion(projectRoot, '@wdio/cli'),
      appium: pkgVersion(projectRoot, 'appium'),
      uiautomator2Driver: pkgVersion(projectRoot, 'appium-uiautomator2-driver'),
    },
  };
}

/** Emulator or phone, Android build, WebView. Uses adb shell when Appium allows it; otherwise returns {}. */
export async function deviceDetails() {
  const prop = async (name) => {
    try {
      return String(await driver.execute('mobile: shell', { command: 'getprop', args: [name] })).trim() || null;
    } catch {
      return null;
    }
  };
  const out = {};
  out.buildFingerprint = await prop('ro.build.fingerprint');
  if (out.buildFingerprint === null) return {}; // adb shell not allowed: nothing more to read
  out.emulator = (await prop('ro.kernel.qemu')) === '1' || /emulator|sdk_gphone|generic/i.test(out.buildFingerprint || '');
  out.securityPatch = await prop('ro.build.version.security_patch');
  out.abi = await prop('ro.product.cpu.abi');
  try {
    const dump = String(await driver.execute('mobile: shell', { command: 'dumpsys', args: ['package', 'com.google.android.webview'] }));
    out.webview = (dump.match(/versionName=(\S+)/) || [])[1] || null;
  } catch {}
  return out;
}
