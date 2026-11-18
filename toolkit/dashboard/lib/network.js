// Turns the app's own HTTP log (OkHttp, in the Android log) into a list of API calls, each with its whole
// life: when it was started, when the request was sent, when the response headers and body arrived (or why
// none did), and the response itself.
//
// The dev build of the Wikipedia app logs every request through OkHttp's HttpLoggingInterceptor (tag "OkHttp").
// BASIC level (the dev default) gives two lines per call:
//     --> GET https://en.wikipedia.org/api/rest_v1/feed/featured/2026/11/12
//     <-- 200 https://en.wikipedia.org/api/rest_v1/feed/featured/2026/11/12 (335ms, 12345-byte body)
// BODY level (the app's OkHttp HttpLoggingInterceptor set to BODY) adds headers, "--> END GET", the body and
//     <-- END HTTP (335ms, 12345-byte body)
// A call with no response ends with "<-- HTTP FAILED: <exception>", or with nothing at all when the app process
// is stopped, crashes or the test ends first. Those cases are detected from other Android log lines
// (ActivityManager "Force stopping" / "has died", AndroidRuntime "FATAL EXCEPTION") or from the recorder,
// and every one of them gets a concrete reason.
// Calls run on several threads at once, so OkHttp lines are grouped by thread id (OkHttp logs one call per thread).

import { httpMeaning, CODE_BOOK } from './codes.js';
const OKHTTP = /^\s*(\S+)\s+(\S+)\s+(\d+)\s+(\d+)\s+([VDIWEF])\s+OkHttp\s*:\s?(.*)$/;
const ANY = /^\s*(\S+)\s+(\S+)\s+(\d+)\s+(\d+)\s+([VDIWEF])\s+(.*?)\s*:\s(.*)$/;
const RESPONSE = /^<-- (\d{3})(?: (.*?))? (https?:\/\/\S+) \((\d+)ms(?:, (.*?) body)?\)$/;
const HEADER = /^([A-Za-z0-9-]+): (.*)$/;
const SECRET_HEADERS = /^(cookie|set-cookie|authorization|x-csrf-token)$/i; // never stored (Set-Cookie carries a location guess)
const CHUNK = 4000; // Android splits long log messages into 4000-character pieces
// Android's log keeps at most 4,059 bytes of one message (4,068 minus the level, the tag "OkHttp" and two end marks).
// A 4,000-character piece with characters such as – or é (2-3 bytes each) is longer, and Android cuts its end off.
export const LOG_LINE_MAX_BYTES = 4059;
const CUT_AT_BYTES = LOG_LINE_MAX_BYTES - 3; // a cut can stop up to 3 bytes early (it never splits a character)

export const SLOW_API_MS = Number(process.env.DASHBOARD_SLOW_API_MS || 2000);
export const LARGE_API_BYTES = Number(process.env.DASHBOARD_LARGE_API_KB || 500) * 1024;

