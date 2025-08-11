// Inject header/footer fragments, then localize them safely.
async function injectComponents() {
  const targets = document.querySelectorAll("[data-component]");
  await Promise.all([...targets].map(async (t) => {
    const name = t.getAttribute("data-component");
    const res = await fetch(`public/components/${name}.html`, { cache: "no-cache" });
    const html = await res.text();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html.trim();
    t.replaceWith(...wrapper.childNodes);
  }));

  // Apply i18n:
  // - if translations already loaded, apply now
  // - otherwise, wait for the load event once
  if (window.I18N?.data && typeof window.i18nApply === "function") {
    window.i18nApply(document);
  } else {
    document.addEventListener("i18n:loaded", () => {
      if (typeof window.i18nApply === "function") window.i18nApply(document);
    }, { once: true });
  }
}

document.addEventListener("DOMContentLoaded", injectComponents);
