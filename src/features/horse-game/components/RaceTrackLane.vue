<script setup lang="ts">
import type { Horse } from '@/features/horse-game/types'
import { HorseIcon } from '@/features/horse-game/components'

type RaceTrackLaneProps = {
  horse: Horse
  progress: number
}

defineProps<RaceTrackLaneProps>()
</script>

<template>
  <div class="race-lane flex items-center h-10 border-b border-surface-200 dark:border-surface-700 relative">
    <div class="lane-name w-28 text-xs truncate px-2 shrink-0">
      {{ horse.name }} {{ horse.condition }}
    </div>
    <div class="lane-track flex-1 relative h-full">
      <div
        class="horse-runner absolute top-0 h-full flex items-center"
        :style="{ left: `${progress * 100}%` }"
      >
        <HorseIcon :color="horse.color" />
      </div>
    </div>
  </div>
</template>
