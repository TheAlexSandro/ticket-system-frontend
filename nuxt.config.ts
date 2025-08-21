// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    server: {
      allowedHosts: true,
    },
    envDir: ".env",
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css",
        },
      ],
      script: [
        {
          defer: true,
          src: "https://cloud.umami.is/script.js",
          "data-website-id": "05936fd4-6f55-47c6-9f0d-eebeec11203e"
        }
      ],
    },
  },
  modules: ["@nuxt/ui", "nuxt-toast"],
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
  },
  runtimeConfig: {
    public: {
      BACKEND_URL: process.env["BACKEND_URL"],
      API_TOKEN: process.env["API_TOKEN"],
      EMAIL: process.env["EMAIL"]
    },
  }
});
