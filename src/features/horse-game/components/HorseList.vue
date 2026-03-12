<script setup lang="ts">
import type { Horse } from '@/features/horse-game/types'

type HorseListProps = {
  horses: Horse[]
}
defineProps<HorseListProps>()
</script>

<template>
  <div class="horse-list">
    <h3 class="text-lg font-semibold mb-2">
      Horses
    </h3>
    <DataTable :value="horses" size="small" scrollable scroll-height="400px" striped-rows>
      <Column field="id" header="#" style="width: 3rem" />
      <Column header="Color" style="width: 3rem">
        <template #body="{ data }">
          <span
            class="inline-block w-4 h-4 rounded-full"
            :style="{ backgroundColor: data.color }"
          />
        </template>
      </Column>
      <Column field="name" header="Name" />
      <Column field="condition" header="Condition" style="width: 5rem" />
    </DataTable>
  </div>
</template>
