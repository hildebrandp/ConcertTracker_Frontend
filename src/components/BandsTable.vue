<template>
  <div class="table-card">
    <div class="table-header">
      <h2>{{ title }}</h2>
      <div class="hint">{{ hint }}</div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Band</th>
          <th style="width: 160px">Last seen</th>
          <th style="width: 90px">Count</th>
          <th style="width: 120px">Rating</th>
          <th style="width: 200px">Last venue</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="band in bands"
          :key="band.band_id"
          class="row"
          role="button"
          tabindex="0"
          @click="$emit('select', band.band_id)"
        >
          <td class="name">{{ band.band_name }}</td>
          <td>{{ formatDate(band.last_seen_date) }}</td>
          <td>{{ band.seen_count }}</td>
          <td>
            <span class="rating">{{ band.rating ?? "-" }}</span>
          </td>
          <td>{{ band.last_venue_name ?? "-" }}</td>
        </tr>

        <tr v-if="bands.length === 0">
          <td colspan="5" class="empty">No bands found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { BandSummaryDto } from "../api/types";

const { title, hint } = withDefaults(
  defineProps<{
    bands: BandSummaryDto[];
    title?: string;
    hint?: string;
  }>(),
  {
    title: "Unique bands",
    hint: "Showing unique bands",
  }
);

defineEmits<{
  (e: "select", bandId: number): void;
}>();

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
