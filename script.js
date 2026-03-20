const exhibitionItems = [
  {
    id: "toronto-biennial-2026",
    name: "Toronto Biennial of Art 2026",
    category: "contemporary",
    area: "Downtown",
    format: "Free / Ticketed",
    description: "Large-scale contemporary exhibitions across the city.",
    link: "https://torontobiennial.org/",
    startDate: "2026-03-26",
    endDate: "2026-06-21",
    posterLabel: "Citywide Biennial",
    posterTone: "cyan"
  },
  {
    id: "moca-installations-2026",
    name: "MOCA - New Installations",
    category: "installation",
    area: "Junction Triangle",
    format: "Museum",
    description: "Rotating installations and contemporary programming.",
    link: "https://moca.ca/",
    startDate: "2026-04-12",
    endDate: "2026-08-30",
    posterLabel: "MOCA Program",
    posterTone: "acid"
  },
  {
    id: "artist-project-2026",
    name: "Artist Project 2026",
    category: "contemporary",
    area: "Downtown",
    format: "Ticketed",
    description: "Discover original works from over 200 independent artists from across Canada.",
    link: "https://theartistproject.com/home/",
    startDate: "2026-03-26",
    endDate: "2026-03-29",
    posterLabel: "Artist Fair",
    posterTone: "violet"
  },
  {
    id: "nuit-blanche-2025",
    name: "Nuit Blanche Toronto",
    category: "contemporary",
    area: "Citywide",
    format: "Night event",
    description: "All-night installations and citywide public art interventions.",
    link: "https://www.toronto.ca/explore-enjoy/festivals-events/nuitblanche/",
    startDate: "2025-10-04",
    endDate: "2025-10-05",
    posterLabel: "Night Route",
    posterTone: "hot"
  },
  {
    id: "toronto-biennial-2024",
    name: "Toronto Biennial of Art",
    category: "contemporary",
    area: "Multi-venue",
    format: "Archive",
    description: "A previous citywide edition focused on multi-site contemporary commissions.",
    link: "https://torontobiennial.org/",
    startDate: "2024-09-21",
    endDate: "2024-12-01",
    posterLabel: "Biennial 2024",
    posterTone: "cyan"
  },
  {
    id: "harbourfront-summer-shows-2023",
    name: "Harbourfront Summer Shows",
    category: "installation",
    area: "Waterfront",
    format: "Festival",
    description: "Seasonal waterfront exhibitions and outdoor programming.",
    link: "https://harbourfrontcentre.com/",
    startDate: "2023-06-10",
    endDate: "2023-08-27",
    posterLabel: "Summer Series",
    posterTone: "acid"
  }
];

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

const MONTH_NAMES = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const CHAT_STORAGE_KEY = "art-tourism-peer-chat";
let map;
let markers = [];
let currentFilteredPlaces = [];
let resultsExpanded = false;
let activeExhibitionFilter = "all";

function parseDate(value) {
  return new Date(`${value}T00:00:00`);
}

function getToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatDisplayDate(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const sameMonth = start.getMonth() === end.getMonth();
  const sameDay = start.getTime() === end.getTime();

  if (sameDay) {
    return {
      day: String(start.getDate()),
      month: MONTH_NAMES[start.getMonth()]
    };
  }

  if (sameMonth) {
    return {
      day: `${start.getDate()} - ${end.getDate()}`,
      month: MONTH_NAMES[start.getMonth()]
    };
  }

  return {
    day: `${start.getDate()} ${MONTH_NAMES[start.getMonth()]}`,
    month: `${end.getDate()} ${MONTH_NAMES[end.getMonth()]}`
  };
}

function createPosterMarkup(item) {
  const year = parseDate(item.startDate).getFullYear();

  return `
    <a
      class="poster-placeholder poster-tone-${item.posterTone}"
      href="${item.link}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open poster link for ${escapeHtml(item.name)}"
    >
      <span class="poster-art" aria-hidden="true">
        <span class="poster-stamp">Poster</span>
        <span class="poster-title">${escapeHtml(item.posterLabel)}</span>
        <span class="poster-year">${year}</span>
      </span>
    </a>
  `;
}

function renderExhibitions() {
  const container = document.getElementById("upcoming-exhibitions");
  if (!container) return;

  const today = getToday();
  const upcoming = exhibitionItems
    .filter((item) => parseDate(item.endDate) >= today)
    .filter((item) => activeExhibitionFilter === "all" || item.category === activeExhibitionFilter)
    .sort((a, b) => parseDate(a.startDate) - parseDate(b.startDate));

  if (upcoming.length === 0) {
    container.innerHTML = `
      <article class="card event-card event-card-empty">
        <div class="event-body">
          <h3 class="card-title">No exhibitions in this filter</h3>
          <p class="card-desc">Try another category or browse the archive below.</p>
        </div>
      </article>
    `;
    return;
  }

  container.innerHTML = upcoming
    .map((item, index) => {
      const displayDate = formatDisplayDate(item.startDate, item.endDate);
      const altClass = index % 2 === 1 ? " alt" : "";

      return `
        <article class="card event-card${altClass}" data-type="${item.category}">
          <div class="event-date">
            <span class="date-num">${displayDate.day}</span>
            <span class="date-mon">${displayDate.month}</span>
          </div>

          <div class="event-body">
            <h3 class="card-title">${escapeHtml(item.name)}</h3>
            <p class="meta">
              <span class="tag">${capitalize(item.category)}</span>
              <span class="tag">${escapeHtml(item.area)}</span>
              <span class="tag">${escapeHtml(item.format)}</span>
            </p>
            <p class="card-desc">${escapeHtml(item.description)}</p>
            <a class="btn btn-small" href="${item.link}" target="_blank" rel="noopener noreferrer">More about the event →</a>
          </div>

          <div class="event-media">
            ${createPosterMarkup(item)}
          </div>
        </article>
      `;
    })
    .join("");
}

