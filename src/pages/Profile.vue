<template>
  <div>
    PROFILE:
    <pre>
      {{ authStore.getAuthUser }}
    </pre>
  </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/store/auth.ts'

const authStore = useAuthStore()
</script>
