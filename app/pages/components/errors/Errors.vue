<template>
    <section class="info-error">
        <div class="container">
            <i class="ri-alert-line"></i>
            <p>Unable to complete the request. Please check your internet connection or contact the administrator throught <a :href="`mailto:${getEmail()}`" target="_blank" rel="noopener noreferrer">{{ getEmail() }}</a>.</p>
        </div>
    </section>
</template>

<script setup lang="ts">
import "./css/errors.css";
import { useRuntimeConfig } from "nuxt/app";

const getEmail = () => {
    const configs = useRuntimeConfig();
    return String(configs.public.EMAIL);
}
</script>