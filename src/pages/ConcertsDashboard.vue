<template>
  <div class="page">
    <header class="header">
      <div>
        <h1>Concert-Tracker</h1>
        <div class="sub">Overview and recent activity</div>
      </div>
      <button class="primary" type="button" @click="openCreate">
        Add event
      </button>
    </header>

    <StatsRow
      :stats="stats"
      @show-all-concerts="openAllConcerts"
      @show-all-bands="openAllBands"
      @show-all-acts="openAllActs"
      @show-all-venues="openAllVenues"
    />

    <ConcertsTable
      v-if="!allConcertsOpen && !allBandsOpen && !allActsOpen && !allVenuesOpen"
      :concerts="concerts"
      @select="openDetails"
    />

    <div v-else-if="allConcertsOpen" class="all-concerts">
      <div class="all-header">
        <button class="secondary" type="button" @click="closeAllConcerts">
          Back to dashboard
        </button>
        <div v-if="allConcertsLoading" class="hint">Loading all concerts...</div>
      </div>

      <div class="pager">
        <div class="pager-group">
          <label class="pager-label" for="page-size">Per page</label>
          <select id="page-size" v-model="pageSize">
            <option v-for="option in pageSizeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="pager-group">
          <button
            class="secondary"
            type="button"
            :disabled="isAllPages || currentPage === 1"
            @click="prevPage"
          >
            Prev
          </button>
          <div class="pager-meta">Page {{ currentPage }} of {{ totalPages }}</div>
          <button
            class="secondary"
            type="button"
            :disabled="isAllPages || currentPage === totalPages"
            @click="nextPage"
          >
            Next
          </button>
        </div>
      </div>

      <ConcertsTable
        :concerts="paginatedConcerts"
        @select="openDetails"
      />

      <div v-if="allConcertsError" class="error">
        {{ allConcertsError }}
      </div>
    </div>

    <div v-else-if="allBandsOpen" class="all-concerts">
      <div class="all-header">
        <button class="secondary" type="button" @click="closeAllBands">
          Back to dashboard
        </button>
        <div v-if="allBandsLoading" class="hint">Loading bands...</div>
      </div>

      <div class="filter-row">
        <label class="filter-label" for="bands-search">Search</label>
        <input
          id="bands-search"
          v-model.trim="bandsSearch"
          type="text"
          placeholder="Filter by band name..."
        />
      </div>

      <div class="pager">
        <div class="pager-group">
          <label class="pager-label" for="band-page-size">Per page</label>
          <select id="band-page-size" v-model="bandPageSize">
            <option v-for="option in bandPageSizeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="pager-group">
          <button
            class="secondary"
            type="button"
            :disabled="isAllBandPages || bandPage === 1"
            @click="prevBandPage"
          >
            Prev
          </button>
          <div class="pager-meta">Page {{ bandPage }} of {{ totalBandPages }}</div>
          <button
            class="secondary"
            type="button"
            :disabled="isAllBandPages || bandPage === totalBandPages"
            @click="nextBandPage"
          >
            Next
          </button>
        </div>
      </div>

      <BandsTable
        :bands="paginatedBands"
        @select="openBandDetails"
      />

      <div v-if="allBandsError" class="error">
        {{ allBandsError }}
      </div>
    </div>

    <div v-else-if="allActsOpen" class="all-concerts">
      <div class="all-header">
        <button class="secondary" type="button" @click="closeAllActs">
          Back to dashboard
        </button>
        <div v-if="allActsLoading" class="hint">Loading bands...</div>
      </div>

      <div class="filter-row">
        <label class="filter-label" for="acts-search">Search</label>
        <input
          id="acts-search"
          v-model.trim="actsSearch"
          type="text"
          placeholder="Filter by band name..."
        />
      </div>

      <div class="pager">
        <div class="pager-group">
          <label class="pager-label" for="acts-page-size">Per page</label>
          <select id="acts-page-size" v-model="actsPageSize">
            <option v-for="option in actsPageSizeOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <div class="pager-group">
          <button
            class="secondary"
            type="button"
            :disabled="isAllActsPages || actsPage === 1"
            @click="prevActsPage"
          >
            Prev
          </button>
          <div class="pager-meta">Page {{ actsPage }} of {{ totalActsPages }}</div>
          <button
            class="secondary"
            type="button"
            :disabled="isAllActsPages || actsPage === totalActsPages"
            @click="nextActsPage"
          >
            Next
          </button>
        </div>
      </div>

      <EventBandsTable
        :entries="paginatedActs"
      />

      <div v-if="allActsError" class="error">
        {{ allActsError }}
      </div>
    </div>

    <div v-else-if="allVenuesOpen" class="all-concerts">
      <div class="all-header">
        <button class="secondary" type="button" @click="closeAllVenues">
          Back to dashboard
        </button>
        <div v-if="allVenuesLoading" class="hint">Loading venues...</div>
      </div>

      <VenuesTable
        :venues="allVenues"
        @select="openVenueDetails"
      />

      <div v-if="allVenuesError" class="error">
        {{ allVenuesError }}
      </div>
    </div>

    <ConcertDetailsModal
      :open="detailsOpen"
      :details="selectedDetails"
      :error="detailsError"
      @close="closeDetails"
      @show-venue="openVenueDetailsFromEvent"
    />

    <BandDetailsModal
      :open="bandDetailsOpen"
      :band="bandDetails"
      :error="bandDetailsError"
      :saving="bandDetailsSaving"
      :all-bands="bandLookup"
      :all-acts="allActs"
      @close="closeBandDetails"
      @save="saveBandDetails"
      @show-acts="jumpToBandActs"
    />

    <VenueDetailsModal
      :open="venueDetailsOpen"
      :venue="venueDetails"
      :error="venueDetailsError"
      :saving="venueDetailsSaving"
      @close="closeVenueDetails"
      @save="saveVenueDetails"
    />

    <AddEventModal
      :open="createOpen"
      @close="closeCreate"
      @created="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import StatsRow from "../components/StatsRow.vue";
