// Test accounts (test/data/users.js): bad settings in .env fail early with a clear message.
// The real values from .env are never printed or compared here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { users, getUser, fullPhone } from '../data/users.js';

const withUser = (u, fn) => { users.__unit = u; try { return fn(); } finally { delete users.__unit; } };

test('an unknown account name lists the known ones', () => {
  assert.throws(() => getUser('nobody'), /Unknown test user "nobody"\. Known: default, secondary, wrongOtp/);
});

test('a missing phone or OTP says which, and where to set it', () => {
  withUser({ countryCode: '+91' }, () => assert.throws(() => getUser('__unit'), /missing phone and otp\. Set them in \.env/));
  withUser({ countryCode: '+91', phone: '9876543210' }, () => assert.throws(() => getUser('__unit'), /missing otp/));
});

test('the phone must be 10 digits without the country code, the OTP 6 digits', () => {
  withUser({ phone: '+919876543210', otp: '123456' }, () => assert.throws(() => getUser('__unit'), /phone must be 10 digits/));
  withUser({ phone: '9876543210', otp: '1234' }, () => assert.throws(() => getUser('__unit'), /OTP must be 6 digits/));
});

test('a valid account comes back with phone and OTP as text', () => {
  const u = withUser({ name: 'Unit', countryCode: '+91', phone: 9876543210, otp: 123456 }, () => getUser('__unit'));
  assert.equal(u.phone, '9876543210');
  assert.equal(u.otp, '123456');
  assert.equal(fullPhone(u), '+919876543210');
});
