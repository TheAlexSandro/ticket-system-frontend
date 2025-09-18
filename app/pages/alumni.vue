<template>
    <Alumni />
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app';
import Alumni from './components/alumni/Alumni.vue';

useHead({
  title: 'Periksa Daftar Alumni - PBL'
})

</script>