import { I18N, applyI18n } from "./app.js";

let WORKS = null;

async function loadWorks() {
  if (WORKS) return WORKS;
  const res = await fetch("public/data/works.json", { cache: "no-cache" });
  WORKS = await res.json();
  return WORKS;
}

function bySlug(slug) {
  return WORKS.categories.find(c => c.slug === slug);
}

function categoryCard(cat) {
  const count = cat.items?.length || 0;
  const title = cat.title?.[I18N.lang] || cat.title?.en || "";
  const desc  = cat.desc?.[I18N.lang]  || cat.desc?.en  || "";
  return `
    <button class="group text-left rounded-2xl bg-white hover:shadow-soft border overflow-hidden"
            data-slug="${cat.slug}">
      <div class="aspect-[4/3] w-full overflow-hidden">
        <img src="${cat.cover}" alt="${title}" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]">
      </div>
      <div class="p-4">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">${title}</h3>
          <span class="text-xs text-slate-500">${count}</span>
        </div>
        <p class="mt-1 text-sm text-slate-600">${desc}</p>
      </div>
    </button>
  `;
}

function renderCategoryList() {
  const mount = document.getElementById("worksMount");
  const cats = WORKS.categories;
  mount.innerHTML = `
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      ${cats.map(categoryCard).join("")}
    </div>
  `;
  applyI18n(mount);

  document.getElementById("worksBackBtn").classList.add("hidden");
  mount.querySelectorAll("[data-slug]").forEach(el => {
    el.addEventListener("click", () => {
      const slug = el.getAttribute("data-slug");
      location.hash = `#${slug}`;
    });
  });
}

function renderGallery(cat) {
  const mount = document.getElementById("worksMount");
  const title = cat.title?.[I18N.lang] || cat.title?.en || "";
  mount.innerHTML = `
    <div class="space-y-3">
      <h2 class="text-xl md:text-2xl font-semibold">${title}</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        ${cat.items.map(item => {
          const alt = item.alt?.[I18N.lang] || item.alt?.en || "";
          return `
            <a href="${item.src}" target="_blank" rel="noopener"
               class="block rounded-xl overflow-hidden bg-white border hover:shadow-soft">
              <img src="${item.src}" alt="${alt}" class="w-full h-40 md:h-44 lg:h-48 object-cover">
            </a>
          `;
        }).join("")}
      </div>
    </div>
  `;
  applyI18n(mount);
  document.getElementById("worksBackBtn").classList.remove("hidden");
}

async function route() {
  await loadWorks();
  const slug = decodeURIComponent(location.hash.replace(/^#/, "")) || "";
  if (!slug) {
    renderCategoryList();
  } else {
    const cat = bySlug(slug);
    if (cat) renderGallery(cat);
    else renderCategoryList();
  }
}

document.addEventListener("DOMContentLoaded", route);
window.addEventListener("hashchange", route);
// Re-render when language changes
document.addEventListener("i18n:changed", route);
document.addEventListener("i18n:loaded", route);

// Back button
document.addEventListener("click", (e) => {
  const back = e.target.closest("#worksBackBtn");
  if (!back) return;
  history.pushState("", document.title, window.location.pathname + window.location.search);
  route();
});
