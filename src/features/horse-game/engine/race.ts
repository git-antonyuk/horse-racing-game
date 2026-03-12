import type { Horse, RaceProgress, Round, RoundEntry } from '@/features/horse-game/types'
import { BASE_DISTANCE, RACE_DURATION_MS, STAGGER_MS } from '@/features/horse-game/engine/constants'

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

function distanceScale(distance: number): number {
  return distance / BASE_DISTANCE
}

export function createTickFunction(
  results: RoundEntry[],
  distance: number,
): (elapsedMs: number) => RaceProgress {
  const scale = distanceScale(distance)
  const scaledBase = RACE_DURATION_MS * scale
  const scaledStagger = STAGGER_MS * scale

  // Pre-compute finish time for each horse based on position
  const finishTimes = new Map<number, number>()
  for (const entry of results) {
    const finishTime = scaledBase + (entry.position - 1) * scaledStagger
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

export function getTotalRaceDuration(entryCount: number, distance: number): number {
  const scale = distanceScale(distance)
  return RACE_DURATION_MS * scale + (entryCount - 1) * STAGGER_MS * scale
}
