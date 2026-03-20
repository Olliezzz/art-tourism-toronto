const errorStage = document.getElementById("error-stage");
const posterFragments = Array.from(document.querySelectorAll(".poster-fragment"));

if (errorStage && posterFragments.length > 0) {
  const isTouchDevice = window.matchMedia("(hover: none)").matches;

  function randomOffset(range) {
    return (Math.random() * range * 2 - range).toFixed(1);
  }

  function revealFragments() {
    posterFragments.forEach((fragment, index) => {
      const drift = isTouchDevice ? 10 : 18;
      fragment.style.setProperty("--tx", `${randomOffset(drift)}px`);
      fragment.style.setProperty("--ty", `${randomOffset(drift)}px`);
      fragment.classList.add("is-revealed");
      fragment.style.transitionDelay = `${index * 22}ms`;
    });
  }

  function settleFragments() {
    posterFragments.forEach((fragment) => {
      fragment.style.setProperty("--tx", "0px");
      fragment.style.setProperty("--ty", "0px");
      fragment.classList.remove("is-revealed");
      fragment.style.transitionDelay = "0ms";
    });
  }

  let settleTimeout;

  function pulseReveal() {
    window.clearTimeout(settleTimeout);
    revealFragments();
    settleTimeout = window.setTimeout(settleFragments, isTouchDevice ? 1800 : 1200);
  }

  errorStage.addEventListener("pointerdown", pulseReveal);

  if (!isTouchDevice) {
    errorStage.addEventListener("pointermove", pulseReveal);
    errorStage.addEventListener("pointerleave", settleFragments);
  }
}
