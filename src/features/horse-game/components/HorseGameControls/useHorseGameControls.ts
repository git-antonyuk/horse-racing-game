import type { Ref } from 'vue'
import type { GamePhase } from '@/features/horse-game/types'
import { computed } from 'vue'

export function useHorseGameControls(phase: Ref<GamePhase>) {
  const startPauseLabel = computed<string>(() => {
    switch (phase.value) {
      case 'running': return 'Pause'
      case 'paused': return 'Resume'
      default: return 'Start'
    }
  })

  const isStartPauseDisabled = computed<boolean>(() =>
    phase.value === 'idle' || phase.value === 'finished',
  )

  const isGenerateDisabled = computed<boolean>(() =>
    phase.value === 'running',
  )

  return {
    startPauseLabel,
    isStartPauseDisabled,
    isGenerateDisabled,
  }
}
