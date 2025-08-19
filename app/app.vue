<template>
  <LoadingScreen v-if="isLoading" />
  <template v-else>
    <NuxtLayout>
      <Headers />
      <section class="main">
        <RouterView />
      </section>
    </NuxtLayout>

  </template>
</template>

<script setup lang="ts">
import '~/css/style.css';
import LoadingScreen from './components/LoadingScreen.vue';
import Headers from './components/Headers.vue';
import { ref, onMounted } from 'vue';

const isLoading = ref(true);

onMounted(() => {
  isLoading.value = !isLoading;
})
</script>