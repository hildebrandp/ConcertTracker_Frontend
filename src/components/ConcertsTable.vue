<template>
  <div class="table-card">
    <div class="table-header">
      <h2>{{ title }}</h2>
      <div class="hint">{{ hint }}</div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th style="width: 160px">Date</th>
          <th>Concert</th>
          <th style="width: 200px">Venue</th>
          <th style="width: 90px">Bands</th>
          <th style="width: 120px">Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="c in concerts"
          :key="c.id"
          class="row"
          @click="$emit('select', c.id)"
          role="button"
          tabindex="0"
        >
          <td>{{ formatDate(c.date) }}</td>
          <td class="name">{{ c.name }}</td>
          <td>{{ c.venueName ?? "-" }}</td>
          <td>{{ c.bandCount ?? "�" }}</td>
          <td>
            <span class="rating">{{ c.rating }}</span>
          </td>
        </tr>

        <tr v-if="concerts.length === 0">
          <td colspan="5" class="empty">No concerts found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { ConcertListItemDto } from "../api/types";

const { title, hint } = withDefaults(
  defineProps<{
    concerts: ConcertListItemDto[];
    title?: string;
    hint?: string;
  }>(),
  {
    title: "All attended Concerts",
    hint: "Click a row to see details",
  }
);

defineEmits<{
  (e: "select", concertId: number): void;
}>();

function formatDate(iso: string) {
  // Simple, stable formatting without timezone surprises for YYYY-MM-DD
  return iso.length >= 10 ? iso.slice(0, 10) : iso;
}
</script>

<style scoped>
.table-card {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
}

.table-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.table-header h2 {
  margin: 0;
  font-size: 16px;
}

.hint {
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  text-align: left;
  font-size: 14px;
}

.row {
  cursor: pointer;
}

.row:hover {
  background: rgba(0, 0, 0, 0.03);
}

.name {
  font-weight: 600;
}

.rating {
  display: inline-block;
  min-width: 36px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.18);
  text-align: center;
}

.empty {
  padding: 20px 16px;
  color: rgba(0, 0, 0, 0.55);
}
</style>



