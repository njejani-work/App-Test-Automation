// Selector builders (S.* in BasePage.js): the strings the page objects send to UiAutomator2.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { S, noBackslash, re } from '../pageobjects/BasePage.js';

test('each builder makes the UiAutomator selector it is named after', () => {
  assert.equal(S.desc('Send OTP'), 'android=new UiSelector().description("Send OTP")');
  assert.equal(S.descContains('Weight'), 'android=new UiSelector().descriptionContains("Weight")');
  assert.equal(S.descStarts('OTP digit '), 'android=new UiSelector().descriptionStartsWith("OTP digit ")');
  assert.equal(S.text('Log in or Sign up'), 'android=new UiSelector().text("Log in or Sign up")');
  assert.equal(S.textContains('Main'), 'android=new UiSelector().textContains("Main")');
  assert.equal(S.textStarts('By submitting'), 'android=new UiSelector().textStartsWith("By submitting")');
  assert.equal(S.id('com.google.android.gms:id/cancel'), 'android=new UiSelector().resourceId("com.google.android.gms:id/cancel")');
  assert.equal(S.cls('android.widget.EditText'), 'android=new UiSelector().className("android.widget.EditText").instance(0)');
  assert.equal(S.cls('android.widget.EditText', 2), 'android=new UiSelector().className("android.widget.EditText").instance(2)');
});

test('quotes and backslashes in a label are escaped, so the selector stays valid', () => {
  assert.equal(S.text('Say "hi"'), 'android=new UiSelector().text("Say \\"hi\\"")');
  assert.equal(S.desc('a\\b'), 'android=new UiSelector().description("a\\\\b")');
});

test('regex selectors never contain a backslash (UiAutomator would double it and never match)', () => {
  assert.equal(S.descMatches('Resend OTP in \\d+s'), 'android=new UiSelector().descriptionMatches("Resend OTP in [0-9]+s")');
  assert.equal(S.textMatches('\\d{1,2}'), 'android=new UiSelector().textMatches("[0-9]{1,2}")');
});

test('no page-object locator sends a backslash to the device (every *Matches selector would silently never match)', async () => {
  const { CATALOG } = await import('../pageobjects/catalog.js');
  const all = CATALOG.flatMap((c) => Object.entries(c.locators || {}).map(([k, v]) => [`${c.page}.${k}`, typeof v === 'function' ? v(1) : v]));
  assert.ok(all.length > 100, `${all.length} locators checked`);
  assert.deepEqual(all.filter(([, v]) => String(v).includes('\\')).map(([k]) => k), []);
});

test('letters other than d (\\w, \\s) have no simple equivalent and are left as they are: write [a-z] or " " instead', () => {
  assert.equal(noBackslash('\\w+'), '\\w+');
});

test('noBackslash turns escapes into character classes that mean the same', () => {
  assert.equal(noBackslash('\\d+'), '[0-9]+');
  assert.equal(noBackslash('[\\d,]'), '[0-9,]');
  assert.equal(noBackslash('a\\.b'), 'a[.]b');
  assert.equal(noBackslash('\\+91'), '[+]91');
  assert.equal(noBackslash('[^\\]]'), '[^\\]]', 'no equivalent: left as it is');
  assert.equal(noBackslash('plain'), 'plain');
});

test('re() escapes every regex special character', () => {
  assert.equal(re('1.5 kg (approx)'), '1\\.5 kg \\(approx\\)');
  assert.ok(new RegExp(`^${re('a+b?[c]')}$`).test('a+b?[c]'));
});

test('XPath helpers quote labels with either kind of quote', () => {
  assert.equal(S.fieldAfter('FIRST NAME'), '//*[starts-with(@text, "FIRST NAME")]/following::android.widget.EditText[1]');
  assert.equal(S.fieldAfter('Say "hi"', 2), '//*[starts-with(@text, \'Say "hi"\')]/following::android.widget.EditText[2]');
  assert.match(S.clickableAfter('Height'), /following::\*\[@clickable="true"\]\[1\]$/);
  assert.match(S.textAfter('Weight'), /following::android\.widget\.TextView\[normalize-space\(@text\) != ''\]\[1\]$/);
});
