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
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css",
        },
        { rel: "icon", type: "image/x-icon", href: "/images/favicon/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/images/favicon/favicon-16x16.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/images/favicon/favicon-32x32.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/images/favicon/apple-touch-icon.png",
        },
        {
          rel: "apple-touch-icon",
          sizes: "152x152",
          href: "/images/favicon/apple-touch-icon-152x152.png",
        },
        { rel: "manifest", href: "/images/favicon/site.webmanifest" },
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
    public: {
      BACKEND_URL: process.env.BACKEND_URL,
      EMAIL: process.env.EMAIL,
      DATA_CHART_URL: process.env.DATA_CHART_URL,
      MARQUEE_CONTENT: process.env.MARQUEE_CONTENT,
      PUNCAK: process.env.PUNCAK
    },
  },
  plugins: ["./plugins/api.ts"],
});
console.log("Server restarting...");
