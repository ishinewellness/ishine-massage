import { createI18n } from 'vue-i18n'
import zh from './locales/zh'
import en from './locales/en'
import fr from './locales/fr'

// Detect browser language, default to Chinese
function getBrowserLang() {
  const lang = navigator.language || navigator.userLanguage
  if (lang.startsWith('fr')) return 'fr'
  if (lang.startsWith('en')) return 'en'
  return 'zh'
}

const savedLang = localStorage.getItem('iShineLang')

const i18n = createI18n({
  locale: savedLang || getBrowserLang(),
  fallbackLocale: 'en',
  messages: { zh, en, fr }
})

export default i18n
