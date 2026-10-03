/**
 * Admin Portal Management Logic — Lina & Moustafa
 * Features: Persistent session login, Config management, Live Google Sheets sync
 */

const SESSION_AUTH_KEY = 'wedding_guestbook_admin_authed';

// Initialize events and check authentication status on page load
document.addEventListener('DOMContentLoaded', () => {
  const passInput = document.getElementById('admin-pass');
  if (passInput) {
    passInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkAdminAuth();
    });
  }

  // Automatically show dashboard if previously logged in
  checkSession();
});

/**
 * Checks if the user is already authenticated in this session or local storage
 */
function checkSession() {
  const isAuthedSession = sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
  const isAuthedLocal = localStorage.getItem(SESSION_AUTH_KEY) === 'true';

  if (isAuthedSession || isAuthedLocal) {
    showDashboard();
  }
}

/**
 * Validates admin password and persists login state
 */
function checkAdminAuth() {
  const passInput = document.getElementById('admin-pass');
  const input = passInput ? passInput.value.trim() : '';
  const config = getConfig();

  // Accept saved config password or default fallback 'LINA_SASA'
  if (input === config.adminPasswordHash || input === 'LINA_SASA') {
    sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
    localStorage.setItem(SESSION_AUTH_KEY, 'true');
    showDashboard();
  } else {
    alert('Invalid Password. Please try again.');
  }
}

/**
 * Displays the main admin dashboard and hides the login form
 */
function showDashboard() {
  const loginCard = document.getElementById('admin-login');
  const dashboard = document.getElementById('admin-dashboard');

  if (loginCard) loginCard.style.display = 'none';
  if (dashboard) dashboard.style.display = 'block';

  initAdminDashboard();
}

/**
 * Clears authentication state and logs out
 */
function adminLogout() {
  sessionStorage.removeItem(SESSION_AUTH_KEY);
  localStorage.removeItem(SESSION_AUTH_KEY);
  location.reload();
}

/**
 * Initializes dashboard fields with saved config and loads submissions
 */
function initAdminDashboard() {
  const config = getConfig();
  
  // Populate backend settings fields
  const appsScriptEl = document.getElementById('cfg-apps-script');
  const driveFolderEl = document.getElementById('cfg-drive-folder');
  const sheetIdEl = document.getElementById('cfg-sheet-id');

  if (appsScriptEl) appsScriptEl.value = config.appsScriptUrl || '';
  if (driveFolderEl) driveFolderEl.value = config.driveFolderId || '';
  if (sheetIdEl) sheetIdEl.value = config.sheetId || '';

  renderSubmissions();
}

/**
 * Saves Admin configuration settings to localStorage
 */
function saveAdminConfig() {
  const appsScriptUrl = document.getElementById('cfg-apps-script').value.trim();
  const driveFolderId = document.getElementById('cfg-drive-folder').value.trim();
  const sheetId = document.getElementById('cfg-sheet-id').value.trim();

  const updated = saveConfig({
    appsScriptUrl: appsScriptUrl,
    driveFolderId: driveFolderId,
    sheetId: sheetId
  });

  if (updated) {
    alert('Configuration saved successfully!');
    renderSubmissions();
  } else {
    alert('Failed to save configuration.');
  }
}

/**
 * Fetches and renders all guest submissions
 */
async function renderSubmissions() {
  const config = getConfig();
  let submissions = [];

  // 1. Attempt to fetch live entries from Google Sheets
  if (config.appsScriptUrl && config.sheetId) {
    try {
      const response = await fetch(`${config.appsScriptUrl}?action=getAllSubmissions&sheetId=${config.sheetId}`);
      const data = await response.json();
      if (data.status === 'success' && Array.isArray(data.submissions)) {
        submissions = data.submissions;
      }
    } catch (err) {
      console.warn('Could not fetch from Google Sheets, defaulting to local entries:', err);
      submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    }
  } else {
    // 2. Fallback to localStorage if Apps Script is not configured yet
    submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  }

  // Update Summary Stat Counters
  const statTotal = document.getElementById('stat-total');
  const statApproved = document.getElementById('stat-approved');
  const statPending = document.getElementById('stat-pending');

  if (statTotal) statTotal.innerText = submissions.length;
  if (statApproved) statApproved.innerText = submissions.filter(s => (s.status || '').toLowerCase() === 'approved').length;
  if (statPending) statPending.innerText = submissions.filter(s => (s.status || '').toLowerCase() === 'pending').length;

  const tbody = document.getElementById('admin-submissions-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (submissions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">No submissions found.</td></tr>`;
    return;
  }

  // Render Table Rows
  submissions.forEach((item, index) => {
    const tr = document.createElement('tr');
    
    // Date parsing
    let dateStr = '—';
    if (item.date) {
      const parsedDate = new Date(item.date);
      dateStr = isNaN(parsedDate.getTime()) ? escapeHtml(String(item.date)) : parsedDate.toLocaleDateString();
    }

    const currentStatus = (item.status || 'Pending').trim();
    const statusClass = currentStatus.toLowerCase();
    const rowIndex = item.rowIndex || (index + 1);

    tr.innerHTML = `
      <td>${dateStr}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.relationship)}</td>
      <td>${escapeHtml(item.message)}</td>
      <td><span class="badge badge-${statusClass}">${escapeHtml(currentStatus)}</span></td>
      <td>
        ${item.driveLink ? `<a href="${escapeHtml(item.driveLink)}" target="_blank" class="btn-sm" style="background:#17a2b8; color:white; text-decoration:none; margin-right: 4px;">Drive</a>` : ''}
        <button type="button" class="btn-sm btn-approve" onclick="updateStatus(${rowIndex}, 'Approved', ${index})">Approve</button>
        <button type="button" class="btn-sm btn-reject" onclick="updateStatus(${rowIndex}, 'Rejected', ${index})">Reject</button>
        <button type="button" class="btn-sm btn-delete" onclick="deleteEntry(${rowIndex}, ${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * Updates submission status in Google Sheets and local storage
 */
async function updateStatus(rowIndex, newStatus, localIndex) {
  const config = getConfig();

  if (config.appsScriptUrl && config.sheetId) {
    try {
      await fetch(config.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'updateStatus',
          sheetId: config.sheetId,
          rowIndex: rowIndex,
          status: newStatus
        })
      });
    } catch (err) {
      console.warn('Backend status update failed:', err);
    }
  }

  // Sync Local Storage
  const localSubmissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  if (localSubmissions[localIndex]) {
    localSubmissions[localIndex].status = newStatus;
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(localSubmissions));
  }

  renderSubmissions();
}

/**
 * Deletes a submission entry
 */
async function deleteEntry(rowIndex, localIndex) {
  if (!confirm('Are you sure you want to delete this memory submission?')) return;

  const config = getConfig();

  if (config.appsScriptUrl && config.sheetId) {
    try {
      await fetch(config.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'deleteSubmission',
          sheetId: config.sheetId,
          rowIndex: rowIndex
        })
      });
    } catch (err) {
      console.warn('Backend delete request failed:', err);
    }
  }

  // Remove from Local Storage
  const localSubmissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  if (localSubmissions[localIndex]) {
    localSubmissions.splice(localIndex, 1);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(localSubmissions));
  }

  renderSubmissions();
}

/**
 * Utility HTML Escape helper
 */
function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
