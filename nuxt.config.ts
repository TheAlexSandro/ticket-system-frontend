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
        {
          name: "description",
          content:
            "Ticket Scanner adalah sistem yang digunakan untuk memverifikasi keaslian tiket dengan memindai Kode QR pada tiket menggunakan perangkat smartphone, PC ataupun tablet.",
        },
        { name: "robots", content: "noindex, nofollow" },
      ],
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
          "data-website-id": "05936fd4-6f55-47c6-9f0d-eebeec11203e",
        },
      ],
    },
  },
  modules: ["@nuxt/ui", "nuxt-toast"],
  nitro: {
    prerender: {
      autoSubfolderIndex: false,
    },
    experimental: {
      openAPI: false,
    },
  },
  runtimeConfig: {
    API_TOKEN: process.env.API_TOKEN,
    public: {
      BACKEND_URL: process.env.BACKEND_URL,
      EMAIL: process.env.EMAIL,
      DATA_CHART_URL: process.env.DATA_CHART_URL,
    },
  },
  plugins: [
    "./plugins/api.ts"
  ]
});
console.log("Server restarting...")