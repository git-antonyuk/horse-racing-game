<script setup lang="ts">
import Button from 'primevue/button'
import { useDarkMode } from './composables/useDarkMode'

const { isDark, toggle } = useDarkMode()
</script>

<template>
  <header class="flex items-center justify-between px-6 py-3 border-b border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-800">
    <div class="flex items-center gap-3">
      <!-- PLACE FOR LOGO -->
    </div>

    <div class="flex items-center gap-2">
      <Button
        :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
        severity="secondary"
        text
        rounded
        aria-label="Toggle dark mode"
        @click="toggle"
      />
    </div>
  </header>
</template>
