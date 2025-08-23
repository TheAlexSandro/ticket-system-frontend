<template>
    <AdminDashboard />
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app';
import AdminDashboard from './components/admin/AdminDashboard.vue';

useHead({
  title: 'Admin Dashboard - PBL'
})

</script>