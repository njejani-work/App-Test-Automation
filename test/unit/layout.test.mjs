// Layout checker (test/support/layout): reading a screen, building a spec from it, and comparing a screen with a spec.
// Uses real eGenome screens (test/unit/fixtures/screens), so these tests check what the app really shows.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseBounds, parseSource, flat, findAll, resolveTokens, isGlyph } from '../support/layout/hierarchy.js';
import { evaluate } from '../support/layout/check.js';
import { buildSpec, shapeOf, isDynamicText } from '../support/layout/spec-builder.js';
import { S } from '../pageobjects/BasePage.js';

const fixture = (f) => fs.readFileSync(new URL(`./fixtures/${f}`, import.meta.url), 'utf8');
const screen = (name) => parseSource(fixture(`screens/${name}.xml`));
const specFrom = (tree, name = 'Test') => buildSpec(tree, tree.screen, { spec: name, page: name, source: 'unit-test' });
const failed = (r) => r.results.filter((x) => x.status === 'failed');
const byText = (tree, text) => tree.all.find((e) => flat(e.text) === text);
const specNameFor = (spec, text) => Object.entries(spec.elements).find(([, e]) => e.text === text || e.match?.text === text || e.selector?.includes(JSON.stringify(text)))?.[0];

// ---------------------------------------------------------------- reading a screen
test('bounds "[x1,y1][x2,y2]" are read as numbers; anything else is null', () => {
  assert.deepEqual(parseBounds('[0,72][720,200]'), { x1: 0, y1: 72, x2: 720, y2: 200 });
  assert.equal(parseBounds(''), null);
  assert.equal(parseBounds('garbage'), null);
});

test('a real screen dump is read with its size and every element (Login screen)', () => {
  const t = screen('Login');
  assert.deepEqual(t.screen, { w: 720, h: 1280 });
  assert.ok(t.all.length > 10);
  assert.ok(byText(t, 'Log in or Sign up'), 'the screen title is found');
  assert.ok(t.all.some((e) => e.input), 'the phone field is recognised as an input');
});

test('text is compared the way a person reads it: line breaks and repeated spaces are one space', () => {
  assert.equal(flat('Main Street\nJacobpura'), 'Main Street Jacobpura');
  assert.equal(flat('  a \t b  '), 'a b');
  assert.equal(flat(null), '');
  // the address on the real Addresses screen has a line break in the middle
  const t = screen('Addresses');
  assert.ok(t.all.some((e) => e.text.includes('Main Street\nJacobpura')), 'the fixture really has the line break');
  assert.equal(findAll(t, { text: '123, Main Street, Main Street Jacobpura, Haryana - 122001' }).length, 1);
  assert.equal(findAll(t, { textPattern: '[0-9]+, +Main +Street, +Main +Street +Jacobpura, +Haryana +[-] +[0-9]+' }).length, 1);
});

test('page-object selectors find elements on a real screen', () => {
  const t = screen('Login');
  assert.equal(findAll(t, S.text('Log in or Sign up')).length, 1);
  assert.equal(findAll(t, S.desc('Send OTP')).length, 1);
  assert.equal(findAll(t, S.textStarts('By submitting')).length, 1);
  assert.equal(findAll(t, S.text('Not on this screen')).length, 0);
});

test('{{TOKENS}} in a spec are filled from the environment (account names stay out of the specs)', () => {
  process.env.UNIT_TEST_NAME = 'Jane Roe';
  assert.equal(resolveTokens('Hello {{UNIT_TEST_NAME}}'), 'Hello Jane Roe');
  assert.equal(resolveTokens('{{NOT_SET_ANYWHERE}}'), '');
  assert.equal(resolveTokens(42), 42);
  delete process.env.UNIT_TEST_NAME;
});

test('an icon drawn with an icon-font character is recognised as an icon', () => {
  assert.equal(isGlyph({ text: '' }), true);
  assert.equal(isGlyph({ text: 'Home' }), false);
  assert.equal(isGlyph({ text: '' }), false);
});

