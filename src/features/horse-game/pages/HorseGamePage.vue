<script setup lang="ts">
import { watch } from 'vue'
import { HorseGameControls, HorseList, RaceProgram, RaceResults, RaceTrack } from '@/features/horse-game/components'
import { useRaceAnimation } from '@/features/horse-game/composables/useRaceAnimation'
import { AUTO_ADVANCE_DELAY_MS } from '@/features/horse-game/engine/constants'
import { getTotalRaceDuration } from '@/features/horse-game/engine/race'
import { useHorseGameStore } from '@/features/horse-game/stores/useHorseGameStore'

const store = useHorseGameStore()
const animation = useRaceAnimation()

// Sync animation progress to store
watch(() => animation.progress.value, (progress) => {
  store.updateProgress(progress)
}, { deep: true })

function onGenerate() {
  animation.stop()
  store.generateProgram()
}

function onStartPause() {
  if (store.phase === 'running') {
    animation.pause()
    store.setPhase('paused')
  }
  else if (store.phase === 'paused') {
    animation.resume()
    store.setPhase('running')
  }
  else if (store.phase === 'ready') {
    startRound()
  }
}

function startRound() {
  const tickFn = store.prepareRound()
  const entryCount = store.currentRound?.entries.length ?? 10
  const duration = getTotalRaceDuration(entryCount)

  animation.start(tickFn, duration, () => {
    store.finalizeRound()

    if (store.phase === 'ready') {
      // Auto-advance to next round
      setTimeout(() => {
        if (store.phase === 'ready') {
          startRound()
        }
      }, AUTO_ADVANCE_DELAY_MS)
    }
  })
}
</script>

<template>
  <div class="horse-game-page p-4">
    <h1 class="text-xl font-bold mb-4">
      Horse Racing Game
    </h1>
    <div class="sticky top-0 z-10 bg-surface-50 dark:bg-surface-900">
      <HorseGameControls
        :phase="store.phase"
        class="mb-4"
        @generate="onGenerate"
        @start-pause="onStartPause"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Left: Horse List -->
      <div class="lg:col-span-2">
        <HorseList :horses="store.horses" />
      </div>

      <!-- Center: Race Track -->
      <div class="lg:col-span-6">
        <RaceTrack
          :horses="store.currentRoundHorses"
          :progress="store.raceProgress"
          :round-number="store.currentRound?.roundNumber ?? null"
          :distance="store.currentRound?.distance ?? null"
        />
      </div>

      <!-- Right: Program + Results -->
      <div class="lg:col-span-2 space-y-4">
        <RaceProgram
          :schedule="store.schedule"
          :horses="store.horses"
        />
      </div>
      <div class="lg:col-span-2">
        <RaceResults
          :completed-rounds="store.completedRounds"
          :horses="store.horses"
        />
      </div>
    </div>
  </div>
</template>
