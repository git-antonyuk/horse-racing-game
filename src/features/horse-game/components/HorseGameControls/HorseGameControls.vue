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
      data-test="generate-btn"
      label="Generate Program"
      :disabled="isGenerateDisabled"
      severity="success"
      @click="emit('generate')"
    >
      <template #icon>
        <IconLucideRefreshCw />
      </template>
    </Button>
    <Button
      data-test="start-btn"
      :label="startPauseLabel"
      :disabled="isStartPauseDisabled"
      severity="info"
      @click="emit('startPause')"
    >
      <template #icon>
        <IconLucidePause v-if="phase === 'running'" />
        <IconLucidePlay v-else />
      </template>
    </Button>
  </div>
</template>
