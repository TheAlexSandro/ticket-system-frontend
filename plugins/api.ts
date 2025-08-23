import axios from "axios";
import { defineNuxtPlugin } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
  //@ts-ignore
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.BACKEND_URL as string,
    withCredentials: true,
  });

  nuxtApp.provide("api", api);
});
