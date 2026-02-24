const chips = document.querySelectorAll(".chip");
const events = document.querySelectorAll(".event-card");

chips.forEach(chip => {
  chip.addEventListener("click", () => {

    // Remove active state
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");

    const filter = chip.dataset.filter;

    events.forEach(event => {
      if (filter === "all") {
        event.style.display = "grid";
      } else {
        if (event.dataset.type === filter) {
          event.style.display = "grid";
        } else {
          event.style.display = "none";
        }
      }
    });
  });
});

// map 
var map = L.map('map').setView([51.505, -0.09], 13);

// --- Smooth scroll for hero button ---

const exploreBtn = document.querySelector(".btn-primary");

if (exploreBtn) {
  exploreBtn.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector("#exhibitions").scrollIntoView({
      behavior: "smooth"
    });
  });
}