import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-03',

  // SPA mode. Every page's data is already a client-side fetch, there is no SEO
  // requirement, and the UI leans on browser-only APIs (Chart.js canvas,
  // window.scrollTo, confirm(), and Intl formatting in the *user's* timezone —
  // which under SSR would differ between a UTC function and a WIB browser).
  // Nitro still builds a real server function on Vercel, so the API routes are
  // unaffected. Flip to true later if server rendering is ever wanted.
  ssr: false,

  devtools: { enabled: true },

  modules: ['@nuxt/fonts', '@nuxtjs/color-mode'],

  colorMode: {
    // Tokens are overridden under :root[data-theme="light"], so drive the
    // attribute rather than a class. No suffix: the value is the attribute.
    preference: 'system',
    fallback: 'dark',
    dataValue: 'theme',
    classSuffix: '',
    storageKey: 'fintrack-theme',
  },

  css: ['~/assets/css/main.css'],

  // Tailwind v4 ships a first-class Vite plugin; @nuxtjs/tailwindcss still
  // targets v3 and would fight the @import "tailwindcss" entry point.
  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'Fintrack',
      titleTemplate: '%s · Fintrack',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'color-scheme', content: 'dark' },
      ],
      link: [{ rel: 'icon', href: '/favicon.ico' }],
    },
  },

  typescript: {
    strict: true,
    // Run explicitly via `npm run typecheck`; keeps dev startup fast.
    typeCheck: false,
  },

  // nitro.preset is intentionally omitted — Nitro detects the VERCEL env var at
  // build time and emits .vercel/output itself.
})
