import type { Horse, Round, RoundEntry } from '../types'
import { HORSE_COLORS, HORSE_NAMES, HORSES_COUNT, HORSES_PER_ROUND, ROUND_DISTANCES, ROUNDS_COUNT } from './constants'

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }
  return shuffled
}

export function generateHorses(): Horse[] {
  const shuffledNames = shuffleArray(HORSE_NAMES)
  const shuffledColors = shuffleArray(HORSE_COLORS)

  return Array.from({ length: HORSES_COUNT }, (_, i) => ({
    id: i + 1,
    name: shuffledNames[i]!,
    color: shuffledColors[i]!,
    condition: Math.floor(Math.random() * 100) + 1,
  }))
}

export function generateSchedule(horses: Horse[]): Round[] {
  return Array.from({ length: ROUNDS_COUNT }, (_, i) => {
    const shuffled = shuffleArray(horses)
    const selected = shuffled.slice(0, HORSES_PER_ROUND)

    const entries: RoundEntry[] = selected.map(horse => ({
      horseId: horse.id,
      position: 0,
    }))

    return {
      roundNumber: i + 1,
      distance: ROUND_DISTANCES[i]!,
      entries,
    }
  })
}