// ---------------------------------------------------------------- building a spec
test('live values are told apart from fixed text', () => {
  assert.equal(isDynamicText('56 kg'), true);
  assert.equal(isDynamicText('Log in or Sign up'), false);
  assert.equal(isDynamicText('John Doe', { userNames: ['John Doe'] }), true);
});

test('the format of a live text keeps its words and lets its numbers change', () => {
  const re = new RegExp(`^(?:${shapeOf('123, Main Street - 122001')})$`);
  assert.ok(re.test('45, Main Street - 560001'));
  assert.ok(!re.test('45, Park Avenue - 560001'));
});

test('a spec built from a screen passes on that same screen (Login, Otp, Addresses, Home)', (tt) => {
  for (const name of ['Login', 'Otp', 'Addresses', 'Home']) {
    const t = screen(name);
    const spec = specFrom(t, name);
    assert.deepEqual(spec.baseline, { w: 720, h: 1280 });
    assert.equal(spec.reviewed, false, 'a generated spec starts as not reviewed');
    const r = evaluate(spec, t);
    assert.deepEqual(failed(r).map((x) => x.message), [], `${name}: no failed checks`);
    assert.ok(r.summary.passed > 20, `${name}: checks were really made`);
    tt.diagnostic(`${name}: ${Object.keys(spec.elements).length} elements, ${spec.rules.length} rules · ${r.summary.passed} checks passed, ${r.summary.skipped} skipped, ${r.summary.warnings} warnings`);
  }
});

test('account names go into a spec as {{TOKENS}}, not as the name itself', () => {
  const t = screen('Home');
  const spec = buildSpec(t, t.screen, { spec: 'Home', page: 'HomePage', source: 'unit-test', userNames: ['John Doe'], nameTokens: [['TEST_USER_NAME', 'John Doe']] });
  const json = JSON.stringify(spec);
  assert.ok(json.includes('{{TEST_USER_NAME}}'));
  assert.ok(!/"text":"John Doe"/.test(json), 'the name is not stored as fixed text');
});

