import { ModuleOptions } from '@nuxtjs/turnstile'

declare module '@nuxt/schema' {
  interface NuxtConfig {
    turnstile?: ModuleOptions
  }
  interface NuxtOptions {
    turnstile?: ModuleOptions
  }
}
