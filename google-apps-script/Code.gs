function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action === 'submitMemory') {
      const folderUrl = DriveService.saveMemorySubmission(data);
      SheetService.recordSubmission(data, folderUrl);
      return responseJSON({ status: 'success', folderUrl: folderUrl });
    }
  } catch (err) {
    return responseJSON({ status: 'error', message: err.toString() });
  }
}

function doGet(e) {
  const action = e.parameter.action;
  const sheetId = e.parameter.sheetId;

  if (action === 'getApproved') {
    const messages = GuestWallService.getApprovedMessages(sheetId);
    return responseJSON({ status: 'success', messages: messages });
  }
  return responseJSON({ status: 'error', message: 'Invalid Action' });
}

function responseJSON(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}