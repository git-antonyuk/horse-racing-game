import { HORSES_COUNT, HORSES_PER_ROUND, ROUND_DISTANCES, ROUNDS_COUNT } from './constants'
import { generateHorses, generateSchedule } from './generate'

describe('generateHorses', () => {
  it('returns exactly 20 horses', () => {
    const horses = generateHorses()
    expect(horses).toHaveLength(HORSES_COUNT)
  })

  it('assigns unique IDs from 1 to 20', () => {
    const horses = generateHorses()
    const ids = horses.map(h => h.id)
    expect(ids).toEqual(Array.from({ length: 20 }, (_, i) => i + 1))
  })

  it('assigns unique names', () => {
    const horses = generateHorses()
    const names = new Set(horses.map(h => h.name))
    expect(names.size).toBe(HORSES_COUNT)
  })

  it('assigns unique colors', () => {
    const horses = generateHorses()
    const colors = new Set(horses.map(h => h.color))
    expect(colors.size).toBe(HORSES_COUNT)
  })

  it('assigns conditions between 1 and 100', () => {
    const horses = generateHorses()
    for (const horse of horses) {
      expect(horse.condition).toBeGreaterThanOrEqual(1)
      expect(horse.condition).toBeLessThanOrEqual(100)
      expect(Number.isInteger(horse.condition)).toBe(true)
    }
  })

  it('produces different orderings on subsequent calls', () => {
    const run1 = generateHorses().map(h => h.name)
    const run2 = generateHorses().map(h => h.name)
    // Extremely unlikely to be identical if shuffled
    expect(run1).not.toEqual(run2)
  })
})

describe('generateSchedule', () => {
  const horses = generateHorses()

  it('returns exactly 6 rounds', () => {
    const schedule = generateSchedule(horses)
    expect(schedule).toHaveLength(ROUNDS_COUNT)
  })

  it('assigns correct distances to each round', () => {
    const schedule = generateSchedule(horses)
    const distances = schedule.map(r => r.distance)
    expect(distances).toEqual(ROUND_DISTANCES)
  })

  it('assigns round numbers 1 through 6', () => {
    const schedule = generateSchedule(horses)
    const roundNumbers = schedule.map(r => r.roundNumber)
    expect(roundNumbers).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('selects 10 horses per round', () => {
    const schedule = generateSchedule(horses)
    for (const round of schedule) {
      expect(round.entries).toHaveLength(HORSES_PER_ROUND)
    }
  })

  it('selects only valid horse IDs', () => {
    const schedule = generateSchedule(horses)
    const validIds = new Set(horses.map(h => h.id))
    for (const round of schedule) {
      for (const entry of round.entries) {
        expect(validIds.has(entry.horseId)).toBe(true)
      }
    }
  })

  it('has no duplicate horses within a single round', () => {
    const schedule = generateSchedule(horses)
    for (const round of schedule) {
      const ids = round.entries.map(e => e.horseId)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('initializes all positions to 0 (unfinished)', () => {
    const schedule = generateSchedule(horses)
    for (const round of schedule) {
      for (const entry of round.entries) {
        expect(entry.position).toBe(0)
      }
    }
  })
})
