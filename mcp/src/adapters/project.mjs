// The dashboard modules the server reuses (never copies), from the shared toolkit: loaded on first use, so start-up
// stays fast. config.mjs sets DASHBOARD_PROJECT_ROOT first, so they read the app's (MCP_APP) reports/ and test/ settings.

/** buildIndex(reportsDir): rebuilds reports/data/*.js from the run folders (the dashboard's analysis). */
export const builder = () => import('@apptest/toolkit/dashboard/builder.js');
/** codesIn(text), httpMeaning(code): what HTTP / exit / Android codes mean. */
export const codes = () => import('@apptest/toolkit/dashboard/lib/codes.js');
/** listDevices(), appInfo(udid, pkg), deviceDetails(udid): read-only adb. */
export const device = () => import('@apptest/toolkit/dashboard/lib/device.js');
