import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// Function to update document direction and language attribute
export function applyDocumentLanguage(lng: string) {
  const language = lng?.startsWith('ar') ? 'ar' : 'en';
  // Keep direction always LTR across all languages
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = language;
}

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'ar',
    lng: localStorage.getItem('i18nextLng') || 'ar',
    supportedLngs: ['ar', 'en'],
    ns: ['translation'],
    defaultNS: 'translation',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Listen to language changes and update dir/lang
i18n.on('languageChanged', (lng) => {
  applyDocumentLanguage(lng);
  try {
    localStorage.setItem('i18nextLng', lng.startsWith('ar') ? 'ar' : 'en');
  } catch {}
});

// Apply initial language direction
applyDocumentLanguage(i18n.language || localStorage.getItem('i18nextLng') || 'ar');

export default i18n;