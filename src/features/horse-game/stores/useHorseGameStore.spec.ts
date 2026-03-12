import { createPinia, setActivePinia } from 'pinia'
import { useHorseGameStore } from './useHorseGameStore'

describe('useHorseGameStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('initial state', () => {
    it('starts in idle phase with empty data', () => {
      const store = useHorseGameStore()
      expect(store.phase).toBe('idle')
      expect(store.horses).toEqual([])
      expect(store.schedule).toEqual([])
      expect(store.currentRoundIndex).toBe(0)
    })
  })

  describe('generateProgram', () => {
    it('populates horses and schedule', () => {
      const store = useHorseGameStore()
      store.generateProgram()

      expect(store.horses).toHaveLength(20)
      expect(store.schedule).toHaveLength(6)
      expect(store.phase).toBe('ready')
      expect(store.currentRoundIndex).toBe(0)
    })

    it('resets state when called again', () => {
      const store = useHorseGameStore()
      store.generateProgram()
      const firstHorses = [...store.horses]

      store.generateProgram()
      expect(store.horses).toHaveLength(20)
      expect(store.currentRoundIndex).toBe(0)
      // Names should be reshuffled (extremely unlikely to match)
      expect(store.horses.map(h => h.name)).not.toEqual(firstHorses.map(h => h.name))
    })
  })

  describe('currentRound', () => {
    it('returns the first round after generation', () => {
      const store = useHorseGameStore()
      store.generateProgram()

      expect(store.currentRound).not.toBeNull()
      expect(store.currentRound!.roundNumber).toBe(1)
    })

    it('returns null when no schedule', () => {
      const store = useHorseGameStore()
      expect(store.currentRound).toBeNull()
    })
  })

  describe('currentRoundHorses', () => {
    it('returns Horse objects for current round entries', () => {
      const store = useHorseGameStore()
      store.generateProgram()

      expect(store.currentRoundHorses).toHaveLength(10)
      for (const horse of store.currentRoundHorses) {
        expect(horse).toHaveProperty('id')
        expect(horse).toHaveProperty('name')
        expect(horse).toHaveProperty('color')
        expect(horse).toHaveProperty('condition')
      }
    })
  })

  describe('prepareRound', () => {
    it('returns a tick function and sets phase to running', () => {
      const store = useHorseGameStore()
      store.generateProgram()

      const tickFn = store.prepareRound()
      expect(typeof tickFn).toBe('function')
      expect(store.phase).toBe('running')
    })

    it('tick function returns race progress', () => {
      const store = useHorseGameStore()
      store.generateProgram()

      const tickFn = store.prepareRound()
      const progress = tickFn(1000)
      expect(progress).toHaveProperty('positions')
      expect(Object.keys(progress.positions)).toHaveLength(10)
    })
  })

  describe('finalizeRound', () => {
    it('writes results to round entries and advances', () => {
      const store = useHorseGameStore()
      store.generateProgram()
      store.prepareRound()
      store.finalizeRound()

      const round1 = store.schedule[0]
      const hasResults = round1!.entries.every(e => e.position > 0)
      expect(hasResults).toBe(true)
      expect(store.currentRoundIndex).toBe(1)
      expect(store.phase).toBe('ready')
    })

    it('sets phase to finished on last round', () => {
      const store = useHorseGameStore()
      store.generateProgram()

      // Run through all 6 rounds
      for (let i = 0; i < 6; i++) {
        store.prepareRound()
        store.finalizeRound()
      }

      expect(store.phase).toBe('finished')
    })
  })

  describe('completedRounds', () => {
    it('returns empty initially', () => {
      const store = useHorseGameStore()
      store.generateProgram()
      expect(store.completedRounds).toHaveLength(0)
    })

    it('returns completed rounds after finalization', () => {
      const store = useHorseGameStore()
      store.generateProgram()
      store.prepareRound()
      store.finalizeRound()

      expect(store.completedRounds).toHaveLength(1)
    })
  })

  describe('isLastRound', () => {
    it('is false at start', () => {
      const store = useHorseGameStore()
      store.generateProgram()
      expect(store.isLastRound).toBe(false)
    })

    it('is true on round 6', () => {
      const store = useHorseGameStore()
      store.generateProgram()

      for (let i = 0; i < 5; i++) {
        store.prepareRound()
        store.finalizeRound()
      }

      expect(store.isLastRound).toBe(true)
    })
  })

  describe('setPhase', () => {
    it('updates the phase', () => {
      const store = useHorseGameStore()
      store.setPhase('paused')
      expect(store.phase).toBe('paused')
    })
  })

  describe('updateProgress', () => {
    it('updates race progress', () => {
      const store = useHorseGameStore()
      const progress = { positions: { 1: 0.5, 2: 0.3 } }
      store.updateProgress(progress)
      expect(store.raceProgress).toEqual(progress)
    })
  })

  describe('reset', () => {
    it('resets all state to initial', () => {
      const store = useHorseGameStore()
      store.generateProgram()
      store.reset()

      expect(store.phase).toBe('idle')
      expect(store.horses).toEqual([])
      expect(store.schedule).toEqual([])
      expect(store.currentRoundIndex).toBe(0)
    })
  })
})
