function doGet(e) {
  const action = e.parameter.action;
  const sheetId = e.parameter.sheetId;

  if (action === 'getApproved') {
    const messages = GuestWallService.getApprovedMessages(sheetId);
    return responseJSON({ status: 'success', messages: messages });
  }
  
  // NEW: Action for Admin Dashboard to fetch ALL submissions
  if (action === 'getAllSubmissions') {
    const submissions = SheetService.getAllSubmissions(sheetId);
    return responseJSON({ status: 'success', submissions: submissions });
  }

  return responseJSON({ status: 'error', message: 'Invalid Action' });
}
