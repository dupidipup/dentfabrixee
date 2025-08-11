const I18N = { data: null, lang: "et" };

async function loadI18n() {
  I18N.lang = localStorage.getItem("lang") || "et";
  const res = await fetch("/public/data/translation.json");
  I18N.data = await res.json();
  applyI18n();
}

function t(key) {
  return I18N?.data?.[key]?.[I18N.lang] || "";
}

function applyI18n(root = document) {
  document.documentElement.setAttribute("lang", I18N.lang);
  root.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const val = t(key);
    if (val) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.setAttribute("placeholder", val);
      } else {
        el.textContent = val;
      }
    }
  });
}

function setupLangToggle() {
  document.getElementById("langToggle")?.addEventListener("click", () => {
    I18N.lang = I18N.lang === "et" ? "en" : "et";
    localStorage.setItem("lang", I18N.lang);
    applyI18n(document);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadI18n().then(setupLangToggle);
});

export { I18N, t, applyI18n };