/** "11-12 10:00:01.250" -> milliseconds (only differences between two times are used). */
export function logTime(at) {
  const m = String(at || '').match(/(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})\.(\d{1,3})/);
  return m ? Date.UTC(2000, Number(m[1]) - 1, Number(m[2]), Number(m[3]), Number(m[4]), Number(m[5]), Number(m[6].padEnd(3, '0'))) : null;
}
const hostOf = (url) => { try { return new URL(url).hostname; } catch { return 'the server'; } };
const fmtBytes = (b) => (b == null ? 'unknown size' : b < 1024 ? `${b} bytes` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`);

/** Plain-language meaning of the exception OkHttp reports when a request gets no response. */
export function explainFailure(error, url) {
  const host = hostOf(url);
  const e = String(error || '');
  const name = (e.match(/([A-Za-z0-9_.]+(?:Exception|Error))/) || [])[1] || 'the error';
  const short = name.split('.').pop();
  if (/UnknownHost/i.test(e)) return `The phone could not look up ${host} (${short}): the emulator had no internet connection or its DNS was not working.`;
  if (/SocketTimeout|timeout/i.test(e)) return `${host} did not answer within the app's time limit (${short}): a slow or broken network, or the server did not respond.`;
  if (/ConnectException|Failed to connect|ECONNREFUSED|Connection refused/i.test(e)) return `The app could not open a connection to ${host} (${short}): the network was down or the server refused the connection.`;
  if (/SSL|Certificate|CertPath|handshake/i.test(e)) return `The secure (TLS) connection to ${host} failed (${short}): usually a proxy in between, or a wrong date/time on the emulator.`;
  if (/Canceled|Cancelled/i.test(e)) return `The app cancelled the request itself before the answer arrived (${short}): normally because the screen that asked for it was closed.`;
  if (/StreamReset|unexpected end of stream|EOFException/i.test(e)) return `The connection to ${host} was cut while the answer was arriving (${short}).`;
  if (/Connection reset|connection abort|SocketException/i.test(e)) return `The connection to ${host} was reset (${short}): the network changed or the app went to the background.`;
  if (/InterruptedIO|interrupted/i.test(e)) return `The request was interrupted inside the app (${short}).`;
  return `The app's HTTP client stopped the request with ${short}: ${e.replace(/^\S+:\s*/, '') || 'no message'}.`;
}

