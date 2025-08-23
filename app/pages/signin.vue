<template>
    <SignIn />
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app';
import SignIn from './components/auth/SignIn.vue';

useHead({
  title: 'Sign In - PBL'
})

</script>