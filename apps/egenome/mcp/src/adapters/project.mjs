// The dashboard modules the server reuses (never copies), from the shared toolkit: loaded on first use, so start-up
// stays fast. config.mjs sets DASHBOARD_PROJECT_ROOT first, so they read eGenome's reports/ and test/ settings.

/** buildIndex(reportsDir): rebuilds reports/data/*.js from the run folders (the dashboard's analysis). */
export const builder = () => import('@apptest/toolkit/dashboard/builder.js');
/** codesIn(text), httpMeaning(code): what HTTP / exit / Android codes mean. */
export const codes = () => import('@apptest/toolkit/dashboard/lib/codes.js');
/** listDevices(), appInfo(udid, pkg), deviceDetails(udid): read-only adb. */
export const device = () => import('@apptest/toolkit/dashboard/lib/device.js');
/** APP_PACKAGE and the eGenome-specific run analysis. */
export const egenomeRun = () => import('@apptest/toolkit/dashboard/egenome-run.js');
