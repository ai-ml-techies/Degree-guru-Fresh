/**
 * Google Apps Script Web App for Degree Guru Leads
 * Connected to Spreadsheet:
 * https://docs.google.com/spreadsheets/d/1k9e609RyT_1bJcNnowpSebw1eMZkieZ7Wtqzdpw3vv8/edit?gid=2135711166#gid=2135711166
 * Target Tab: "Logical Form Website"
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
var NOTIFICATION_EMAIL = "agestartup@gmail.com";

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

  // Target the exact "Logical Form Website" tab
  var sheet = ss.getSheetByName("Logical Form Website");
  if (!sheet) {
    sheet = ss.insertSheet("Logical Form Website");
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

    // 14 Clear, Crisp Headers (Zero Fluff)
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

    // Ensure Row 1 has clean headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(expectedHeaders);
      var hr = sheet.getRange(1, 1, 1, expectedHeaders.length);
      hr.setFontWeight("bold");
      hr.setBackground("#061A36");
      hr.setFontColor("#FFFFFF");
      try { sheet.setFrozenRows(1); } catch (fErr) {}
    } else {
      var firstCell = String(sheet.getRange(1, 1).getValue() || "").trim();
      if (!firstCell || firstCell.toLowerCase().indexOf("lead") === -1) {
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

    // Guaranteed Email Notification via MailApp (Direct Google Deliverability)
    try {
      var subject = "[New Lead] " + nameVal + " (" + (qualificationVal || "Candidate") + ") - " + phoneVal;
      var html = '<div style="font-family:Arial,sans-serif;max-width:550px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">' +
        '<div style="background:#061A36;color:#ffffff;padding:12px 16px;font-size:16px;font-weight:bold;">New Lead Received (Degree Guru)</div>' +
        '<div style="padding:16px;font-size:13px;line-height:1.6;color:#1e293b;">' +
        '<p><strong>Name:</strong> ' + nameVal + '</p>' +
        '<p><strong>Phone:</strong> <a href="tel:' + phoneVal + '">' + phoneVal + '</a></p>' +
        '<p><strong>Email:</strong> <a href="mailto:' + emailVal + '">' + emailVal + '</a></p>' +
        '<p><strong>City:</strong> ' + cityVal + '</p>' +
        '<p><strong>Age:</strong> ' + ageVal + '</p>' +
        '<p><strong>Qualification:</strong> ' + qualificationVal + '</p>' +
        '<p><strong>Work Experience:</strong> ' + experienceVal + '</p>' +
        '<p><strong>Interest:</strong> ' + interestVal + '</p>' +
        '<p><strong>Form:</strong> ' + formHeadingVal + '</p>' +
        '<p><strong>Lead ID:</strong> ' + leadIdVal + '</p>' +
        '<p><strong>Date & Time:</strong> ' + dateTimeVal + '</p>' +
        (resumeDriveUrl ? ('<p><strong>Resume:</strong> <a href="' + resumeDriveUrl + '" target="_blank">View / Download Resume</a></p>') : '') +
        '</div></div>';

      MailApp.sendEmail({
        to: NOTIFICATION_EMAIL,
        replyTo: emailVal || NOTIFICATION_EMAIL,
        subject: subject,
        htmlBody: html
      });

      // Send acknowledgment to applicant if valid email provided
      if (emailVal && emailVal.indexOf("@") !== -1) {
        try {
          var applicantHtml = '<div style="font-family:Arial,sans-serif;max-width:550px;padding:16px;color:#1e293b;">' +
            '<h2 style="color:#061A36;">Application Received</h2>' +
            '<p>Dear ' + nameVal + ',</p>' +
            '<p>Thank you for submitting your application for the <strong>Bajaj Capital ACWM Programme</strong> on Degree Guru.</p>' +
            '<p>Our career admissions team will review your eligibility and connect with you shortly.</p>' +
            '<p style="margin-top:20px;color:#64748b;font-size:12px;">Degree Guru Admissions Team</p>' +
            '</div>';

          MailApp.sendEmail({
            to: emailVal,
            subject: "Application Received - Degree Guru & Bajaj Capital",
            htmlBody: applicantHtml
          });
        } catch (cErr) {
          Logger.log("Applicant notification note: " + cErr);
        }
      }
    } catch (mailErr) {
      Logger.log("MailApp notification error: " + mailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead punched successfully into Logical Form Website tab",
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
    message: "Degree Guru Google Sheet Webhook for Logical Form Website tab is active"
  })).setMimeType(ContentService.MimeType.JSON);
}

// Test function to initialize headers and punch a test row in "Logical Form Website" tab
function testLeadPunch() {
  var sheet = getTargetSheet();
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
  }

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