// ---------------------------------------------------------------- comparing a screen with a spec
test('an element that moved is reported with how far it moved', (tt) => {
  const t = screen('Login');
  const spec = specFrom(t);
  const name = specNameFor(spec, 'Log in or Sign up');
  assert.ok(name, 'the title is in the spec');
  const el = byText(t, 'Log in or Sign up');
  el.bounds = { ...el.bounds, y1: el.bounds.y1 + 200, y2: el.bounds.y2 + 200 }; // 200 px = 15.6% of the screen lower
  const msgs = failed(evaluate(spec, t)).filter((x) => x.target === name).map((x) => x.message).join(' ');
  tt.diagnostic(`Layout checker said: ${msgs}`);
  assert.match(msgs, /moved\/resized: y \d+\.\d% \(expected \d+\.\d% ±/);
});

test('an element that is gone is reported as not found', () => {
  const t = screen('Login');
  const spec = specFrom(t);
  for (const e of t.all) if (e.desc === 'Send OTP' || e.text === 'Send OTP') e.displayed = false;
  assert.ok(failed(evaluate(spec, t)).some((x) => x.type === 'presence' && /not found/.test(x.message)));
});

test('changed text is a failure, but a line break added to the same text is not', () => {
  const t = screen('Login');
  const spec = specFrom(t);
  const consent = t.all.find((e) => e.text.startsWith('By submitting'));
  const original = consent.text;
  consent.text = original.replace(' to contact you', '\nto contact you');
  assert.deepEqual(failed(evaluate(spec, t)), [], 'a line break is not a change');
  consent.text = 'Some other wording';
  assert.ok(failed(evaluate(spec, t)).length > 0, 'different words are a change');
});

test('on a screen of another shape, positions are skipped (relations are still checked)', () => {
  const t = screen('Login');
  const spec = { ...specFrom(t), baseline: { w: 1440, h: 3216 } }; // spec recorded on the OnePlus 11
  const r = evaluate(spec, t);
  assert.equal(r.aspectMatches, false);
  const boxes = r.results.filter((x) => x.type === 'box');
  assert.ok(boxes.length > 0 && boxes.every((x) => x.status === 'skipped'));
});

test('tap targets under 48dp are warnings, never failures', () => {
  const t = screen('Login');
  const spec = specFrom(t);
  const r = evaluate(spec, t, { dpi: 320 }); // the emulator's density
  const small = r.results.filter((x) => x.type === 'minTap' && x.status === 'warning');
  assert.ok(small.length > 0, 'the small country-code button is found');
  assert.match(small[0].message, /tap target is \d+dp \(Android guideline: 48dp\)/);
  assert.deepEqual(failed(r), []);
  // without the density, the check is skipped instead of guessed
  assert.ok(evaluate(spec, t).results.filter((x) => x.type === 'minTap').every((x) => x.status === 'skipped'));
});

test('regression (13 Nov): the address with a line break passes against the real Addresses spec', (tt) => {
  const spec = JSON.parse(fixture('specs/Addresses.json'));
  const r = evaluate(spec, screen('Addresses'));
  tt.diagnostic(`Screen text: ${JSON.stringify(screen('Addresses').all.find((e) => e.text.includes('Main Street\nJacobpura')).text)}`);
  tt.diagnostic(`Real spec: ${r.summary.total} checks · ${r.summary.passed} passed · ${r.summary.failed} failed`);
  const address = Object.entries(spec.elements).filter(([, e]) => /Main/.test(e.match?.textPattern || '')).map(([n]) => n);
  assert.ok(address.length > 0, 'the spec checks the address format');
  for (const n of address) assert.ok(r.results.some((x) => x.target === n && x.type === 'presence' && x.status === 'passed'), `${n} is found`);
  assert.deepEqual(failed(r).map((x) => x.message), []);
});

test('the order of elements from top to bottom is checked', () => {
  const t = screen('Login');
  const spec = specFrom(t);
  const order = spec.rules.find((r) => r.type === 'order');
  assert.ok(order && order.els.length >= 2, 'the spec has an order rule');
  // move the last element of the order to the very top of the screen
  const lastName = order.els[order.els.length - 1];
  const r0 = evaluate(spec, t);
  const el = t.all.find((e) => r0.elements.some((x) => x.name === lastName) && e.bounds && findAll(t, spec.elements[lastName].selector || spec.elements[lastName].match).includes(e));
  const h = el.bounds.y2 - el.bounds.y1;
  el.bounds = { ...el.bounds, y1: 0, y2: h };
  assert.ok(failed(evaluate(spec, t)).some((x) => x.type === 'order' && /Order changed: .+ is now above /.test(x.message)));
});

test('month calendar: every day of the month once, under its weekday (Monthly Progress, November 2026)', () => {
  const t = screen('MonthlyProgress');
  const spec = specFrom(t, 'MonthlyProgress');
  assert.ok(spec.rules.some((r) => r.type === 'calendarGrid'), 'the calendar is recognised');
  const r = evaluate(spec, t);
  assert.ok(r.results.some((x) => x.type === 'calendarDays' && x.status === 'passed'));
  assert.ok(r.results.some((x) => x.type === 'calendarColumns' && x.status === 'passed'));
  // a day missing from the grid is named
  const day15 = t.all.find((e) => (e.desc.trim() === '15' || e.text.trim() === '15') && e.clickable);
  assert.ok(day15, 'day 15 is on the screen');
  day15.displayed = false;
  assert.ok(failed(evaluate(spec, t)).some((x) => x.type === 'calendarDays' && /missing 15/.test(x.message)));
});
