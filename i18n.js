// i18n.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// --- 1. Language Resources (Dictionaries) ---
// This is where you define ALL the text translations for your app.
const resources = {
  en: {
    translation: {
      greeting: "Welcome to Food App!",
      save: "Save",
      current_lang: "Current Language",
      settings: {
        header: "Settings",
        language_title: "Language", // Used in SettingsRow
        help_center: "Help Center",
        // Add more keys as you localize, e.g.,
        change_password: "Change Password",
        order_history: "Order History",
      },
    },
  },
  es: { // Spanish Example
    translation: {
    	greeting: "¡Bienvenido a la Food App!",
        save: "Guardar",
        current_lang: "Idioma Actual",
        settings: {
            header: "Configuración",
            language_title: "Idioma",
            help_center: "Centro de Ayuda",
            change_password: "Cambiar Contraseña",
            order_history: "Historial de Pedidos",
        }
    }
  },
  // Add more language resources here (e.g., 'tl', 'fr', 'de')
};

// --- 2. Custom Language Detector for Storage ---
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    // Avoid using AsyncStorage (and other browser/native APIs) when running
    // in a Node/CLI environment (expo CLI / metro server). Guard access.
    const isClient = typeof window !== 'undefined' && typeof navigator !== 'undefined';

    try {
      if (isClient && AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const storedLang = await AsyncStorage.getItem('user-language');
        if (storedLang) return callback(storedLang);
      }
    } catch (error) {
      console.warn("AsyncStorage Error on detect:", error);
    }

    // Fallback: use device locale when available, otherwise default to 'en'
    let locale = 'en';
    try {
      if (Localization && typeof Localization.locale === 'string') {
        locale = Localization.locale;
      }
    } catch (e) {
      // ignore
    }

    const systemLang = String(locale).split('-')[0] || 'en';
    return callback(systemLang);
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    try {
      const isClient = typeof window !== 'undefined' && typeof navigator !== 'undefined';
      if (!isClient) return; // don't attempt to persist during CLI/server execution
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem('user-language', language);
      }
    } catch (error) {
      console.warn("AsyncStorage Error on cache:", error);
    }
  }
};

// --- 3. Initialize i18next ---
i18n
  .use(languageDetector) // Use our custom detector first
  .use(initReactI18next) 
  .init({
    compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'en', // Use English if the detected language is not available
    detection: {
        order: ['customDetector'],
    },
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;