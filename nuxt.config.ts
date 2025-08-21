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
      meta: [
        { name: "description", content: "Ticket Scanner adalah sistem yang digunakan untuk memverifikasi keaslian tiket dengan memindai Kode QR pada tiket menggunakan perangkat smartphone, PC ataupun tablet." }
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.ico" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon.ico" },
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
