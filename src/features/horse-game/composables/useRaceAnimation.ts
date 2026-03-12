import type { RaceProgress } from '../types'
import { ref } from 'vue'

export function useRaceAnimation() {
  const isRunning = ref(false)
  const progress = ref<RaceProgress>({ positions: {} })

  let animationFrameId: number | null = null
  let startTime: number | null = null
  let pausedElapsed = 0
  let tickFn: ((elapsedMs: number) => RaceProgress) | null = null
  let onCompleteCb: (() => void) | null = null
  let totalDuration = 0

  function loop(timestamp: number) {
    if (startTime === null)
      startTime = timestamp
    const elapsed = pausedElapsed + (timestamp - startTime)

    if (tickFn) {
      progress.value = tickFn(elapsed)
    }

    if (elapsed >= totalDuration) {
      isRunning.value = false
      animationFrameId = null
      if (onCompleteCb)
        onCompleteCb()
      return
    }

    animationFrameId = requestAnimationFrame(loop)
  }

  function start(
    fn: (elapsedMs: number) => RaceProgress,
    duration: number,
    onComplete?: () => void,
  ) {
    tickFn = fn
    totalDuration = duration
    onCompleteCb = onComplete ?? null
    pausedElapsed = 0
    startTime = null
    isRunning.value = true
    animationFrameId = requestAnimationFrame(loop)
  }

  function pause() {
    if (!isRunning.value || animationFrameId === null)
      return
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null

    // Calculate elapsed so far
    if (startTime !== null) {
      pausedElapsed += performance.now() - startTime
    }
    startTime = null
    isRunning.value = false
  }

  function resume() {
    if (isRunning.value || !tickFn)
      return
    startTime = null
    isRunning.value = true
    animationFrameId = requestAnimationFrame(loop)
  }

  function stop() {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    isRunning.value = false
    tickFn = null
    onCompleteCb = null
    startTime = null
    pausedElapsed = 0
    progress.value = { positions: {} }
  }

  return {
    isRunning,
    progress,
    start,
    pause,
    resume,
    stop,
  }
}
