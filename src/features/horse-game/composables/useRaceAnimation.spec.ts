import { useRaceAnimation } from './useRaceAnimation'

describe('useRaceAnimation', () => {
  let rafCallbacks: Array<{ id: number, cb: (timestamp: number) => void }> = []
  let rafId = 0

  beforeEach(() => {
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
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function flushRAF(timestamp: number) {
    const cbs = [...rafCallbacks]
    rafCallbacks = []
    for (const entry of cbs) entry.cb(timestamp)
  }

  it('starts with isRunning false', () => {
    const { isRunning } = useRaceAnimation()
    expect(isRunning.value).toBe(false)
  })

  it('sets isRunning to true after start', () => {
    const { isRunning, start } = useRaceAnimation()
    const tickFn = (elapsed: number) => ({ positions: { 1: Math.min(elapsed / 5000, 1) } })

    start(tickFn, 5000)
    expect(isRunning.value).toBe(true)
  })

  it('calls tick function on each frame', () => {
    const { start } = useRaceAnimation()
    const tickFn = vi.fn((elapsed: number) => ({ positions: { 1: Math.min(elapsed / 5000, 1) } }))

    start(tickFn, 5000)
    // First frame sets startTime
    flushRAF(1000)
    expect(tickFn).toHaveBeenCalledWith(0) // elapsed = 1000 - 1000 = 0

    // Second frame
    flushRAF(2000)
    expect(tickFn).toHaveBeenCalledWith(1000) // elapsed = 2000 - 1000 = 1000
  })

  it('updates progress ref', () => {
    const { progress, start } = useRaceAnimation()
    const tickFn = (elapsed: number) => ({ positions: { 1: Math.min(elapsed / 5000, 1) } })

    start(tickFn, 5000)
    flushRAF(1000) // startTime = 1000, elapsed = 0
    flushRAF(3500) // elapsed = 2500

    expect(progress.value.positions[1]).toBe(0.5)
  })

  it('calls onComplete when duration is reached', () => {
    const { start } = useRaceAnimation()
    const onComplete = vi.fn()
    const tickFn = (elapsed: number) => ({ positions: { 1: Math.min(elapsed / 5000, 1) } })

    start(tickFn, 5000, onComplete)
    flushRAF(0) // startTime = 0, elapsed = 0
    flushRAF(5000) // elapsed = 5000

    expect(onComplete).toHaveBeenCalledOnce()
  })

  it('stops requesting frames after completion', () => {
    const { isRunning, start } = useRaceAnimation()
    const tickFn = (elapsed: number) => ({ positions: { 1: Math.min(elapsed / 1000, 1) } })

    start(tickFn, 1000)
    flushRAF(0) // startTime = 0
    flushRAF(1000) // elapsed = 1000 >= duration

    expect(isRunning.value).toBe(false)
    expect(rafCallbacks).toHaveLength(0)
  })

  it('pause stops animation', () => {
    const { isRunning, start, pause } = useRaceAnimation()
    const tickFn = (elapsed: number) => ({ positions: { 1: Math.min(elapsed / 5000, 1) } })

    start(tickFn, 5000)
    flushRAF(0)
    pause()

    expect(isRunning.value).toBe(false)
  })

  it('resume continues animation after pause', () => {
    const { isRunning, start, pause, resume } = useRaceAnimation()
    const tickFn = (elapsed: number) => ({ positions: { 1: Math.min(elapsed / 5000, 1) } })

    start(tickFn, 5000)
    flushRAF(0)
    pause()
    resume()

    expect(isRunning.value).toBe(true)
  })

  it('stop resets everything', () => {
    const { isRunning, progress, start, stop } = useRaceAnimation()
    const tickFn = (elapsed: number) => ({ positions: { 1: Math.min(elapsed / 5000, 1) } })

    start(tickFn, 5000)
    flushRAF(0)
    flushRAF(2000)
    stop()

    expect(isRunning.value).toBe(false)
    expect(progress.value).toEqual({ positions: {} })
  })
})
