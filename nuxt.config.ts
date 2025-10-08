// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from "nuxt/config";

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
      title: "60th",
      titleTemplate: "%s - PBL Smekensa",
      meta: [
        {
          name: "description",
          content: "Selamat datang di website PBL Smekensa yang ke 60th.",
        },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css",
        },
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/images/favicon/favicon.ico",
        },
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
          href: "/images/favicon/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/images/favicon/site.webmanifest" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "48x48",
          href: "/images/favicon/favicon-48x48.png",
        },
      ],
      script: [
        {
          defer: true,
          src: "https://cloud.umami.is/script.js",
          "data-website-id": "05936fd4-6f55-47c6-9f0d-eebeec11203e",
        },
        {
          src: "https://challenges.cloudflare.com/turnstile/v0/api.js",
          async: true,
          defer: true,
        },
      ],
    },
  },
  modules: ["@nuxt/ui", "nuxt-toast", "@nuxtjs/turnstile"],
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
      BACKEND_URL: process.env["BACKEND_URL"],
      EMAIL: process.env["EMAIL"],
      MARQUEE_CONTENT: process.env["MARQUEE_CONTENT"],
      PUNCAK: process.env["PUNCAK"],
      ADMIN_DASH: process.env["ADMIN_DASH"]
    },
  },
  turnstile: {
    siteKey: process.env["CF_SITE_KEY"],
  },
  plugins: ["./plugins/api.ts"],
});
console.log("Server starting...");
