export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],
  css: ['~/assets/css/main.css'],
  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        flag: '🇺🇸',
        file: 'en.json'
      },
      {
        code: 'zh-TW',
        name: '繁體中文',
        flag: '🇹🇼',
        file: 'zh-TW.json'
      },
      {
        code: 'ja',
        name: '日本語',
        flag: '🇯🇵',
        file: 'ja.json'
      }
    ],
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'zh-TW',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
})