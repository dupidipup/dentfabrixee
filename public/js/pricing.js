import { I18N, applyI18n, t } from "./app.js";

async function getPricing() {
  const res = await fetch("/public/data/pricelist.json");
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

async function renderPricing() {
  const items = await getPricing();
  const lang = I18N.lang || "et";
  const html = `
    <div class="hidden md:block">${desktopTable(items, lang)}</div>
    ${mobileCards(items, lang)}
  `;
  const container = document.getElementById("priceTable");
  container.innerHTML = html;
  applyI18n(container);
}

function setupPrint() {
  const btn = document.getElementById("downloadPdf");
  btn?.addEventListener("click", () => {
    window.print();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPricing();
  setupPrint();
});
