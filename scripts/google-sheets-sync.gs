/**
 * Google Apps Script Web App for Degree Guru Leads
 * Connected to Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1k9e609RyT_1bJcNnowpSebw1eMZkieZ7Wtqzdpw3vv8/edit?gid=0#gid=0
 * 
 * Instructions:
 * 1. Open the Google Sheet above.
 * 2. Click "Extensions" -> "Apps Script".
 * 3. Replace any code with this entire script and click Save (Ctrl+S).
 * 4. Click "Deploy" -> "New deployment".
 * 5. Select type: "Web app".
 * 6. Set Description: "Degree Guru Leads Webhook".
 * 7. Set "Execute as": "Me (your account)".
 * 8. Set "Who has access": "Anyone" (allows website and backend to submit leads).
 * 9. Click "Deploy" and authorize permissions.
 * 10. Copy the Web App URL (e.g. https://script.google.com/macros/s/.../exec).
 * 11. Add it to .env.development and .env.production as:
 *     VITE_GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 *     GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = {};

    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Initialize headers if sheet is brand new or empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Lead ID",
        "Date & Time",
        "Form Heading",
        "Full Name",
        "Mobile Number",
        "Email",
        "City",
        "Age",
        "Status / Experience",
        "Qualification",
        "Program / Notes",
        "Source Page"
      ]);
      // Format header row
      var headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#061A36");
      headerRange.setFontColor("#FFFFFF");
    }

    var now = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    sheet.appendRow([
      data.leadId || ("DG-" + Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyyMMdd-") + Math.floor(1000 + Math.random() * 9000)),
      data.dateTime || now,
      data.formHeading || "Enquiry Form",
      data.name || "",
      data.phone || "",
      data.email || "",
      data.city || "",
      data.age || "",
      data.status || "",
      data.graduate || "",
      data.program || "",
      data.source || ""
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Lead punched successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "active", message: "Degree Guru Google Sheet Webhook is active" }))
    .setMimeType(ContentService.MimeType.JSON);
}
