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

  return ss.getSheetByName("Sheet1") || ss.getActiveSheet() || ss.getSheets()[0];
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

    // Read existing headers from row 1
    var lastCol = sheet.getLastColumn();
    var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];

    // Initialize headers if sheet is brand new or empty
    if (headers.length === 0 || sheet.getLastRow() === 0) {
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
        "Source Page"
      ]);
      headers = ["Lead ID", "Date & Time", "Form Heading", "Full Name", "Mobile Number", "Email", "City", "Age", "Status / Experience", "Qualification", "Source Page"];
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#061A36");
      headerRange.setFontColor("#FFFFFF");
    }

    var now = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";

    var rawPhone = data.phone || data["Mobile Number"] || data.mobile || "";
    var phoneVal = rawPhone ? String(rawPhone).trim() : "";
    if (phoneVal.charAt(0) === "+" || phoneVal.charAt(0) === "=") {
      phoneVal = "'" + phoneVal;
    }

    var nameVal = data.name || data["Full Name"] || data.fullName || "";
    var formHeadingVal = data.formHeading || data["Form Heading"] || "Placement Guaranteed Eligibility (Phone Verified)";
    var leadIdVal = data.leadId || data["Lead ID"] || data.id || ("DG-" + Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyyMMdd-") + Math.floor(1000 + Math.random() * 9000));
    var dateTimeVal = data.dateTime || data["Date & Time"] || now;
    var emailVal = data.email || data["Email"] || "";
    var cityVal = data.city || data["City"] || "";
    var ageVal = data.age || data["Age"] || "";
    var statusVal = data.status || data["Status / Experience"] || data.experience || "";
    var graduateVal = data.graduate || data["Qualification"] || data.education || "";
    var sourceVal = data.source || data["Source Page"] || "";

    // Map each cell dynamically to the corresponding column header
    var valMap = {
      "lead id": leadIdVal,
      "date & time": dateTimeVal,
      "date time": dateTimeVal,
      "form heading": formHeadingVal,
      "full name": nameVal,
      "name": nameVal,
      "mobile number": phoneVal,
      "mobile": phoneVal,
      "phone": phoneVal,
      "email": emailVal,
      "city": cityVal,
      "age": ageVal,
      "status / experience": statusVal,
      "experience": statusVal,
      "qualification": graduateVal,
      "education": graduateVal,
      "source page": sourceVal,
      "source": sourceVal
    };

    var row = [];
    for (var i = 0; i < headers.length; i++) {
      var h = String(headers[i]).toLowerCase().trim();
      if (h.indexOf("program") !== -1 || h.indexOf("note") !== -1) {
        row.push(""); // Leave empty if column not yet deleted in sheet
      } else {
        row.push(valMap[h] !== undefined ? valMap[h] : "");
      }
    }
    sheet.appendRow(row);

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
