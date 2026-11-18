// Locator capture (scripts/locator-capture/lib/parser.mjs): element names and locators from a real screen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { analyze, suggestName, camel, xpathLiteral, elementKey } from '@apptest/toolkit/locators/lib/parser.mjs';

const login = fs.readFileSync(new URL('./fixtures/screens/Login.xml', import.meta.url), 'utf8');

test('a real screen gives named elements with unique locators, best first', () => {
  const r = analyze(login, { appPackage: 'com.egenome.app' });
  assert.equal(r.package, 'com.egenome.app');
  assert.ok(r.signature.size > 0);
  const send = r.elements.find((e) => e.suggestedName === 'sendOtpBtn');
  assert.ok(send, 'the Send OTP button is found and named');
  assert.deepEqual(send.locators[0], { strategy: 'accessibility id', selector: '~Send OTP', unique: true });
  assert.ok(r.elements.find((e) => e.suggestedName === 'enterYourMobileNumberInput'), 'the phone field is named after its hint');
  assert.ok(r.elements.every((e) => e.locators.length > 0));
});

test('the same screen always gives the same fingerprint (so captures are not duplicated)', () => {
  const a = analyze(login, { appPackage: 'com.egenome.app' }), b = analyze(login, { appPackage: 'com.egenome.app' });
  assert.equal(a.structureHash, b.structureHash);
});

test('names: words in camelCase with a type suffix; names that clash with page members are changed', () => {
  assert.equal(camel(['send', 'otp', 'btn']), 'sendOtpBtn');
  assert.equal(camel(['1st', 'item']), 'el1stItem');
  const el = (o) => ({ cls: 'android.widget.TextView', resourceId: '', contentDesc: '', text: '', hint: '', clickable: false, ...o });
  assert.equal(suggestName(el({ cls: 'android.widget.Button', text: 'Continue' })), 'continueBtn');
  assert.equal(suggestName(el({ text: 'Terms', clickable: true })), 'termsLink');
  assert.equal(suggestName(el({ resourceId: 'com.x:id/btn_save' })), 'saveText');
  assert.equal(suggestName(el({ cls: 'android.widget.ImageView', clickable: true })), 'btn');
});

test('XPath text with quotes is written so the XPath stays valid', () => {
  assert.equal(xpathLiteral('Home'), '"Home"');
  assert.equal(xpathLiteral('Say "hi"'), '\'Say "hi"\'');
  assert.equal(xpathLiteral('It\'s "x"'), 'concat("It\'s ", \'"\', "x", \'"\', "")');
});

test('element keys prefer the id, then the text', () => {
  assert.equal(elementKey({ cls: 'B', resourceId: 'a:id/x', contentDesc: '', text: 'Hi', hint: '' }), 'B|id:a:id/x|desc:');
  assert.equal(elementKey({ cls: 'T', resourceId: '', contentDesc: '', text: ' Hi ', hint: '' }), 'T|text:Hi');
});
