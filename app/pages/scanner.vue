<template>
    <Dashboard />
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app';
import Dashboard from './components/scanner/Dashboard.vue';

useHead({
  title: 'Ticket Scanner - PBL'
})

</script>