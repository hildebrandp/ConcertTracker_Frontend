<template>
  <div class="concerts-page">
    <!-- Header -->
    <header class="stats">
      <h2>Visited Concerts: {{ visitedConcerts }}</h2>
      <h2>Seen Bands: {{ seenBands }}</h2>
    </header>

    <!-- Concerts List -->
    <section class="concerts-list">
      <h3>All Concerts</h3>
      <ul>
        <li v-for="concert in concerts" :key="concert.id">
          <h4>{{ concert.name }}</h4>
          <p>Date: {{ concert.datetime }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios from "axios";

interface Concert {
  id: number;
  name: string;
  datetime: string;
}

export default defineComponent({
  name: "Concerts",
  setup() {
    const visitedConcerts = ref(0);
    const seenBands = ref(0);
    const concerts = ref<Concert[]>([]);
    const bands = ref<Concert[]>([]);

    // Fetch data from the backend
    const fetchConcerts = async () => {
      try {
        const response = await axios.get("http://localhost:4242/api/concertEvents");
        concerts.value = response.data;

        // Calculate stats
        visitedConcerts.value = concerts.value.length;
        console.log("Got Concerts for " + concerts.value.length);
      } catch (error) {
        console.error("Error fetching concerts:", error);
      }
    };

    const fetchBands = async () => {
      try {
        const response = await axios.get("http://localhost:4242/api/concertBands");
        bands.value = response.data;

        // Calculate stats
        seenBands.value = bands.value.length;
        console.log("Got Bands for " + bands.value.length);
      } catch (error) {
        console.error("Error fetching concerts:", error);
      }
    };

    // Fetch concerts when component is mounted
    onMounted(fetchConcerts);
    onMounted(fetchBands);

    return { visitedConcerts, seenBands, concerts };
  },
});
</script>

<style>
.concerts-page {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.stats {
  margin-bottom: 20px;
}

.concerts-list ul {
  list-style-type: none;
  padding: 0;
}

.concerts-list li {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.concerts-list h4 {
  margin: 0;
}
</style>