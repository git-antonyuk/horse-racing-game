import type { Ref } from 'vue'
import { computed } from 'vue'
import { HORSE_ICON_SIZE } from '@/features/horse-game/components/HorseIcon.vue'

const BOUNCE_AMPLITUDE = 3
const BOUNCE_CYCLES = 10

export function useRaceTrackLane(progress: Ref<number>) {
  const transformStyle = computed<string>(() => {
    const bounceY = Math.sin(progress.value * Math.PI * BOUNCE_CYCLES) * -BOUNCE_AMPLITUDE
    const translateX = `calc(${progress.value * 100}cqw - ${progress.value * HORSE_ICON_SIZE}px)`
    return `translateX(${translateX}) translateY(${bounceY}px)`
  })

  return {
    transformStyle,
  }
}
