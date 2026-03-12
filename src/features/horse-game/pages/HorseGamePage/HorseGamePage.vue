<script setup lang="ts">
import { HorseGameControls, HorseList, RaceProgram, RaceResults, RaceTrack } from '@/features/horse-game/components'
import { useHorseGamePage } from './useHorseGamePage'

const { store, onGenerate, onStartPause } = useHorseGamePage()
</script>

<template>
  <div class="horse-game-page p-4">
    <h1 data-test="page-title" class="text-xl font-bold mb-4">
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
