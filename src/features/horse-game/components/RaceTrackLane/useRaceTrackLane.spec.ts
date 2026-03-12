import { ref } from 'vue'
import { useRaceTrackLane } from './useRaceTrackLane'

const TRANSLATE_Y_PATTERN = /translateY\([\d.e-]+px\)/

describe('useRaceTrackLane', () => {
  describe('leftStyle', () => {
    it('returns 0% at progress 0', () => {
      const progress = ref(0)
      const { leftStyle } = useRaceTrackLane(progress)
      expect(leftStyle.value).toBe('calc(0% - 0px)')
    })

    it('returns 100% minus icon size at progress 1', () => {
      const progress = ref(1)
      const { leftStyle } = useRaceTrackLane(progress)
      expect(leftStyle.value).toBe('calc(100% - 50px)')
    })

    it('returns intermediate value at progress 0.5', () => {
      const progress = ref(0.5)
      const { leftStyle } = useRaceTrackLane(progress)
      expect(leftStyle.value).toBe('calc(50% - 25px)')
    })

    it('reacts to progress changes', () => {
      const progress = ref(0)
      const { leftStyle } = useRaceTrackLane(progress)
      expect(leftStyle.value).toBe('calc(0% - 0px)')

      progress.value = 0.75
      expect(leftStyle.value).toBe('calc(75% - 37.5px)')
    })
  })

  describe('transformStyle', () => {
    it('returns translateY(0px) at progress 0 (sin of 0)', () => {
      const progress = ref(0)
      const { transformStyle } = useRaceTrackLane(progress)
      expect(transformStyle.value).toBe('translateY(0px)')
    })

    it('returns translateY with bounce value at mid-progress', () => {
      const progress = ref(0.5)
      const { transformStyle } = useRaceTrackLane(progress)
      // sin(0.5 * PI * 10) = sin(5PI) ≈ 0
      expect(transformStyle.value).toMatch(TRANSLATE_Y_PATTERN)
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
