import { I18N, applyI18n, t } from "./app.js";

async function getPricing() {
  const res = await fetch("public/data/pricelist.json", { cache: "no-cache" });
  return res.json();
}

function desktopTable(items, lang) {
  return `
  <table class="w-full text-left bg-white rounded-xl overflow-hidden shadow print-container">
    <thead class="bg-df-graycap/60">
      <tr>
        <th class="px-4 py-3">#</th>
        <th class="px-4 py-3">${t("service")}</th>
        <th class="px-4 py-3">${t("price")}</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((it, i) => `
        <tr class="border-t">
          <td class="px-4 py-3">${i + 1}</td>
          <td class="px-4 py-3">${it[lang]}</td>
          <td class="px-4 py-3">${it.price}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>`;
}

function mobileCards(items, lang) {
  return `
  <div class="md:hidden space-y-3">
    ${items.map((it, i) => `
      <div class="bg-white rounded-xl shadow p-4 grid grid-cols-2 gap-2">
        <div class="text-slate-500">#${i + 1}</div>
        <div class="text-right font-medium">${it.price}</div>
        <div class="col-span-2 font-medium">${it[lang]}</div>
      </div>
    `).join("")}
  </div>`;
}

let cachedItems = null;

async function renderPricing() {
  if (!cachedItems) cachedItems = await getPricing();
  const lang = I18N.lang || "et";
  const html = `
    <div class="hidden md:block">${desktopTable(cachedItems, lang)}</div>
    ${mobileCards(cachedItems, lang)}
  `;
  const container = document.getElementById("priceTable");
  if (!container) return;
  container.innerHTML = html;
  applyI18n(container);
}

function setupPrint() {
  const btn = document.getElementById("downloadPdf");
  btn?.addEventListener("click", () => window.print());
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderPricing();
  setupPrint();
});

// Re-render when language becomes available or changes
document.addEventListener("i18n:loaded", renderPricing);
document.addEventListener("i18n:changed", renderPricing);

// Also handle multi-tab sync
window.addEventListener("storage", (e) => {
  if (e.key === "lang" || e.key === "lang_sync") renderPricing();
});
