<script setup lang="ts">
import Button from 'primevue/button'
import { useDarkMode } from './composables/useDarkMode'

const { isDark, toggle } = useDarkMode()
</script>

<template>
  <header data-test="app-header" class="flex items-center justify-between px-6 py-3 border-b border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-800">
    <div class="flex items-center gap-3">
      <!-- PLACE FOR LOGO -->
    </div>

    <div class="flex items-center gap-2">
      <Button
        data-test="dark-mode-toggle"
        severity="secondary"
        text
        rounded
        aria-label="Toggle dark mode"
        @click="toggle"
      >
        <template #icon>
          <IconLucideSun v-if="isDark" />
          <IconLucideMoon v-else />
        </template>
      </Button>
    </div>
  </header>
</template>
