<script setup lang="ts">
import type { GamePhase } from '@/features/horse-game/types'
import { toRef } from 'vue'
import { useHorseGameControls } from './useHorseGameControls'

type HorseGameControlsProps = {
  phase: GamePhase
}

type HorseGameControlsEmits = {
  generate: []
  startPause: []
}

const props = defineProps<HorseGameControlsProps>()
const emit = defineEmits<HorseGameControlsEmits>()

const { startPauseLabel, isStartPauseDisabled, isGenerateDisabled } = useHorseGameControls(toRef(() => props.phase))
</script>

<template>
  <div class="flex gap-3">
    <Button
      label="Generate Program"
      icon="pi pi-refresh"
      :disabled="isGenerateDisabled"
      severity="success"
      @click="emit('generate')"
    />
    <Button
      :label="startPauseLabel"
      :icon="phase === 'running' ? 'pi pi-pause' : 'pi pi-play'"
      :disabled="isStartPauseDisabled"
      severity="info"
      @click="emit('startPause')"
    />
  </div>
</template>
