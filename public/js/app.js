const I18N = { data: null, lang: "et" };

async function loadI18n() {
  I18N.lang = localStorage.getItem("lang") || "et";

  const res = await fetch("public/data/translation.json", { cache: "no-cache" });
  I18N.data = await res.json();

  document.documentElement.setAttribute("lang", I18N.lang);
  applyI18n(document);

  window.I18N = I18N;
  window.i18nApply = applyI18n;

  document.dispatchEvent(new CustomEvent("i18n:loaded", { detail: { lang: I18N.lang } }));
}

function t(key) {
  return I18N?.data?.[key]?.[I18N.lang] || "";
}

function applyI18n(root = document) {
  if (!I18N.data) return; 
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

function setLang(newLang) {
  if (newLang !== "et" && newLang !== "en") return;
  if (I18N.lang === newLang) return;
  I18N.lang = newLang;
  try { localStorage.setItem("lang", newLang); } catch {}
  applyI18n(document);
  document.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: newLang } }));
  try { localStorage.setItem("lang_sync", String(Date.now())); } catch {}
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest("#langToggle");
  if (!btn) return;
  setLang(I18N.lang === "et" ? "en" : "et");
});

document.addEventListener("DOMContentLoaded", () => {
  loadI18n(); 
});

window.addEventListener("storage", (e) => {
  if (e.key === "lang" || e.key === "lang_sync") {
    const stored = localStorage.getItem("lang") || "et";
    if (stored !== I18N.lang) {
      I18N.lang = stored;
      applyI18n(document);
      document.dispatchEvent(new CustomEvent("i18n:changed", { detail: { lang: stored } }));
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadI18n().then(setupLangToggle);
});

export { I18N, t, applyI18n, setLang };
