<script setup lang="ts">
import type { Horse } from '@/features/horse-game/types'
import { toRef } from 'vue'
import HorseIcon from '@/features/horse-game/components/HorseIcon.vue'
import { useRaceTrackLane } from './useRaceTrackLane'

type RaceTrackLaneProps = {
  horse: Horse
  progress: number
}

const props = defineProps<RaceTrackLaneProps>()

const { transformStyle } = useRaceTrackLane(toRef(() => props.progress))
</script>

<template>
  <div data-test="race-lane" class="race-lane flex items-center h-10 border-b border-surface-200 dark:border-surface-700 relative">
    <div class="lane-name w-28 text-xs truncate px-2 shrink-0" :title="`Power: ${horse.condition}`">
      {{ horse.name }} {{ horse.condition }}
    </div>
    <div class="lane-track flex-1 relative h-full @container">
      <div
        class="horse-runner absolute left-0 top-0 h-full flex items-center will-change-transform"
        :style="{
          transform: transformStyle,
        }"
      >
        <HorseIcon :color="horse.color" />
      </div>
    </div>
  </div>
</template>
