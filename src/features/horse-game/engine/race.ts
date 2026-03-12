import type { Horse, RaceProgress, Round, RoundEntry } from '../types'
import { RACE_DURATION_MS, STAGGER_MS } from './constants'

export function simulateRace(round: Round, horses: Horse[]): RoundEntry[] {
  const horseMap = new Map(horses.map(h => [h.id, h]))

  const timed = round.entries.map((entry) => {
    const horse = horseMap.get(entry.horseId)!
    const baseFactor = 1000
    const jitter = (Math.random() - 0.5) * 400
    const raceTime = (baseFactor / horse.condition) * round.distance + jitter
    return { horseId: entry.horseId, raceTime }
  })

  timed.sort((a, b) => a.raceTime - b.raceTime)

  return timed.map((t, i) => ({
    horseId: t.horseId,
    position: i + 1,
  }))
}

function easeOut(t: number): number {
  return 1 - (1 - t) ** 2
}

export function createTickFunction(
  results: RoundEntry[],
): (elapsedMs: number) => RaceProgress {
  // Pre-compute finish time for each horse based on position
  const finishTimes = new Map<number, number>()
  for (const entry of results) {
    const finishTime = RACE_DURATION_MS + (entry.position - 1) * STAGGER_MS
    finishTimes.set(entry.horseId, finishTime)
  }

  return (elapsedMs: number): RaceProgress => {
    const positions: Record<number, number> = {}

    for (const entry of results) {
      const finishTime = finishTimes.get(entry.horseId)!
      const rawProgress = Math.min(elapsedMs / finishTime, 1)
      positions[entry.horseId] = easeOut(rawProgress)
    }

    return { positions }
  }
}

export function getTotalRaceDuration(entryCount: number): number {
  return RACE_DURATION_MS + (entryCount - 1) * STAGGER_MS
}
