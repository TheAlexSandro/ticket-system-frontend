import { useRuntimeConfig } from "nuxt/app"
import { defineEventHandler, readBody } from "h3"

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const pathParam = event.context.params?.path
  const path = Array.isArray(pathParam) ? pathParam.join("/") : (pathParam || "")
  const body = await readBody(event)

  return await $fetch(`${config.public.backendUrl}/${path}`, {
    method: event.method,
    body,
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
    },
  })
})
