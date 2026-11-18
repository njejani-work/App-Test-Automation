// Reading the Android log (logcat) of one test: the app's own errors and warnings, crashes of other processes,
// and signs that the emulator itself is stuck. Used by the recorder while tests run, and by the dashboard
// builder to re-read older runs.

// "11-13 10:54:52.215 15131 15131 E Tag: message"
export const LOGCAT_LINE = /^\s*\S+\s+\S+\s+(\d+)\s+(\d+)\s+([VDIWEF])\s+(.*?)\s*:\s(.*)$/;

// Signs that the emulator's screen itself is stuck (seen 13 Nov 2026 on the Android 17 emulator): taps land on no
// window at all, and every tap first waits 5 s for screen animations that never finish.
const NO_WINDOW = /InputDispatcher: No new touched window at \(([\d.]+), ([\d.]+)\)/;
const ANIM_TIMEOUT = /WindowManager: Timed out waiting for animations to complete/;

/**
 * Split the Android log into the app's own errors and warnings. A crash (AndroidRuntime FATAL EXCEPTION) only
 * counts as the app's when the crashed process IS the app ("Process: org.wikipedia.dev, PID: …"): crashes of
 * other processes (e.g. WebView's sandboxed helper "com.google.android.webview:sandboxed_process0") are listed
 * apart in otherCrashes. Also counts the stuck-screen signs above.
 */
export function classifyLogcat(lines, pkg, pid = null) {
  const errors = [];
  const warnings = [];
  const otherCrashes = [];
  const screen = { noWindow: 0, animTimeouts: 0, at: null };
  const crashPids = new Map(); // pid -> process name from "Process: <name>, PID: <pid>"
  for (const l of lines) {
    const m = l.match(LOGCAT_LINE);
    if (m && m[4] === 'AndroidRuntime') { const p = m[5].match(/^Process: ([^,]+), PID: (\d+)/); if (p) crashPids.set(p[2], p[1]); }
  }
  const isAppPid = (p) => (crashPids.has(p) ? crashPids.get(p) === pkg : pid ? p === pid : true);
  for (const l of lines) {
    let x;
    if ((x = l.match(NO_WINDOW))) { screen.noWindow++; screen.at = screen.at || `${Math.round(x[1])},${Math.round(x[2])}`; }
    if (ANIM_TIMEOUT.test(l)) screen.animTimeouts++;
    const m = l.match(LOGCAT_LINE);
    if (!m) continue;
    const [, linePid, , level, tag, msg] = m;
    const fromApp = pid ? linePid === pid : l.includes(pkg);
    if (tag === 'AndroidRuntime') {
      const isCrashLine = /FATAL EXCEPTION/.test(msg) || crashPids.has(linePid) || msg.includes(pkg);
      if (isCrashLine && !isAppPid(linePid)) {
        let c = otherCrashes.find((o) => o.pid === linePid);
        if (!c) otherCrashes.push((c = { pid: linePid, process: crashPids.get(linePid) || `pid ${linePid}`, exception: '' }));
        if (!c.exception && /Exception|Error/.test(msg) && !/FATAL EXCEPTION|^Process: /.test(msg)) c.exception = msg.trim().slice(0, 240);
        continue;
      }
      if (isCrashLine) { errors.push(`${level} ${tag}: ${msg}`); continue; }
    }
    if ((level === 'E' || level === 'F') && fromApp) errors.push(`${level} ${tag}: ${msg}`);
    else if (level === 'W' && fromApp) warnings.push(`W ${tag}: ${msg}`);
  }
  return { errors, warnings, otherCrashes, screen };
}

/** Warnings for things on the emulator that are not the app: a stuck screen, other processes crashing. */
export function deviceWarnings({ otherCrashes = [], screen = {} }) {
  const out = [];
  if (screen.noWindow > 0) {
    out.push({ source: 'device', message: `The emulator's screen was stuck: ${screen.noWindow} tap(s) reached no window at all (Android: "No new touched window at ${screen.at}")${screen.animTimeouts ? `, and Android waited ${screen.animTimeouts} time(s) for screen animations that never finished` : ''}. The app could not receive taps, so this result says nothing about the app. Cold boot the emulator (Device Manager > ⋮ > Cold Boot Now) and run again.` });
  } else if (screen.animTimeouts >= 3) {
    out.push({ source: 'device', message: `Android waited ${screen.animTimeouts} times for screen animations that never finished ("Timed out waiting for animations to complete"): each tap was delayed 5 s. If taps stop working, cold boot the emulator.` });
  }
  for (const c of otherCrashes) {
    out.push({ source: 'device', message: `Another process crashed, not the app: ${c.process} (pid ${c.pid})${c.exception ? `: ${c.exception}` : ''}.${/webview/i.test(c.process) ? ' This is Android\'s WebView helper; the app keeps running, but pages shown in a WebView may stay blank.' : ''}` });
  }
  return out;
}


/**
 * App screens' launch times from Android's "Displayed" lines, e.g.
 *   "Displayed org.wikipedia.dev/org.wikipedia.main.MainActivity: +1s234ms"            (Android 14 and older)
 *   "Displayed org.wikipedia.dev/.onboarding.InitialOnboardingActivity for user 0: +6s311ms"  (Android 15+)
 */
export function launchTimesIn(lines, pkg) {
  const out = [];
  for (const l of lines) {
    const m = l.match(/Displayed (\S+?)\/(\S+?)(?: for user \d+)?: \+(?:(\d+)s)?(\d+)ms/);
    if (m && m[1] === pkg) out.push({ activity: m[2].replace(/^.*\./, ''), ms: Number(m[3] || 0) * 1000 + Number(m[4]) });
  }
  return out;
}
