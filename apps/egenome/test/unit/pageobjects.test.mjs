// Page objects with a pretend phone (helpers/fake-device.mjs): what they do on each screen, without Appium.
// The first tests are the three bugs found on the emulator in Nov 2026, so they can never come back unnoticed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fakeDevice } from './helpers/fake-device.mjs';
import LoginPage from '../pageobjects/LoginPage.js';
import BottomNav from '../pageobjects/components/BottomNav.js';
import OnboardingPage from '../pageobjects/OnboardingPage.js';
import OtpPage from '../pageobjects/OtpPage.js';
import SystemDialogs from '../pageobjects/components/SystemDialogs.js';
import SettingsPage from '../pageobjects/SettingsPage.js';

// What the screens show (texts that appear in the page objects' selectors)
const LOGIN = ['Log in or Sign up', 'Send OTP', 'android.widget.EditText'];
const OTP = ['OTP, please', 'OTP digit '];
const TABS = ['("Home")', '("Report")', '("Settings")'];
const PICKER_NEW = 'Choose a phone number'; // Google Play services sheet, design from Nov 2026 (no "cancel" id)
const PICKER_OLD = 'gms:id/cancel'; // older design with a Cancel button

// Each test gets a pretend phone; at the end, what it showed and what the page object did go to the dashboard
const device = (t, opts) => { const dev = fakeDevice(opts); t.after(() => { for (const m of dev.summary()) t.diagnostic(m); dev.restore(); }); return dev; };
/** The picker covers the login screen while it is open; Back closes it (like its X). */
function pickerAppears(dev, ms) {
  dev.after(ms, () => { dev.hide(...LOGIN); dev.show(PICKER_NEW); });
  dev.onBack = () => { if (dev.showing.has(PICKER_NEW)) { dev.hide(PICKER_NEW); dev.show(...LOGIN); } };
}

// ---------------------------------------------------------------- Google's phone-number picker (bug of 13 Nov)
test('login screen: the new-design phone picker that pops up late is closed with Back, once', async (t) => {
  const dev = device(t, { showing: LOGIN });
  pickerAppears(dev, 1500);
  await LoginPage.open();
  assert.equal(dev.count('back'), 1);
  assert.ok(dev.showing.has('Send OTP') && !dev.showing.has(PICKER_NEW), 'the login screen is free');
});

test('login screen: a picker that pops up after the screen opened is closed before the layout check (17 Nov)', async (t) => {
  const dev = device(t, { showing: LOGIN });
  await LoginPage.open(); // no picker yet: the screen is free
  pickerAppears(dev, 2500); // ...then it pops up while the test moves on
  await LoginPage.settle(); // what verifyLayout does first
  assert.equal(dev.count('back'), 1);
  assert.ok(dev.showing.has('Send OTP') && !dev.showing.has(PICKER_NEW), 'the layout check sees the login screen, not the picker');
});

test('login screen: a keyboard that comes back after the picker closed is closed again (SMK-08, 17 Nov)', async (t) => {
  const dev = device(t, { showing: LOGIN });
  pickerAppears(dev, 1500);
  const back = dev.onBack;
  dev.onBack = () => { back(); dev.after(3000, () => { dev.keyboard = true; }); }; // the phone field gets focus again, a little later
  await LoginPage.open();
  assert.equal(dev.keyboard, false, 'Send OTP is not covered');
});

test('login screen: the old-design picker is closed with its Cancel button, not Back', async (t) => {
  const dev = device(t, { showing: [PICKER_OLD] });
  dev.onClick[PICKER_OLD] = () => { dev.hide(PICKER_OLD); dev.show(...LOGIN); };
  await LoginPage.open();
  assert.ok(dev.clicked(PICKER_OLD));
  assert.equal(dev.count('back'), 0);
});

test('login screen: no picker, nothing is pressed', async (t) => {
  const dev = device(t, { showing: LOGIN });
  await LoginPage.open();
  assert.equal(dev.count('back'), 0);
  assert.equal(dev.count('click'), 0);
});

test('login screen: a picker that will not close gives a clear error, not "LoginPage did not open"', async (t) => {
  const dev = device(t, { showing: [PICKER_NEW] });
  dev.onBack = () => {}; // Back does nothing
  await assert.rejects(LoginPage.open(), /"Choose a phone number" sheet stayed over the login screen/);
});

test('login screen: the intro carousel is skipped first', async (t) => {
  const dev = device(t, { showing: ['("Skip")'] });
  dev.onClick['("Skip")'] = () => { dev.hide('("Skip")'); dev.show(...LOGIN); };
  await LoginPage.open();
  assert.ok(dev.clicked('Skip'));
  assert.ok(await OnboardingPage.isOpen() === false);
});

// ---------------------------------------------------------------- keyboard covering "Send OTP" (bug of 13 Nov)
test('login screen: a keyboard that opens with the phone field is closed (it covers "Send OTP")', async (t) => {
  const dev = device(t, { showing: LOGIN, keyboard: true });
  await LoginPage.open();
  assert.equal(dev.count('hideKeyboard'), 1);
  assert.equal(dev.keyboard, false);
});

test('hideKeyboard waits for a keyboard that is still sliding in', async (t) => {
  const dev = device(t, { showing: LOGIN });
  dev.after(200, () => { dev.keyboard = true; }); // appears 0.2 s after the field got focus
  await LoginPage.hideKeyboard();
  assert.equal(dev.count('hideKeyboard'), 1);
});

test('hideKeyboard does nothing when there is no keyboard', async (t) => {
  const dev = device(t, { showing: LOGIN });
  await LoginPage.hideKeyboard();
  assert.equal(dev.count('hideKeyboard'), 0);
});

