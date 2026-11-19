// start_test_run: starts a device suite in the background, ONLY after the user confirmed (it clears app data).
import { z } from 'zod';
import { ACTION, fail } from '../shared/types.mjs';
import { device } from '../adapters/project.mjs';
import { activeRunElsewhere } from '../adapters/run-log.mjs';
import { adbDevices, ADB_MISSING, notReadyHint } from '../services/devices.mjs';
import { list } from '../format/md.mjs';

// The suites the assistant may start, what each does and what a run does to the device: the app's mcp.json.
const suiteNames = (config) => Object.keys(config.app.suites);

export default {
  name: 'start_test_run',
  title: 'Start a device test suite',
  description: (config) => `Starts one of the ${config.app.name} device suites (${suiteNames(config).join(', ')}) on the device in .env (${config.app.deviceVar}) as a background job; it can change the app on the device (the first call says how) and takes minutes. Call it first WITHOUT confirm: it only describes what would happen; show that to the user, and call again with confirm: true only after they agree. Then use check_test_run.`,
  input: (config) => ({
    suite: z.enum(suiteNames(config)),
    confirm: z.boolean().default(false).describe('true only after the user agreed to what the first call described'),
  }),
  annotations: { ...ACTION, destructiveHint: true },

  async run({ suite, confirm }, ctx) {
    const { config, jobs } = ctx;
    const SUITES = config.app.suites;
    if (!SUITES[suite]) fail(`${config.app.name} has no suite "${suite}"; suites: ${suiteNames(config).join(', ')}.`);
    const busy = jobs.running('suite');
    if (busy) fail(`A test run is already going (${busy.id}, ${busy.label}, started ${busy.startedAt}). One device run at a time: follow it with check_test_run or stop it with stop_test_run.`);
    const elsewhere = activeRunElsewhere(config.reportsDir);
    if (elsewhere && !jobs.ownsRun(elsewhere.runId)) fail(`A test run started outside the assistant is still going (run ${elsewhere.runId}, last activity ${elsewhere.lastActivity}). Wait for it to finish; one device run at a time.`);

    const devices = await adbDevices();
    if (!devices) fail(`${ADB_MISSING} No device can be checked or used.`);
    const dev = devices.find((d) => d.id === config.deviceUdid);
    if (dev?.state !== 'device') fail(`The device the tests use (${config.app.deviceVar}=${config.deviceUdid} in .env) is ${dev ? `"${dev.state}" (not ready${notReadyHint(dev.state)})` : 'not connected'}. adb sees: ${devices.map((d) => `${d.id} (${d.state})`).join(', ') || 'nothing'}. Start the emulator or connect the phone, or change ${config.app.deviceVar}.`);

    const tools = config.suiteEnv();
    if (tools.missing.length) fail(`Appium needs ${tools.missing.join(' and ')}, and this server cannot find it. Set it in Windows (System → Environment variables) and restart Claude, or add it to the server's "env" in the Claude config.`);
    const details = await (await device()).deviceDetails(config.deviceUdid);
    const last = ctx.reports.index()?.runs.find((r) => (r.suites || []).includes(suite) && r.durationMs && r.summary.total > 1);
    const plan = {
      suite, what: SUITES[suite].what, device: `${config.deviceUdid}${details?.emulator ? ' (emulator)' : ' (A REAL PHONE)'}`,
      effects: [
        ...config.app.effects,
        details?.emulator ? null : `WARNING: this is a real phone, not the emulator. Do not run it on a phone where ${config.app.name} is used with a personal account.`,
        `Results are recorded on the ${config.app.name} dashboard (apps/${config.app.id}/reports/).`,
      ].filter(Boolean),
      expectedMinutes: last ? String(Math.max(1, Math.round(last.durationMs / 60000))) : SUITES[suite].minutes,
      timeLimitMinutes: Math.round(config.limits.suiteMs / 60000),
      tools: tools.notes,
    };
    const facts = list([`**What:** ${plan.what}`, `**Device:** ${plan.device}`, `**Takes about:** ${plan.expectedMinutes} min (stopped after ${plan.timeLimitMinutes} min)`, ...plan.tools.map((n) => `**${n.split(':')[0]}:**${n.slice(n.indexOf(':') + 1)}`)]);
    if (!confirm) {
      const next = 'Nothing has started. Show this to the user; if they agree, call start_test_run again with confirm: true.';
      return { text: `## Ready to start ${suite}: NOT started yet\n\n${facts}\n\n**What will happen:**\n${list(plan.effects)}\n\n➡ ${next}`, data: { needsConfirmation: true, ...plan, next } };
    }
    const job = jobs.startSuite(suite);
    const next = `Follow it with check_test_run (job "${job.id}"); every 1-2 minutes is enough.`;
    return { text: `## ▶ ${suite} started (job \`${job.id}\`)\n\n${facts}\n\n➡ ${next}`, data: { started: true, job: job.id, ...plan, next } };
  },
};
