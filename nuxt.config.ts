import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-07",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      shopifyDomain: process.env.SHOPIFY_DOMAIN || '',
      shopifyToken: process.env.SHOPIFY_TOKEN || '',
      siteUrl: process.env.SITE_URL || 'http://localhost:3000',
    }
  },
  css: ['~/assets/css/main.css'],
  modules: [
    ['@nuxtjs/google-fonts', {
      families: { Roboto: [300, 400, 700] },
      display: 'swap',
    }],
    '@pinia/nuxt',
  ],
  vite: {
    plugins: [tailwindcss()],
  },
})