function renderArchive() {
  const container = document.getElementById("archive-list");
  if (!container) return;

  const today = getToday();
  const archived = exhibitionItems
    .filter((item) => parseDate(item.endDate) < today)
    .sort((a, b) => parseDate(b.endDate) - parseDate(a.endDate));

  container.innerHTML = archived
    .map((item) => `
      <li class="archive-item">
        <span class="archive-year">${parseDate(item.endDate).getFullYear()}</span>
        <span class="archive-title">${escapeHtml(item.name)}</span>
        <span class="archive-type">${capitalize(item.category)} / ${escapeHtml(item.area)}</span>
      </li>
    `)
    .join("");
}

function initExhibitionFilters() {
  const chips = document.querySelectorAll(".chip");
  if (chips.length === 0) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((item) => item.classList.remove("active"));
      chip.classList.add("active");
      activeExhibitionFilter = chip.dataset.filter || "all";
      renderExhibitions();
    });
  });
}

function initPrimaryActions() {
  const exploreBtn = document.querySelector(".hero-actions .btn-primary");
  if (!exploreBtn) return;

  exploreBtn.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("#exhibitions")?.scrollIntoView({ behavior: "smooth" });
  });
}

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

  window.setTimeout(() => {
    map.invalidateSize();
  }, 100);
}

function setupMapUI() {
  const mapChips = document.querySelectorAll(".map-chip");
  const searchInput = document.getElementById("map-search");

  mapChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      mapChips.forEach((item) => item.classList.remove("active"));
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
          <h3>${escapeHtml(place.name)}</h3>
          <p><strong>${capitalize(place.type)}</strong> · ${escapeHtml(place.area)}</p>
          <p>${escapeHtml(place.description)}</p>
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

function clearMarkers() {
  if (!map) return;
  markers.forEach((item) => map.removeLayer(item.marker));
  markers = [];
}

function renderMapResults(items, searchTerm = "") {
  const results = document.getElementById("map-results");
  if (!results) return;

  if (items.length === 0) {
    results.innerHTML = `<p class="map-empty-state">No museums or exhibitions found.</p>`;
    return;
  }

  results.innerHTML = items
    .map((item) => {
      const hasSearchMatch = searchTerm.length > 0;
      return `
        <article class="map-result-card ${hasSearchMatch ? "is-match" : ""}" data-place-name="${item.name}">
          <h3 class="map-result-title">${escapeHtml(item.name)}</h3>
          <p class="map-result-meta">${capitalize(item.type)} · ${escapeHtml(item.area)} · ${capitalize(item.price)}</p>
          <p class="map-result-desc">${escapeHtml(item.description)}</p>
          <a class="map-result-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
            Visit website →
          </a>
        </article>
      `;
    })
    .join("");

  attachResultCardEvents();
}

function attachResultCardEvents() {
  const cards = document.querySelectorAll(".map-result-card");

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;

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

function initPeerChat() {
  const form = document.getElementById("peer-chat-form");
  const nameInput = document.getElementById("peer-name");
  const messageInput = document.getElementById("peer-message");
  const container = document.getElementById("peer-chat-messages");
  if (!form || !nameInput || !messageInput || !container) return;

  let storedMessages = loadChatMessages();
  renderChatMessages(storedMessages);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();
    const author = nameInput.value.trim() || "Guest";
    if (!message) return;

    const nextMessages = [
      ...storedMessages,
      {
        author,
        message,
        createdAt: new Date().toISOString()
      }
    ].slice(-12);

    storedMessages = nextMessages;
    saveChatMessages(nextMessages);
    renderChatMessages(nextMessages);
    messageInput.value = "";
    messageInput.focus();
  });
}

