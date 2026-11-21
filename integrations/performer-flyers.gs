// Use a separate Apps Script project for performer flyers.
function doPost(event) {
  const properties = PropertiesService.getScriptProperties();
  const token = properties.getProperty('PERFORMER_SHEET_TOKEN');
  const sheetId = properties.getProperty('SPREADSHEET_ID');
  const reply = success => ContentService.createTextOutput(JSON.stringify({ success }))
    .setMimeType(ContentService.MimeType.JSON);
  if (!token || !sheetId) return reply(false);

  let record;
  try { record = JSON.parse(event.postData.contents); }
  catch (_) { return reply(false); }
  if (!record || record.token !== token ||
      typeof record.id !== 'string' || !/^[0-9a-f-]{36}$/i.test(record.id) ||
      typeof record.performer !== 'string' || !record.performer.trim() || record.performer.length > 90 ||
      typeof record.role !== 'string' || !record.role.trim() || record.role.length > 42) return reply(false);

  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(5000);
    const book = SpreadsheetApp.openById(sheetId);
    let sheet = book.getSheetByName('Performer Flyers');
    if (!sheet) sheet = book.insertSheet('Performer Flyers');
    if (sheet.getLastRow() === 0) sheet.appendRow(['Created at', 'Name or choir', 'Concert role', 'Flyer', 'Creation ID']);
    if (sheet.getLastRow() > 1 &&
        sheet.getRange(2, 5, sheet.getLastRow() - 1, 1).createTextFinder(record.id).matchEntireCell(true).findNext()) return reply(true);

    const asText = value => "'" + value;
    sheet.appendRow([new Date(), asText(record.performer), asText(record.role),
      record.role.toLowerCase() === 'guest choir' ? 'Who Are We?' : 'Who Am I?', record.id]);
    SpreadsheetApp.flush();
    return reply(true);
  } catch (_) {
    return reply(false);
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}
