<template>
    <section class="loader">
        <div class="container">
            <img :src="`${configs.public['IMAGE_CDN']}/head.png`" alt="Loading...">
            <div class="line" role="progressbar" aria-label="Loading"></div>
        </div>
    </section>
</template>

<script setup lang="ts">
import './css/Loading.css';
import { useRuntimeConfig } from 'nuxt/app';

const configs = useRuntimeConfig();
</script>
