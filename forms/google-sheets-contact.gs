/* Paste into the Apps Script project opened from your private spreadsheet.
 * Run setup once in the editor, then deploy as Me, with access set to Anyone.
 * No Gmail permissions or public spreadsheet sharing are required.
 */
const CONTACT_HEADERS = ['Submitted At', 'Name', 'Email', 'Subject', 'Message', 'Submission ID'];

function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Open Apps Script from your spreadsheet first.');
  const sheet = spreadsheet.getSheetByName('Submissions');
  if (!sheet) throw new Error('Rename your sheet tab to Submissions first.');
  const headers = sheet.getRange(1, 1, 1, 6).getValues()[0];
  if (JSON.stringify(headers) !== JSON.stringify(CONTACT_HEADERS)) {
    throw new Error('Set A1:F1 to: ' + CONTACT_HEADERS.join(', '));
  }
  PropertiesService.getScriptProperties().setProperty('CONTACT_SPREADSHEET_ID', spreadsheet.getId());
}

function doGet() {
  return contactResponse({ ok: true, service: 'Portfolio contact receiver' });
}

function doPost(event) {
  let lock;
  try {
    if (!event || !event.parameter || event.contentLength > 100000) {
      return contactResponse({ ok: false });
    }
    const data = event.parameter;
    if (data.website) return contactResponse({ ok: false });
    const limits = { name: 120, email: 254, subject: 200, message: 5000 };
    const values = {};
    for (const field of Object.keys(limits)) {
      const value = String(data[field] || '').trim();
      if (!value || value.length > limits[field]) return contactResponse({ ok: false });
      values[field] = value;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      return contactResponse({ ok: false });
    }
    const id = String(data.submissionId || '');
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return contactResponse({ ok: false });
    }
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('CONTACT_SPREADSHEET_ID');
    if (!spreadsheetId) throw new Error('Run setup before deploying.');

    // Serialize writes and cache recent IDs; no full-sheet scans for each message.
    // Cache entries may be evicted early, so retry deduplication is best effort.
    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return contactResponse({ ok: false });
    const cache = CacheService.getScriptCache();
    const cacheKey = 'contact:' + id;
    if (cache.get(cacheKey)) return contactResponse({ ok: true, submissionId: id });

    const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName('Submissions');
    if (!sheet) throw new Error('Submissions sheet is missing.');
    sheet.appendRow([
      new Date(),
      contactCell(values.name),
      contactCell(values.email),
      contactCell(values.subject),
      contactCell(values.message),
      id
    ]);
    SpreadsheetApp.flush();
    cache.put(cacheKey, 'saved', 21600);
    return contactResponse({ ok: true, submissionId: id });
  } catch (_) {
    return contactResponse({ ok: false });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function contactCell(value) {
  // Keep user input as text rather than allowing spreadsheet formulas.
  return /^[=+\-@\s\u0000-\u001f]/.test(value) ? "'" + value : value;
}

function contactResponse(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