import ConcertsTable from "../components/ConcertsTable.vue";
import BandsTable from "../components/BandsTable.vue";
import VenuesTable from "../components/VenuesTable.vue";
import BandDetailsModal from "../components/BandDetailsModal.vue";
import VenueDetailsModal from "../components/VenueDetailsModal.vue";
import EventBandsTable from "../components/EventBandsTable.vue";
import ConcertDetailsModal from "../components/ConcertDetailsModal.vue";
import AddEventModal from "../components/AddEventModal.vue";
import {
  getAllConcerts,
  getBandSummaries,
  getConcertBands,
  getConcertBandById,
  getConcertDetails,
  getConcertVenueById,
  getConcertVenues,
  getEventBandSummaries,
  getLastConcerts,
  getStats,
  updateConcertBand,
  updateConcertVenue,
} from "../api/concertsApi";
import type {
  BandSummaryDto,
  ConcertBandDto,
  ConcertBandDetailsDto,
  ConcertDetailsDto,
  ConcertListItemDto,
  ConcertVenueDetailsDto,
  ConcertVenueDto,
  CreateConcertBandDto,
  CreateConcertVenueDto,
  EventBandSummaryDto,
  StatsDto,
  VenueSummaryDto,
} from "../api/types";

const stats = ref<StatsDto | null>(null);
const concerts = ref<ConcertListItemDto[]>([]);
const allConcerts = ref<ConcertListItemDto[]>([]);
const allConcertsOpen = ref(false);
const allConcertsLoading = ref(false);
const allConcertsError = ref<string | null>(null);
const pageSizeOptions = ["10", "20", "50", "100", "200", "All"] as const;
const pageSize = ref<(typeof pageSizeOptions)[number]>("20");
const currentPage = ref(1);
const allBands = ref<BandSummaryDto[]>([]);
const allBandsOpen = ref(false);
const allBandsLoading = ref(false);
const allBandsError = ref<string | null>(null);
const bandPageSizeOptions = ["10", "20", "50", "100", "200", "All"] as const;
const bandPageSize = ref<(typeof bandPageSizeOptions)[number]>("20");
const bandPage = ref(1);
const bandsSearch = ref("");
const allActs = ref<EventBandSummaryDto[]>([]);
const allActsOpen = ref(false);
const allActsLoading = ref(false);
const allActsError = ref<string | null>(null);
const actsPageSizeOptions = ["10", "20", "50", "100", "200", "All"] as const;
const actsPageSize = ref<(typeof actsPageSizeOptions)[number]>("20");
const actsPage = ref(1);
const actsSearch = ref("");
const allVenues = ref<VenueSummaryDto[]>([]);
const allVenuesOpen = ref(false);
const allVenuesLoading = ref(false);
const allVenuesError = ref<string | null>(null);

