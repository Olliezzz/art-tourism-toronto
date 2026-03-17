/* -----------------------------
   EXHIBITION FILTER CHIPS
----------------------------- */
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

/* -----------------------------
   HERO BUTTON SMOOTH SCROLL
----------------------------- */
const exploreBtn = document.querySelector(".hero-actions .btn-primary");

if (exploreBtn) {
  exploreBtn.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector("#exhibitions").scrollIntoView({
      behavior: "smooth"
    });
  });
}

/* -----------------------------
   MAP DATA
----------------------------- */
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
  },
  {
    name: "Royal Ontario Museum",
    type: "museum",
    price: "ticketed",
    area: "Bloor-Yorkville",
    position: [43.6677, -79.3948],
    description: "Major museum with art, culture, and natural history collections.",
    link: "https://www.rom.on.ca/"
  },
  {
    name: "Gardiner Museum",
    type: "museum",
    price: "ticketed",
    area: "Bloor-Yorkville",
    position: [43.6680, -79.3939],
    description: "Ceramic art museum across from the ROM.",
    link: "https://www.gardinermuseum.on.ca/"
  },
  {
    name: "Aga Khan Museum",
    type: "museum",
    price: "ticketed",
    area: "North York",
    position: [43.7256, -79.3327],
    description: "Museum of Islamic art, culture, and exhibitions.",
    link: "https://agakhanmuseum.org/"
  },
  {
    name: "Toronto Sculpture Garden",
    type: "street-art",
    price: "free",
    area: "Bloor-Yorkville",
    position: [43.6670, -79.3945],
    description: "Outdoor sculpture garden with rotating exhibits.",
    link: "https://www.torontosculpturegarden.ca/"
  }
];

/* -----------------------------
   MAP STATE
----------------------------- */
let map;
let markers = [];
let currentFilteredPlaces = [];
let resultsExpanded = false;

