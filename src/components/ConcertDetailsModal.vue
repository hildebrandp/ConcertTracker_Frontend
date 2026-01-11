<template>
  <div v-if="open" class="backdrop" @click.self="$emit('close')">
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <div class="title">
          <div class="name">{{ details?.name ?? "Loading…" }}</div>
          <div class="meta">
            <span v-if="details">{{ details.date.slice(0, 10) }} · Rating {{ details.rating }}</span>
            <span v-if="details?.venueName"> · {{ details.venueName }}</span>
          </div>
        </div>

        <button class="close" type="button" @click="$emit('close')">Close</button>
      </div>

      <div class="modal-body">
        <div class="section">
          <div class="section-title">Bands</div>
          <ul v-if="details" class="list">
            <li v-for="b in details.bands" :key="b.id">{{ b.name }}</li>
            <li v-if="details.bands.length === 0" class="muted">No bands recorded.</li>
          </ul>
          <div v-else class="muted">Loading…</div>
        </div>

        <div class="section">
          <div class="section-title">Participated with</div>
          <ul v-if="details" class="list">
            <li v-for="p in details.participatedWith" :key="p.id">{{ p.displayName }}</li>
            <li v-if="details.participatedWith.length === 0" class="muted">No participants recorded.</li>
          </ul>
          <div v-else class="muted">Loading…</div>
        </div>

        <div v-if="error" class="error">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConcertDetailsDto } from "../api/types";

defineProps<{
  open: boolean;
  details: ConcertDetailsDto | null;
  error: string | null;
}>();

defineEmits<{
  (e: "close"): void;
}>();
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 18px;
}

.modal {
  width: min(860px, 100%);
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.16);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.title .name {
  font-size: 16px;
  font-weight: 700;
}

.meta {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
}

.close {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
}

.modal-body {
  padding: 16px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.section {
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding: 12px;
}

.section-title {
  font-weight: 700;
  margin-bottom: 8px;
}

.list {
  margin: 0;
  padding-left: 16px;
}

.muted {
  color: rgba(0, 0, 0, 0.55);
  font-size: 13px;
}

.error {
  grid-column: 1 / -1;
  border: 1px solid rgba(180, 0, 0, 0.35);
  background: rgba(180, 0, 0, 0.06);
  padding: 10px 12px;
  border-radius: 10px;
}
</style>
