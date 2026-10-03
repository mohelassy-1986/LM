document.addEventListener('DOMContentLoaded', loadGuestWall);

async function loadGuestWall() {
  const config = getConfig();
  const container = document.getElementById('guest-wall-container');
  container.innerHTML = '';

  let entries = [];

  if (config.appsScriptUrl) {
    try {
      const resp = await fetch(`${config.appsScriptUrl}?action=getApproved&sheetId=${config.sheetId}`);
      const data = await resp.json();
      if (data.status === 'success') entries = data.messages;
    } catch (e) {
      console.warn('Apps Script request failed, using local storage.', e);
      entries = getLocalApproved();
    }
  } else {
    entries = getLocalApproved();
  }

  if (entries.length === 0) {
    container.innerHTML = `<p style="text-align:center; grid-column: 1/-1; color: var(--text-muted);">No messages published yet.</p>`;
    return;
  }

  entries.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'wall-card';
    card.innerHTML = `
      <div class="guest-name">${escapeHtml(entry.name)}</div>
      <div class="guest-rel">${escapeHtml(entry.relationship || 'Guest')}</div>
      <div class="guest-msg">"${escapeHtml(entry.message)}"</div>
    `;
    container.appendChild(card);
  });
}

function getLocalApproved() {
  const submissions = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  return submissions.filter(s => s.status === 'Approved');
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}