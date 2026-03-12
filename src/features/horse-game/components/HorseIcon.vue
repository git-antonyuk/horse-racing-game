<script lang="ts">
import HorseSvg from '@/features/horse-game/assets/horse.svg'

type HorseIconProps = {
  color: string
}

export const HORSE_ICON_SIZE = 50
</script>

<script setup lang="ts">
defineProps<HorseIconProps>()
</script>

<template>
  <HorseSvg class="horse-icon" :color="color" :width="HORSE_ICON_SIZE" :height="HORSE_ICON_SIZE" />
</template>
