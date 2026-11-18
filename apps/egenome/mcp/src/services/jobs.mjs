// The test runs this server started (jobs live as long as the server). One device run at a time.
import { startJob } from '../adapters/processes.mjs';
import { currentRunId, runMeta, closeRun } from '../adapters/run-log.mjs';

export function createJobs(config, mask, log) {
  const jobs = []; // oldest first

  /** The device run a job is writing: the run whose folder appeared after the job started. */
  function runIdOf(job) {
    if (job.runId || job.kind !== 'suite') return job.runId || null;
    const id = currentRunId(config.reportsDir);
    const meta = id && runMeta(config.reportsDir, id);
    if (meta && meta.startedAt >= job.startedMs - 2000) job.runId = id;
    return job.runId || null;
  }

  return {
    runIdOf,
    find: (id) => jobs.find((j) => j.id === id) || null,
    newest: (kind) => jobs.findLast((j) => j.kind === kind) || null,
    running: (kind) => jobs.find((j) => j.status === 'running' && (!kind || j.kind === kind)) || null,
    ids: () => jobs.map((j) => j.id),
    ownsRun: (runId) => jobs.some((j) => j.runId === runId),

    /** Run the unit tests; onLine(line) for progress. */
    startUnit(coverage, onLine) {
      const { cmd, args } = config.commands.unit(coverage);
      const job = startJob({ kind: 'unit', label: coverage ? 'unit tests + coverage' : 'unit tests', cmd, args, cwd: config.root, timeoutMs: config.limits.unitMs, mask, onLine });
      jobs.push(job);
      return job;
    },

    /** Start a device suite in the background. When it ends early, its run record is closed with the reason. */
    startSuite(suite) {
      const { cmd, args } = config.commands.suite(suite);
      const job = startJob({ kind: 'suite', label: `${suite} on ${config.deviceUdid}`, cmd, args, cwd: config.root, env: config.suiteEnv().env, timeoutMs: config.limits.suiteMs, mask });
      job.suite = suite;
      jobs.push(job);
      log.info(`started ${job.id}: ${job.label}`);
      job.done.then(() => {
        const id = runIdOf(job);
        log.info(`${job.id} ended: ${job.status} (exit ${job.exitCode})`);
        if (!id || job.status === 'passed' || job.status === 'failed') return;
        const why = job.status === 'timed out' ? `stopped: over the ${Math.round(config.limits.suiteMs / 60000)}-minute time limit (MCP server)` : 'stopped from the assistant (MCP server)';
        try { closeRun(config.reportsDir, id, job.exitCode ?? 1, why); } catch (e) { log.warn(`could not close run ${id}`, e); }
      });
      return job;
    },

    /** Stop everything this server started (when the client disconnects or the server exits). */
    stopAll: () => { for (const j of jobs) j.stop(); },
  };
}
