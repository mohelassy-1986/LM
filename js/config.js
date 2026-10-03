const CONFIG_KEY = 'wedding_guestbook_config';
const SUBMISSIONS_KEY = 'wedding_guestbook_submissions';

const DEFAULT_CONFIG = {
  weddingTitle: 'Lina & Moustafa',
  coupleNames: 'Lina & Moustafa',
  welcomeMsgEn: 'Every photo tells a story, every message holds a memory, and every voice carries a piece of this special day.',
  welcomeMsgAr: 'كل صورة تحكي حكاية، وكل رسالة تحمل ذكرى، وكل صوت يحمل جزءاً من هذا اليوم المميز.',
  couplePhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000',
  appsScriptUrl: '',
  driveFolderId: '',
  sheetId: '',
  adminPasswordHash: 'LINA_SASA',
  requireApproval: true,
  enableGuestWall: true,
  qrTargetUrl: window.location.origin + window.location.pathname.replace('admin.html', 'index.html')
};

function getConfig() {
  const saved = localStorage.getItem(CONFIG_KEY);
  if (!saved) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
    return DEFAULT_CONFIG;
  }
  return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
}

function saveConfig(newConfig) {
  const updated = { ...getConfig(), ...newConfig };
  localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
  return updated;
}