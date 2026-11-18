# Unit tests

Tests of this project's own code, without a device. Run them with `npm run test:unit` (about 5 seconds).
They use Node's built-in test runner (`node:test`) and assertions (`node:assert/strict`): nothing to install.

## Writing a test

One file per area, named `<area>.test.mjs`. Each `test()` checks **one behaviour** and is named after it, in words a
reader understands when it fails:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flat } from '../support/layout/hierarchy.js';

test('line breaks and repeated spaces count as one space', () => {
  // Arrange: the input   Act: run the code   Assert: check the result
  assert.equal(flat('Main Street\nJacobpura'), 'Main Street Jacobpura');
});
```

- **Pure code** (layout checker, selectors, parsers): give an input, check the output.
- **Real screens**: `parseSource(fs.readFileSync('fixtures/screens/Login.xml'))` gives the same data the layout check
  reads on the device. To add a screen, copy it from `reports/runs/<run>/layout/<Screen>.xml` into `fixtures/screens/`.
- **Page objects**: use the pretend phone.

## Messages for the dashboard

`t.diagnostic('...')` attaches a message to the test. It appears under the test in the dashboard's **Unit tests** tab:
use it for the data the test checked (an API call and its body, what the layout checker said, a value that was typed).
Page-object tests get the pretend phone's summary automatically (what was on screen, what the page object did).

```js
test('the reports list has the fields the app needs', (t) => {
  t.diagnostic(`Response body: ${body}`);
  ...
});
```

To see how each kind of failure is reported: `npm run test:unit:error-demo` (every test there fails on purpose).

## The pretend phone (`helpers/fake-device.mjs`)

```js
import { fakeDevice } from './helpers/fake-device.mjs';
import LoginPage from '../pageobjects/LoginPage.js';

test('the phone picker is closed with Back', async (t) => {
  const dev = fakeDevice({ showing: ['Log in or Sign up', 'Send OTP'] }); // what is on screen
  t.after(() => dev.restore());                                           // always put the real globals back
  dev.after(1500, () => dev.show('Choose a phone number'));               // something appears 1.5 s later
  dev.onBack = () => dev.hide('Choose a phone number');                   // what Back does here
  await LoginPage.open();
  assert.equal(dev.count('back'), 1);                                     // what the page object did
});
```

| | |
|---|---|
| `showing`, `dev.show(...)`, `dev.hide(...)` | A selector counts as displayed when its string contains one of the shown texts (`'Send OTP'` matches `S.desc('Send OTP')`) |
| `keyboard: true`, `dev.keyboard` | Whether the on-screen keyboard is up |
| `dev.after(ms, fn)` | Something that happens later (the clock is pretend: waits move it, nothing sleeps) |
| `dev.onBack`, `dev.onClick['text']` | What the Back button / a tap on that element does |
| `dev.appState` | 4 = app in front; set 1 to pretend Back left the app |
| `dev.calls`, `dev.count('back')`, `dev.clicked('Skip')` | What the page object did: taps, Back, hideKeyboard, activateApp, typed values |

## Rules

- No device, network or real reports folder (the recorder test writes to a temporary folder).
- Never print or compare the real values in `.env`.
- Every bug fix comes with a test that **fails without the fix**: put the old code back for a moment and check.
- Keep `npm run test:unit:coverage` above 75% line coverage (it fails below that).
