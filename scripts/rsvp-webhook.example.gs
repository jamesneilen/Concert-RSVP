// Example for a NEW dedicated sheet. Review mappings before adapting an existing script.
// Set SPREADSHEET_ID in Apps Script project properties. Never put it in browser code.
function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  if (!/^CK-2026-XMAS-[0-9a-f-]{36}$/i.test(payload.passCode || '')) {
    throw new Error('Invalid passCode');
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    const sheet = SpreadsheetApp.openById(id).getSheetByName('RSVPs');
    if (!sheet) throw new Error('Create a dedicated RSVPs sheet first');
    const fields = ['timestamp', 'fullName', 'tier', 'guestCount', 'passCode',
      'email', 'phone', 'seatingZone', 'prayerIntentions', 'status'];
    if (sheet.getLastRow() === 0) sheet.appendRow(fields);
    const lastRow = sheet.getLastRow();
    const match = lastRow > 1
      ? sheet.getRange(2, 5, lastRow - 1, 1).createTextFinder(payload.passCode)
          .matchEntireCell(true).useRegularExpression(false).findNext()
      : null;
    // Prevent attendee-controlled text from becoming spreadsheet formulas.
    const row = fields.map(key => {
      const value = payload[key] ?? '';
      return typeof value === 'string' && /^[=+@\-\t\r]/.test(value) ? "'" + value : value;
    });
    sheet.getRange(match ? match.getRow() : lastRow + 1, 1, 1, fields.length).setValues([row]);
    SpreadsheetApp.flush();
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
