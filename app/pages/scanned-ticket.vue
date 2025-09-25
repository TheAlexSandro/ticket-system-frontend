<template>
    <ScannedTicket />
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app';
import ScannedTicket from './components/tickets/ScannedTicket.vue';

useHead({
  title: 'Tiket Dipindai'
})

</script>