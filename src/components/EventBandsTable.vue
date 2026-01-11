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
          <th>Band</th>
          <th style="width: 200px">Venue</th>
          <th style="width: 120px">Rating</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry.event_band_id" class="row">
          <td>{{ formatDate(entry.date) }}</td>
          <td class="name">{{ entry.band_name }}</td>
          <td>{{ entry.venue_name ?? "-" }}</td>
          <td>
            <span class="rating">{{ entry.rating ?? "-" }}</span>
          </td>
        </tr>

        <tr v-if="entries.length === 0">
          <td colspan="4" class="empty">No bands found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { EventBandSummaryDto } from "../api/types";

const { title, hint } = withDefaults(
  defineProps<{
    entries: EventBandSummaryDto[];
    title?: string;
    hint?: string;
  }>(),
  {
    title: "All live acts",
    hint: "Showing all band appearances",
  }
);

function formatDate(iso: string) {
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
