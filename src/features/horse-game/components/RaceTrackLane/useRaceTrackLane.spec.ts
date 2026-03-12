import { ref } from 'vue'
import { useRaceTrackLane } from './useRaceTrackLane'

const TRANSFORM_PATTERN = /translateX\(.+\)\s+translateY\([\d.e-]+px\)/

describe('useRaceTrackLane', () => {
  describe('transformStyle', () => {
    it('returns translateX(0) and translateY(0) at progress 0', () => {
      const progress = ref(0)
      const { transformStyle } = useRaceTrackLane(progress)
      expect(transformStyle.value).toBe('translateX(calc(0cqw - 0px)) translateY(0px)')
    })

    it('returns full translateX at progress 1', () => {
      const progress = ref(1)
      const { transformStyle } = useRaceTrackLane(progress)
      expect(transformStyle.value).toContain('translateX(calc(100cqw - 50px))')
    })

    it('returns intermediate translateX at progress 0.5', () => {
      const progress = ref(0.5)
      const { transformStyle } = useRaceTrackLane(progress)
      expect(transformStyle.value).toContain('translateX(calc(50cqw - 25px))')
    })

    it('includes bounce translateY at mid-progress', () => {
      const progress = ref(0.5)
      const { transformStyle } = useRaceTrackLane(progress)
      expect(transformStyle.value).toMatch(TRANSFORM_PATTERN)
    })

    it('reacts to progress changes', () => {
      const progress = ref(0)
      const { transformStyle } = useRaceTrackLane(progress)
      const initial = transformStyle.value

      progress.value = 0.25
      expect(transformStyle.value).not.toBe(initial)
    })
  })
})
