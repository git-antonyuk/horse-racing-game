import type { GamePhase, Horse, RaceProgress, Round, RoundEntry } from '../types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { generateHorses, generateSchedule } from '../engine/generate'
import { createTickFunction, simulateRace } from '../engine/race'

export const useHorseGameStore = defineStore('horseGame', () => {
  const horses = ref<Horse[]>([])
  const schedule = ref<Round[]>([])
  const currentRoundIndex = ref(0)
  const phase = ref<GamePhase>('idle')
  const raceProgress = ref<RaceProgress>({ positions: {} })
  const raceElapsedMs = ref(0)
  const precomputedResults = ref<RoundEntry[]>([])

  const currentRound = computed(() => schedule.value[currentRoundIndex.value] ?? null)

  const completedRounds = computed(() =>
    schedule.value.filter(r => r.entries.some(e => e.position > 0)),
  )

  const currentRoundHorses = computed(() => {
    const round = currentRound.value
    if (!round)
      return []
    const horseMap = new Map(horses.value.map(h => [h.id, h]))
    return round.entries.map(e => horseMap.get(e.horseId)!).filter(Boolean)
  })

  const isLastRound = computed(() => currentRoundIndex.value >= schedule.value.length - 1)

  function generateProgram() {
    const newHorses = generateHorses()
    horses.value = newHorses
    schedule.value = generateSchedule(newHorses)
    currentRoundIndex.value = 0
    raceProgress.value = { positions: {} }
    raceElapsedMs.value = 0
    precomputedResults.value = []
    phase.value = 'ready'
  }

  function prepareRound(): (elapsedMs: number) => RaceProgress {
    const round = currentRound.value!
    const results = simulateRace(round, horses.value)
    precomputedResults.value = results

    const tickFn = createTickFunction(results, round.distance)
    phase.value = 'running'
    raceProgress.value = { positions: {} }
    return tickFn
  }

  function finalizeRound() {
    const round = currentRound.value!
    round.finishTimeMs = raceElapsedMs.value

    if (precomputedResults.value.length > 0) {
      round.entries = precomputedResults.value
      precomputedResults.value = []
    }

    if (isLastRound.value) {
      phase.value = 'finished'
    }
    else {
      currentRoundIndex.value++
      phase.value = 'ready'
    }
    raceProgress.value = { positions: {} }
    raceElapsedMs.value = 0
  }

  function setPhase(newPhase: GamePhase) {
    phase.value = newPhase
  }

  function updateElapsedMs(ms: number) {
    raceElapsedMs.value = ms
  }

  function updateProgress(progress: RaceProgress) {
    raceProgress.value = progress
  }

  function reset() {
    horses.value = []
    schedule.value = []
    currentRoundIndex.value = 0
    phase.value = 'idle'
    raceProgress.value = { positions: {} }
    raceElapsedMs.value = 0
    precomputedResults.value = []
  }

  return {
    horses,
    schedule,
    currentRoundIndex,
    phase,
    raceProgress,
    raceElapsedMs,
    currentRound,
    completedRounds,
    currentRoundHorses,
    isLastRound,
    generateProgram,
    prepareRound,
    finalizeRound,
    setPhase,
    updateElapsedMs,
    updateProgress,
    reset,
  }
})
