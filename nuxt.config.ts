export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],
  css: [
    '~/assets/css/main.css',
    '../frontend/assets/css/theme-integration.css',
    '../frontend/assets/css/responsive.css'
  ],
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
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'https://promotion.mercylife.cc/api'
    }
  },
  i18n: {
    locales: [
      { code: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' }
    ],
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'zh-TW',
    strategy: 'no_prefix'
  },
  // Disable problematic nuxt-icon server bundle
  icon: {
    serverBundle: false
  }
})