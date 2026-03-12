import type { Horse, Round } from '../types'
import { BASE_DISTANCE, RACE_DURATION_MS, STAGGER_MS } from './constants'
import { createTickFunction, getTotalRaceDuration, simulateRace } from './race'

function createTestHorses(): Horse[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Horse ${i + 1}`,
    color: `#${String(i).padStart(6, '0')}`,
    condition: (i + 1) * 10, // 10, 20, ..., 100
  }))
}

function createTestRound(horses: Horse[]): Round {
  return {
    roundNumber: 1,
    distance: 1200,
    entries: horses.map(h => ({ horseId: h.id, position: 0 })),
  }
}

describe('simulateRace', () => {
  const horses = createTestHorses()
  const round = createTestRound(horses)

  it('returns results for all 10 horses', () => {
    const results = simulateRace(round, horses)
    expect(results).toHaveLength(10)
  })

  it('assigns positions 1 through 10', () => {
    const results = simulateRace(round, horses)
    const positions = results.map(r => r.position).sort((a, b) => a - b)
    expect(positions).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('returns valid horse IDs', () => {
    const results = simulateRace(round, horses)
    const validIds = new Set(horses.map(h => h.id))
    for (const r of results) {
      expect(validIds.has(r.horseId)).toBe(true)
    }
  })

  it('favors higher-condition horses for top positions (statistical)', () => {
    // Run many races and check that horse 10 (condition=100) wins more often than horse 1 (condition=10)
    let highCondWins = 0
    let lowCondWins = 0
    const runs = 200

    for (let i = 0; i < runs; i++) {
      const results = simulateRace(round, horses)
      const winner = results.find(r => r.position === 1)!
      if (winner.horseId === 10)
        highCondWins++
      if (winner.horseId === 1)
        lowCondWins++
    }

    expect(highCondWins).toBeGreaterThan(lowCondWins)
  })
})

describe('createTickFunction', () => {
  const horses = createTestHorses()
  const round = createTestRound(horses)

  it('returns a function', () => {
    const results = simulateRace(round, horses)
    const tickFn = createTickFunction(results, round.distance)
    expect(typeof tickFn).toBe('function')
  })

  it('returns all zeros at elapsed=0', () => {
    const results = simulateRace(round, horses)
    const tickFn = createTickFunction(results, round.distance)
    const progress = tickFn(0)

    for (const horseId of results.map(r => r.horseId)) {
      expect(progress.positions[horseId]).toBe(0)
    }
  })

  it('returns all 1.0 after total duration', () => {
    const results = simulateRace(round, horses)
    const tickFn = createTickFunction(results, round.distance)
    const totalDuration = getTotalRaceDuration(results.length, round.distance)
    const progress = tickFn(totalDuration + 1000)

    for (const horseId of results.map(r => r.horseId)) {
      expect(progress.positions[horseId]).toBe(1)
    }
  })

  it('winner progresses faster than last place at midpoint', () => {
    const results = simulateRace(round, horses)
    const tickFn = createTickFunction(results, round.distance)
    const midpoint = RACE_DURATION_MS / 2

    const progress = tickFn(midpoint)
    const winnerId = results.find(r => r.position === 1)!.horseId
    const lastId = results.find(r => r.position === 10)!.horseId

    expect(progress.positions[winnerId]).toBeGreaterThan(progress.positions[lastId]!)
  })

  it('progress is monotonically increasing', () => {
    const results = simulateRace(round, horses)
    const tickFn = createTickFunction(results, round.distance)
    const horseId = results[0]!.horseId

    let prevProgress = 0
    for (let t = 0; t <= RACE_DURATION_MS + STAGGER_MS * 10; t += 100) {
      const progress = tickFn(t)
      expect(progress.positions[horseId]).toBeGreaterThanOrEqual(prevProgress)
      prevProgress = progress.positions[horseId]!
    }
  })
})

describe('getTotalRaceDuration', () => {
  it('calculates correct total duration for base distance', () => {
    expect(getTotalRaceDuration(10, BASE_DISTANCE)).toBe(RACE_DURATION_MS + 9 * STAGGER_MS)
  })

  it('returns base duration for single entry at base distance', () => {
    expect(getTotalRaceDuration(1, BASE_DISTANCE)).toBe(RACE_DURATION_MS)
  })

  it('scales duration with distance', () => {
    const longDistance = 2200
    const scale = longDistance / BASE_DISTANCE
    const expected = RACE_DURATION_MS * scale + 9 * STAGGER_MS * scale
    expect(getTotalRaceDuration(10, longDistance)).toBeCloseTo(expected)
  })
})
