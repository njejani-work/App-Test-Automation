// API response format checks (test/support/dashboard/lib/formats.js), with rules written like test/api-formats.json.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ruleFor, checkBody, checkCall } from '../support/dashboard/lib/formats.js';

const RULE = { name: 'Reports list', match: '/v1/reports', status: 200, fields: { data: 'array', 'data[].id': 'string', 'data[].paid': 'boolean?', 'meta.total': 'number?' }, nonEmpty: ['data'] };
const good = { data: [{ id: 'r1', paid: true }, { id: 'r2' }] };
/** The API data of a check, for the dashboard: the call, the rule, the body and what was found. */
const report = (t, call, body, result) => {
  if (call) t.diagnostic(`API call: ${call.endpoint || call.url} · status ${call.status ?? 'no response'}`);
  t.diagnostic(`Rule: ${RULE.name} (match "${RULE.match}", status ${RULE.status}) · fields ${JSON.stringify(RULE.fields)}`);
  t.diagnostic(`Response body: ${typeof body === 'string' ? body || '(empty)' : JSON.stringify(body)}`);
  t.diagnostic(`Result: ${result == null ? 'not checked (no rule or no response)' : result.status ? `${result.status}${result.reason ? ' - ' + result.reason : ''}${result.problems?.length ? ' - ' + result.problems.map((p) => p.text).join(' ') : ''}` : result.problems.length ? result.problems.map((p) => p.text).join(' ') : `ok (${result.checked} values checked)`}`);
};

test('the rule is picked by part of the API name or URL', () => {
  assert.equal(ruleFor({ endpoint: 'GET staging.api/v1/reports' }, [RULE]), RULE);
  assert.equal(ruleFor({ url: 'https://x/v1/profile' }, [RULE]), null);
});

test('a body with every field and type passes; optional fields may be missing', (t) => {
  const r = checkBody(good, RULE);
  report(t, null, good, r);
  assert.deepEqual(r.problems, []);
  assert.ok(r.checked >= 4);
});

test('a wrong type is reported with its path, in plain words', (t) => {
  const r = checkBody({ data: [{ id: 12345 }] }, RULE);
  report(t, null, { data: [{ id: 12345 }] }, r);
  assert.equal(r.problems.length, 1);
  assert.equal(r.problems[0].path, 'data[].id', 'the rule it broke');
  assert.match(r.problems[0].text, /^data\[0\]\.id should be text but is a number\.$/, 'the exact item, in plain words');
});

test('an optional field that is there must still have its type; a required list must not be empty', () => {
  assert.match(checkBody({ data: [{ id: 'r1', paid: 'yes' }] }, RULE).problems[0].text, /data\[0\]\.paid should be true\/false but is text \("yes"\)/);
  assert.match(checkBody({ data: [] }, RULE).problems[0].text, /data is an empty list; the app needs at least one item/);
  assert.match(checkBody({}, RULE).problems[0].text, /data is missing \(expected a list\)/);
});

test('a call is only checked when it can be: right status, body recorded, valid JSON', (t) => {
  const call = { endpoint: 'GET x/v1/reports', status: 200 };
  for (const [c, b] of [[{ ...call, status: 500 }, '{}'], [call, ''], [call, '{"data": ['], [call, JSON.stringify(good)], [call, '{"data":[{"id":1}]}']]) report(t, c, b, checkCall(c, [RULE], b));
  assert.equal(checkCall({ endpoint: 'GET x/v1/other', status: 200 }, [RULE], '{}'), null, 'no rule');
  assert.equal(checkCall({ ...call, status: null }, [RULE], ''), null, 'no response');
  assert.equal(checkCall({ ...call, status: 500 }, [RULE], '{}').status, 'not-checked');
  assert.match(checkCall(call, [RULE], '').reason, /not recorded/);
  assert.match(checkCall(call, [RULE], '{"data": [').reason, /not valid JSON/);
  assert.match(checkCall({ ...call, bodyCut: 2 }, [RULE], '{"data": [').reason, /4,059-byte line limit/);
  assert.equal(checkCall(call, [RULE], JSON.stringify(good)).status, 'ok');
  assert.equal(checkCall(call, [RULE], '{"data":[{"id":1}]}').status, 'problems');
});
