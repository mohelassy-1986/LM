let recordedBlobs = [];
let isAudioRecording = false;
let isVideoRecording = false;

document.addEventListener('DOMContentLoaded', () => {
  const config = getConfig();
  document.getElementById('couple-photo').src = config.couplePhoto;
  
  if (currentLang === 'ar' && config.welcomeMsgAr) {
    document.getElementById('welcome-msg').textContent = config.welcomeMsgAr;
  } else if (config.welcomeMsgEn) {
    document.getElementById('welcome-msg').textContent = config.welcomeMsgEn;
  }

  document.getElementById('guestbook-form').addEventListener('submit', handleFormSubmit);
});

async function toggleAudioRecord() {
  const btn = document.getElementById('btn-record-audio');
  if (!isAudioRecording) {
    await recorderManager.startAudioRecording();
    isAudioRecording = true;
    btn.style.background = '#dc3545';
    btn.innerText = '🔴 Stop Audio Recording';
  } else {
    const result = await recorderManager.stopRecording();
    isAudioRecording = false;
    btn.style.background = '';
    btn.innerText = '🎤 Record Voice Note';
    if (result) addRecordingPreview(result);
  }
}

async function toggleVideoRecord() {
  const btn = document.getElementById('btn-record-video');
  const videoPreview = document.getElementById('video-preview');
  
  if (!isVideoRecording) {
    videoPreview.style.display = 'block';
    await recorderManager.startVideoRecording(videoPreview);
    isVideoRecording = true;
    btn.style.background = '#dc3545';
    btn.innerText = '🔴 Stop Video Recording';
  } else {
    const result = await recorderManager.stopRecording();
    isVideoRecording = false;
    videoPreview.style.display = 'none';
    btn.style.background = '';
    btn.innerText = '📹 Record Video';
    if (result) addRecordingPreview(result);
  }
}

function addRecordingPreview(recording) {
  recordedBlobs.push(recording);
  const container = document.getElementById('recordings-list');
  const url = URL.createObjectURL(recording.blob);
  
  const mediaEl = document.createElement(recording.type === 'video' ? 'video' : 'audio');
  mediaEl.src = url;
  mediaEl.controls = true;
  mediaEl.style.width = '100%';
  mediaEl.style.marginTop = '0.5rem';

  container.appendChild(mediaEl);
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById('btn-submit');
  submitBtn.disabled = true;
  submitBtn.innerText = translations[currentLang].submitting;

  const config = getConfig();
  const name = document.getElementById('guest-name').value;
  const phone = document.getElementById('guest-phone').value;
  const rel = document.getElementById('guest-rel').value;
  const msg = document.getElementById('guest-msg').value;

  const fileInput = document.getElementById('media-files');
  const mediaPayload = [];

  for (let file of fileInput.files) {
    const b64 = await fileToBase64(file);
    mediaPayload.push(b64);
  }

  for (let idx in recordedBlobs) {
    const rec = recordedBlobs[idx];
    const filename = `recording_${Date.now()}_${idx}.${rec.type === 'video' ? 'webm' : 'webm'}`;
    const b64 = await blobToBase64(rec.blob, filename);
    mediaPayload.push(b64);
  }

  const payload = {
    action: 'submitMemory',
    name,
    phone,
    relationship: rel,
    message: msg,
    mediaFiles: mediaPayload,
    driveFolderId: config.driveFolderId,
    sheetId: config.sheetId,
    requireApproval: config.requireApproval
  };

  if (config.appsScriptUrl) {
    try {
      await fetch(config.appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Backend submission error, falling back to local storage', err);
      saveLocalSubmission(payload);
    }
  } else {
    saveLocalSubmission(payload);
  }

  document.getElementById('form-container').style.display = 'none';
  document.getElementById('thank-you-screen').style.display = 'block';
}

function saveLocalSubmission(payload) {
  const current = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
  const newEntry = {
    id: Date.now(),
    date: new Date().toISOString(),
    name: payload.name,
    phone: payload.phone,
    relationship: payload.relationship,
    message: payload.message,
    status: payload.requireApproval ? 'Pending' : 'Approved'
  };
  current.push(newEntry);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(current));
}