function loadChatMessages() {
  try {
    const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveChatMessages(messages) {
  window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
}

function renderChatMessages(messages) {
  const container = document.getElementById("peer-chat-messages");
  if (!container) return;

  if (messages.length === 0) {
    container.innerHTML = `
      <article class="peer-message peer-message-empty">
        <p class="peer-message-body">No messages yet. Add a quick tip, route idea, or note for the next visitor.</p>
      </article>
    `;
    return;
  }

  container.innerHTML = messages
    .map((item) => `
      <article class="peer-message">
        <div class="peer-message-head">
          <strong class="peer-message-author">${escapeHtml(item.author)}</strong>
          <span class="peer-message-time">${new Date(item.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</span>
        </div>
        <p class="peer-message-body">${escapeHtml(item.message)}</p>
      </article>
    `)
    .join("");
}

function initHeaderShrink() {
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelectorAll(".nav .nav-link");
  if (!header) return;

  function closeMenu() {
    header.classList.remove("is-menu-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
    }
  }

  function updateHeaderState() {
    header.classList.toggle("is-condensed", window.scrollY > 48);

    if (window.innerWidth < 768 && window.scrollY > 12) {
      closeMenu();
    }

    if (window.innerWidth >= 768) {
      closeMenu();
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const nextExpanded = navToggle.getAttribute("aria-expanded") !== "true";
      header.classList.toggle("is-menu-open", nextExpanded);
      navToggle.setAttribute("aria-expanded", String(nextExpanded));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) {
        closeMenu();
      }
    });
  });

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("resize", updateHeaderState);
}

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

  function onMove(event) {
    active = true;
    pointerToViewBox(event.clientX, event.clientY);
  }

  function onTouchMove(event) {
    const touch = event.touches[0];
    if (!touch) return;
    active = true;
    pointerToViewBox(touch.clientX, touch.clientY);
  }

  function onWindowPointerMove(event) {
    const rect = reveal.getBoundingClientRect();
    const withinX = event.clientX >= rect.left && event.clientX <= rect.right;
    const withinY = event.clientY >= rect.top && event.clientY <= rect.bottom;

    if (!withinX || !withinY) {
      active = false;
      return;
    }

    onMove(event);
  }

  reveal.addEventListener("pointerenter", onMove);
  reveal.addEventListener("pointerleave", () => {
    active = false;
  });
  window.addEventListener("pointermove", onWindowPointerMove);

  reveal.addEventListener("touchstart", onTouchMove, { passive: true });
  reveal.addEventListener("touchmove", onTouchMove, { passive: true });
  reveal.addEventListener("touchend", () => {
    active = false;
  });

  function setEllipse(element, cx, cy, rx, ry) {
    element.setAttribute("cx", cx.toFixed(2));
    element.setAttribute("cy", cy.toFixed(2));
    element.setAttribute("rx", rx.toFixed(2));
    element.setAttribute("ry", ry.toFixed(2));
  }

  function animate(now) {
    const time = now * 0.001;

    currentX += (targetX - currentX) * (active ? 0.16 : 0.08);
    currentY += (targetY - currentY) * (active ? 0.16 : 0.08);

    const isMobile = window.innerWidth < 700;
    const base = active ? (isMobile ? 10.5 : 12.8) : (isMobile ? 7.2 : 8.4);

    const wobbleA = Math.sin(time * 2.1);
    const wobbleB = Math.cos(time * 1.7);
    const wobbleC = Math.sin(time * 1.3 + 1.2);
    const wobbleD = Math.cos(time * 1.9 + 0.8);

    setEllipse(blobs[0], currentX, currentY, base + wobbleA * 0.9, base * 0.82 + wobbleB * 0.7);
    setEllipse(blobs[1], currentX + 3.5 + wobbleB * 1.8, currentY - 2.2 + wobbleC * 1.5, base * 0.9, base * 0.68);
    setEllipse(blobs[2], currentX - 4.2 + wobbleC * 1.7, currentY + 2.8 + wobbleA * 1.4, base * 0.78, base * 0.62);
    setEllipse(blobs[3], currentX + 1.6 + wobbleD * 2.0, currentY + 5.0 + wobbleB * 1.2, base * 0.72, base * 0.56);
    setEllipse(blobs[4], currentX + 6.0 + wobbleA * 1.6, currentY + 1.0 + wobbleD * 1.6, base * 0.6, base * 0.5);
    setEllipse(blobs[5], currentX - 5.8 + wobbleB * 1.5, currentY - 4.1 + wobbleC * 1.3, base * 0.64, base * 0.5);

    const freqX = 0.012 + Math.sin(time * 0.65) * 0.0022;
    const freqY = 0.021 + Math.cos(time * 0.78) * 0.0031;
    noise.setAttribute("baseFrequency", `${freqX.toFixed(4)} ${freqY.toFixed(4)}`);

    const scale = active ? 30 + Math.sin(time * 1.6) * 3 : 18 + Math.sin(time * 1.2) * 2;
    displace.setAttribute("scale", scale.toFixed(2));

    rafId = requestAnimationFrame(animate);
  }

  rafId = requestAnimationFrame(animate);

  window.addEventListener("beforeunload", () => {
    if (rafId) cancelAnimationFrame(rafId);
  });

  window.addEventListener("pointerleave", () => {
    active = false;
  });
}

window.addEventListener("load", () => {
  renderExhibitions();
  renderArchive();
  initExhibitionFilters();
  initPrimaryActions();
  initLeafletMap();
  initPeerChat();
  initHeaderShrink();
  initAboutSmoke();
});
