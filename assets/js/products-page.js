"use strict";

(async function initProductsPage() {
  if (document.body?.dataset?.page !== "products") return;
  if (!window.PublicAPI) return;
  let products = [];
  try {
    products = await window.PublicAPI.getProducts();
  } catch (_error) {
    return;
  }

  const listRoot = document.getElementById("productsGrid");
  const filtersRoot = document.getElementById("categoryFilters");
  const searchInput = document.getElementById("searchProducts");
  const sortSelect = document.getElementById("sortProducts");
  const countLabel = document.getElementById("resultsCount");
  const i18n = window.I18N;
  const localize = window.localizeValue || ((value) => value);
  const t = window.translateText || ((keyPath) => keyPath);

  if (!listRoot || !filtersRoot || !countLabel) return;

  function localizeIn(value, forcedLanguage) {
    if (i18n && typeof i18n.localize === "function") {
      return i18n.localize(value, forcedLanguage);
    }
    return localize(value);
  }

  const state = {
    category: "__all__",
    query: "",
    sortBy: "featured"
  };

  const categories = [...new Set(products.map((item) => localize(item.category)))];

  function renderFilters() {
    const allLabel = t("common.allCategories");
    filtersRoot.innerHTML =
      `
      <button class="chip ${state.category === "__all__" ? "active" : ""}" data-category="__all__">${allLabel}</button>
    ` +
      categories
        .map(
          (category) => `
      <button class="chip ${state.category === category ? "active" : ""}" data-category="${category}">${category}</button>
    `
        )
        .join("");

    filtersRoot.querySelectorAll("button[data-category]").forEach((button) => {
      button.addEventListener("click", () => {
        state.category = button.dataset.category || "__all__";
        renderFilters();
        renderProducts();
      });
    });
  }

  function applySort(items) {
    if (state.sortBy === "price-low") {
      return items.sort((a, b) => a.salePrice - b.salePrice);
    }
    if (state.sortBy === "price-high") {
      return items.sort((a, b) => b.salePrice - a.salePrice);
    }
    if (state.sortBy === "discount") {
      return items.sort((a, b) => b.discountPercent - a.discountPercent);
    }
    return items.sort((a, b) => a.id - b.id);
  }

  function filterProducts() {
    const query = state.query.trim().toLowerCase();
    let items = products.filter((item) => {
      const matchesCategory =
        state.category === "__all__" || localize(item.category) === state.category;
      if (!matchesCategory) return false;
      if (!query) return true;

      const haystack = [
        localizeIn(item.name, "ar"),
        localizeIn(item.name, "en"),
        localizeIn(item.description, "ar"),
        localizeIn(item.description, "en"),
        localizeIn(item.category, "ar"),
        localizeIn(item.category, "en"),
        item.sku
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });

    items = applySort(items);
    return items;
  }

  function renderProducts() {
    const items = filterProducts();
    countLabel.textContent = t("common.resultCount", { count: items.length });

    if (!items.length) {
      listRoot.innerHTML = `
        <div class="empty-state">
          <h3>${t("common.noResultsTitle")}</h3>
          <p>${t("common.noResultsDesc")}</p>
        </div>
      `;
      return;
    }

    listRoot.innerHTML = items
      .map((item) => {
        return `
          <article class="product-card tone-${item.imageTone}" id="product-${item.id}">
            <span class="product-badge">${localize(item.badge)}</span>
            <div class="product-thumb" aria-hidden="true">
              <span>${item.volumeMl}ml</span>
            </div>
            <h3>${localize(item.name)}</h3>
            <p class="product-category">${localize(item.category)}</p>
            <p class="product-description">${localize(item.description)}</p>
            <ul class="product-meta">
              <li><strong>${t("common.sku")}:</strong> ${item.sku}</li>
              <li><strong>${t("common.concentration")}:</strong> ${localize(item.concentration)}</li>
              <li><strong>${t("common.size")}:</strong> ${item.volumeMl} ${t("common.ml")}</li>
              <li><strong>${t("common.longevity")}:</strong> ${t("common.high")}</li>
            </ul>
            <div class="price-wrap">
              <span class="price-sale">${window.formatCurrency(item.salePrice)}</span>
              <span class="price-original">${window.formatCurrency(item.originalPrice)}</span>
              <span class="discount">${t("common.discount", {
                value: item.discountPercent
              })}</span>
            </div>
            <div class="card-actions">
              <button class="btn btn-gold" data-add-to-cart="${item.sku}">${t("cart.add")}</button>
              <a class="btn btn-outline" href="checkout.html?sku=${encodeURIComponent(
                item.sku
              )}">${t("common.buyNow")}</a>
            </div>
          </article>
        `;
      })
      .join("");

    listRoot.querySelectorAll("[data-add-to-cart]").forEach((button) => {
      button.addEventListener("click", () => {
        const sku = button.getAttribute("data-add-to-cart") || "";
        if (window.CartStore) {
          window.CartStore.addItem(sku, 1);
        }
        if (window.refreshLayout) {
          window.refreshLayout();
        }
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      state.query = event.target.value || "";
      renderProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      state.sortBy = event.target.value || "featured";
      renderProducts();
    });
  }

  renderFilters();
  renderProducts();
})();
