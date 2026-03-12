<script setup lang="ts">
import type { Horse, Round } from '@/features/horse-game/types'

type RoundResultTableProps = {
  round: Round
  horses: Horse[]
}
const props = defineProps<RoundResultTableProps>()

const horseMap = new Map(props.horses.map(h => [h.id, h]))
const results = props.round.entries.toSorted((a, b) => a.position - b.position)
  .map(e => ({
    position: e.position,
    name: horseMap.get(e.horseId)?.name ?? 'Unknown',
    color: horseMap.get(e.horseId)?.color ?? '#888',
  }))
</script>

<template>
  <div class="mb-3" data-test="round-result">
    <div class="text-sm font-semibold mb-1">
      Round {{ round.roundNumber }} — {{ round.distance }}m
    </div>
    <DataTable :value="results" size="small" striped-rows>
      <Column field="position" header="Pos" style="width: 2.5rem" />
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