const detailsOpen = ref(false);
const selectedDetails = ref<ConcertDetailsDto | null>(null);
const detailsError = ref<string | null>(null);
const bandDetailsOpen = ref(false);
const bandDetails = ref<ConcertBandDetailsDto | null>(null);
const bandDetailsError = ref<string | null>(null);
const bandDetailsSaving = ref(false);
const bandLookup = ref<ConcertBandDto[]>([]);
const bandLookupError = ref<string | null>(null);
const venueDetailsOpen = ref(false);
const venueDetails = ref<ConcertVenueDetailsDto | null>(null);
const venueDetailsError = ref<string | null>(null);
const venueDetailsSaving = ref(false);
const returnToEventDetails = ref(false);

const createOpen = ref(false);
async function loadAllConcerts() {
  allConcertsLoading.value = true;
  allConcertsError.value = null;

  try {
    allConcerts.value = await getAllConcerts();
  } catch (e: any) {
    allConcertsError.value = e?.message ?? "Failed to load all concerts.";
  } finally {
    allConcertsLoading.value = false;
  }
}

async function openAllConcerts() {
  allConcertsOpen.value = true;
  allBandsOpen.value = false;
  allActsOpen.value = false;
  allVenuesOpen.value = false;
  if (allConcerts.value.length === 0) {
    await loadAllConcerts();
  }
}

function closeAllConcerts() {
  allConcertsOpen.value = false;
}

async function loadAllBands() {
  allBandsLoading.value = true;
  allBandsError.value = null;

  try {
    allBands.value = await getBandSummaries();
  } catch (e: any) {
    allBandsError.value = e?.message ?? "Failed to load bands.";
  } finally {
    allBandsLoading.value = false;
  }
}

async function openAllBands() {
  allBandsOpen.value = true;
  allConcertsOpen.value = false;
  allActsOpen.value = false;
  allVenuesOpen.value = false;
  if (allBands.value.length === 0) {
    await loadAllBands();
  }
}

function closeAllBands() {
  allBandsOpen.value = false;
}

async function loadAllActs() {
  allActsLoading.value = true;
  allActsError.value = null;

  try {
    allActs.value = await getEventBandSummaries();
  } catch (e: any) {
    allActsError.value = e?.message ?? "Failed to load bands.";
  } finally {
    allActsLoading.value = false;
  }
}

function buildVenueSummaries(
  venues: ConcertVenueDto[],
  concertsData: ConcertListItemDto[]
): VenueSummaryDto[] {
  const statsByVenue = new Map<
    number,
    { count: number; lastDate?: string; lastVenueName?: string }
  >();

  for (const concert of concertsData) {
    if (!concert.venueId) continue;
    const date = concert.date;
    const entry = statsByVenue.get(concert.venueId) ?? { count: 0 };
    entry.count += 1;
    if (!entry.lastDate || date > entry.lastDate) {
      entry.lastDate = date;
      if (concert.venueName) {
        entry.lastVenueName = concert.venueName;
      }
    } else if (!entry.lastVenueName && concert.venueName) {
      entry.lastVenueName = concert.venueName;
    }
    statsByVenue.set(concert.venueId, entry);
  }

  const summaries: VenueSummaryDto[] = [];

  for (const venue of venues) {
    const stats = statsByVenue.get(venue.id);
    if (!stats) continue;
    summaries.push({
      venue_id: venue.id,
      venue_name: venue.name,
      last_visited_date: stats.lastDate ?? null,
      visit_count: stats.count,
      rating: venue.rating ?? null,
    });
    statsByVenue.delete(venue.id);
  }

  for (const [venueId, stats] of statsByVenue) {
    summaries.push({
      venue_id: venueId,
      venue_name: stats.lastVenueName ?? `Venue #${venueId}`,
      last_visited_date: stats.lastDate ?? null,
      visit_count: stats.count,
      rating: null,
    });
  }

  summaries.sort((a, b) => (b.last_visited_date ?? "").localeCompare(a.last_visited_date ?? ""));
  return summaries;
}

async function loadAllVenues() {
  allVenuesLoading.value = true;
  allVenuesError.value = null;

  try {
    const [venues, concertsData] = await Promise.all([
      getConcertVenues(),
      allConcerts.value.length === 0 ? getAllConcerts() : Promise.resolve(allConcerts.value),
    ]);

    if (allConcerts.value.length === 0) {
      allConcerts.value = concertsData;
    }

    allVenues.value = buildVenueSummaries(venues, concertsData);
  } catch (e: any) {
    allVenuesError.value = e?.message ?? "Failed to load venues.";
  } finally {
    allVenuesLoading.value = false;
  }
}

