<template>
    <Dashboard />
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app';
import Dashboard from './components/index/Dashboard.vue';

useHead({
  title: 'Ticket Scanner - PBL'
})

</script>