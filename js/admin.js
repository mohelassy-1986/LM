function checkAdminAuth() {
  const input = document.getElementById('admin-pass').value.trim();
  const config = getConfig();

  // Validate password (supports saved config password or default 'LINA_SASA')
  if (input === config.adminPasswordHash || input === 'LINA_SASA') {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    initAdminDashboard();
  } else {
    alert('Invalid Password');
  }
}

function initAdminDashboard() {
  const config = getConfig();
  document.getElementById('cfg-apps-script').value = config.appsScriptUrl || '';
  document.getElementById('cfg-drive-folder').value = config.driveFolderId || '';
  document.getElementById('cfg-sheet-id').value = config.sheetId || '';

  renderSubmissions();
}
