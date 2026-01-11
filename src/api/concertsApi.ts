import { http } from "./http";
import type {
  ConcertDetailsDto,
  ConcertEventDto,
  ConcertListItemDto,
  ConcertBandDto,
  ConcertBandDetailsDto,
  ConcertVenueDto,
  BandSummaryDto,
  EventBandSummaryDto,
  CreateConcertBandDto,
  CreateConcertEventDto,
  CreateConcertVenueDto,
  CreateEventBandDto,
  StatsDto,
  EventBandsDto,
} from "./types";

/**
 * Backend status:
 * Your OpenAPI currently only has /concertVenues endpoints. :contentReference[oaicite:2]{index=2}
 * This frontend expects endpoints for stats + concerts.
 * Until those exist, we run in mock mode.
 */
const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? "true").toLowerCase() === "true";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

const mockStats: StatsDto = {
  concertsAttended: 42,
  bandsSeen: 128,
  actsSeen: 32
};
const mockBandSummaries: BandSummaryDto[] = [
  {
    band_id: 1,
    band_name: "Heaven Shall Burn",
    last_seen_date: "2025-12-19",
    seen_count: 3,
    rating: 9,
    last_venue_name: "Some Arena",
  },
  {
    band_id: 2,
    band_name: "Powerwolf",
    last_seen_date: "2025-10-12",
    seen_count: 2,
    rating: 7,
    last_venue_name: "Steel Hall",
  },
];

const mockEventBandSummaries: EventBandSummaryDto[] = [
  {
    event_band_id: 1,
    date: "2025-12-19",
    band_name: "Heaven Shall Burn",
    venue_name: "Some Arena",
    rating: 9,
  },
  {
    event_band_id: 2,
    date: "2025-10-12",
    band_name: "Powerwolf",
    venue_name: "Steel Hall",
    rating: 7,
  },
];

const mockBandDetailsById: Record<number, ConcertBandDetailsDto> = {
  1: {
    id: 1,
    name: "Heaven Shall Burn",
    genre: "Metalcore",
    origin_country: "Germany",
    rating: 9,
    notes: "High energy live sets.",
    link: "",
    website: "https://www.heavenshallburn.com",
  },
  2: {
    id: 2,
    name: "Powerwolf",
    genre: "Power Metal",
    origin_country: "Germany",
    rating: 7,
    notes: "",
    link: "",
    website: "https://www.powerwolf.net",
  },
};
const mockConcerts: ConcertListItemDto[] = [
  {
    id: 1001,
    date: "2025-12-19",
    name: "Heaven Shall Burn + Support",
    rating: 9,
    venueName: "Some Arena",
    bandCount: 3,
  },
  { id: 1002, date: "2025-11-02", name: "The National", rating: 8, bandCount: 1 },
  { id: 1003, date: "2025-10-12", name: "Powerwolf", rating: 7, bandCount: 2 },
  { id: 1004, date: "2025-09-01", name: "Architects", rating: 9, bandCount: 2 },
  { id: 1005, date: "2025-08-17", name: "Bring Me The Horizon", rating: 8, bandCount: 3 },
  { id: 1006, date: "2025-07-04", name: "Rammstein", rating: 10, bandCount: 2 },
  { id: 1007, date: "2025-06-22", name: "Ghost", rating: 8, bandCount: 2 },
  { id: 1008, date: "2025-05-11", name: "Kreator", rating: 7, bandCount: 3 },
  { id: 1009, date: "2025-04-03", name: "Muse", rating: 8, bandCount: 1 },
  { id: 1010, date: "2025-03-14", name: "Metallica", rating: 10, bandCount: 1 },
];
const mockDetails: Record<number, ConcertDetailsDto> = {
  1001: {
    id: 1001,
    date: "2025-12-19",
    name: "Heaven Shall Burn + Support",
    rating: 9,
    venueName: "Some Arena",
    bands: [
      { id: 1, name: "Heaven Shall Burn" },
      { id: 2, name: "Support Band A" },
      { id: 3, name: "Support Band B" },
    ],
    participatedWith: [
      { id: 10, displayName: "Pascal" },
      { id: 11, displayName: "Alex" },
    ],
  },
};

export async function getStats(): Promise<StatsDto> {
  if (USE_MOCK) {
    await sleep(150);
    return mockStats;
  }

  /**
   * EXPECTED BACKEND ENDPOINT (you need to add this):
   * GET /statsOverview
   * Response: StatsDto
   */
  const res = await http.get<StatsDto>("/statsOverview");
  console.log(res.status);
  return res.data;
}

export async function getLastConcerts(limit = 10): Promise<ConcertListItemDto[]> {
  if (USE_MOCK) {
    await sleep(200);
    return mockConcerts.slice(0, limit);
  }

  /**
   * EXPECTED BACKEND ENDPOINT (you need to add this):
   * GET /concertOverview?limit=10
   * Response: ConcertEventDto[]
   */
  const res = await http.get<ConcertEventDto[]>("/concertOverview", {
    params: { limit },
  });

  return mapConcertOverviewData(res.data);
}

export async function getAllConcerts(): Promise<ConcertListItemDto[]> {
  if (USE_MOCK) {
    await sleep(200);
    return mockConcerts;
  }

  const res = await http.get<ConcertEventDto[]>("/concertOverview");
  return mapConcertOverviewData(res.data);
}

