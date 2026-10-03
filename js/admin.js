async function renderSubmissions() {
  const config = getConfig();
  let submissions = [];
function checkAdminAuth() {
  const input = document.getElementById('admin-pass').value.trim();
  const config = getConfig();

  // Allow login if input matches either the current config password OR default fallback
  if (input === config.adminPasswordHash || input === 'LINA_SASA') {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    initAdminDashboard();
  } else {
    alert('Invalid Password');
  }
}
  // Fetch live entries from Google Sheets backend if URL & Sheet ID are set
  if (config.appsScriptUrl && config.sheetId) {
    try {
      const response = await fetch(`${config.appsScriptUrl}?action=getAllSubmissions&sheetId=${config.sheetId}`);
      const data = await response.json();
      if (data.status === 'success') {
        submissions = data.submissions;
      }
    } catch (err) {
      console.warn('Could not fetch from Google Sheets, showing local entries:', err);
      submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    }
  } else {
    // Fallback if Apps Script isn't configured yet
    submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  }

  // Update Summary Counters
  document.getElementById('stat-total').innerText = submissions.length;
  document.getElementById('stat-approved').innerText = submissions.filter(s => s.status === 'Approved').length;
  document.getElementById('stat-pending').innerText = submissions.filter(s => s.status === 'Pending').length;

  const tbody = document.getElementById('admin-submissions-body');
  tbody.innerHTML = '';

  if (submissions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">No submissions found.</td></tr>`;
    return;
  }

  submissions.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(item.date).toLocaleDateString()}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.relationship)}</td>
      <td>${escapeHtml(item.message)}</td>
      <td><span class="badge badge-${(item.status || 'pending').toLowerCase()}">${item.status}</span></td>
      <td>
        ${item.driveLink ? `<a href="${item.driveLink}" target="_blank" class="btn-sm" style="background:#17a2b8; color:white; text-decoration:none;">Drive</a>` : ''}
        <button class="btn-sm btn-approve" onclick="updateStatus(${index}, 'Approved')">Approve</button>
        <button class="btn-sm btn-reject" onclick="updateStatus(${index}, 'Rejected')">Reject</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
