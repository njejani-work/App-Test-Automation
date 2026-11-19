// One-line meanings for every kind of code the reports show: HTTP status codes, MediaWiki API error codes,
// process exit codes and signals, adb install errors, Android log levels and test severities.
// Used by the recorder (API issues), the dashboard builder (terminal summary, api-log.txt) and the page
// (it gets this list inside data/index.js as DASH_INDEX.codes, and explains every code it shows).

export const CODE_BOOK = {
  http: {
    100: ['Continue', 'The server got the request headers; the client may send the body.'],
    101: ['Switching Protocols', 'The server agreed to change protocol (e.g. to WebSocket).'],
    200: ['OK', 'The request worked and the answer is in the body.'],
    201: ['Created', 'The request worked and created something new.'],
    202: ['Accepted', 'The server accepted the request but has not finished it yet.'],
    204: ['No Content', 'The request worked; there is deliberately no body.'],
    206: ['Partial Content', 'The server sent only the requested part of the file (e.g. part of an image or video).'],
    301: ['Moved Permanently', 'The address has moved for good; the client follows the new one.'],
    302: ['Found', 'Temporary redirect to another address.'],
    303: ['See Other', 'Redirect: fetch the result from another address.'],
    304: ['Not Modified', 'The copy the app already has is still current, so nothing was sent again (cache hit).'],
    307: ['Temporary Redirect', 'Temporary redirect; repeat the same request at the new address.'],
    308: ['Permanent Redirect', 'Permanent redirect; repeat the same request at the new address.'],
    400: ['Bad Request', 'The server could not understand the request (wrong or missing parameters).'],
    401: ['Unauthorized', 'Login is needed, or the login sent is not valid.'],
    403: ['Forbidden', 'The server understood the request but refuses it: no permission, or this client or IP address is blocked.'],
    404: ['Not Found', 'Nothing exists at this address (e.g. a page or image that does not exist).'],
    405: ['Method Not Allowed', 'This address does not accept this kind of request (e.g. POST where only GET works).'],
    406: ['Not Acceptable', 'The server cannot answer in any format the app asked for.'],
    408: ['Request Timeout', 'The server gave up waiting for the request to arrive.'],
    409: ['Conflict', 'The request clashes with the current state (e.g. an edit conflict).'],
    410: ['Gone', 'It existed but was removed for good.'],
    411: ['Length Required', 'The server needs to know the size of the body first.'],
    412: ['Precondition Failed', 'A condition the app set (e.g. "only if unchanged") was not met.'],
    413: ['Content Too Large', 'The request body is bigger than the server accepts.'],
    414: ['URI Too Long', 'The address is too long for the server.'],
    415: ['Unsupported Media Type', 'The server does not accept the format of the body sent.'],
    416: ['Range Not Satisfiable', 'The part of the file asked for does not exist.'],
    418: ["I'm a teapot", 'A joke code; some servers use it to refuse automated requests.'],
    421: ['Misdirected Request', 'The request went to a server that cannot answer for this address.'],
    422: ['Unprocessable Content', 'The request was understood but its content is invalid.'],
    425: ['Too Early', 'The server will not risk handling a request that might be replayed.'],
    426: ['Upgrade Required', 'The client must switch to a newer protocol.'],
    428: ['Precondition Required', 'The server wants a condition (e.g. "only if unchanged") on this request.'],
    429: ['Too Many Requests', 'Rate limited: too many requests in a short time; wait and try again.'],
    431: ['Request Header Fields Too Large', 'The request headers (e.g. cookies) are too big.'],
    451: ['Unavailable For Legal Reasons', 'Blocked for legal reasons (e.g. a court order in this country).'],
    499: ['Client Closed Request', 'The client gave up before the server answered (nginx-style code).'],
    500: ['Internal Server Error', 'The server failed while handling the request: a bug or outage on the server, not the app.'],
    501: ['Not Implemented', 'The server does not support what was asked.'],
    502: ['Bad Gateway', 'A server in the middle got a bad answer from the server behind it.'],
    503: ['Service Unavailable', 'The server is overloaded or down for maintenance; usually temporary.'],
    504: ['Gateway Timeout', 'A server in the middle waited too long for the server behind it.'],
    505: ['HTTP Version Not Supported', 'The server does not support this HTTP version.'],
    507: ['Insufficient Storage', 'The server has no room to store the result.'],
    508: ['Loop Detected', 'The server found an endless loop while handling the request.'],
    511: ['Network Authentication Required', 'The network (e.g. a Wi-Fi login page) wants you to sign in first.'],
  },
  // MediaWiki Action API (…/w/api.php) error codes: they arrive inside a normal 200 response
  api: {
    badtoken: 'The security token sent with the request is missing, wrong or expired.',
    notoken: 'The request needs a security token and none was sent.',
    ratelimited: 'Too many actions in a short time for this user or IP address; wait and try again.',
    maxlag: 'The database servers are behind; the server asks the client to retry later.',
    readonly: 'The wiki is temporarily read-only (maintenance).',
    missingtitle: 'The page asked for does not exist.',
    invalidtitle: 'The page title is not valid (forbidden characters, empty, too long).',
    nosuchrevid: 'The page revision asked for does not exist.',
    nosuchpageid: 'The page ID asked for does not exist.',
    permissiondenied: 'This user is not allowed to do that.',
    mustbeloggedin: 'This action needs a logged-in user.',
    notloggedin: 'This action needs a logged-in user.',
    'assertuserfailed': 'The request expected a logged-in user, but the session is logged out.',
    'assertbotfailed': 'The request expected a bot account.',
    blocked: 'This user or IP address is blocked from editing.',
    autoblocked: 'This IP address is blocked automatically because a blocked user used it.',
    editconflict: 'Someone else changed the page in the meantime.',
    'abusefilter-disallowed': "The wiki's abuse filter refused the action.",
    'abusefilter-warning': "The wiki's abuse filter warns about the action.",
    'unknown_action': 'The API does not know the action asked for.',
    badvalue: 'One of the parameters has a value the API does not accept.',
    missingparam: 'A required parameter is missing.',
    toomanyvalues: 'Too many values in one parameter.',
    'paramempty': 'A parameter was sent without a value.',
    'cirrussearch-backend-error': 'The search servers failed; usually temporary.',
    'internal_api_error_DBQueryError': 'A database error on the server; not the app.',
    'internal_api_error_DBConnectionError': 'The server could not reach its database; not the app.',
  },
  // Process exit codes (WebdriverIO, npm, adb, shell commands)
  exit: {
    0: 'Finished without errors (all tests passed).',
    1: 'Finished with errors: at least one test failed, or the run could not start.',
    2: 'Wrong command or options (misuse of the command).',
    126: 'The command was found but could not be run (no permission).',
    127: 'The command was not found (not installed, or not on PATH).',
    130: 'Stopped with Ctrl+C.',
    137: 'Killed (signal 9): stopped by force, often for running out of memory.',
    143: 'Stopped politely (signal 15, SIGTERM), e.g. by a CI timeout.',
  },
  // Linux signals in the Android log ("Sending signal. PID: 1234 SIG: 9")
  signal: {
    3: 'SIGQUIT: ask the process to dump its threads (used for ANR reports).',
    6: 'SIGABRT: the process aborted itself after a fatal error (native crash).',
    9: 'SIGKILL: Android killed the process immediately (crash clean-up, force stop, or low memory).',
    11: 'SIGSEGV: the process read memory it may not touch (native crash).',
    15: 'SIGTERM: the process was asked to stop.',
  },
  // adb / Package Manager install errors
  install: {
    INSTALL_FAILED_INSUFFICIENT_STORAGE: 'The emulator has no free space for the APK; wipe data or make the disk bigger.',
    INSTALL_FAILED_UPDATE_INCOMPATIBLE: 'An app with the same name but a different signing key is installed; uninstall it first.',
    INSTALL_FAILED_VERSION_DOWNGRADE: 'A newer version is already installed; uninstall it first.',
    INSTALL_FAILED_NO_MATCHING_ABIS: 'The APK has no native code for this CPU (e.g. an ARM-only APK on an x86_64 emulator).',
    INSTALL_FAILED_OLDER_SDK: 'The APK needs a newer Android version than the emulator has.',
    INSTALL_FAILED_ALREADY_EXISTS: 'The app is already installed and the install did not allow replacing it.',
    INSTALL_FAILED_TEST_ONLY: 'The APK is marked test-only; it must be installed with -t.',
    INSTALL_FAILED_USER_RESTRICTED: 'The device refused the install (installs over USB are turned off).',
    INSTALL_FAILED_DEXOPT: 'Android could not prepare the app code after installing.',
    INSTALL_FAILED_INVALID_APK: 'The APK file is damaged or not a valid app.',
    INSTALL_PARSE_FAILED_NO_CERTIFICATES: 'The APK is not signed.',
    INSTALL_FAILED_ABORTED: 'The install was cancelled (often a prompt on the device was not accepted).',
  },
  // Android log levels (the letter after the process and thread numbers)
  logLevel: {
    V: 'Verbose: the most detailed developer messages.',
    D: 'Debug: developer messages.',
    I: 'Info: normal events.',
    W: 'Warning: something unexpected that the app could handle.',
    E: 'Error: something failed (the app may still carry on).',
    F: 'Fatal: a failure that ends the process.',
  },
  // Test severity (test/triage.json, or [P0] in a test title)
  severity: {
    P0: 'Blocker: core flow (launch, onboarding, search, reading); a failure blocks the release.',
    P1: 'High: important feature; fix before release.',
    P2: 'Medium: secondary feature; fix soon.',
    P3: 'Low: minor or cosmetic.',
  },
};

