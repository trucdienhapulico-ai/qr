/**
 * GOOGLE APPS SCRIPT - BACKEND FOR QR-UID SYSTEM (SECURED)
 * 
 * Instructions:
 * 1. Create a Google Sheet.
 * 2. Rename Sheet1 to "Devices" and add columns: UID, Name, Location.
 * 3. Add another sheet named "Logs" and add columns: Timestamp, UID, Items, Notes, User.
 * 4. Open Extensions > Apps Script.
 * 5. Paste this code and Deploy as Web App (Execute as: Me, Access: Anyone).
 */

const SHEET_ID = "1aK1KMrG5Bn4hYy-QSS5SAST_Xl4Ta_hCbVmqyHXJjUo";
const API_TOKEN = "HAPU_QR_SECRET_2026"; // Simple security token

function doGet(e) {
  const token = e.parameter.token;
  const uid = e.parameter.uid;
  const action = e.parameter.action;

  // Security Check
  if (token !== API_TOKEN) {
    return contentResponse({ status: "error", message: "Unauthorized access" });
  }

  if (action === 'login') {
    const pin = e.parameter.pin;
    const username = e.parameter.username;
    if (!pin || !username) return contentResponse({ status: "error", message: "Missing credentials" });

    const userSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Users");
    if (!userSheet) return contentResponse({ status: "error", message: "Users sheet not found" });
    const users = userSheet.getDataRange().getValues();
    let userRole = null; let userName = null;
    
    // Check Username + PIN (Users sheet: A=Username, B=PIN, C=Role)
    for (let i = 1; i < users.length; i++) {
      if (String(users[i][0]).trim().toLowerCase() === String(username).trim().toLowerCase() 
          && String(users[i][1]) == String(pin)) {
        userName = users[i][0];
        userRole = users[i][2];
        break;
      }
    }

    if (!userRole) return contentResponse({ status: "error", message: "Sai tên đăng nhập hoặc mật khẩu" });

    // Preload devices
    const devSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Devices");
    const devData = devSheet.getDataRange().getValues();
    let devices = [];
    for (let i = 1; i < devData.length; i++) {
      devices.push({
        uid: devData[i][0],
        name: devData[i][1],
        location: devData[i][2],
        specs: devData[i][3] || "N/A",
        cycle: devData[i][4] || 30,
        nextMaintenance: devData[i][5] || ""
      });
    }

    return contentResponse({ 
      status: "success", 
      user: { name: userName, role: userRole },
      devices: devices 
    });
  }

  if (!uid) return contentResponse({ status: "error", message: "Missing UID" });

  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Devices");
  const data = sheet.getDataRange().getValues();
  let deviceData = null;
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == uid) {
      deviceData = {
        uid: data[i][0],
        name: data[i][1],
        location: data[i][2],
        specs: data[i][3] || "N/A",
        cycle: data[i][4] || 30,
        nextMaintenance: data[i][5] || ""
      };
      break;
    }
  }

  if (!deviceData) return contentResponse({ status: "not_found", message: "Device not found" });

  // Get recent history
  const logSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Logs");
  const logData = logSheet.getDataRange().getValues();
  let history = [];
  for (let i = logData.length - 1; i > 0; i--) {
    if (logData[i][1] == uid) {
      history.push({
        date: logData[i][0],
        notes: logData[i][3]
      });
      if (history.length >= 3) break;
    }
  }
  deviceData.history = history;

  return contentResponse({ status: "success", data: deviceData });
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    
    // Security Check
    if (params.token !== API_TOKEN) {
      return contentResponse({ status: "error", message: "Unauthorized access" });
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Logs");
    
    sheet.appendRow([
      new Date(),
      params.uid,
      JSON.stringify(params.items),
      params.notes,
      "Mobile User"
    ]);

    // Update Next Maintenance Date based on Cycle
    const devSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName("Devices");
    const devData = devSheet.getDataRange().getValues();
    for (let i = 1; i < devData.length; i++) {
      if (devData[i][0] == params.uid) {
        let cycle = devData[i][4] || 30; // Default to 30 days if not set
        let nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + parseInt(cycle));
        devSheet.getRange(i + 1, 6).setValue(nextDate); // Column F (6)
        break;
      }
    }

    return contentResponse({ status: "success" });
  } catch (err) {
    return contentResponse({ status: "error", message: err.toString() });
  }
}

function contentResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
