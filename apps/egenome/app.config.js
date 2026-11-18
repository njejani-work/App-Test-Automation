// What the shared toolkit needs to know about the eGenome app (read by wdio.conf.js -> createConfig()).
// Everything not here (Appium service, reporters, timeouts, dashboard recording) is the toolkit's default:
// see toolkit/wdio/index.js.
export default {
  id: 'egenome',
  name: 'eGenome.ai',
  package: 'com.egenome.app',
  activity: '.MainActivity',
  dashboard: { title: 'eGenome.ai App Tests' },

  // npx wdio run ./wdio.conf.js (no --suite): smoke + regression
  specs: ['./test/specs/smoke/**/*.js', './test/specs/regression/**/*.js'],
  suites: {
    smoke: ['./test/specs/smoke/**/*.js'],
    regression: ['./test/specs/regression/**/*.js'],
    layout: ['./test/specs/layout/**/*.js'],
    extended: ['./test/specs/extended/**/*.js'],
  },
  exclude: ['./test/specs/_archive/**'],

  // capabilities: {},  only what differs from the toolkit's defaults (none for eGenome)
  // wdio: {},          other WebdriverIO settings that differ (none for eGenome)
};
