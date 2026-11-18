// Reads .env, only for two things: the device id (not a secret) and the values that must be masked.
// No .env value is ever returned to the assistant.
import fs from 'node:fs';

const read = (file) => { try { return fs.readFileSync(file, 'utf8'); } catch { return ''; } };
const unquote = (v) => v.replace(/^["']|["']$/g, '');

/** DEVICE_UDID: the emulator / phone the tests use. */
export const deviceFrom = (envFile) => (read(envFile).match(/^\s*DEVICE_UDID\s*=\s*["']?([^"'\s#]+)/m) || [])[1] || null;

/** Values that must never reach the assistant: test phone numbers, OTPs, tokens, passwords... */
export const secretsFrom = (envFile) => read(envFile).split(/\r?\n/)
  .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)).filter(Boolean)
  .filter(([, key, v]) => /OTP|PHONE|TOKEN|SECRET|PASSWORD|KEY|PIN/i.test(key) && unquote(v).length >= 4)
  .map(([, , v]) => unquote(v));

/** Replaces every secret in a text with dots. */
export const masker = (secrets) => (text) => secrets.reduce((t, s) => t.split(s).join('•'.repeat(Math.min(s.length, 6))), String(text));
