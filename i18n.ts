
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { BRAND_INFO } from './constants'; // For dynamic values if needed

const supportedLngs = ['en', 'es', 'fr', 'de']; // English, Spanish, French, German

i18n
  .use(HttpBackend) // Loads translations from /public/locales
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    supportedLngs: supportedLngs,
    fallbackLng: 'en',
    debug: true, // Set to false in production
    interpolation: {
      escapeValue: false, // React already safes from xss
      format: (value, format, lng) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (value instanceof Date) return new Intl.DateTimeFormat(lng).format(value);
        return value;
      }
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Path to translation files
    },
    react: {
      useSuspense: true, // Recommended for loading translations
    }
  });

// Function to dynamically update chatbot name in translations if needed
// This is an example if you had a translation like "Chat with {{chatbotName}}"
// i18n.on('loaded', () => {
//   i18n.addResourceBundle('en', 'translation', {
//     chatbotName: BRAND_INFO.chatbot.name 
//   }, true, true);
//    i18n.addResourceBundle('es', 'translation', {
//     chatbotName: BRAND_INFO.chatbot.name 
//   }, true, true);
// });


export default i18n;