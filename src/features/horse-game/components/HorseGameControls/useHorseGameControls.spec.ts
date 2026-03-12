import type { GamePhase } from '@/features/horse-game/types'
import { ref } from 'vue'
import { useHorseGameControls } from './useHorseGameControls'

describe('useHorseGameControls', () => {
  describe('startPauseLabel', () => {
    it('returns "Pause" when running', () => {
      const phase = ref<GamePhase>('running')
      const { startPauseLabel } = useHorseGameControls(phase)
      expect(startPauseLabel.value).toBe('Pause')
    })

    it('returns "Resume" when paused', () => {
      const phase = ref<GamePhase>('paused')
      const { startPauseLabel } = useHorseGameControls(phase)
      expect(startPauseLabel.value).toBe('Resume')
    })

    it('returns "Start" for other phases', () => {
      const phase = ref<GamePhase>('ready')
      const { startPauseLabel } = useHorseGameControls(phase)
      expect(startPauseLabel.value).toBe('Start')
    })

    it('reacts to phase changes', () => {
      const phase = ref<GamePhase>('ready')
      const { startPauseLabel } = useHorseGameControls(phase)
      expect(startPauseLabel.value).toBe('Start')

      phase.value = 'running'
      expect(startPauseLabel.value).toBe('Pause')
    })
  })

  describe('isStartPauseDisabled', () => {
    it('is disabled when idle', () => {
      const phase = ref<GamePhase>('idle')
      const { isStartPauseDisabled } = useHorseGameControls(phase)
      expect(isStartPauseDisabled.value).toBe(true)
    })

    it('is disabled when finished', () => {
      const phase = ref<GamePhase>('finished')
      const { isStartPauseDisabled } = useHorseGameControls(phase)
      expect(isStartPauseDisabled.value).toBe(true)
    })

    it('is enabled when ready', () => {
      const phase = ref<GamePhase>('ready')
      const { isStartPauseDisabled } = useHorseGameControls(phase)
      expect(isStartPauseDisabled.value).toBe(false)
    })

    it('is enabled when running', () => {
      const phase = ref<GamePhase>('running')
      const { isStartPauseDisabled } = useHorseGameControls(phase)
      expect(isStartPauseDisabled.value).toBe(false)
    })

    it('is enabled when paused', () => {
      const phase = ref<GamePhase>('paused')
      const { isStartPauseDisabled } = useHorseGameControls(phase)
      expect(isStartPauseDisabled.value).toBe(false)
    })
  })

  describe('isGenerateDisabled', () => {
    it('is disabled when running', () => {
      const phase = ref<GamePhase>('running')
      const { isGenerateDisabled } = useHorseGameControls(phase)
      expect(isGenerateDisabled.value).toBe(true)
    })

    it('is enabled when idle', () => {
      const phase = ref<GamePhase>('idle')
      const { isGenerateDisabled } = useHorseGameControls(phase)
      expect(isGenerateDisabled.value).toBe(false)
    })

    it('is enabled when ready', () => {
      const phase = ref<GamePhase>('ready')
      const { isGenerateDisabled } = useHorseGameControls(phase)
      expect(isGenerateDisabled.value).toBe(false)
    })
  })
})