/** What the response contains, in one line: JSON keys and sizes, HTML title, text start, or the binary type. */
export function shapeOf(body, contentType = '', bytes = null, bodyNote = '', bodyCut = 0) {
  if (bodyNote && /binary/.test(bodyNote)) return `Binary ${contentType.split(';')[0] || 'data'}, ${fmtBytes(bytes)} (binary content is not stored)`;
  if (bodyNote && /encoded/.test(bodyNote)) return `Compressed body that the app's logger could not decode (${contentType.split(';')[0] || 'unknown type'})`;
  if (!body) return null;
  const t = body.trim();
  if (/^[{[]/.test(t)) {
    try {
      const j = JSON.parse(t);
      const desc = (v) => (Array.isArray(v) ? `list of ${v.length}` : v && typeof v === 'object' ? `object, ${Object.keys(v).length} field${Object.keys(v).length === 1 ? '' : 's'}` : typeof v === 'string' ? `text, ${v.length} chars` : String(v));
      if (Array.isArray(j)) return `JSON list of ${j.length} item${j.length === 1 ? '' : 's'}`;
      const keys = Object.keys(j);
      return `JSON with ${keys.length} field${keys.length === 1 ? '' : 's'}: ` + keys.slice(0, 12).map((k) => `${k} (${desc(j[k])})`).join(', ') + (keys.length > 12 ? `, … ${keys.length - 12} more` : '');
    } catch {
      return bodyCut
        ? `JSON that lost text in the Android log: ${bodyCut} of its 4,000-character pieces were longer than Android's ${LOG_LINE_MAX_BYTES.toLocaleString('en')}-byte line limit (characters such as – or é take 2-3 bytes) and were cut, so it is no longer valid JSON (${t.length} characters kept)`
        : `JSON-like text that is not valid JSON (${t.length} characters; possibly cut off in the log)`;
    }
  }
  const title = t.match(/<title>([^<]*)<\/title>/i);
  if (title) return `HTML page "${title[1].trim()}" (${t.length} characters)`;
  return `Text, ${t.length} characters: "${t.slice(0, 80).replace(/\s+/g, ' ')}${t.length > 80 ? '…' : ''}"`;
}

/** Keeps calls that started in one batch of log lines and finish in a later one (e.g. across tests). */
export class NetworkLog {
  /** @param {{ pkg?: string }} opts  the app's package name, to spot its process being stopped or crashing */
  constructor({ pkg = 'org.wikipedia.dev' } = {}) {
    this.pkg = pkg;
    this.open = new Map(); // thread id -> call in progress
    this.seq = 0;
    this.expected = null; // { reason, level } when the test (or its setup) is about to close the app on purpose
  }

  /** The test is about to stop the app on purpose: calls cut off by that get this reason instead of a guess. */
  expectStop(reason, level = 'info') {
    this.expected = { reason, level };
  }

  /** Feed raw logcat lines; returns the calls that were resolved (answered, failed or abandoned) in these lines. */
  parse(lines) {
    const done = [];
    for (const raw of lines) {
      const line = String(raw);
      const stamp = line.match(/^\s*(\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}\.\d+)/);
      if (stamp) this.lastAt = `${stamp[1]} ${stamp[2]}`; // newest Android log time seen so far
      const m = line.match(OKHTTP);
      if (!m) { this.#otherLine(line, done); continue; }
      const [, date, time, pid, tid, , msg] = m;
      const at = `${date} ${time}`;
      const call = this.open.get(tid);

      if (msg.startsWith('--> ') && !msg.startsWith('--> END')) {
        if (call) {
          const reason = call.pid !== pid
            ? `No response was logged before the app's process changed (pid ${call.pid} → ${pid}): the earlier process was stopped while this call was waiting.`
            : `No response or failure was logged; the same app thread started its next request at ${time}. OkHttp logs every network error, so this call most likely ended with an error inside the app that the HTTP logger does not report, or its log lines were dropped.`;
          done.push(this.#finish(call, tid, { at, kind: 'abandoned', level: 'warn', reason }));
        }
        const [method, url] = msg.slice(4).split(' ');
        this.open.set(tid, { seq: ++this.seq, at, pid, tid, method, url, phase: 'request', reqHeaders: {}, resHeaders: {}, pieces: [], events: [{ at, kind: 'start', text: `Request started: ${method} ${url}` }] });
        continue;
      }
      if (!call) continue;

      if (msg.startsWith('--> END')) {
        call.phase = 'sent';
        call.events.push({ at, kind: 'sent', text: `Request sent (${Object.keys(call.reqHeaders).length} header${Object.keys(call.reqHeaders).length === 1 ? '' : 's'}${/\d+-byte body/.test(msg) ? ', ' + msg.match(/\d+-byte body/)[0] : ', no body'})` });
        continue;
      }
      if (msg.startsWith('<-- HTTP FAILED:')) {
        call.error = msg.slice(16).trim();
        done.push(this.#finish(call, tid, { at, kind: 'failed', level: 'fail', reason: explainFailure(call.error, call.url) }));
        continue;
      }
      const r = msg.match(RESPONSE);
      if (r) {
        call.status = Number(r[1]);
        call.statusText = r[2] || '';
        call.finalUrl = r[3];
        call.ms = Number(r[4]);
        call.headersAt = at;
        call.statusMeaning = httpMeaning(call.status);
        call.events.push({ at, kind: 'headers', text: `Response ${call.status}${call.statusText ? ' ' + call.statusText : ''} received after ${call.ms} ms${r[3] !== call.url ? ` (redirected to ${r[3]})` : ''}` });
        if (r[5] != null) { // BASIC level: the size comes on the same line and nothing more follows
          call.sizeText = r[5];
          call.events.push({ at, kind: 'done', text: `Response complete: ${r[5].replace(/-byte/, ' bytes')} body (body content not logged at this log level)` });
          done.push(this.#finish(call, tid));
        } else call.phase = 'headers';
        continue;
      }
      if (msg.startsWith('<-- END HTTP')) {
        call.sizeText = (msg.match(/\((.*)\)/) || [])[1] || '';
        const total = logTime(at) != null && logTime(call.at) != null ? logTime(at) - logTime(call.at) : null;
        call.events.push({ at, kind: 'done', text: `Response complete: ${call.sizeText.replace(/^\d+ms, /, '').replace(/-byte/, ' bytes') || 'size not logged'}${total != null && total >= (call.ms || 0) ? ` (${total} ms after the request started)` : ''}` });
        done.push(this.#finish(call, tid));
        continue;
      }
      if (call.phase === 'request') {
        const h = msg.match(HEADER);
        if (h) call.reqHeaders[h[1].toLowerCase()] = SECRET_HEADERS.test(h[1]) ? '(hidden)' : h[2];
        continue;
      }
      if (call.phase === 'headers') {
        const h = msg.match(HEADER);
        if (h && !msg.startsWith('{') && !msg.startsWith('[')) { call.resHeaders[h[1].toLowerCase()] = SECRET_HEADERS.test(h[1]) ? '(hidden)' : h[2]; continue; }
        call.phase = 'body';
        if (msg === '') continue; // blank line between headers and body
      }
      if (call.phase === 'body') {
        call.pieces.push(msg);
        if (Buffer.byteLength(msg, 'utf8') >= CUT_AT_BYTES) call.bodyCut = (call.bodyCut || 0) + 1;
      }
    }
    return done;
  }

  /** Android lines that end calls with no response: the app's process stopped or crashed. */
  #otherLine(line, done) {
    if (!this.open.size || !line.includes(this.pkg) && !/AndroidRuntime/.test(line)) return;
    const m = line.match(ANY);
    if (!m) return;
    const [, date, time, linePid, , , tag, msg] = m;
    const at = `${date} ${time}`;
    const pkgRe = this.pkg.replace(/\./g, '\\.');
    let pid = null, reason = null, level = 'warn';
    let x;
    if ((x = msg.match(new RegExp(`^Force stopping ${pkgRe}\\b.*?(?:from pid (\\d+))?$`)))) {
      if (this.expected) { reason = `${this.expected.reason} (Android stopped the app at ${time}.)`; level = this.expected.level; this.expected = null; }
      else reason = `The app was force-stopped at ${time} (Android: "Force stopping ${this.pkg}") before a response arrived, and the test did not ask for it: something outside the test stopped the app.`;
    } else if ((x = msg.match(new RegExp(`Process ${pkgRe} \\(pid (\\d+)\\) has died`)))) {
      pid = x[1];
      reason = `The app's process (pid ${pid}) died at ${time} before a response arrived (Android: "${msg.slice(0, 120)}").`;
    } else if ((x = msg.match(new RegExp(`Killing (\\d+):${pkgRe}\\b(.*)`)))) {
      pid = x[1];
      reason = `Android killed the app's process (pid ${pid}) at ${time} before a response arrived (${x[2].replace(/^\/\S+\s*/, '').trim() || 'no reason given'}).`;
    } else if (tag === 'AndroidRuntime' && /FATAL EXCEPTION/.test(msg)) {
      pid = linePid;
      reason = `The app crashed at ${time} (AndroidRuntime FATAL EXCEPTION in pid ${pid}) before a response arrived.`;
      level = 'fail';
    }
    if (!reason) return;
    for (const [tid, call] of [...this.open]) {
      if (pid && call.pid !== pid) continue;
      done.push(this.#finish(call, tid, { at, kind: 'abandoned', level, reason }));
    }
  }

  /**
   * End every open call with a known reason (the recorder calls this when the test or its setup closes the app,
   * and at the end of the session). `level`: 'info' when expected (the test closed the app on purpose).
   */
  abandonOpen(reason, { level = 'info', at = null } = {}) {
    const out = [];
    for (const [tid, call] of [...this.open]) out.push(this.#finish(call, tid, { at: at || (logTime(this.lastAt) >= logTime(call.at) ? this.lastAt : call.at), kind: 'abandoned', level, reason }));
    return out;
  }

  /** Kept for older callers: same as abandonOpen with an unknown reason. */
  flushOpen() {
    return this.abandonOpen('No response was logged before the test ended, and nothing in the Android log says why (the call may still have been running).', { level: 'warn' });
  }

  #finish(call, tid, end = null) {
    this.open.delete(tid);
    let body = '';
    let prevLen = -1;
    for (const p of call.pieces) { body += prevLen === -1 || prevLen >= CHUNK ? p : '\n' + p; prevLen = p.length; }
    const size = sizeOf(call.sizeText);
    if (end) call.events.push({ at: end.at, kind: end.kind, text: (end.kind === 'failed' ? `No response: ${call.error}. ` : 'No response. ') + end.reason });
    const out = {
      seq: call.seq,
      at: call.at,
      endAt: (end && end.at) || call.events[call.events.length - 1].at,
      pid: call.pid,
      thread: call.tid,
      method: call.method,
      url: call.url,
      finalUrl: call.finalUrl && call.finalUrl !== call.url ? call.finalUrl : undefined,
      endpoint: endpointOf(call.method, call.url),
      status: call.status ?? null,
      statusText: call.statusText || '',
      ms: call.ms ?? null,
      totalMs: (() => { const a = logTime(call.at), b = logTime(call.events[call.events.length - 1].at); return a != null && b != null ? b - a : null; })(),
      bytes: size.bytes,
      bodyNote: size.note,
      contentType: call.resHeaders['content-type'] || '',
      reqHeaders: call.reqHeaders,
      resHeaders: call.resHeaders,
      body: body || null,
      bodyCut: call.bodyCut || undefined,
      error: call.error || null,
      events: call.events,
    };
    if (end && end.kind === 'abandoned') { out.unfinished = true; out.noResponse = { reason: end.reason, level: end.level }; }
    if (end && end.kind === 'failed') out.noResponse = { reason: end.reason, level: 'fail' };
    out.shape = shapeOf(out.body, out.contentType, out.bytes, out.bodyNote, out.bodyCut);
    out.issues = issuesOf(out);
    out.resolution = resolutionOf(out);
    return out;
  }
}

function sizeOf(text = '') {
  const m = String(text).match(/(\d+)-byte/);
  return { bytes: m ? Number(m[1]) : null, note: /omitted/.test(text) ? text : '' };
}

/** One line saying how the call ended. */
export function resolutionOf(c) {
  if (c.noResponse) return `No response. ${c.noResponse.reason}`;
  if (c.status == null) return 'No response and no reason in the log.';
  const kind = (c.contentType || '').split(';')[0] || (c.bodyNote ? 'binary' : 'content type not logged');
  return `${c.status}${c.statusText ? ' ' + c.statusText : ''} · ${c.bytes == null ? 'size not logged' : fmtBytes(c.bytes)} · ${kind} · headers after ${c.ms} ms${c.totalMs != null && c.totalMs > c.ms ? `, complete after ${c.totalMs} ms` : ''}`;
}

/** A stable name for "the same API" across calls: dates, ids and article titles replaced. */
export function endpointOf(method, url) {
  try {
    const u = new URL(url);
    if (/(^|\.)(upload|thumb)\.wikimedia\.org$/.test(u.hostname)) return `${method} ${u.hostname} (image)`;
    let p = u.pathname
      .replace(/\/\d{4}\/\d{2}\/\d{2}(?=\/|$)/, '/{yyyy}/{mm}/{dd}')
      .replace(/\/(onthisday\/[a-z]+)\/\d{1,2}\/\d{1,2}/, '/$1/{mm}/{dd}')
      .replace(/(\/page\/(?:summary|html|mobile-html|media-list|related|talk)\/)[^/]+/, '$1{title}')
      .replace(/\/\d+(?=\/|$)/g, '/{n}');
    if (p.endsWith('/api.php')) {
      const q = u.searchParams;
      const what = ['list', 'generator', 'meta', 'prop'].map((k) => (q.get(k) ? `${k}=${q.get(k).split('|')[0]}` : '')).filter(Boolean)[0];
      p += `?action=${q.get('action') || '?'}${what ? '&' + what : ''}`;
    }
    return `${method} ${u.hostname}${p}`;
  } catch {
    return `${method} ${url}`;
  }
}

const stripHtml = (s) => String(s).replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Why a call is a problem: fail (no usable answer), warn (worked but worth a look, or ended without a known
 * reason), info (no response, but for an expected reason such as the test closing the app).
 */
// "403 Forbidden: …" -> "403 Forbidden means: The server understood…" (one line, for issue texts)
const meaningOnly = (status) => { const m = httpMeaning(status); return m ? m.replace(/^(\d+(?: [^:]+)?): /, '$1 means: ') : ''; };
const apiMeaning = (code) => (CODE_BOOK.api[code] ? ` ("${code}" means: ${CODE_BOOK.api[code]})` : '');

/** Problems of one call. `limits` = { slowCallMs, maxKb } for its API (test/budgets.json); defaults from the environment. */
export function issuesOf(c, limits = {}) {
  const slowMs = limits.slowCallMs ?? SLOW_API_MS;
  const largeBytes = limits.maxKb != null ? limits.maxKb * 1024 : LARGE_API_BYTES;
  const out = [];
  const add = (level, reason) => out.push({ level, reason });
  if (c.error) {
    add('fail', `Request failed: ${c.error}. ${explainFailure(c.error, c.url)}`);
  } else if (c.noResponse) {
    add(c.noResponse.level || 'warn', c.noResponse.reason);
  } else if (c.unfinished) {
    add('warn', 'No response was logged before the test ended, and nothing in the Android log says why.');
  } else if (c.status >= 400) {
    const why = reasonFromBody(c.body);
    add('fail', `HTTP ${c.status}${c.statusText ? ' ' + c.statusText : ''} from ${hostOf(c.url)}${why ? `: ${why}` : c.body ? '' : ` (the error page was ${fmtBytes(c.bytes)}; its text was not logged at this log level)`}. ${meaningOnly(c.status)}`);
  }
  if (c.body && c.status && c.status < 400 && /json/.test(c.contentType || 'json')) {
    try {
      const j = JSON.parse(c.body);
      if (j && j.error) add('fail', `API error "${j.error.code || 'unknown'}" inside a ${c.status} response: ${stripHtml(j.error.info || j.error.html || j.error.text || 'no message')}${apiMeaning(j.error.code)}`);
      if (j && Array.isArray(j.errors) && j.errors.length) add('fail', `API error "${j.errors[0].code || 'unknown'}" inside a ${c.status} response: ${stripHtml(j.errors[0].html || j.errors[0].text || 'no message')}${apiMeaning(j.errors[0].code)}`);
      if (j && Array.isArray(j.warnings) && j.warnings.length) add('warn', `API warning "${j.warnings[0].code || 'unknown'}": ${stripHtml(j.warnings[0].html || j.warnings[0].text || 'no message')}`);
    } catch {}
  }
  if (c.ms != null && c.ms > slowMs) add('warn', `Slow: ${hostOf(c.url)} took ${(c.ms / 1000).toFixed(1)} s to answer (limit ${slowMs / 1000} s)`);
  if (c.bytes != null && c.bytes > largeBytes) add('warn', `Large response: ${Math.round(c.bytes / 1024)} KB of ${(c.contentType || 'data').split(';')[0]} (limit ${Math.round(largeBytes / 1024)} KB)`);
  return out;
}

function reasonFromBody(body) {
  if (!body) return '';
  try {
    const j = JSON.parse(body);
    const e = j.error || (j.errors && j.errors[0]) || j;
    return stripHtml(e.info || e.detail || e.title || e.html || e.text || e.messageTranslations?.en || '').slice(0, 200);
  } catch {}
  const t = String(body).match(/<title>([^<]*)<\/title>/i);
  const p = String(body).match(/<p>([\s\S]*?)<\/p>/i);
  return stripHtml([t && t[1], p && p[1]].filter(Boolean).join(' · ')).slice(0, 200);
}