// ---------------------------------------------------------------- app closed and reopened by Back (bug of 13 Nov)
test('tab bar: on the OTP screen (not logged in) it stops with a clear error and never presses Back', async (t) => {
  const dev = device(t, { showing: OTP });
  await assert.rejects(BottomNav.ensureVisible(), /the app is not logged in \(the login or OTP screen is showing\)/);
  assert.equal(dev.count('back'), 0);
  assert.equal(dev.count('activateApp'), 0);
});

test('tab bar: on the login screen it also stops without pressing Back', async (t) => {
  const dev = device(t, { showing: LOGIN });
  await assert.rejects(BottomNav.ensureVisible(), /not logged in/);
  assert.equal(dev.count('back'), 0);
});

test('tab bar: a screen left open by an earlier test is closed with Back', async (t) => {
  const dev = device(t, { showing: ['Report details'] });
  dev.onBack = () => { dev.hide('Report details'); dev.show(...TABS); };
  await BottomNav.ensureVisible();
  assert.equal(dev.count('back'), 1);
});

test('tab bar: if Back leaves the app, the app is brought back to the front', async (t) => {
  const dev = device(t, { showing: ['Premium plan'] });
  dev.onBack = () => { dev.hide('Premium plan'); dev.appState = 1; dev.show(...TABS); }; // app went to the background
  await BottomNav.ensureVisible();
  assert.equal(dev.count('activateApp'), 1);
});

test('tab bar: already showing, nothing is pressed', async (t) => {
  const dev = device(t, { showing: TABS });
  await BottomNav.ensureVisible();
  assert.equal(dev.calls.length, 0);
});

// ---------------------------------------------------------------- typing the phone number
test('phone number: +91, spaces and a leading 0 are removed before typing', async (t) => {
  for (const [given, typed] of [['+91 98765 43210', '9876543210'], ['09876543210', '9876543210'], ['9876543210', '9876543210']]) {
    const dev = fakeDevice({ showing: LOGIN });
    try {
      await LoginPage.enterPhone(given);
      const set = dev.calls.find((c) => c[0] === 'setValue');
      t.diagnostic(`"${given}" was typed as "${set[2]}"`);
      assert.equal(set[2], typed, `${given} -> ${typed}`);
    } finally { dev.restore(); }
  }
});

// ---------------------------------------------------------------- OTP screen
test('OTP: the code is typed one digit per box, then the keyboard is closed', async (t) => {
  const dev = device(t, { showing: OTP, keyboard: true });
  await OtpPage.enterOtp('482913');
  const typed = dev.calls.filter((c) => c[0] === 'setValue').map((c) => [c[1].match(/OTP digit (\d)/)[1], c[2]]);
  assert.deepEqual(typed, [['1', '4'], ['2', '8'], ['3', '2'], ['4', '9'], ['5', '1'], ['6', '3']]);
  assert.equal(dev.keyboard, false);
});

test('OTP: a code that is not 6 digits is refused before anything is typed', async (t) => {
  const dev = device(t, { showing: OTP });
  await assert.rejects(OtpPage.enterOtp('12345'), /OTP must be 6 digits, got "12345"/);
  assert.equal(dev.count('setValue'), 0);
});

// ---------------------------------------------------------------- Android permission dialogs
const NOTIF = ['permission_message', 'permission_allow_button', 'permission_deny_and_dont_ask_again_button'];
const LOCATION = ['permission_message', 'permission_allow_foreground_only_button', 'permission_deny_button'];
function dialogs(dev, order) { // each tap answers the dialog on screen and shows the next one
  const next = () => { dev.hide(...NOTIF, ...LOCATION); const d = order.shift(); if (d) dev.show(...d); };
  for (const k of ['permission_allow_button', 'permission_deny_and_dont_ask_again_button', 'permission_allow_foreground_only_button', 'permission_deny_button']) dev.onClick[k] = next;
  next();
}

test('permission dialogs: notifications, then location, are allowed in turn', async (t) => {
  const dev = device(t, { showing: [] });
  dialogs(dev, [NOTIF, LOCATION]);
  assert.deepEqual(await SystemDialogs.handleAll(), ['notifications', 'location']);
  assert.ok(dev.clicked('permission_allow_button') && dev.clicked('permission_allow_foreground_only_button'));
});

test('permission dialogs: with allow: false they are denied', async (t) => {
  const dev = device(t, { showing: [] });
  dialogs(dev, [NOTIF, LOCATION]);
  assert.deepEqual(await SystemDialogs.handleAll({ allow: false }), ['notifications', 'location']);
  assert.ok(dev.clicked('permission_deny_and_dont_ask_again_button') && dev.clicked('permission_deny_button'));
  assert.ok(!dev.clicked('permission_allow_button'));
});

test('permission dialogs: none showing, nothing is tapped', async (t) => {
  const dev = device(t, { showing: TABS });
  assert.deepEqual(await SystemDialogs.handleAll({ timeout: 1000 }), []);
  assert.equal(dev.count('click'), 0);
});

// ---------------------------------------------------------------- Settings scrolled to the bottom (17 Nov)
test('settings: back from Help & Support with the list scrolled to the bottom still counts as Settings', async (t) => {
  // on the 720x1280 emulator only the lower rows are on screen; the top rows (profile card, Appearance) are not
  device(t, { showing: [...TABS, 'Help & Support', 'Logout'] });
  await SettingsPage.waitForOpen(2000);
});

test('settings: another screen is not mistaken for Settings', async (t) => {
  device(t, { showing: [...TABS, 'Priority Support'] });
  await assert.rejects(SettingsPage.waitForOpen(2000), /SettingsPage did not open within 2000ms/);
});
