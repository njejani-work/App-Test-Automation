// A test's history across the kept runs: NEW, RECURRING, FLAKY or REGRESSION (the dashboard's rules).

/** @returns {{status: string, lastPass: object|null, last10: string[]}|null} */
export function historyOf(index, run, testId) {
  const T = index.tests.find((t) => t.id === testId || t.title === testId);
  if (!T) return null;
  const older = T.results.filter((x) => x.runId <= run.id);
  const [cur, ...before] = older;
  const lastPass = before.find((x) => x.status !== 'failed' && !x.crash);
  let streak = 0; for (const x of older) { if (x.status === 'failed') streak++; else break; }
  const sameBuild = older.slice(0, 10).filter((x) => cur && x.buildId === cur.buildId);
  const flaky = sameBuild.some((x) => x.status === 'failed') && sameBuild.some((x) => x.status !== 'failed');
  // passed on an older build, fails on a newer one, same test code = the app changed
  const regression = lastPass && lastPass.buildId && cur?.buildId && lastPass.buildId !== cur.buildId && lastPass.projectCommit === cur.projectCommit;
  const status = !cur || cur.status !== 'failed' ? cur?.status || 'not in this run'
    : regression ? `REGRESSION (passed on app build ${lastPass.buildId}, fails on ${cur.buildId} with the same test code: the app changed)`
      : flaky ? 'FLAKY (failed and passed on the same app build)'
        : !before.length ? 'NEW (first run of this test)'
          : before[0].status !== 'failed' ? 'NEW (passed in the previous run)'
            : `RECURRING (failing ${streak} runs in a row)`;
  return {
    status,
    lastPass: lastPass ? { runId: lastPass.runId, appBuild: lastPass.buildId, sameAppBuild: lastPass.buildId === cur?.buildId, sameTestCode: lastPass.projectCommit === cur?.projectCommit } : null,
    last10: older.slice(0, 10).map((x) => `${x.runId}:${x.status}`),
  };
}

/** The first word of a history status: NEW, RECURRING, FLAKY, REGRESSION (for one-line lists). */
export const historyTag = (h) => (h ? h.status.split(' ')[0] : null);
