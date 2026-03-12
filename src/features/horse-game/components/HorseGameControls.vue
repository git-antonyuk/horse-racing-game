<script setup lang="ts">
import type { GamePhase } from '@/features/horse-game/types'

type HorseGameControlsProps = {
  phase: GamePhase
}

type HorseGameControlsEmits = {
  generate: []
  startPause: []
}
const props = defineProps<HorseGameControlsProps>()

const emit = defineEmits<HorseGameControlsEmits>()

function getStartPauseLabel(): string {
  switch (props.phase) {
    case 'running': return 'Pause'
    case 'paused': return 'Resume'
    default: return 'Start'
  }
}

function isStartPauseDisabled(): boolean {
  return props.phase === 'idle' || props.phase === 'finished'
}

function isGenerateDisabled(): boolean {
  return props.phase === 'running'
}
</script>

<template>
  <div class="flex gap-3">
    <Button
      label="Generate Program"
      icon="pi pi-refresh"
      :disabled="isGenerateDisabled()"
      severity="success"
      @click="emit('generate')"
    />
    <Button
      :label="getStartPauseLabel()"
      :icon="phase === 'running' ? 'pi pi-pause' : 'pi pi-play'"
      :disabled="isStartPauseDisabled()"
      severity="info"
      @click="emit('startPause')"
    />
  </div>
</template>
