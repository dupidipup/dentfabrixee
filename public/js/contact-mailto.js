import { t } from "./app.js";

// Builds the localized mailto link for the hero Contact button.
function updateContactHref() {
  const btn = document.getElementById("contactBtn");
  if (!btn) return;

  const subject = encodeURIComponent(t("contactSubject") || "DentFabrix inquiry");
  // You can also prefill body if you like:
  // const body = encodeURIComponent(t("contactPrefill") || "");
  btn.href = `mailto:info@dentfabrix.ee?subject=${subject}`;
}

document.addEventListener("DOMContentLoaded", updateContactHref);
document.addEventListener("i18n:loaded", updateContactHref);
document.addEventListener("i18n:changed", updateContactHref);
