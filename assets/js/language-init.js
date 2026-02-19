"use strict";

(function initLanguageEarly() {
  const key = "rawnaq_lang";
  const segments = window.location.pathname.split("/").filter(Boolean);
  const isEnglishPath = segments.includes("en");
  const fileName =
    segments.length && segments[segments.length - 1].includes(".")
      ? segments[segments.length - 1]
      : "index.html";

  let preferred = null;
  try {
    preferred = localStorage.getItem(key);
  } catch (_error) {
    preferred = null;
  }

  const currentLang = isEnglishPath ? "en" : "ar";
  const targetLang = preferred === "ar" || preferred === "en" ? preferred : currentLang;

  if (targetLang !== currentLang) {
    const suffix = `${window.location.search || ""}${window.location.hash || ""}`;
    const targetHref =
      (targetLang === "en" ? `en/${fileName}` : `../${fileName}`) + suffix;
    window.location.replace(targetHref);
    return;
  }

  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("data-lang", currentLang);
})();
