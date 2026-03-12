<script lang="ts">
import type { Horse, Round } from '@/features/horse-game/types'
import { RoundResultTable } from '@/features/horse-game/components'

export type RaceResultsProps = {
  completedRounds: Round[]
  horses: Horse[]
}
</script>

<script setup lang="ts">
defineProps<RaceResultsProps>()
</script>

<template>
  <div class="race-results">
    <h3 class="text-lg font-semibold mb-2">
      Results
    </h3>
    <div v-if="completedRounds.length > 0" class="overflow-y-auto max-h-[500px]">
      <RoundResultTable
        v-for="round in completedRounds"
        :key="round.roundNumber"
        :round="round"
        :horses="horses"
      />
    </div>
    <div v-else class="text-surface-400 text-sm">
      No results yet
    </div>
  </div>
</template>
