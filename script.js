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
    const target = document.querySelector("#exhibitions");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
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
    area: "Downtown",
    position: [43.6500, -79.3737],
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
   ABOUT PAGE SMOKE REVEAL
----------------------------- */
function initAboutSmoke() {
  const reveal = document.getElementById("aboutReveal");
  const noise = document.getElementById("smokeNoise");
  const displace = document.getElementById("smokeDisplace");
  const blobs = Array.from(document.querySelectorAll("[data-smoke-blob]"));

  if (!reveal || !noise || !displace || blobs.length === 0) return;

  let targetX = 50;
  let targetY = 50;
  let currentX = 50;
  let currentY = 50;
  let active = false;
  let rafId = null;

  function pointerToViewBox(clientX, clientY) {
    const rect = reveal.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    targetX = Math.max(0, Math.min(100, x));
    targetY = Math.max(0, Math.min(100, y));
  }

  function onMove(e) {
    active = true;
    pointerToViewBox(e.clientX, e.clientY);
  }

  function onTouchMove(e) {
    const touch = e.touches[0];
    if (!touch) return;
    active = true;
    pointerToViewBox(touch.clientX, touch.clientY);
  }

  reveal.addEventListener("pointermove", onMove);
  reveal.addEventListener("pointerenter", onMove);
  reveal.addEventListener("pointerleave", () => {
    active = false;
  });

  reveal.addEventListener("touchstart", onTouchMove, { passive: true });
  reveal.addEventListener("touchmove", onTouchMove, { passive: true });
  reveal.addEventListener("touchend", () => {
    active = false;
  });

  function setEllipse(el, cx, cy, rx, ry) {
    el.setAttribute("cx", cx.toFixed(2));
    el.setAttribute("cy", cy.toFixed(2));
    el.setAttribute("rx", rx.toFixed(2));
    el.setAttribute("ry", ry.toFixed(2));
  }

  function animate(now) {
    const t = now * 0.001;

    currentX += (targetX - currentX) * (active ? 0.16 : 0.08);
    currentY += (targetY - currentY) * (active ? 0.16 : 0.08);

    const isMobile = window.innerWidth < 700;
    const base = active ? (isMobile ? 10.5 : 12.8) : (isMobile ? 7.2 : 8.4);

    const wobbleA = Math.sin(t * 2.1);
    const wobbleB = Math.cos(t * 1.7);
    const wobbleC = Math.sin(t * 1.3 + 1.2);
    const wobbleD = Math.cos(t * 1.9 + 0.8);

    setEllipse(blobs[0], currentX, currentY, base + wobbleA * 0.9, base * 0.82 + wobbleB * 0.7);
    setEllipse(blobs[1], currentX + 3.5 + wobbleB * 1.8, currentY - 2.2 + wobbleC * 1.5, base * 0.9, base * 0.68);
    setEllipse(blobs[2], currentX - 4.2 + wobbleC * 1.7, currentY + 2.8 + wobbleA * 1.4, base * 0.78, base * 0.62);
    setEllipse(blobs[3], currentX + 1.6 + wobbleD * 2.0, currentY + 5.0 + wobbleB * 1.2, base * 0.72, base * 0.56);
    setEllipse(blobs[4], currentX + 6.0 + wobbleA * 1.6, currentY + 1.0 + wobbleD * 1.6, base * 0.6, base * 0.5);
    setEllipse(blobs[5], currentX - 5.8 + wobbleB * 1.5, currentY - 4.1 + wobbleC * 1.3, base * 0.64, base * 0.5);

    const freqX = 0.012 + Math.sin(t * 0.65) * 0.0022;
    const freqY = 0.021 + Math.cos(t * 0.78) * 0.0031;
    noise.setAttribute("baseFrequency", `${freqX.toFixed(4)} ${freqY.toFixed(4)}`);

    const scale = active ? 30 + Math.sin(t * 1.6) * 3 : 18 + Math.sin(t * 1.2) * 2;
    displace.setAttribute("scale", scale.toFixed(2));

    rafId = requestAnimationFrame(animate);
  }

  rafId = requestAnimationFrame(animate);

  window.addEventListener("beforeunload", () => {
    if (rafId) cancelAnimationFrame(rafId);
  });
}