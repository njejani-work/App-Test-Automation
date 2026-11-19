// The URL hash <-> page state: the same parameter names as the old page, so every link people shared still opens.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readState, hashOf, nextState } from '../src/route/state.js';

test('an old link opens the same view with the same filters, and writes back the same way', () => {
  const old = '#/api?run=20261118-160308&suite=smoke&open=n54ffr&dt=log&af=problems&mine=1';
  const S = readState(old);
  assert.equal(S.tab, 'api');
  assert.equal(S.run, '20261118-160308');
  assert.equal(S.af, 'problems');
  assert.equal(S.mine, true);
  assert.equal(hashOf(S), '#/api?suite=smoke&run=20261118-160308&open=n54ffr&dt=log&af=problems&mine=1');
  assert.deepEqual(readState(hashOf(S)), S);
});

test('defaults stay out of the address; an empty or unknown view opens the overview', () => {
  assert.equal(hashOf(readState('')), '#/overview');
  assert.equal(readState('#/nope?f=all').tab, 'overview');
  assert.equal(readState('#/triage').f, 'failures');
  assert.equal(hashOf(readState('#/triage?f=failures')), '#/triage');
});

test('another view starts on its first section; another test on its default tab', () => {
  const S = readState('#/api?sec=calls&open=a&dt=log');
  assert.equal(nextState(S, { tab: 'triage' }).sec, '');
  assert.equal(nextState(S, { open: 'b' }).dt, '');
  assert.equal(nextState(S, { q: 'x' }).sec, 'calls', 'other changes keep the section');
});
