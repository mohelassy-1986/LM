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
  },

  // NEW: Method to retrieve all rows for the Admin panel
  getAllSubmissions: function(sheetId) {
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    const submissions = [];

    // Skip Header Row (Row 0)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[1]) { // If name exists
        submissions.push({
          rowIndex: i + 1, // Store sheet row number for updating status
          date: row[0],
          name: row[1],
          phone: row[2],
          relationship: row[3],
          message: row[4],
          driveLink: row[5],
          status: row[6] || 'Pending'
        });
      }
    }
    return submissions;
  }
};
