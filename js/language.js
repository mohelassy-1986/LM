const translations = {
  en: {
    title: "Lina & Moustafa",
    subtitle: "Every photo tells a story, every message holds a memory, and every voice carries a piece of this special day.",
    leaveMemory: "Leave a Memory",
    guestWall: "Guest Wall",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    relationship: "Relationship",
    selectRelationship: "Select Relationship",
    relFamily: "Family",
    relFriend: "Friend",
    relColleague: "Colleague",
    relNeighbour: "Neighbour",
    relOther: "Other",
    writtenMessage: "Written Message",
    messagePlaceholder: "Share your blessings and memories (Max 500 characters)...",
    mediaUploads: "Photos & Videos",
    recordings: "Voice & Video Recording",
    recordAudio: "Record Voice Note",
    recordVideo: "Record Video Message",
    stopRecording: "Stop Recording",
    submitMemory: "Submit Memory",
    submitting: "Saving Memory...",
    thankYouTitle: "Thank You ❤️",
    thankYouMsg: "Your memory has been saved successfully.",
    viewWall: "Explore Guest Wall",
    adminPortal: "Admin Portal",
    requiredFieldsNote: "* Required fields"
  },
  ar: {
    title: "لينا ومصطفى",
    subtitle: "كل صورة تحكي حكاية، وكل رسالة تحمل ذكرى، وكل صوت يحمل جزءاً من هذا اليوم المميز.",
    leaveMemory: "اترك ذكرى جميلة",
    guestWall: "جدار الأمنيات",
    fullName: "الاسم بالكامل",
    phoneNumber: "رقم الهاتف",
    relationship: "صلة القرابة / المعرفة",
    selectRelationship: "اختر صلة القرابة",
    relFamily: "عائلة",
    relFriend: "صديق",
    relColleague: "زميل عمل",
    relNeighbour: "جار",
    relOther: "غير ذلك",
    writtenMessage: "رسالتك للعروسين",
    messagePlaceholder: "شاركهما أمنياتك وذكرياتك السعيدة (الحد الأقصى 500 حرف)...",
    mediaUploads: "الصور ومقاطع الفيديو",
    recordings: "تسجيل صوتي وفيديو",
    recordAudio: "تسجيل كلمة صوتية",
    recordVideo: "تسجيل فيديو تهنئة",
    stopRecording: "إيقاف التسجيل",
    submitMemory: "إرسال الأمنية",
    submitting: "جاري الحفظ...",
    thankYouTitle: "شكراً لك ❤️",
    thankYouMsg: "تم حفظ ذكرياتك وأمنياتك بنجاح.",
    viewWall: "تصفح جدار الأمنيات",
    adminPortal: "لوحة التحكم",
    requiredFieldsNote: "* حقول إضافية مطلوبة"
  }
};

let currentLang = localStorage.getItem('guestbook_lang') || 'en';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('guestbook_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  
  let rtlLink = document.getElementById('rtl-stylesheet');
  if (lang === 'ar') {
    if (!rtlLink) {
      rtlLink = document.createElement('link');
      rtlLink.id = 'rtl-stylesheet';
      rtlLink.rel = 'stylesheet';
      rtlLink.href = 'css/rtl.css';
      document.head.appendChild(rtlLink);
    }
  } else if (rtlLink) {
    rtlLink.remove();
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.textContent = translations[lang][key];
      }
    }
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
});