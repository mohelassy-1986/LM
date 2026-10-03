const GuestWallService = {
  getApprovedMessages: function(sheetId) {
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    const rows = sheet.getDataRange().getValues();
    const approved = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row[6] === 'Approved') {
        approved.push({
          name: row[1],
          relationship: row[3],
          message: row[4]
        });
      }
    }
    return approved;
  }
};