async function mapConcertOverviewData(
  events: ConcertEventDto[]
): Promise<ConcertListItemDto[]> {
  const venueIds = Array.from(
    new Set(events.map((event) => event.venue_id).filter(Boolean))
  );

  const eventIds = Array.from(
    new Set(events.map((event) => event.id).filter(Boolean))
  );

  const venueNameById = new Map<number, string>();
  const bandCountById = new Map<number, number>();

  await Promise.all([
    ...venueIds.map(async (venueId) => {
      try {
        const venueRes = await http.get<ConcertVenueDto>(`/concertVenues/${venueId}`);
        venueNameById.set(venueId, venueRes.data.name);
      } catch {
        // Ignore missing venue names; UI will show a fallback.
      }
    }),
    ...eventIds.map(async (eventId) => {
      try {
        const bandCountRes = await http.get<EventBandsDto>(`/eventBandsByEventId/${eventId}`);
        bandCountById.set(eventId, bandCountRes.data.count);
      } catch {
        // Ignore missing band counts; UI will show a fallback.
      }
    }),
  ]);

  return events.map((event) => ({
    id: event.id,
    date: event.datetime,
    name: event.name,
    rating: event.rating ?? 0,
    venueId: event.venue_id,
    venueName: venueNameById.get(event.venue_id),
    bandCount: bandCountById.get(event.id),
  }));
}

export async function getBandSummaries(): Promise<BandSummaryDto[]> {
  if (USE_MOCK) {
    await sleep(150);
    return mockBandSummaries;
  }

  /**
   * EXPECTED BACKEND ENDPOINT (you need to add this):
   * GET /bandSummaries
   * Response: BandSummaryDto[]
   */
  const res = await http.get<BandSummaryDto[]>("/bandSummaries");
  return res.data;
}

export async function getEventBandSummaries(): Promise<EventBandSummaryDto[]> {
  if (USE_MOCK) {
    await sleep(150);
    return mockEventBandSummaries;
  }

  /**
   * EXPECTED BACKEND ENDPOINT (you need to add this):
   * GET /eventBandSummaries
   * Response: EventBandSummaryDto[]
   */
  const res = await http.get<EventBandSummaryDto[]>("/eventBandSummaries");
  return res.data;
}

export async function getConcertDetails(concertId: number): Promise<ConcertDetailsDto> {
  if (USE_MOCK) {
    await sleep(150);

    const details = mockDetails[concertId];
    if (!details) {
      // fallback mock
      return {
        id: concertId,
        date: "2025-01-01",
        name: `Concert #${concertId}`,
        rating: 0,
        bands: [],
        participatedWith: [],
      };
    }
    return details;
  }

  /**
   * EXPECTED BACKEND ENDPOINT (you need to add this):
   * GET /concertEvents/{id}/details
   * Response: ConcertDetailsDto
   */
  const res = await http.get<ConcertDetailsDto>(
    `/concertEvents/${concertId}/details`
  );
  return res.data;
}

export async function getConcertVenues(): Promise<ConcertVenueDto[]> {
  if (USE_MOCK) {
    await sleep(100);
    return [];
  }

  const res = await http.get<ConcertVenueDto[]>("/concertVenues");
  return res.data;
}

export async function getConcertBands(): Promise<ConcertBandDto[]> {
  if (USE_MOCK) {
    await sleep(100);
    return Object.values(mockBandDetailsById).map(({ id, name }) => ({ id, name }));
  }

  const res = await http.get<ConcertBandDto[]>("/concertBands");
  return res.data;
}

export async function getConcertBandById(
  bandId: number
): Promise<ConcertBandDetailsDto> {
  if (USE_MOCK) {
    await sleep(120);
    return (
      mockBandDetailsById[bandId] ?? {
        id: bandId,
        name: `Band #${bandId}`,
        genre: "",
        origin_country: "",
        rating: null,
        notes: "",
        link: "",
        website: "",
      }
    );
  }

  const res = await http.get<ConcertBandDetailsDto>(`/concertBands/${bandId}`);
  return res.data;
}

export async function updateConcertBand(
  bandId: number,
  payload: CreateConcertBandDto
): Promise<void> {
  if (USE_MOCK) {
    await sleep(120);
    mockBandDetailsById[bandId] = { id: bandId, ...payload };
    return;
  }

  await http.put(`/concertBands/${bandId}`, payload);
}

export async function createConcertVenue(payload: CreateConcertVenueDto): Promise<number> {
  if (USE_MOCK) {
    await sleep(100);
    return Date.now();
  }

  const res = await http.post<{ venueId?: string | number }>("/concertVenues", payload);
  const venueId = Number(res.data?.venueId);

  if (!Number.isFinite(venueId)) {
    throw new Error("Failed to create venue.");
  }

  return venueId;
}

export async function createConcertBand(payload: CreateConcertBandDto): Promise<number> {
  if (USE_MOCK) {
    await sleep(100);
    return Date.now();
  }

  const res = await http.post<{ bandId?: string | number }>("/concertBands", payload);
  const bandId = Number(res.data?.bandId);

  if (!Number.isFinite(bandId)) {
    throw new Error("Failed to create band.");
  }

  return bandId;
}

export async function createConcertEvent(payload: CreateConcertEventDto): Promise<number> {
  if (USE_MOCK) {
    await sleep(120);
    return Date.now();
  }

  const res = await http.post<{ eventId?: string | number }>("/concertEvents", payload);
  const eventId = Number(res.data?.eventId);

  if (!Number.isFinite(eventId)) {
    throw new Error("Failed to create event.");
  }

  return eventId;
}

export async function createEventBand(payload: CreateEventBandDto): Promise<void> {
  if (USE_MOCK) {
    await sleep(50);
    return;
  }

  await http.post("/eventBands", {
    ...payload,
    eventId: payload.event_id,
    bandId: payload.band_id,
  });
}
