const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { test } = require('node:test');
const vm = require('node:vm');
const path = require('node:path');

const read = (file) => readFileSync(path.join(__dirname, '..', file), 'utf8');
const receiverSource = read('forms/google-sheets-contact.gs');
const clientSource = read('assets/js/contact.js');
const id = '12345678-1234-4123-8123-123456789abc';
const valid = { name: 'Visitor', email: 'visitor@example.com', subject: 'Hello', message: 'A question', submissionId: id };

function receiver(options = {}) {
  const rows = [];
  const cache = new Map();
  const properties = new Map(options.unconfigured ? [] : [['CONTACT_SPREADSHEET_ID', 'sheet-id']]);
  let released = 0;
  const sheet = {
    getRange: () => ({ getValues: () => [options.headers || ['Submitted At', 'Name', 'Email', 'Subject', 'Message', 'Submission ID']] }),
    appendRow: (row) => {
      if (options.writeFails) throw new Error('Quota exceeded');
      rows.push(row);
    }
  };
  const spreadsheet = { getId: () => 'sheet-id', getSheetByName: () => sheet };
  const context = vm.createContext({
    SpreadsheetApp: {
      getActiveSpreadsheet: () => spreadsheet,
      openById: () => spreadsheet,
      flush: () => {}
    },
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (key) => properties.get(key),
      setProperty: (key, value) => properties.set(key, value)
    }) },
    LockService: { getScriptLock: () => ({
      tryLock: () => !options.busy,
      hasLock: () => !options.busy,
      releaseLock: () => released++
    }) },
    CacheService: { getScriptCache: () => ({ get: (key) => cache.get(key), put: (key, value) => cache.set(key, value) }) },
    ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput: (text) => ({ setMimeType: () => JSON.parse(text) }) }
  });
  vm.runInContext(receiverSource, context);
  return { context, rows, properties, released: () => released, post: (data = valid) => context.doPost({ parameter: data, contentLength: 1000 }) };
}

function element(value = '') {
  const classes = new Set();
  return {
    value, textContent: '', disabled: false,
    classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c), contains: (c) => classes.has(c) }
  };
}

function client(fetchImplementation, endpoint = 'https://script.google.com/macros/s/example/exec') {
  const nodes = Object.fromEntries(['button[type="submit"]', '.loading', '.error-message', '.sent-message'].map((key) => [key, element()]));
  const fields = Object.fromEntries(Object.entries({ ...valid, website: '' }).map(([key, value]) => [key, element(value)]));
  let submit;
  let resets = 0;
  let calls = 0;
  let request;
  let timeout;
  const attributes = new Map();
  const form = {
    dataset: { googleScriptUrl: endpoint },
    elements: { namedItem: (key) => fields[key] },
    querySelector: (key) => nodes[key],
    reportValidity: () => true,
    addEventListener: (_, handler) => { submit = handler; },
    setAttribute: (key, value) => attributes.set(key, value),
    removeAttribute: (key) => attributes.delete(key),
    reset: () => { resets++; }
  };
  const context = vm.createContext({
    document: { getElementById: () => form },
    URLSearchParams, AbortController,
    crypto: { randomUUID: () => id },
    setTimeout: (callback) => { timeout = callback; return 1; },
    clearTimeout: () => {},
    fetch: async (url, options) => {
      calls++;
      request = { url, ...options };
      return fetchImplementation(url, options);
    }
  });
  vm.runInContext(clientSource, context);
  return { nodes, fields, attributes, submit: () => submit({ preventDefault() {} }), calls: () => calls, request: () => request, resets: () => resets, timeout: () => timeout() };
}

test('profile updates and client wiring preserve template assets', () => {
  const html = read('index.html');
  assert.equal((html.match(/rufai\.abubakar@prokip\.africa<\/span>|rufai\.abubakar@prokip\.africa\n/g) || []).length, 2);
  assert.match(html, /<strong>Age:<\/strong> <span>29<\/span>/);
  assert.doesNotMatch(html, /prowebesolutions\.com|action="forms\/contact\.php"|src="assets\/vendor\/php-email-form\/validate\.js"/);
  assert.match(html, /src="assets\/js\/contact\.js"/);
  assert.match(html, /data-google-script-url="https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec"/);
  assert.match(html, /src="assets\/js\/main\.js"/);
  assert.match(html, /type="submit" disabled/);
});

test('setup saves the private spreadsheet ID and checks headers', () => {
  const app = receiver({ unconfigured: true });
  app.context.setup();
  assert.equal(app.properties.get('CONTACT_SPREADSHEET_ID'), 'sheet-id');
  assert.throws(() => receiver({ headers: ['Wrong'] }).context.setup(), /A1:F1/);
});

test('receiver saves six columns and acknowledges the same submission ID', () => {
  const app = receiver();
  assert.deepEqual(app.post(), { ok: true, submissionId: id });
  assert.equal(app.rows.length, 1);
  assert.equal(app.rows[0].length, 6);
  assert.equal(app.rows[0][2], valid.email);
  assert.equal(app.released(), 1);
});

