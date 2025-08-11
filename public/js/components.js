async function injectComponents() {
  const targets = document.querySelectorAll("[data-component]");
  await Promise.all([...targets].map(async (t) => {
    const name = t.getAttribute("data-component");
    const res = await fetch(`/public/components/${name}.html`, { cache: "no-cache" });
    const html = await res.text();
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html.trim();
    t.replaceWith(...wrapper.childNodes);
  }));
  if (window.applyI18n) applyI18n(document);
}
document.addEventListener("DOMContentLoaded", injectComponents);
