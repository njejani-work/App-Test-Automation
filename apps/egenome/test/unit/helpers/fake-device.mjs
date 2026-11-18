// A pretend phone for unit tests of page objects: stands in for WebdriverIO's global `driver`, `$` and `$$`.
// No Appium, no emulator. A test says what is on screen, runs a page-object method, then checks what it did.
//
//   const dev = fakeDevice({ showing: ['Log in or Sign up', 'Send OTP'] });
//   dev.after(1500, () => dev.show('Choose a phone number'));     // something appears 1.5 s later
//   dev.onBack = () => dev.hide('Choose a phone number');         // what the Back button does
//   await LoginPage.open();
//   assert.equal(dev.count('back'), 1);
//   dev.restore();
//
// "On screen" works by text: a selector counts as displayed when its string contains one of the shown texts
// (e.g. 'Send OTP' matches android=new UiSelector().description("Send OTP")).
// Time is pretend: waits and pauses move a fake clock (Date.now() included) instead of sleeping, so a page object
// that waits 20 s finishes in milliseconds, and things scheduled with dev.after() happen at the right moment.
export function fakeDevice({ showing = [], keyboard = false, screen = { width: 720, height: 1280 } } = {}) {
  const realNow = Date.now;
  let clock = Date.UTC(2026, 10, 16, 10, 0, 0);
  const start = clock;
  const events = [];
  const dev = {
    showing: new Set(showing),
    keyboard,
    appState: 4, // 4 = app in the foreground (Appium's queryAppState)
    calls: [], // everything the page object did: ['click', selector], ['back'], ['hideKeyboard'], ...
    onBack: () => { dev.keyboard = false; }, // default: Back only closes the keyboard
    onClick: {}, // { 'text in selector': () => {...} }: what a tap does
    show: (...t) => t.forEach((x) => dev.showing.add(x)),
    hide: (...t) => t.forEach((x) => dev.showing.delete(x)),
    after: (ms, fn) => events.push({ at: clock + ms, fn }),
    now: () => clock,
    count: (name) => dev.calls.filter((c) => c[0] === name).length,
    clicked: (text) => dev.calls.some((c) => c[0] === 'click' && String(c[1]).includes(text)),
  };
  const advance = (ms) => {
    clock += ms;
    events.sort((a, b) => a.at - b.at);
    while (events.length && events[0].at <= clock) events.shift().fn();
  };
  const shown = (sel) => [...dev.showing].some((t) => String(sel).includes(t));
  const waitFor = async (sel, { timeout = 5000, reverse = false } = {}) => {
    const end = clock + timeout;
    while (shown(sel) === reverse) {
      if (clock >= end) throw new Error(`fake device: ${sel} still ${reverse ? 'displayed' : 'not displayed'} after ${timeout}ms`);
      advance(100);
    }
    return true;
  };
  const element = (sel) => ({
    selector: sel,
    isDisplayed: async () => shown(sel),
    isExisting: async () => shown(sel),
    waitForDisplayed: (o) => waitFor(sel, o),
    waitForExist: (o) => waitFor(sel, o),
    click: async () => {
      if (!shown(sel)) throw new Error(`fake device: tapped ${sel}, which is not on screen`);
      dev.calls.push(['click', sel]);
      for (const [text, fn] of Object.entries(dev.onClick)) if (String(sel).includes(text)) fn();
    },
    setValue: async (v) => { dev.calls.push(['setValue', sel, String(v)]); },
    addValue: async (v) => { dev.calls.push(['addValue', sel, String(v)]); },
    clearValue: async () => { dev.calls.push(['clearValue', sel]); },
    getText: async () => '',
    getAttribute: async () => null,
    getLocation: async () => ({ x: 0, y: 0 }),
    getSize: async () => ({ width: 100, height: 40 }),
  });
  // Like WebdriverIO: $(sel) can be awaited, or chained ($(sel).isDisplayed())
  globalThis.$ = (sel) => { const e = element(sel); return Object.assign(Promise.resolve(e), e); };
  globalThis.$$ = async (sel) => (shown(sel) ? [element(sel)] : []);
  globalThis.driver = {
    back: async () => { dev.calls.push(['back']); dev.onBack(); },
    isKeyboardShown: async () => dev.keyboard,
    hideKeyboard: async () => { dev.calls.push(['hideKeyboard']); dev.keyboard = false; },
    pause: async (ms) => advance(ms),
    waitUntil: async (fn, { timeout = 5000, interval = 500, timeoutMsg } = {}) => {
      const end = clock + timeout;
      for (;;) {
        if (await fn()) return true;
        if (clock >= end) throw new Error(timeoutMsg || 'waitUntil timed out');
        advance(interval);
      }
    },
    queryAppState: async () => dev.appState,
    activateApp: async (id) => { dev.calls.push(['activateApp', id]); dev.appState = 4; },
    terminateApp: async (id) => { dev.calls.push(['terminateApp', id]); dev.appState = 1; },
    getWindowSize: async () => screen,
    execute: async (...args) => { dev.calls.push(['execute', ...args]); return false; },
    saveScreenshot: async () => {},
  };
  Date.now = () => clock;
  dev.restore = () => { Date.now = realNow; delete globalThis.$; delete globalThis.$$; delete globalThis.driver; };
  /** One line each: what was on screen at the end, and what the page object did (shown on the dashboard). */
  dev.summary = () => {
    const short = (sel) => String(sel).replace(/^android=new UiSelector\(\)\./, '').replace(/^\/\/\*/, 'xpath ');
    const did = dev.calls.map(([k, sel, v]) => (k === 'click' ? `tap ${short(sel)}` : k === 'setValue' ? `type "${v}" into ${short(sel)}` : k === 'execute' ? `execute ${sel}` : sel ? `${k} ${short(sel)}` : k));
    return [
      `Pretend phone · on screen at the end: ${[...dev.showing].join(', ') || 'nothing'}${dev.keyboard ? ' + keyboard' : ''} · pretend time used: ${((clock - start) / 1000).toFixed(1)} s`,
      `Pretend phone · the page object did: ${did.length ? did.join(' → ') : 'nothing'}`,
    ];
  };
  return dev;
}