test('receiver rejects invalid, oversized, and honeypot submissions without writing', () => {
  const app = receiver();
  for (const change of [{ name: ' ' }, { email: 'bad' }, { message: 'a'.repeat(5001) }, { submissionId: 'invalid' }, { website: 'spam' }]) {
    assert.equal(app.post({ ...valid, ...change }).ok, false);
  }
  assert.equal(app.context.doPost({ parameter: valid, contentLength: 100001 }).ok, false);
  assert.equal(app.context.doPost().ok, false);
  assert.equal(app.rows.length, 0);
});

test('receiver escapes spreadsheet formula prefixes', () => {
  const app = receiver();
  app.post({ ...valid, name: '=1+1', subject: '+1', message: '@SUM(A1)' });
  assert.equal(app.rows[0][1], "'=1+1");
  assert.equal(app.rows[0][3], "'+1");
  assert.equal(app.rows[0][4], "'@SUM(A1)");
});

test('recent retries acknowledge the original row without appending again', () => {
  const app = receiver();
  app.post();
  assert.deepEqual(app.post(), { ok: true, submissionId: id });
  assert.equal(app.rows.length, 1);
  assert.equal(app.released(), 2);
});

test('missing setup and lock contention fail without writing', () => {
  for (const options of [{ unconfigured: true }, { busy: true }]) {
    const app = receiver(options);
    assert.equal(app.post().ok, false);
    assert.equal(app.rows.length, 0);
  }
});

test('receiver releases lock after a failed write and permits a retry', () => {
  const app = receiver({ writeFails: true });
  assert.equal(app.post().ok, false);
  assert.equal(app.post().ok, false);
  assert.equal(app.released(), 2);
  assert.equal(app.rows.length, 0);
});

test('missing or untrusted endpoint never sends contact data', async () => {
  for (const endpoint of ['', 'https://example.com/exec', 'https://script.google.com/macros/s/example/dev']) {
    const app = client(() => {}, endpoint);
    await app.submit();
    assert.equal(app.calls(), 0);
    assert.match(app.nodes['.error-message'].textContent, /being connected/);
  }
});

test('client rejects whitespace-only fields', async () => {
  const app = client(() => {});
  app.fields.message.value = '   ';
  await app.submit();
  assert.equal(app.calls(), 0);
});

test('client sends URL-encoded data and clears entries only after acknowledgement', async () => {
  const app = client(async () => ({ ok: true, json: async () => ({ ok: true, submissionId: id }) }));
  await app.submit();
  assert.equal(app.request().body.get('email'), valid.email);
  assert.equal(app.request().body.get('submissionId'), id);
  assert.equal(app.request().credentials, 'omit');
  assert.equal(app.request().mode, undefined);
  assert.equal(app.resets(), 1);
  assert.equal(app.nodes['.sent-message'].classList.contains('d-block'), true);
  assert.equal(app.nodes['button[type="submit"]'].disabled, false);
  assert.equal(app.attributes.has('aria-busy'), false);
});

test('failed or unconfirmed saves keep entries and reuse ID on retry', async () => {
  for (const response of [
    { ok: false },
    { ok: true, json: async () => ({ ok: false }) },
    { ok: true, json: async () => ({ ok: true, submissionId: 'wrong-id' }) },
    { ok: true, json: async () => { throw new Error('HTML instead of JSON'); } }
  ]) {
    const app = client(async () => response);
    await app.submit();
    const firstId = app.request().body.get('submissionId');
    await app.submit();
    assert.equal(app.request().body.get('submissionId'), firstId);
    assert.equal(app.resets(), 0);
    assert.equal(app.fields.message.value, valid.message);
    assert.equal(app.nodes['.sent-message'].classList.contains('d-block'), false);
    assert.match(app.nodes['.error-message'].textContent, /could not confirm/);
  }
});

test('pending request blocks repeated submit clicks', async () => {
  let resolve;
  const app = client(() => new Promise((done) => { resolve = done; }));
  const first = app.submit();
  await app.submit();
  assert.equal(app.calls(), 1);
  assert.equal(app.nodes['button[type="submit"]'].disabled, true);
  resolve({ ok: true, json: async () => ({ ok: true, submissionId: id }) });
  await first;
  assert.equal(app.nodes['button[type="submit"]'].disabled, false);
});

test('timeout preserves entries and restores submit button', async () => {
  const app = client((_, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new Error('Aborted')));
  }));
  const pending = app.submit();
  app.timeout();
  await pending;
  assert.equal(app.resets(), 0);
  assert.equal(app.nodes['button[type="submit"]'].disabled, false);
  assert.equal(app.nodes['.loading'].classList.contains('d-block'), false);
  assert.match(app.nodes['.error-message'].textContent, /could not confirm/);
});
