function checkAdminAuth() {
  const input = document.getElementById('admin-pass').value;
  const config = getConfig();
  if (input === config.adminPasswordHash) {
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

function saveAdminConfig() {
  saveConfig({
    appsScriptUrl: document.getElementById('cfg-apps-script').value,
    driveFolderId: document.getElementById('cfg-drive-folder').value,
    sheetId: document.getElementById('cfg-sheet-id').value
  });
  alert('Configuration updated successfully!');
}

function renderSubmissions() {
  const submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  
  document.getElementById('stat-total').innerText = submissions.length;
  document.getElementById('stat-approved').innerText = submissions.filter(s => s.status === 'Approved').length;
  document.getElementById('stat-pending').innerText = submissions.filter(s => s.status === 'Pending').length;

  const tbody = document.getElementById('admin-submissions-body');
  tbody.innerHTML = '';

  submissions.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(item.date).toLocaleDateString()}</td>
      <td>${item.name}</td>
      <td>${item.relationship}</td>
      <td>${item.message}</td>
      <td><span class="badge badge-${item.status.toLowerCase()}">${item.status}</span></td>
      <td>
        <button class="btn-sm btn-approve" onclick="updateStatus(${index}, 'Approved')">Approve</button>
        <button class="btn-sm btn-reject" onclick="updateStatus(${index}, 'Rejected')">Reject</button>
        <button class="btn-sm btn-delete" onclick="deleteEntry(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateStatus(index, newStatus) {
  const submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  submissions[index].status = newStatus;
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  renderSubmissions();
}

function deleteEntry(index) {
  const submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  submissions.splice(index, 1);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  renderSubmissions();
}