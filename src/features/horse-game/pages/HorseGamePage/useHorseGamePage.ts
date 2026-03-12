import { watch } from 'vue'
import { useRaceAnimation } from '@/features/horse-game/composables/useRaceAnimation'
import { AUTO_ADVANCE_DELAY_MS } from '@/features/horse-game/engine/constants'
import { getTotalRaceDuration } from '@/features/horse-game/engine/race'
import { useHorseGameStore } from '@/features/horse-game/stores/useHorseGameStore'

export function useHorseGamePage() {
  const store = useHorseGameStore()
  const animation = useRaceAnimation()

  watch(() => animation.progress.value, (progress) => {
    store.updateProgress(progress)
  })

  function onGenerate() {
    animation.stop()
    store.generateProgram()
  }

  function onStartPause() {
    if (store.phase === 'running') {
      animation.pause()
      store.setPhase('paused')
    }
    else if (store.phase === 'paused') {
      animation.resume()
      store.setPhase('running')
    }
    else if (store.phase === 'ready') {
      startRound()
    }
  }

  function startRound() {
    const tickFn = store.prepareRound()
    const entryCount = store.currentRound?.entries.length ?? 10
    const duration = getTotalRaceDuration(entryCount)

    animation.start(tickFn, duration, () => {
      store.finalizeRound()

      if (store.phase === 'ready') {
        setTimeout(() => {
          if (store.phase === 'ready') {
            startRound()
          }
        }, AUTO_ADVANCE_DELAY_MS)
      }
    })
  }

  return {
    store,
    onGenerate,
    onStartPause,
  }
}
