<script setup lang="ts">
import type { Horse, RaceProgress } from '@/features/horse-game/types'
import { RaceTrackLane } from '@/features/horse-game/components'

type RaceTrackProps = {
  horses: Horse[]
  progress: RaceProgress
  roundNumber: number | null
  distance: number | null
}
defineProps<RaceTrackProps>()
</script>

<template>
  <div class="race-track">
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-lg font-semibold">
        Race Track
      </h3>
      <span v-if="roundNumber" class="text-sm text-surface-500">
        Round {{ roundNumber }} — {{ distance }}m
      </span>
    </div>
    <div class="track-container border border-surface-300 dark:border-surface-600 rounded-lg overflow-hidden relative">
      <template v-if="horses.length > 0">
        <RaceTrackLane
          v-for="horse in horses"
          :key="horse.id"
          :horse="horse"
          :progress="progress.positions[horse.id] ?? 0"
        />
      </template>
      <div v-else class="p-8 text-center text-surface-400">
        Generate a program to start racing
      </div>
      <!-- Finish line -->
      <div
        v-if="horses.length > 0"
        class="absolute right-0 top-0 bottom-0 w-1 bg-red-500"
      />
    </div>
  </div>
</template>
