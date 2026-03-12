export type Horse = {
  id: number
  name: string
  color: string
  condition: number
}

export type RoundEntry = {
  horseId: number
  position: number // 0 = unfinished
}

export type Round = {
  roundNumber: number
  distance: number
  entries: RoundEntry[]
  finishTimeMs?: number
}

export type RaceProgress = {
  positions: Record<number, number> // horseId → 0.0..1.0
}

export type GamePhase = 'idle' | 'ready' | 'running' | 'paused' | 'finished'
