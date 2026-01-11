<template>
  <div class="table-card">
    <div class="table-header">
      <h2>{{ title }}</h2>
      <div class="hint">{{ hint }}</div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Venue</th>
          <th style="width: 160px">Last visited</th>
          <th style="width: 90px">Count</th>
          <th style="width: 120px">Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="venue in venues"
          :key="venue.venue_id"
          class="row"
          role="button"
          tabindex="0"
          @click="$emit('select', venue.venue_id)"
        >
          <td class="name">{{ venue.venue_name }}</td>
          <td>{{ formatDate(venue.last_visited_date) }}</td>
          <td>{{ venue.visit_count }}</td>
          <td>
            <span class="rating">{{ venue.rating ?? "-" }}</span>
          </td>
        </tr>

        <tr v-if="venues.length === 0">
          <td colspan="4" class="empty">No venues found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { VenueSummaryDto } from "../api/types";

const { title, hint } = withDefaults(
  defineProps<{
    venues: VenueSummaryDto[];
    title?: string;
    hint?: string;
  }>(),
  {
    title: "Visited Venues",
    hint: "Showing all venues",
  }
);

defineEmits<{
  (e: "select", venueId: number): void;
}>();

function formatDate(iso?: string | null) {
  if (!iso) return "-";
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
