// Reads .env, only for two things: the device id (not a secret) and the values that must be masked.
// No .env value is ever returned to the assistant.
import fs from 'node:fs';

const read = (file) => { try { return fs.readFileSync(file, 'utf8'); } catch { return ''; } };
const unquote = (v) => v.replace(/^["']|["']$/g, '');

/** The emulator / phone the tests use: DEVICE_UDID, or the app's own key (Instagram: UDID). Not a secret. An empty value
 * (= the only connected device) gives null: the match stays on its own line. */
export const deviceFrom = (envFile, key = 'DEVICE_UDID') => (read(envFile).match(new RegExp(`^[ \\t]*${key}[ \\t]*=[ \\t]*["']?([^"'\\s#]+)`, 'm')) || [])[1] || null;

/** Values that must never reach the assistant: test phone numbers, OTPs, tokens, passwords, account names... */
export const secretsFrom = (envFile) => read(envFile).split(/\r?\n/)
  .map((l) => l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)).filter(Boolean)
  .filter(([, key, v]) => /OTP|PHONE|TOKEN|SECRET|PASSWORD|KEY|PIN|USER|EMAIL|ACCOUNT/i.test(key) && unquote(v).length >= 4)
  .map(([, , v]) => unquote(v));

/** Replaces every secret in a text with dots. */
export const masker = (secrets) => (text) => secrets.reduce((t, s) => t.split(s).join('•'.repeat(Math.min(s.length, 6))), String(text));
