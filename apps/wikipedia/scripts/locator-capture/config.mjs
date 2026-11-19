// Locator capture configuration for the Wikipedia app (copied from the eGenome.ai tool,
// only this file changed). Values can be overridden with environment variables.
//
// Before capturing, install the APK you built:  adb install -r out/<newest>.apk
// (npm run test:smoke also installs it). The capture tool starts the installed app.

export default {
  appium: {
    hostname: process.env.APPIUM_HOST || '127.0.0.1',
    port: Number(process.env.APPIUM_PORT || 4723),
    path: process.env.APPIUM_PATH || '/',
  },

  capabilities: {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
    ...(process.env.DEVICE_UDID ? { 'appium:udid': process.env.DEVICE_UDID } : {}),
    // devDebug build. Change APP_PACKAGE for other variants (alphaDebug -> org.wikipedia.alpha).
    'appium:appPackage': process.env.APP_PACKAGE || 'org.wikipedia.dev',
    'appium:appActivity': process.env.APP_ACTIVITY || 'org.wikipedia.main.MainActivity',
    'appium:appWaitActivity': '*',      // the app may open the intro screens first
    'appium:noReset': true,
    'appium:dontStopAppOnReset': true,
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 3600,
    'appium:language': 'en',
    'appium:locale': 'US',
  },

  outputDir: process.env.LOCATORS_DIR || 'locators',
  pageObjectFormat: 'auto',
  saveScreenshots: true,
  saveRawXml: process.env.SAVE_RAW_XML === 'true', // CI turns this on, so the page source can be reviewed

  ignorePackages: [
    'com.android.systemui',
    'com.google.android.inputmethod.latin',
    'com.android.inputmethod.latin',
    'com.samsung.android.honeyboard',
  ],

  screenMatchThreshold: 0.6,

  watch: {
    pollIntervalMs: 1000,
    stableChecks: 2,
  },

  crawl: {
    maxDepth: Number(process.env.CRAWL_MAX_DEPTH || 5),
    maxActions: Number(process.env.CRAWL_MAX_ACTIONS || 250),
    maxMinutes: Number(process.env.CRAWL_MAX_MINUTES || 25),
    settleMs: 1500,
    // NEVER tap these. Wikipedia is a live, public site: editing, publishing or
    // thanking would change real content under a real (anonymous) IP. Login, donation,
    // sharing and links that leave the app are blocked too.
    denylist: /edit|publish|save changes|undo|revert|rollback|thank|watch|talk|report|donate|donation|log ?in|sign ?in|create account|join wikipedia|log ?out|sign ?out|delete|remove|clear|share|send feedback|open in browser|rate|reset|privacy|terms|license|wikimedia|install|update/i,
    // The smoke paths need search terms; everything else gets a harmless word.
    inputs: [
      { match: /search|find/i, value: 'Albert Einstein' },
      { match: /.*/, value: 'test' },
    ],
  },
};
