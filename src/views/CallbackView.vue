<template>
  <div class="d-flex justify-content-center" style="min-height: 100vh;">
    <h1 class="align-content-center text-dark">Loading... <i class="fs-1 pi pi-spinner pi-spin"></i>
    </h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { handleCallback } from '../services/auth';
import global from '@/stores/global';
import { useToast } from 'primevue';
import router from '@/router';

const toast = useToast();
onMounted(async () => {
  try {
    await handleCallback();
    router.push('/');
  } catch (error) {
    console.error('Error handling callback:', error);
    global.ui.notification.error(toast, "Falha no login");
    router.push('/'); // Redirect to login on error
  }
});

</script>
