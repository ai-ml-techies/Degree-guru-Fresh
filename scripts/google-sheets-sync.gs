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

  return ss.getSheetByName("Website") || ss.getSheetByName("Sheet1") || ss.getActiveSheet() || ss.getSheets()[0];
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

    // Ensure standard 12 headers in row 1
    var expectedHeaders = [
      "Lead ID",
      "Date & Time",
      "Form Heading",
      "Full Name",
      "Mobile Number",
      "Email",
      "City",
      "Age",
      "Education",
      "Source Page",
      "Remarks",
      "Resume Link"
    ];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(expectedHeaders);
      var hr = sheet.getRange(1, 1, 1, 12);
      hr.setFontWeight("bold");
      hr.setBackground("#061A36");
      hr.setFontColor("#FFFFFF");
    } else {
      // Ensure header row 1 has "Source Page" in Col 10, "Remarks" in Col 11, and "Resume Link" in Col 12
      var col10Val = String(sheet.getRange(1, 10).getValue() || "").trim();
      if (!col10Val || col10Val.toLowerCase().indexOf("source") === -1) {
        sheet.getRange(1, 10).setValue("Source Page").setFontWeight("bold").setBackground("#061A36").setFontColor("#FFFFFF");
      }
      var col11Val = String(sheet.getRange(1, 11).getValue() || "").trim();
      if (!col11Val) {
        sheet.getRange(1, 11).setValue("Remarks").setFontWeight("bold").setBackground("#061A36").setFontColor("#FFFFFF");
      }
      var col12Val = String(sheet.getRange(1, 12).getValue() || "").trim();
      if (!col12Val || (col12Val.toLowerCase().indexOf("resume") === -1 && col12Val.toLowerCase().indexOf("drive") === -1 && col12Val.toLowerCase().indexOf("cv") === -1)) {
        sheet.getRange(1, 12).setValue("Resume Link").setFontWeight("bold").setBackground("#061A36").setFontColor("#FFFFFF");
      }
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
    var graduateVal = data.education || data.graduate || data["Education"] || data["Qualification"] || "";
    var sourceVal = data.source || data["Source Page"] || "placement-guaranteed-trust-page";

    // Upload CV/Resume to designated Google Drive folder if provided
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
        var fileName = data.resumeFileName || ("CV_" + leadIdVal + ".pdf");
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

    // Exactly matches historical rows 40-59 column structure:
    // Col A (1): Lead ID
    // Col B (2): Date & Time
    // Col C (3): Form Heading
    // Col D (4): Full Name
    // Col E (5): Mobile Number
    // Col F (6): Email
    // Col G (7): City
    // Col H (8): Age
    // Col I (9): Education
    // Col J (10): Source Page
    // Col K (11): Remarks (left empty for counselors' manual notes)
    // Col L (12): Resume Link (Google Drive file link)
    var row = [
      leadIdVal,
      dateTimeVal,
      formHeadingVal,
      nameVal,
      phoneVal,
      emailVal,
      cityVal,
      ageVal,
      graduateVal,
      sourceVal,
      "",
      resumeDriveUrl
    ];

    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead punched successfully",
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
    "Placement Guaranteed Eligibility (Phone Verified)",
    "Test Student",
    "'+91 9999999999",
    "test@example.com",
    "Delhi",
    "24",
    "B.Com",
    "placement-guaranteed-trust-page",
    "",
    "https://drive.google.com/test-resume-link"
  ]);
  Logger.log("Test row punched successfully into tab: " + sheet.getName());
}