async function openAllActs() {
  allActsOpen.value = true;
  allConcertsOpen.value = false;
  allBandsOpen.value = false;
  allVenuesOpen.value = false;
  if (allActs.value.length === 0) {
    await loadAllActs();
  }
}

function closeAllActs() {
  allActsOpen.value = false;
}

async function openAllVenues() {
  allVenuesOpen.value = true;
  allConcertsOpen.value = false;
  allBandsOpen.value = false;
  allActsOpen.value = false;
  if (allVenues.value.length === 0) {
    await loadAllVenues();
  }
}

function closeAllVenues() {
  allVenuesOpen.value = false;
}

const isAllPages = computed(() => pageSize.value === "All");
const isAllBandPages = computed(() => bandPageSize.value === "All");
const isAllActsPages = computed(() => actsPageSize.value === "All");

const totalPages = computed(() => {
  if (isAllPages.value) {
    return 1;
  }
  const size = Number(pageSize.value);
  return Math.max(1, Math.ceil(allConcerts.value.length / size));
});

const paginatedConcerts = computed(() => {
  if (isAllPages.value) {
    return allConcerts.value;
  }
  const size = Number(pageSize.value);
  const start = (currentPage.value - 1) * size;
  return allConcerts.value.slice(start, start + size);
});

const totalBandPages = computed(() => {
  if (isAllBandPages.value) {
    return 1;
  }
  const size = Number(bandPageSize.value);
  return Math.max(1, Math.ceil(filteredBands.value.length / size));
});

const filteredBands = computed(() => {
  const q = bandsSearch.value.trim().toLowerCase();
  if (!q) {
    return allBands.value;
  }
  return allBands.value.filter((band) =>
    band.band_name.toLowerCase().includes(q)
  );
});

const paginatedBands = computed(() => {
  if (isAllBandPages.value) {
    return filteredBands.value;
  }
  const size = Number(bandPageSize.value);
  const start = (bandPage.value - 1) * size;
  return filteredBands.value.slice(start, start + size);
});

const totalActsPages = computed(() => {
  if (isAllActsPages.value) {
    return 1;
  }
  const size = Number(actsPageSize.value);
  return Math.max(1, Math.ceil(filteredActs.value.length / size));
});

const filteredActs = computed(() => {
  const q = actsSearch.value.trim().toLowerCase();
  if (!q) {
    return allActs.value;
  }
  return allActs.value.filter((entry) =>
    entry.band_name.toLowerCase().includes(q)
  );
});

const paginatedActs = computed(() => {
  if (isAllActsPages.value) {
    return filteredActs.value;
  }
  const size = Number(actsPageSize.value);
  const start = (actsPage.value - 1) * size;
  return filteredActs.value.slice(start, start + size);
});

watch([pageSize, allConcerts], () => {
  currentPage.value = 1;
});

watch(totalPages, (nextTotal) => {
  if (currentPage.value > nextTotal) {
    currentPage.value = nextTotal;
  }
});

watch([bandPageSize, allBands, bandsSearch], () => {
  bandPage.value = 1;
});

watch(totalBandPages, (nextTotal) => {
  if (bandPage.value > nextTotal) {
    bandPage.value = nextTotal;
  }
});

watch([actsPageSize, allActs, actsSearch], () => {
  actsPage.value = 1;
});

watch(totalActsPages, (nextTotal) => {
  if (actsPage.value > nextTotal) {
    actsPage.value = nextTotal;
  }
});

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
}

function prevBandPage() {
  if (bandPage.value > 1) {
    bandPage.value -= 1;
  }
}

function nextBandPage() {
  if (bandPage.value < totalBandPages.value) {
    bandPage.value += 1;
  }
}

function prevActsPage() {
  if (actsPage.value > 1) {
    actsPage.value -= 1;
  }
}

function nextActsPage() {
  if (actsPage.value < totalActsPages.value) {
    actsPage.value += 1;
  }
}

async function refreshData() {
  stats.value = await getStats();
  concerts.value = await getLastConcerts(10);

  if (allConcertsOpen.value || allConcerts.value.length > 0) {
    await loadAllConcerts();
  }
  if (allBandsOpen.value || allBands.value.length > 0) {
    await loadAllBands();
  }
  if (allActsOpen.value || allActs.value.length > 0) {
    await loadAllActs();
  }
  if (allVenuesOpen.value || allVenues.value.length > 0) {
    await loadAllVenues();
  }
}

onMounted(refreshData);

