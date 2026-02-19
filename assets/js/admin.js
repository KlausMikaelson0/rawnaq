"use strict";

(function initAdminPanel() {
  if (document.body?.dataset?.page !== "admin") return;
  if (!window.StoreState) return;

  const t = window.translateText || ((keyPath) => keyPath);

  const settingsStatus = document.getElementById("adminSettingsStatus");
  const productsStatus = document.getElementById("adminProductsStatus");
  const productSearch = document.getElementById("productSearch");
  const productSelect = document.getElementById("productSelect");

  function asLocalized(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return {
        ar: value.ar || "",
        en: value.en || ""
      };
    }
    return {
      ar: String(value || ""),
      en: String(value || "")
    };
  }

  let config = window.StoreState.getConfig();
  let products = window.StoreState.getProducts();
  let currentProductId = products[0] ? products[0].id : null;

  function byId(id) {
    return document.getElementById(id);
  }

  function setStatus(target, text) {
    if (target) target.textContent = text;
  }

  function fillSettings() {
    byId("storeNameAr").value = asLocalized(config.name).ar;
    byId("storeNameEn").value = asLocalized(config.name).en;
    byId("taglineAr").value = asLocalized(config.tagline).ar;
    byId("taglineEn").value = asLocalized(config.tagline).en;
    byId("currencyAr").value = asLocalized(config.currency).ar;
    byId("currencyEn").value = asLocalized(config.currency).en;

    byId("contactEmail").value = config.contact?.email || "";
    byId("contactPhone").value = config.contact?.phone || "";
    byId("contactWhatsapp").value = config.contact?.whatsapp || "";
    byId("locationAr").value = asLocalized(config.contact?.location).ar;
    byId("locationEn").value = asLocalized(config.contact?.location).en;

    byId("shippingAr").value = asLocalized(config.business?.shippingNote).ar;
    byId("shippingEn").value = asLocalized(config.business?.shippingNote).en;
    byId("paymentAr").value = asLocalized(config.business?.paymentNote).ar;
    byId("paymentEn").value = asLocalized(config.business?.paymentNote).en;
    byId("qualityAr").value = asLocalized(config.business?.qualityNote).ar;
    byId("qualityEn").value = asLocalized(config.business?.qualityNote).en;
  }

  function readSettingsForm() {
    return {
      ...config,
      name: {
        ar: byId("storeNameAr").value.trim(),
        en: byId("storeNameEn").value.trim()
      },
      tagline: {
        ar: byId("taglineAr").value.trim(),
        en: byId("taglineEn").value.trim()
      },
      currency: {
        ar: byId("currencyAr").value.trim() || "ريال",
        en: byId("currencyEn").value.trim() || "SAR"
      },
      contact: {
        ...config.contact,
        email: byId("contactEmail").value.trim(),
        phone: byId("contactPhone").value.trim(),
        whatsapp: byId("contactWhatsapp").value.trim(),
        location: {
          ar: byId("locationAr").value.trim(),
          en: byId("locationEn").value.trim()
        }
      },
      business: {
        ...config.business,
        shippingNote: {
          ar: byId("shippingAr").value.trim(),
          en: byId("shippingEn").value.trim()
        },
        paymentNote: {
          ar: byId("paymentAr").value.trim(),
          en: byId("paymentEn").value.trim()
        },
        qualityNote: {
          ar: byId("qualityAr").value.trim(),
          en: byId("qualityEn").value.trim()
        }
      }
    };
  }

  function getFilteredProducts() {
    const query = (productSearch?.value || "").trim().toLowerCase();
    if (!query) return products;
    return products.filter((item) => {
      return (
        String(item.sku).toLowerCase().includes(query) ||
        asLocalized(item.name).ar.toLowerCase().includes(query) ||
        asLocalized(item.name).en.toLowerCase().includes(query)
      );
    });
  }

  function renderProductSelect() {
    if (!productSelect) return;
    const filtered = getFilteredProducts();
    productSelect.innerHTML = filtered
      .map((item) => {
        const name = asLocalized(item.name);
        const selected = item.id === currentProductId ? "selected" : "";
        return `<option value="${item.id}" ${selected}>${item.sku} — ${name.ar} / ${name.en}</option>`;
      })
      .join("");

    if (!filtered.find((item) => item.id === currentProductId)) {
      currentProductId = filtered[0] ? filtered[0].id : null;
    }
  }

  function getCurrentProduct() {
    return products.find((item) => item.id === currentProductId) || null;
  }

  function fillProductForm() {
    const item = getCurrentProduct();
    if (!item) return;

    byId("productSku").value = item.sku || "";
    byId("productNameAr").value = asLocalized(item.name).ar;
    byId("productNameEn").value = asLocalized(item.name).en;
    byId("productCategoryAr").value = asLocalized(item.category).ar;
    byId("productCategoryEn").value = asLocalized(item.category).en;
    byId("productBadgeAr").value = asLocalized(item.badge).ar;
    byId("productBadgeEn").value = asLocalized(item.badge).en;
    byId("productDescriptionAr").value = asLocalized(item.description).ar;
    byId("productDescriptionEn").value = asLocalized(item.description).en;
    byId("productConcentrationAr").value = asLocalized(item.concentration).ar;
    byId("productConcentrationEn").value = asLocalized(item.concentration).en;
    byId("productVolumeMl").value = item.volumeMl;
    byId("productOriginalPrice").value = item.originalPrice;
    byId("productSalePrice").value = item.salePrice;
  }

  function saveCurrentProduct() {
    const index = products.findIndex((item) => item.id === currentProductId);
    if (index === -1) return;

    const updated = {
      ...products[index],
      name: {
        ar: byId("productNameAr").value.trim(),
        en: byId("productNameEn").value.trim()
      },
      category: {
        ar: byId("productCategoryAr").value.trim(),
        en: byId("productCategoryEn").value.trim()
      },
      badge: {
        ar: byId("productBadgeAr").value.trim(),
        en: byId("productBadgeEn").value.trim()
      },
      description: {
        ar: byId("productDescriptionAr").value.trim(),
        en: byId("productDescriptionEn").value.trim()
      },
      concentration: {
        ar: byId("productConcentrationAr").value.trim(),
        en: byId("productConcentrationEn").value.trim()
      },
      volumeMl: Math.max(1, Number(byId("productVolumeMl").value || 100)),
      originalPrice: Math.max(1, Number(byId("productOriginalPrice").value || 1)),
      salePrice: Math.max(1, Number(byId("productSalePrice").value || 1))
    };

    updated.discountPercent = Math.round(
      (1 - updated.salePrice / updated.originalPrice) * 100
    );

    products[index] = updated;
    products = window.StoreState.saveProducts(products);
    setStatus(productsStatus, t("admin.savedProduct"));
    renderProductSelect();
    fillProductForm();
  }

  function exportBackup() {
    const snapshot = window.StoreState.exportSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rawnaq-store-backup.json";
    link.click();
    URL.revokeObjectURL(url);
    setStatus(settingsStatus, t("admin.exported"));
  }

  function bindEvents() {
    byId("saveSettingsBtn")?.addEventListener("click", () => {
      config = window.StoreState.saveConfig(readSettingsForm());
      fillSettings();
      setStatus(settingsStatus, t("admin.savedSettings"));
    });

    byId("resetSettingsBtn")?.addEventListener("click", () => {
      config = window.StoreState.resetConfig();
      fillSettings();
      setStatus(settingsStatus, t("admin.resetSettings"));
    });

    byId("exportBackupBtn")?.addEventListener("click", exportBackup);

    byId("importBackupInput")?.addEventListener("change", async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const ok = window.StoreState.importSnapshot(parsed);
        if (!ok) throw new Error("invalid");
        config = window.StoreState.getConfig();
        products = window.StoreState.getProducts();
        currentProductId = products[0] ? products[0].id : null;
        fillSettings();
        renderProductSelect();
        fillProductForm();
        setStatus(settingsStatus, t("admin.imported"));
      } catch (_error) {
        setStatus(settingsStatus, t("admin.importFailed"));
      } finally {
        event.target.value = "";
      }
    });

    productSearch?.addEventListener("input", () => {
      renderProductSelect();
      fillProductForm();
    });

    productSelect?.addEventListener("change", () => {
      currentProductId = Number(productSelect.value || 0);
      fillProductForm();
    });

    byId("saveProductBtn")?.addEventListener("click", saveCurrentProduct);

    byId("resetProductsBtn")?.addEventListener("click", () => {
      products = window.StoreState.resetProducts();
      currentProductId = products[0] ? products[0].id : null;
      renderProductSelect();
      fillProductForm();
      setStatus(productsStatus, t("admin.resetProducts"));
    });
  }

  fillSettings();
  renderProductSelect();
  fillProductForm();
  bindEvents();
})();
