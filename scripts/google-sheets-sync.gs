/**
 * Google Apps Script Web App for Degree Guru Leads
 * Connected to Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1k9e609RyT_1bJcNnowpSebw1eMZkieZ7Wtqzdpw3vv8/edit?gid=0#gid=0
 *
 * CRITICAL DEPLOYMENT SETTING:
 * In Google Apps Script -> Deploy -> Manage deployments -> Edit (pencil icon):
 * - "Execute as": "Me"
 * - "Who has access": "Anyone"  <-- MUST BE "Anyone", NOT "Only myself"!
 * - "Version": "New version"
 * - Click Deploy!
 */

var SPREADSHEET_ID = "1k9e609RyT_1bJcNnowpSebw1eMZkieZ7Wtqzdpw3vv8";

function getTargetSheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {}

  if (!ss) {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (err) {
      Logger.log("openById error: " + err);
    }
  }

  if (!ss) {
    throw new Error("Could not locate spreadsheet. Make sure SPREADSHEET_ID is valid and authorized.");
  }

  return ss.getActiveSheet() || ss.getSheets()[0];
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = getTargetSheet();
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

    var now = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";

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

// Simple test function you can run inside the Apps Script editor to test insertion
function testLeadPunch() {
  var sheet = getTargetSheet();
  var now = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";
  sheet.appendRow([
    "TEST-LEAD-001",
    now,
    "Test Form",
    "Test Student",
    "9999999999",
    "test@example.com",
    "Delhi",
    "24",
    "Graduate",
    "B.Com",
    "Test notes",
    "/placement-guaranteed"
  ]);
  Logger.log("Test row punched successfully into: " + sheet.getName());
}
