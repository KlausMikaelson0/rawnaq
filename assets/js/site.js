"use strict";

(async function initSite() {
  const i18n = window.I18N;
  const lang = i18n ? i18n.getCurrentLanguage() : "ar";
  const page = document.body?.dataset?.page || "";
  const publicApi = window.PublicAPI;
  const defaultConfig = window.DEFAULT_STORE_CONFIG || {};
  let config = defaultConfig;

  try {
    if (publicApi) {
      config = (await publicApi.getSettings()) || defaultConfig;
    }
  } catch (_error) {
    config = defaultConfig;
  }

  function localize(value, targetLang) {
    if (i18n && typeof i18n.localize === "function") {
      return i18n.localize(value, targetLang || lang);
    }
    if (value && typeof value === "object") {
      return value.ar || value.en || "";
    }
    return String(value || "");
  }

  function t(keyPath, variables) {
    if (i18n && typeof i18n.t === "function") {
      return i18n.t(keyPath, variables, lang);
    }
    return "";
  }

  function getAssetPrefix() {
    if (i18n && typeof i18n.isEnglishPath === "function" && i18n.isEnglishPath()) {
      return "../assets";
    }
    return "assets";
  }

  function getTargetLanguage() {
    return lang === "ar" ? "en" : "ar";
  }

  function cartItemCount() {
    if (!window.CartStore) return 0;
    return window.CartStore.getItemCount();
  }

  function applyBrandText() {
    const storeName = localize(config.name);
    const tagline = localize(config.tagline);
    const location = localize(config.contact?.location);
    const shippingNote = localize(config.business?.shippingNote);
    const paymentNote = localize(config.business?.paymentNote);
    const qualityNote = localize(config.business?.qualityNote);

    document.querySelectorAll("[data-store-name]").forEach((el) => {
      el.textContent = storeName;
    });
    document.querySelectorAll("[data-store-tagline]").forEach((el) => {
      el.textContent = tagline;
    });
    document.querySelectorAll("[data-store-email]").forEach((el) => {
      el.textContent = config.contact?.email || "";
    });
    document.querySelectorAll("[data-store-phone]").forEach((el) => {
      el.textContent = config.contact?.phone || "";
    });
    document.querySelectorAll("[data-store-location]").forEach((el) => {
      el.textContent = location;
    });
    document.querySelectorAll("[data-store-whatsapp]").forEach((el) => {
      if (el.tagName.toLowerCase() === "a") {
        el.setAttribute("href", config.contact?.whatsapp || "#");
      } else {
        el.textContent = config.contact?.whatsapp || "";
      }
    });
    document.querySelectorAll("[data-store-shipping-note]").forEach((el) => {
      el.textContent = shippingNote;
    });
    document.querySelectorAll("[data-store-payment-note]").forEach((el) => {
      el.textContent = paymentNote;
    });
    document.querySelectorAll("[data-store-quality-note]").forEach((el) => {
      el.textContent = qualityNote;
    });
    document.querySelectorAll("[data-current-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function applyMetaBranding() {
    const storeName = localize(config.name);
    const titleTemplate = document.body?.dataset?.titleTemplate;
    if (titleTemplate) {
      document.title = titleTemplate.replaceAll("{store}", storeName);
    }

    const descriptionTemplate = document.body?.dataset?.descriptionTemplate;
    if (descriptionTemplate) {
      const descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta) {
        descriptionMeta.setAttribute(
          "content",
          descriptionTemplate.replaceAll("{store}", storeName)
        );
      }
    }
  }

  function navLinkClass(targetPage) {
    return targetPage === page ? "nav-link active" : "nav-link";
  }

  function renderHeaderFooter() {
    const storeName = localize(config.name);
    const storeTagline = localize(config.tagline);
    const targetLanguage = getTargetLanguage();
    const languageHref = i18n
      ? i18n.getLanguageSwitchHref(targetLanguage)
      : "#";
    const assetPrefix = getAssetPrefix();
    const headerRoot = document.getElementById("site-header");
    const footerRoot = document.getElementById("site-footer");

    const cartCount = cartItemCount();
    const cartLabel = `${t("nav.cart")} (${cartCount})`;

    if (headerRoot) {
      headerRoot.innerHTML = `
        <header class="site-header">
          <div class="container header-inner">
            <a class="brand" href="index.html" aria-label="${t("header.homeAria")}">
              <img src="${assetPrefix}/brand/logo-icon.svg" alt="${storeName} logo" class="brand-logo" />
              <div class="brand-text">
                <strong data-store-name>${storeName}</strong>
                <span data-store-tagline>${storeTagline}</span>
              </div>
            </a>
            <button id="mobileMenuToggle" class="mobile-toggle" aria-label="${t("header.menuAria")}">☰</button>
            <nav id="mainNav" class="main-nav" aria-label="${t("header.menuAria")}">
              <a class="${navLinkClass("home")}" href="index.html">${t("nav.home")}</a>
              <a class="${navLinkClass("products")}" href="products.html">${t("nav.products")}</a>
              <a class="${navLinkClass("cart")}" href="cart.html">${cartLabel}</a>
              <a class="${navLinkClass("checkout")}" href="checkout.html">${t("nav.checkout")}</a>
              <a class="${navLinkClass("faq")}" href="faq.html">${t("nav.faq")}</a>
              <a class="${navLinkClass("about")}" href="about.html">${t("nav.about")}</a>
              <a class="${navLinkClass("contact")}" href="contact.html">${t("nav.contact")}</a>
            </nav>
            <div class="header-actions">
              <a id="languageSwitch" class="btn btn-outline lang-toggle" href="${languageHref}" data-lang-target="${targetLanguage}">
                ${t("header.switchLanguage")}
              </a>
              <a class="btn btn-gold header-cta" href="products.html">${t("header.shopNow")}</a>
            </div>
          </div>
        </header>
      `;
    }

    if (footerRoot) {
      footerRoot.innerHTML = `
        <footer class="site-footer">
          <div class="container footer-grid">
            <section>
              <h3>${t("footer.aboutTitle", { store: storeName })}</h3>
              <p>${t("footer.aboutText")}</p>
            </section>
            <section>
              <h3>${t("footer.linksTitle")}</h3>
              <ul class="footer-links">
                <li><a href="privacy.html">${t("footer.privacy")}</a></li>
                <li><a href="terms.html">${t("footer.terms")}</a></li>
                <li><a href="returns.html">${t("footer.returns")}</a></li>
                <li><a href="contact.html">${t("footer.contact")}</a></li>
                <li><a href="checkout.html">${t("footer.checkout")}</a></li>
                <li><a href="cart.html">${t("footer.cart")}</a></li>
                <li><a href="faq.html">${t("footer.faq")}</a></li>
                <li><a href="admin.html">${t("footer.admin")}</a></li>
              </ul>
            </section>
            <section>
              <h3>${t("footer.contactTitle")}</h3>
              <ul class="footer-contact">
                <li><strong>${t("footer.email")}:</strong> <span data-store-email>${config.contact?.email || ""}</span></li>
                <li><strong>${t("footer.phone")}:</strong> <span data-store-phone>${config.contact?.phone || ""}</span></li>
                <li><strong>${t("footer.city")}:</strong> <span data-store-location>${localize(config.contact?.location)}</span></li>
                <li><a class="footer-whatsapp" data-store-whatsapp href="${config.contact?.whatsapp || "#"}">${t("footer.whatsapp")}</a></li>
              </ul>
            </section>
          </div>
          <div class="container footer-bottom">
            <p>${t("footer.rights", { year: new Date().getFullYear(), store: storeName })}</p>
          </div>
        </footer>
      `;
    }
  }

  function initMobileMenu() {
    const toggle = document.getElementById("mobileMenuToggle");
    const nav = document.getElementById("mainNav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form || !publicApi) return;
    const status = document.getElementById("formStatus");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (status) status.textContent = "";

      const formData = new FormData(form);
      const payload = {
        fullName: String(formData.get("name") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        message: String(formData.get("message") || "").trim()
      };

      try {
        await publicApi.sendContact(payload);
        if (status) {
          status.textContent = t("common.contactSuccess", {
            store: localize(config.name)
          });
        }
        form.reset();
      } catch (error) {
        if (status) status.textContent = error.message || "Unable to send message.";
      }
    });
  }

  function initLanguageSwitch() {
    const switcher = document.getElementById("languageSwitch");
    if (!switcher || !i18n) return;
    switcher.addEventListener("click", (event) => {
      event.preventDefault();
      const target = switcher.getAttribute("data-lang-target");
      if (target !== "ar" && target !== "en") return;
      i18n.setLanguagePreference(target);
      const href = switcher.getAttribute("href");
      if (href) {
        window.location.href = href;
      }
    });
  }

  function initFaqAccordion() {
    document.querySelectorAll(".faq-item").forEach((item) => {
      const button = item.querySelector(".faq-question");
      if (!button) return;
      button.addEventListener("click", () => {
        item.classList.toggle("open");
      });
    });
  }

  window.formatCurrency = function formatCurrency(value) {
    const locale = lang === "ar" ? "ar-SA" : "en-SA";
    const currencyLabel = localize(config.currency, lang);
    return `${Number(value || 0).toLocaleString(locale)} ${currencyLabel}`;
  };

  window.getStoreConfig = function getStoreConfig() {
    return config;
  };

  window.getCurrentLanguage = function getCurrentLanguage() {
    return lang;
  };

  window.localizeValue = function localizeValue(value) {
    return localize(value, lang);
  };

  window.translateText = function translateText(keyPath, variables) {
    return t(keyPath, variables);
  };

  window.refreshLayout = function refreshLayout() {
    renderHeaderFooter();
    applyBrandText();
    initMobileMenu();
    initLanguageSwitch();
    initFaqAccordion();
  };

  renderHeaderFooter();
  applyBrandText();
  applyMetaBranding();
  initMobileMenu();
  initLanguageSwitch();
  initContactForm();
  initFaqAccordion();
})();
