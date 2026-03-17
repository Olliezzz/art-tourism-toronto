const chips = document.querySelectorAll(".chip");
const events = document.querySelectorAll(".event-card");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;

    events.forEach((event) => {
      if (filter === "all") {
        event.style.display = "grid";
      } else {
        event.style.display = event.dataset.type === filter ? "grid" : "none";
      }
    });
  });
});

const exploreBtn = document.querySelector(".hero-actions .btn-primary");

if (exploreBtn) {
  exploreBtn.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector("#exhibitions").scrollIntoView({
      behavior: "smooth"
    });
  });
}

const places = [
  {
    name: "Art Gallery of Ontario",
    type: "museum",
    price: "ticketed",
    area: "Downtown",
    position: [43.6536, -79.3925],
    description: "Major collections and special exhibitions.",
    link: "https://ago.ca/"
  },
  {
    name: "Museum of Contemporary Art Toronto",
    type: "museum",
    price: "ticketed",
    area: "Junction Triangle",
    position: [43.6655, -79.4472],
    description: "Contemporary museum with rotating installations.",
    link: "https://moca.ca/"
  },
  {
    name: "The Power Plant",
    type: "museum",
    price: "free",
    area: "Harbourfront",
    position: [43.6388, -79.3826],
    description: "Contemporary visual art gallery on the waterfront.",
    link: "https://www.thepowerplant.org/"
  },
  {
    name: "The Bentway",
    type: "museum",
    price: "free",
    area: "Fort York",
    position: [43.6380, -79.4000],
    description: "Public art and programming under the Gardiner.",
    link: "https://thebentway.ca/"
  },
  {
    name: "Toronto Biennial of Art 2026",
    type: "exhibition",
    price: "free",
    area: "Toronto",
    position: [43.6450, -79.3950],
    description: "Large-scale contemporary exhibitions across the city.",
    link: "https://torontobiennial.org/"
  },
  {
    name: "Artist Project 2026",
    type: "exhibition",
    price: "ticketed",
    area: "Exhibition Place",
    position: [43.6338, -79.4187],
    description: "Independent artists from across Canada.",
    link: "https://theartistproject.com/home/"
  }
];

let map;
let markers = [];

function initLeafletMap() {
  const mapElement = document.getElementById("map");

  if (!mapElement || typeof L === "undefined") return;

  map = L.map("map").setView([43.6532, -79.3832], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  setupMapUI();
  updateMapAndList(places);

  setTimeout(() => {
    map.invalidateSize();
  }, 100);
}

function setupMapUI() {
  const mapChips = document.querySelectorAll(".map-chip");
  const searchInput = document.getElementById("map-search");

  mapChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      mapChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      applyMapFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyMapFilters);
  }
}

function applyMapFilters() {
  const activeChip = document.querySelector(".map-chip.active");
  const currentFilter = activeChip ? activeChip.dataset.mapFilter : "all";

  const searchInput = document.getElementById("map-search");
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const filteredPlaces = places.filter((place) => {
    const matchesFilter =
      currentFilter === "all" ||
      place.type === currentFilter ||
      place.price === currentFilter;

    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm) ||
      place.area.toLowerCase().includes(searchTerm) ||
      place.description.toLowerCase().includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  updateMapAndList(filteredPlaces);
}

function updateMapAndList(filteredPlaces) {
  clearMarkers();
  renderMapResults(filteredPlaces);

  if (!map) return;

  if (filteredPlaces.length === 0) {
    map.setView([43.6532, -79.3832], 11);
    return;
  }

  const bounds = [];

  filteredPlaces.forEach((place) => {
    const marker = L.marker(place.position)
      .addTo(map)
      .bindPopup(`
        <div style="max-width:220px;">
          <h3 style="margin:0 0 8px 0;">${place.name}</h3>
          <p style="margin:0 0 6px 0;"><strong>${capitalize(place.type)}</strong> · ${place.area}</p>
          <p style="margin:0 0 8px 0;">${place.description}</p>
          <a href="${place.link}" target="_blank" rel="noopener noreferrer">Visit website →</a>
        </div>
      `);

    markers.push(marker);
    bounds.push(place.position);
  });

  if (bounds.length === 1) {
    map.setView(bounds[0], 14);
  } else {
    map.fitBounds(bounds, { padding: [30, 30] });
  }
}

function clearMarkers() {
  if (!map) return;
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];
}

function renderMapResults(items) {
  const results = document.getElementById("map-results");
  if (!results) return;

  if (items.length === 0) {
    results.innerHTML = `<p>No museums or exhibitions found.</p>`;
    return;
  }

  results.innerHTML = items.map((item) => `
    <article class="map-result-card">
      <h3 class="map-result-title">${item.name}</h3>
      <p class="map-result-meta">${capitalize(item.type)} · ${item.area} · ${capitalize(item.price)}</p>
      <p class="map-result-desc">${item.description}</p>
      <a class="map-result-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
        Visit website →
      </a>
    </article>
  `).join("");
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

window.addEventListener("load", () => {
  initLeafletMap();
});