<template>
    <Dashboard />
</template>

<script setup lang="ts">
import Dashboard from '../components/Dashboard.vue';
import { useHead } from 'nuxt/app';

useHead({
  title: 'Ticket Scanner - PBL',
  link: [
    { rel: 'icon', type: 'image/png', href: '/image.png' }
  ]
})

</script>