<script setup lang="ts">
import type { Horse, Round } from '@/features/horse-game/types'

type RoundProgramTableProps = {
  round: Round
  horses: Horse[]
}

const props = defineProps<RoundProgramTableProps>()

const horseMap = new Map(props.horses.map(h => [h.id, h]))
const entries = props.round.entries.map(e => ({
  name: horseMap.get(e.horseId)?.name ?? 'Unknown',
  color: horseMap.get(e.horseId)?.color ?? '#888',
}))
</script>

<template>
  <div class="mb-3">
    <div class="text-sm font-semibold mb-1">
      Round {{ round.roundNumber }} — {{ round.distance }}m
    </div>
    <DataTable :value="entries" size="small" striped-rows>
      <Column header="#" style="width: 2rem">
        <template #body="{ index }">
          {{ index + 1 }}
        </template>
      </Column>
      <Column header="Color" style="width: 2rem">
        <template #body="{ data }">
          <span
            class="inline-block w-3 h-3 rounded-full"
            :style="{ backgroundColor: data.color }"
          />
        </template>
      </Column>
      <Column field="name" header="Horse" />
    </DataTable>
  </div>
</template>