async function openDetails(concertId: number) {
  detailsOpen.value = true;
  selectedDetails.value = null;
  detailsError.value = null;

  try {
    const details = await getConcertDetails(concertId);
    if (!details.venueId || !details.venueName) {
      const fromList =
        allConcerts.value.find((concert) => concert.id === concertId) ??
        concerts.value.find((concert) => concert.id === concertId);
      if (fromList?.venueId && !details.venueId) {
        details.venueId = fromList.venueId;
      }
      if (fromList?.venueName && !details.venueName) {
        details.venueName = fromList.venueName;
      }
    }
    selectedDetails.value = details;
  } catch (e: any) {
    detailsError.value = e?.message ?? "Failed to load concert details.";
  }
}

function closeDetails() {
  detailsOpen.value = false;
}

async function openVenueDetailsFromEvent(venueId: number) {
  await openVenueDetails(venueId, true);
  detailsOpen.value = false;
}

async function openBandDetails(bandId: number) {
  bandDetailsOpen.value = true;
  bandDetails.value = null;
  bandDetailsError.value = null;

  if (bandLookup.value.length === 0) {
    try {
      bandLookup.value = await getConcertBands();
    } catch (e: any) {
      bandLookupError.value = e?.message ?? "Failed to load band lookups.";
    }
  }

  if (allActs.value.length === 0) {
    await loadAllActs();
  }

  try {
    bandDetails.value = await getConcertBandById(bandId);
  } catch (e: any) {
    bandDetailsError.value = e?.message ?? "Failed to load band details.";
  }
}

function closeBandDetails() {
  bandDetailsOpen.value = false;
}

async function openVenueDetails(venueId: number, fromEvent = false) {
  venueDetailsOpen.value = true;
  venueDetails.value = null;
  venueDetailsError.value = null;
  returnToEventDetails.value = fromEvent;

  try {
    venueDetails.value = await getConcertVenueById(venueId);
  } catch (e: any) {
    venueDetailsError.value = e?.message ?? "Failed to load venue details.";
  }
}

function closeVenueDetails() {
  venueDetailsOpen.value = false;
  if (returnToEventDetails.value && selectedDetails.value) {
    detailsOpen.value = true;
  }
  returnToEventDetails.value = false;
}

async function jumpToBandActs(bandName: string) {
  actsSearch.value = bandName;
  await openAllActs();
  bandDetailsOpen.value = false;
}

async function saveBandDetails(payload: CreateConcertBandDto) {
  if (!bandDetails.value) {
    return;
  }

  bandDetailsSaving.value = true;
  bandDetailsError.value = null;

  try {
    await updateConcertBand(bandDetails.value.id, payload);
    bandDetails.value = await getConcertBandById(bandDetails.value.id);

    if (allBandsOpen.value || allBands.value.length > 0) {
      await loadAllBands();
    }
    if (allActsOpen.value || allActs.value.length > 0) {
      await loadAllActs();
    }
  } catch (e: any) {
    bandDetailsError.value = e?.message ?? "Failed to update band.";
  } finally {
    bandDetailsSaving.value = false;
  }
}

async function saveVenueDetails(payload: CreateConcertVenueDto) {
  if (!venueDetails.value) {
    return;
  }

  venueDetailsSaving.value = true;
  venueDetailsError.value = null;

  try {
    await updateConcertVenue(venueDetails.value.id, payload);
    venueDetails.value = await getConcertVenueById(venueDetails.value.id);

    if (allVenuesOpen.value || allVenues.value.length > 0) {
      await loadAllVenues();
    }
  } catch (e: any) {
    venueDetailsError.value = e?.message ?? "Failed to update venue.";
  } finally {
    venueDetailsSaving.value = false;
  }
}

function openCreate() {
  createOpen.value = true;
}

function closeCreate() {
  createOpen.value = false;
}
</script>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 18px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.header h1 {
  margin: 0;
  font-size: 22px;
}

.sub {
  margin-top: 4px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 13px;
}

.primary {
  background: #111;
  color: #fff;
  border: 1px solid #111;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

@media (max-width: 720px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}

.all-concerts {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.all-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.filter-row input {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 6px 10px;
  min-width: 240px;
}

.pager-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pager-label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.pager-meta {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.pager select {
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 6px 10px;
  background: #fff;
}

.secondary {
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: #fff;
  border-radius: 10px;
  padding: 8px 12px;
  cursor: pointer;
}

.error {
  border: 1px solid rgba(180, 0, 0, 0.35);
  background: rgba(180, 0, 0, 0.06);
  padding: 10px 12px;
  border-radius: 10px;
}</style>
