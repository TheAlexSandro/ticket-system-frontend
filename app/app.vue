<template>
  <LoadingScreen v-if="isLoading" />
  <template v-else>
    <NuxtLayout>
      <Headers />
      <!-- PAGE RENDERING -->
      <NuxtPage />
    </NuxtLayout>
  </template>
</template>

<script setup lang="ts">
import './css/Global.css';
import LoadingScreen from './pages/components/global/LoadingScreen.vue';
import Headers from './pages/components/global/Headers.vue';
import { ref, onMounted } from 'vue';
import { useHead } from 'nuxt/app';
import { useSocket } from './composables/useSocket';
const socket = useSocket();

useHead({
  title: "Project Based Learning"
})

onMounted(() => {
  socket.on("refresh", (data) => {
    if (data['status'] == null) return;
    if (data['status']) {
      window.location.reload();
    }
  })
})

const isLoading = ref(true);

onMounted(() => {
  isLoading.value = !isLoading;
})
</script>