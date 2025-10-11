<template>
    <div class="header">
        <div class="logo" @click="home()">
            <div class="bounce-wrap">
                <img :src="`${configs.public['IMAGE_CDN']}/head.png`" alt="Logo">
            </div>
            <p>PBL Smekensa</p>
        </div>
        <div class="menu">
            <div class="user" @click="redirect()"><i class="ri-user-line"></i></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import './css/Header.css';
import { useRuntimeConfig } from 'nuxt/app';

const configs = useRuntimeConfig();

const redirect = () => {
    const dash = useRuntimeConfig().public["ADMIN_DASH"]
    window.location.href = dash as string;
}

const home = () => {
    window.location.href = "/";
}
</script>