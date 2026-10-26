/**
 * Google Apps Script Web App for Degree Guru Leads
 * Connected to Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1k9e609RyT_1bJcNnowpSebw1eMZkieZ7Wtqzdpw3vv8/edit?gid=0#gid=0
 * Target Tab: "Website"
 *
 * CRITICAL DEPLOYMENT SETTING:
 * In Google Apps Script -> Deploy -> Manage deployments -> Edit (pencil icon):
 * - "Execute as": "Me"
 * - "Who has access": "Anyone"  <-- MUST BE "Anyone"!
 * - "Version": "New version"
 * - Click Deploy!
 */

var SPREADSHEET_ID = "1k9e609RyT_1bJcNnowpSebw1eMZkieZ7Wtqzdpw3vv8";
var DRIVE_FOLDER_ID = "1oSEoB_Lln1l7E1XNnLlX8W6uc45MRikf";

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

  // Always target the "Website" tab as requested
  var sheet = ss.getSheetByName("Website");
  if (!sheet) {
    sheet = ss.insertSheet("Website");
  }
  return sheet;
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

    // 14 Clear, Crisp Form-Relevant Headers (Zero Fluff)
    var expectedHeaders = [
      "Lead ID",
      "Date & Time",
      "Form Name",
      "Full Name",
      "Mobile Number",
      "Email",
      "City",
      "Age",
      "Qualification",
      "Work Experience",
      "Interest",
      "Source Page",
      "Notes",
      "Resume Link"
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(expectedHeaders);
      var hr = sheet.getRange(1, 1, 1, expectedHeaders.length);
      hr.setFontWeight("bold");
      hr.setBackground("#061A36");
      hr.setFontColor("#FFFFFF");
      try { sheet.setFrozenRows(1); } catch (fErr) {}
    } else {
      var firstCell = String(sheet.getRange(1, 1).getValue() || "").trim();
      var col9 = String(sheet.getRange(1, 9).getValue() || "").trim();
      var col10 = String(sheet.getRange(1, 10).getValue() || "").trim();
      // If row 1 is uninitialized or uses older headers, align headers
      if (!firstCell || col9.toLowerCase().indexOf("qual") === -1 || col10.toLowerCase().indexOf("exp") === -1) {
        sheet.getRange(1, 1, 1, expectedHeaders.length).setValues([expectedHeaders]);
        var hr = sheet.getRange(1, 1, 1, expectedHeaders.length);
        hr.setFontWeight("bold");
        hr.setBackground("#061A36");
        hr.setFontColor("#FFFFFF");
        try { sheet.setFrozenRows(1); } catch (fErr) {}
      }
    }

    var now = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";

    var rawPhone = data.phone || data["Mobile Number"] || data.mobile || "";
    var phoneVal = rawPhone ? String(rawPhone).trim() : "";
    if (phoneVal.charAt(0) === "+" || phoneVal.charAt(0) === "=") {
      phoneVal = "'" + phoneVal;
    }

    var nameVal = data.name || data["Full Name"] || data.fullName || "";
    var formHeadingVal = data.formHeading || data.form_heading || data["Form Name"] || data["Form Heading"] || "Bajaj Capital ACWM Placement Guaranteed";
    var leadIdVal = data.leadId || data["Lead ID"] || data.id || ("DG-" + Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyyMMdd-") + Math.floor(1000 + Math.random() * 9000));
    var dateTimeVal = data.dateTime || data["Date & Time"] || now;
    var emailVal = data.email || data["Email"] || "";
    var cityVal = data.city || data["City"] || "";
    var ageVal = data.age || data["Age"] || "";
    var qualificationVal = data.qualification || data.graduate || data.education || data["Qualification"] || data["Education"] || "";
    var experienceVal = data.experience || data.status || data["Work Experience"] || data["Experience"] || "";
    var interestVal = data.interest || data["Interest"] || data["Interested in Enrolling"] || "";
    var sourceVal = data.source || data.source_page || data["Source Page"] || "placement-guaranteed";

    // Upload Resume to designated Google Drive folder if provided
    var resumeDriveUrl = data.resumeLink || data["Resume Link"] || data.resumeUrl || "";
    if (data.resumeBase64 && data.resumeFileName) {
      try {
        var base64Data = String(data.resumeBase64).trim();
        if (base64Data.indexOf(",") !== -1) {
          base64Data = base64Data.split(",")[1];
        }
        var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
        var decoded = Utilities.base64Decode(base64Data);
        var mime = data.resumeMimeType || "application/pdf";
        var fileName = data.resumeFileName || ("Resume_" + leadIdVal + ".pdf");
        var blob = Utilities.newBlob(decoded, mime, fileName);
        var driveFile = folder.createFile(blob);
        try {
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (shareErr) {
          Logger.log("Drive sharing permission warning: " + shareErr);
        }
        resumeDriveUrl = driveFile.getUrl();
      } catch (driveErr) {
        Logger.log("DriveApp upload error: " + driveErr);
      }
    }

    // 14 Columns matching form fields directly:
    // Col A (1): Lead ID
    // Col B (2): Date & Time
    // Col C (3): Form Name
    // Col D (4): Full Name
    // Col E (5): Mobile Number
    // Col F (6): Email
    // Col G (7): City
    // Col H (8): Age
    // Col I (9): Qualification
    // Col J (10): Work Experience
    // Col K (11): Interest
    // Col L (12): Source Page
    // Col M (13): Notes (Empty for counselor / follow-up notes)
    // Col N (14): Resume Link (Google Drive file link)
    var row = [
      leadIdVal,
      dateTimeVal,
      formHeadingVal,
      nameVal,
      phoneVal,
      emailVal,
      cityVal,
      ageVal,
      qualificationVal,
      experienceVal,
      interestVal,
      sourceVal,
      "",
      resumeDriveUrl
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead punched successfully into Website tab",
      leadId: leadIdVal,
      resumeUrl: resumeDriveUrl
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "Degree Guru Google Sheet Webhook for Website tab is active"
  })).setMimeType(ContentService.MimeType.JSON);
}

// Test function to verify row insertion into "Website" tab directly in Apps Script editor
function testLeadPunch() {
  var sheet = getTargetSheet();
  var now = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a") + " IST";
  sheet.appendRow([
    "TEST-LEAD-001",
    now,
    "Bajaj Capital ACWM Placement Guaranteed",
    "Test Candidate",
    "'+91 9999999999",
    "test@example.com",
    "Delhi",
    "24",
    "Bachelor's Degree",
    "Fresher",
    "Yes, I'm interested",
    "placement-guaranteed",
    "",
    "https://drive.google.com/test-resume-link"
  ]);
  Logger.log("Test row punched successfully into tab: " + sheet.getName());
}
