// Demo unit tests for the dashboard's own tests and demo (not part of npm run test:unit: the file name has no .test).
// Run by test/dashboard/fixtures.mjs with the real reporter, once passing and once with DEMO_FAIL=1.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { cleanPhone, maskOtp, layoutBox } from './demo-lib.mjs';

describe('Login', () => {
  test('phone number: +91 and spaces are removed', (t) => {
    t.diagnostic('"+91 98765 43210" was typed as "9876543210"');
    assert.equal(cleanPhone('+91 98765 43210'), '9876543210');
  });
  test('OTP codes are masked in the report', (t) => {
    t.diagnostic(`API call: POST staging.api.example/v1/otp/verify · status 200`);
    t.diagnostic(`Response body: {"token":"(hidden)","user":{"id":"u1"}}`);
    assert.equal(maskOtp('482913'), '••••••');
  });
});
describe('Layout', () => {
  test('position is a share of the screen height', () => {
    console.log('checking the Home screen box');
    assert.deepEqual(layoutBox({ y: 640 }, process.env.DEMO_FAIL ? null : { h: 1280 }), { y: 50 });
  });
  test.skip('calendar on a 1440x3216 screen', () => {});
});
