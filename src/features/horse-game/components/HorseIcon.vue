<script setup lang="ts">
import HorseSvg from '@/features/horse-game/assets/horse.svg'

type HorseIconProps = {
  color: string
}

defineProps<HorseIconProps>()

const SIZE = 58
</script>

<template>
  <HorseSvg class="horse-icon" :color="color" :width="SIZE" :height="SIZE" />
</template>