/** "403 Forbidden: The server understood the request but refuses it…" or null. */
export function httpMeaning(status) {
  const e = CODE_BOOK.http[status];
  if (e) return `${status} ${e[0]}: ${e[1]}`;
  const n = Number(status);
  if (!Number.isFinite(n)) return null;
  const group = n >= 500 ? 'Server error: the server failed, not the app.'
    : n >= 400 ? 'Client error: the server refused or could not use the request.'
    : n >= 300 ? 'Redirect: the answer is at another address.'
    : n >= 200 ? 'Success.'
    : n >= 100 ? 'Information: the request is still going.' : null;
  return group && `${status}: ${group} (not a standard code; meaning from its first digit)`;
}

/**
 * Every code mentioned in a piece of text, each with its one-line meaning (no duplicates).
 * Finds: "HTTP 403", "Code: 403", "status 403", "Response 403", "403 Forbidden"; MediaWiki API codes in
 * "API error "badtoken""; "exit code 1"; "SIG: 9"; "INSTALL_FAILED_…"; "[P0]" / "P0".
 */
export function codesIn(text) {
  const s = String(text || '');
  const out = new Map();
  const add = (key, line) => { if (line && !out.has(key)) out.set(key, line); };
  for (const m of s.matchAll(/\b(?:HTTP|Code:|[Ss]tatus(?: code)?|Response|answered)\s*([1-5]\d\d)\b|\b([1-5]\d\d) (?=[A-Z][a-z])/g)) {
    const code = m[1] || m[2];
    if (m[2] && !CODE_BOOK.http[code]) continue; // "200 Thing" only counts for codes we know
    add('http' + code, httpMeaning(code));
  }
  for (const m of s.matchAll(/API error "([\w-]+)"/g)) {
    const code = m[1];
    const meaning = CODE_BOOK.api[code] || (/^internal_api_error/.test(code) ? 'An error inside the server; not the app.' : null);
    add('api' + code, meaning ? `API error "${code}": ${meaning}` : `API error "${code}": a MediaWiki API error code (see https://www.mediawiki.org/wiki/API:Errors_and_warnings).`);
  }
  for (const m of s.matchAll(/exit(?:ed with)? code (\d+)/gi)) add('exit' + m[1], CODE_BOOK.exit[m[1]] && `Exit code ${m[1]}: ${CODE_BOOK.exit[m[1]]}`);
  for (const m of s.matchAll(/\bSIG: (\d+)/g)) add('sig' + m[1], CODE_BOOK.signal[m[1]] && `Signal ${m[1]}: ${CODE_BOOK.signal[m[1]]}`);
  for (const m of s.matchAll(/\b(INSTALL_(?:FAILED|PARSE_FAILED)_[A-Z_]+)/g)) add(m[1], `${m[1]}: ${CODE_BOOK.install[m[1]] || 'Android refused to install the APK (see the Android documentation for this code).'}`);
  for (const m of s.matchAll(/\bP([0-3])\b/g)) add('P' + m[1], `P${m[1]}: ${CODE_BOOK.severity['P' + m[1]]}`);
  return [...out.values()];
}
