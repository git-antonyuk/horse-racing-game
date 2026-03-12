import { createPinia, setActivePinia } from 'pinia'
import { useHorseGameStore } from '@/features/horse-game/stores/useHorseGameStore'
import { useHorseGamePage } from './useHorseGamePage'

describe('useHorseGamePage', () => {
  let rafCallbacks: Array<{ id: number, cb: (timestamp: number) => void }> = []
  let rafId = 0

  beforeEach(() => {
    setActivePinia(createPinia())
    rafCallbacks = []
    rafId = 0

    vi.stubGlobal('requestAnimationFrame', (cb: (timestamp: number) => void) => {
      const id = ++rafId
      rafCallbacks.push({ id, cb })
      return id
    })

    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      rafCallbacks = rafCallbacks.filter(entry => entry.id !== id)
    })

    vi.stubGlobal('performance', { now: () => Date.now() })
    vi.useFakeTimers({ toFake: ['setTimeout'] })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  /**
   * Run one RAF frame at the given timestamp.
   * Returns true if there are still pending callbacks after this frame.
   */
  function tickRaf(timestamp: number): boolean {
    const batch = [...rafCallbacks]
    rafCallbacks = []
    for (const entry of batch) {
      entry.cb(timestamp)
    }
    return rafCallbacks.length > 0
  }

  /** Run two frames: first at t=0 to set startTime, then at endTimestamp to complete. */
  function completeAnimation() {
    tickRaf(0) // sets startTime = 0
    tickRaf(999_999) // elapsed >> duration → triggers onComplete
  }

  describe('onGenerate', () => {
    it('generates a new program in the store', () => {
      const { store, onGenerate } = useHorseGamePage()
      onGenerate()

      expect(store.horses).toHaveLength(20)
      expect(store.schedule).toHaveLength(6)
      expect(store.phase).toBe('ready')
    })

    it('resets when called again', () => {
      const { store, onGenerate } = useHorseGamePage()
      onGenerate()
      const firstHorses = store.horses.map(h => h.name)

      onGenerate()
      expect(store.horses).toHaveLength(20)
      expect(store.currentRoundIndex).toBe(0)
      expect(store.horses.map(h => h.name)).not.toEqual(firstHorses)
    })
  })

  describe('onStartPause', () => {
    it('starts the race when phase is ready', () => {
      const { store, onGenerate, onStartPause } = useHorseGamePage()
      onGenerate()
      onStartPause()

      expect(store.phase).toBe('running')
    })

    it('pauses the race when phase is running', () => {
      const { store, onGenerate, onStartPause } = useHorseGamePage()
      onGenerate()
      onStartPause() // start
      onStartPause() // pause

      expect(store.phase).toBe('paused')
    })

    it('resumes the race when phase is paused', () => {
      const { store, onGenerate, onStartPause } = useHorseGamePage()
      onGenerate()
      onStartPause() // start
      onStartPause() // pause
      onStartPause() // resume

      expect(store.phase).toBe('running')
    })

    it('does nothing when phase is idle', () => {
      const store = useHorseGameStore()
      const { onStartPause } = useHorseGamePage()
      onStartPause()

      expect(store.phase).toBe('idle')
    })
  })

  describe('race completion', () => {
    it('finalizes the round when animation completes', () => {
      const { store, onGenerate, onStartPause } = useHorseGamePage()
      onGenerate()
      onStartPause() // starts the race

      expect(store.phase).toBe('running')
      expect(store.currentRoundIndex).toBe(0)

      // Flush RAF with a timestamp past the total duration to trigger onComplete
      completeAnimation()

      expect(store.currentRoundIndex).toBe(1)
      expect(store.schedule[0]!.entries.every(e => e.position > 0)).toBe(true)
    })

    it('auto-advances to the next round after completion', () => {
      const { store, onGenerate, onStartPause } = useHorseGamePage()
      onGenerate()
      onStartPause()

      // Complete first round
      completeAnimation()

      expect(store.phase).toBe('ready')
      expect(store.currentRoundIndex).toBe(1)

      // AUTO_ADVANCE_DELAY_MS is 0, so advance timers to trigger setTimeout
      vi.advanceTimersByTime(0)

      // Auto-advance should have started the next round
      expect(store.phase).toBe('running')
      expect(store.currentRoundIndex).toBe(1)
    })

    it('sets phase to finished after the last round completes', () => {
      const { store, onGenerate, onStartPause } = useHorseGamePage()
      onGenerate()

      // Run through all 6 rounds
      for (let i = 0; i < 6; i++) {
        if (i === 0) {
          onStartPause()
        }
        else {
          // Auto-advance triggers startRound via setTimeout
          vi.advanceTimersByTime(0)
        }
        completeAnimation()
      }

      expect(store.phase).toBe('finished')
      // Index stays at 5 (last round) since finalizeRound doesn't increment on the last round
      expect(store.currentRoundIndex).toBe(5)
    })
  })
})
