<script setup lang="ts">
import type { Horse } from '@/features/horse-game/types'
import { computed } from 'vue'
import HorseIcon, { HORSE_ICON_SIZE } from '@/features/horse-game/components/HorseIcon.vue'

type RaceTrackLaneProps = {
  horse: Horse
  progress: number
}

const { progress, horse } = defineProps<RaceTrackLaneProps>()

const BOUNCE_AMPLITUDE = 3
const BOUNCE_CYCLES = 10

const transformStyle = computed<string>(() => {
  const bounceY = Math.sin(progress * Math.PI * BOUNCE_CYCLES) * -BOUNCE_AMPLITUDE
  return `translateY(${bounceY}px)`
})

const leftStyle = computed<string>(() =>
  `calc(${progress * 100}% - ${progress * HORSE_ICON_SIZE}px)`,
)
</script>

<template>
  <div class="race-lane flex items-center h-10 border-b border-surface-200 dark:border-surface-700 relative">
    <div class="lane-name w-28 text-xs truncate px-2 shrink-0" :title="`Power: ${horse.condition}`">
      {{ horse.name }} {{ horse.condition }}
    </div>
    <div class="lane-track flex-1 relative h-full">
      <div
        class="horse-runner absolute top-0 h-full flex items-center"
        :style="{
          left: leftStyle,
          transform: transformStyle,
        }"
      >
        <HorseIcon :color="horse.color" />
      </div>
    </div>
  </div>
</template>
