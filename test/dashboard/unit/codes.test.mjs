// One-line meanings for the codes the reports show.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CODE_BOOK, httpMeaning, codesIn } from '../../support/dashboard/lib/codes.js';

test('HTTP status codes have a name and a one-line meaning; unknown ones get their class', () => {
  assert.equal(httpMeaning(403), '403 Forbidden: The server understood the request but refuses it: no permission, or this client or IP address is blocked.');
  assert.match(httpMeaning(304), /^304 Not Modified: .*cache/);
  assert.match(httpMeaning(599), /^599: Server error: the server failed, not the app\. \(not a standard code/);
  assert.equal(httpMeaning('abc'), null);
  for (const [code, [name, line]] of Object.entries(CODE_BOOK.http)) {
    assert.ok(name && line && !line.includes('\n'), `code ${code} has a name and a single line`);
  }
});

test('codes are found in free text: HTTP, API errors, exit codes, signals, install errors, severities', () => {
  const found = codesIn('HttpStatusException: Code: 403, URL: https://x · API error "ratelimited" · worker 0-0 ended with exit code 1 · Sending signal. PID: 17001 SIG: 9 · INSTALL_FAILED_NO_MATCHING_ABIS · [P0] · Response 304 received');
  assert.deepEqual(found.map((l) => l.split(':')[0]), ['403 Forbidden', '304 Not Modified', 'API error "ratelimited"', 'Exit code 1', 'Signal 9', 'INSTALL_FAILED_NO_MATCHING_ABIS', 'P0']);
  assert.deepEqual(codesIn('HTTP 403 and again Code: 403'), [httpMeaning(403)], 'each code once');
  assert.deepEqual(codesIn('Took 2500 ms, list "QA list 7f3k2a"'), [], 'numbers that are not codes are left alone');
});
