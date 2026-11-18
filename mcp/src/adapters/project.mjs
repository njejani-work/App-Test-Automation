// The dashboard modules the server reuses (never copies): loaded on first use, so start-up stays fast.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../config.mjs';

const load = (rel) => import(pathToFileURL(path.join(ROOT, rel)).href);

/** buildIndex(reportsDir): rebuilds reports/data/*.js from the run folders (the dashboard's analysis). */
export const builder = () => load('test/support/dashboard/builder.js');
/** codesIn(text), httpMeaning(code): what HTTP / exit / Android codes mean. */
export const codes = () => load('test/support/dashboard/lib/codes.js');
/** listDevices(), appInfo(udid, pkg), deviceDetails(udid): read-only adb. */
export const device = () => load('test/support/dashboard/lib/device.js');
/** APP_PACKAGE and the eGenome-specific run analysis. */
export const egenomeRun = () => load('test/support/dashboard/egenome-run.js');
