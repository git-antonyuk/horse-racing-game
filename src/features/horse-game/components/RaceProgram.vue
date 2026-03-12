<script setup lang="ts">
import type { Horse, Round } from '@/features/horse-game/types'
import { RoundProgramTable } from '@/features/horse-game/components'

type RaceProgramProps = {
  schedule: Round[]
  horses: Horse[]
}

defineProps<RaceProgramProps>()
</script>

<template>
  <div class="race-program">
    <h3 class="text-lg font-semibold mb-2">
      Program
    </h3>
    <div v-if="schedule.length > 0" class="overflow-y-auto max-h-[500px]">
      <RoundProgramTable
        v-for="round in schedule"
        :key="round.roundNumber"
        :round="round"
        :horses="horses"
      />
    </div>
    <div v-else class="text-surface-400 text-sm">
      No program generated yet
    </div>
  </div>
</template>
