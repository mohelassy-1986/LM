const SheetService = {
  recordSubmission: function(data, folderUrl) {
    const sheet = SpreadsheetApp.openById(data.sheetId).getActiveSheet();
    const status = data.requireApproval ? 'Pending' : 'Approved';
    
    sheet.appendRow([
      new Date(),
      data.name,
      data.phone,
      data.relationship,
      data.message,
      folderUrl,
      status
    ]);
  }
};