import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en.json';
import itTranslation from './locales/it.json';
import frTranslation from './locales/fr.json';
import deTranslation from './locales/de.json';
import arTranslation from './locales/ar.json';
import jpTranslation from './locales/jp.json';
import hiTranslation from './locales/hi.json';
import koTranslation from './locales/ko.json';
import zhCNTranslation from './locales/zh-CN.json';
import ruTranslation from './locales/ru.json';

const resources = {
  en: enTranslation, // Structure is { "translation": { ... } }
  it: itTranslation,
  fr: frTranslation,
  de: deTranslation,
  ar: arTranslation,
  jp: jpTranslation,
  hi: hiTranslation,
  ko: koTranslation,
  'zh-CN': zhCNTranslation,
  ru: ruTranslation,
};

i18n
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources,
    fallbackLng: 'en',
    debug: import.meta.env.DEV, // Enable debug mode in development
    ns: ['translation'], // Default namespace
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag', 'querystring', 'cookie', 'path'],
      caches: ['localStorage', 'cookie'], // Where to cache detected language
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,
    },
    react: {
      useSuspense: true, // Recommended for leveraging React Suspense
    }
  });

export default i18n;
