<script setup lang="ts">
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen bg-surface-50 dark:bg-surface-900">
    <AppHeader />

    <main class="flex-1 overflow-auto">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