/* -----------------------------
   CUSTOM ICONS
----------------------------- */
function createCustomIcon(type) {
  return L.divIcon({
    className: "",
    html: `<div class="custom-marker ${type}"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -10]
  });
}

function setActiveMarker(placeName) {
  markers.forEach((markerObj) => {
    const markerEl = markerObj.marker.getElement()?.querySelector(".custom-marker");
    if (!markerEl) return;

    if (markerObj.place.name === placeName) {
      markerEl.classList.add("is-active");
    } else {
      markerEl.classList.remove("is-active");
    }
  });
}

/* -----------------------------
   INIT MAP
----------------------------- */
function initLeafletMap() {
  const mapElement = document.getElementById("map");

  if (!mapElement || typeof L === "undefined") return;

  map = L.map("map", {
  scrollWheelZoom: false,
  zoomControl: false,
  dragging: true,
  touchZoom: true,
  doubleClickZoom: true,
  boxZoom: false,
  keyboard: true
}).setView([43.6532, -79.3832], 11);

L.control.zoom({
  position: "topleft"
}).addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  setupMapUI();
  setupResultsToggle();
  updateMapAndList(places);

  setTimeout(() => {
    map.invalidateSize();
  }, 100);
}

/* -----------------------------
   MAP UI
----------------------------- */
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
    searchInput.addEventListener("input", () => {
      resultsExpanded = false;
      applyMapFilters();
    });
  }
}

function setupResultsToggle() {
  const toggleBtn = document.getElementById("map-results-toggle");
  if (!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    resultsExpanded = !resultsExpanded;
    updateResultsCollapseState(currentFilteredPlaces.length);
  });
}

function updateResultsCollapseState(totalItems) {
  const results = document.getElementById("map-results");
  const toggleBtn = document.getElementById("map-results-toggle");
  if (!results || !toggleBtn) return;

  const shouldCollapse = totalItems > 3 && !resultsExpanded;

  results.classList.toggle("is-collapsed", shouldCollapse);

  if (totalItems <= 3) {
    toggleBtn.style.display = "none";
  } else {
    toggleBtn.style.display = "inline-block";
    toggleBtn.textContent = resultsExpanded ? "Show fewer places" : "See more places";
    toggleBtn.setAttribute("aria-expanded", String(resultsExpanded));
  }
}

/* -----------------------------
   FILTERS
----------------------------- */
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

  updateMapAndList(filteredPlaces, searchTerm);
}

/* -----------------------------
   RENDER MAP + LIST
----------------------------- */
function updateMapAndList(filteredPlaces, searchTerm = "") {
  currentFilteredPlaces = filteredPlaces;
  clearMarkers();
  renderMapResults(filteredPlaces, searchTerm);
  updateResultsCollapseState(filteredPlaces.length);

  if (!map) return;

  if (filteredPlaces.length === 0) {
    map.setView([43.6532, -79.3832], 11);
    setActiveMarker("");
    return;
  }

  const bounds = [];

  filteredPlaces.forEach((place) => {
    const marker = L.marker(place.position, {
      icon: createCustomIcon(place.type)
    })
      .addTo(map)
      .bindPopup(`
        <div style="max-width:220px;">
          <h3>${place.name}</h3>
          <p><strong>${capitalize(place.type)}</strong> · ${place.area}</p>
          <p>${place.description}</p>
          <a href="${place.link}" target="_blank" rel="noopener noreferrer">Visit website →</a>
        </div>
      `);

    marker.on("click", () => {
      highlightSelectedCard(place.name);
      setActiveMarker(place.name);
    });

    markers.push({ marker, place });
    bounds.push(place.position);
  });

  if (bounds.length === 1) {
    map.setView(bounds[0], 14);
    markers[0].marker.openPopup();
    highlightSelectedCard(filteredPlaces[0].name);
    setActiveMarker(filteredPlaces[0].name);
  } else {
    map.fitBounds(bounds, { padding: [30, 30] });
  }
}

/* -----------------------------
   CLEAR MARKERS
----------------------------- */
function clearMarkers() {
  if (!map) return;
  markers.forEach((item) => map.removeLayer(item.marker));
  markers = [];
}

/* -----------------------------
   RESULTS LIST
----------------------------- */
function renderMapResults(items, searchTerm = "") {
  const results = document.getElementById("map-results");
  if (!results) return;

  if (items.length === 0) {
    results.innerHTML = `<p>No museums or exhibitions found.</p>`;
    return;
  }

  results.innerHTML = items.map((item) => {
    const hasSearchMatch = searchTerm.length > 0;
    return `
      <article class="map-result-card ${hasSearchMatch ? "is-match" : ""}" data-place-name="${item.name}">
        <h3 class="map-result-title">${item.name}</h3>
        <p class="map-result-meta">${capitalize(item.type)} · ${item.area} · ${capitalize(item.price)}</p>
        <p class="map-result-desc">${item.description}</p>
        <a class="map-result-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
          Visit website →
        </a>
      </article>
    `;
  }).join("");

  attachResultCardEvents();
}

/* -----------------------------
   RESULT CARD EVENTS
----------------------------- */
function attachResultCardEvents() {
  const cards = document.querySelectorAll(".map-result-card");

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;

      const placeName = card.dataset.placeName;
      const place = currentFilteredPlaces.find((item) => item.name === placeName);
      const markerObj = markers.find((item) => item.place.name === placeName);

      if (place && markerObj) {
        map.setView(place.position, 14);
        markerObj.marker.openPopup();
        highlightSelectedCard(placeName);
        setActiveMarker(placeName);
      }
    });

    card.addEventListener("mouseenter", () => {
      const placeName = card.dataset.placeName;
      setActiveMarker(placeName);
    });

    card.addEventListener("mouseleave", () => {
      const selectedCard = document.querySelector(".map-result-card.is-selected");
      if (selectedCard) {
        setActiveMarker(selectedCard.dataset.placeName);
      } else {
        setActiveMarker("");
      }
    });
  });
}

function highlightSelectedCard(placeName) {
  const cards = document.querySelectorAll(".map-result-card");

  cards.forEach((card) => {
    card.classList.remove("is-selected");
    if (card.dataset.placeName === placeName) {
      card.classList.add("is-selected");
    }
  });
}

/* -----------------------------
   HELPERS
----------------------------- */
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/* -----------------------------
   START
----------------------------- */
window.addEventListener("load", () => {
  initLeafletMap();
});