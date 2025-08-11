import { I18N } from "./app.js";

/**
 * DentFabrix Carousel
 * - Vanilla JS
 * - Autoplay: 5s
 * - Keyboard: ← →, focusable controls
 * - Touch swipe
 * - Pause on hover or when window/tab not visible
 */
const AUTOPLAY_MS = 5000;

async function loadSlides() {
  const res = await fetch("public/data/carousel.json", { cache: "no-cache" });
  return res.json();
}

function createEl(tag, cls = "", attrs = {}) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function renderCarousel(container, slides) {
  container.innerHTML = "";

  // Shell
  const wrapper = createEl("div", "relative");
  const viewport = createEl(
    "div",
    "overflow-hidden rounded-2xl bg-white shadow-soft aspect-[4/3]",
    { "aria-roledescription": "carousel" }
  );
  const track = createEl("div", "flex h-full w-full transition-transform duration-500 ease-out");

  // Slides
  slides.forEach((s, idx) => {
    const slide = createEl(
      "div",
      "relative min-w-full h-full select-none",
      { role: "group", "aria-roledescription": "slide", "aria-label": `${idx + 1} / ${slides.length}` }
    );
    const img = createEl("img", "w-full h-full object-cover");
    img.src = s.src;
    img.alt = s.alt?.[I18N.lang] || s.alt?.en || "";
    slide.appendChild(img);
    track.appendChild(slide);
  });

  // Controls
  const btnBase = "absolute top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow focus:outline-none focus:ring";
  const prevBtn = createEl("button", `${btnBase} left-3`, { "aria-label": "Previous slide", type: "button" });
  prevBtn.innerHTML = `<span aria-hidden="true" class="text-xl">‹</span>`;

  const nextBtn = createEl("button", `${btnBase} right-3`, { "aria-label": "Next slide", type: "button" });
  nextBtn.innerHTML = `<span aria-hidden="true" class="text-xl">›</span>`;

  // Dots
  const dotsWrap = createEl("div", "absolute inset-x-0 bottom-3 flex items-center justify-center gap-2");
  const dots = slides.map((_, i) => {
    const b = createEl(
      "button",
      "h-2.5 w-2.5 rounded-full bg-white/60 hover:bg-white ring-1 ring-black/10 focus:outline-none focus:ring-2 focus:ring-df-blue",
      { type: "button", "aria-label": `Go to slide ${i + 1}`, "data-idx": String(i) }
    );
    dotsWrap.appendChild(b);
    return b;
  });

  viewport.appendChild(track);
  wrapper.appendChild(viewport);
  wrapper.appendChild(prevBtn);
  wrapper.appendChild(nextBtn);
  wrapper.appendChild(dotsWrap);
  container.appendChild(wrapper);

  // State
  let current = 0;
  let timer = null;
  let pointerStartX = 0;
  let pointerDeltaX = 0;

  function goTo(i, { animate = true } = {}) {
    current = (i + slides.length) % slides.length;
    track.style.transitionDuration = animate ? "500ms" : "0ms";
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  function updateDots() {
    dots.forEach((d, i) => {
      if (i === current) {
        d.classList.add("bg-white");
        d.setAttribute("aria-current", "true");
      } else {
        d.classList.remove("bg-white");
        d.removeAttribute("aria-current");
      }
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function start() {
    stop();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Events
  nextBtn.addEventListener("click", () => { next(); start(); });
  prevBtn.addEventListener("click", () => { prev(); start(); });
  dots.forEach((d) => d.addEventListener("click", (e) => {
    const idx = parseInt(e.currentTarget.getAttribute("data-idx"), 10);
    goTo(idx);
    start();
  }));

  // Keyboard on wrapper
  wrapper.tabIndex = 0;
  wrapper.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { next(); start(); }
    if (e.key === "ArrowLeft") { prev(); start(); }
  });

  // Pause on hover/focus
  wrapper.addEventListener("mouseenter", stop);
  wrapper.addEventListener("mouseleave", start);
  wrapper.addEventListener("focusin", stop);
  wrapper.addEventListener("focusout", start);

  // Touch/Pointer swipe
  viewport.addEventListener("pointerdown", (e) => {
    pointerStartX = e.clientX;
    pointerDeltaX = 0;
    stop();
    viewport.setPointerCapture(e.pointerId);
  });
  viewport.addEventListener("pointermove", (e) => {
    if (!pointerStartX) return;
    pointerDeltaX = e.clientX - pointerStartX;
    const offsetPct = (pointerDeltaX / viewport.clientWidth) * 100;
    track.style.transitionDuration = "0ms";
    track.style.transform = `translateX(calc(-${current * 100}% + ${offsetPct}%))`;
  });
  viewport.addEventListener("pointerup", (e) => {
    const threshold = viewport.clientWidth * 0.15; // 15%
    if (Math.abs(pointerDeltaX) > threshold) {
      pointerDeltaX < 0 ? next() : prev();
    } else {
      goTo(current); // snap back
    }
    pointerStartX = 0;
    pointerDeltaX = 0;
    start();
  });

  // Pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  // Init
  goTo(0, { animate: false });
  start();
}

async function initCarousel() {
  const mount = document.getElementById("dfCarousel");
  if (!mount) return;
  const slides = await loadSlides();
  renderCarousel(mount, slides);
}

// Re-render when language changes (optional)
window.addEventListener("storage", (e) => {
  if (e.key === "lang") initCarousel();
});

document.addEventListener("DOMContentLoaded", initCarousel);
