"use strict";

(function initHomePage() {
  if (document.body?.dataset?.page !== "home") return;
  const products = window.StoreState
    ? window.StoreState.getProducts()
    : window.DEFAULT_PRODUCTS || [];
  if (!products.length) return;

  const featuredRoot = document.getElementById("featuredProducts");
  const countProducts = document.getElementById("statProductsCount");
  const countCategories = document.getElementById("statCategoriesCount");
  const localize = window.localizeValue || ((value) => value);
  const t = window.translateText || ((key) => key);
  const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : "ar";

  if (countProducts) {
    countProducts.textContent = String(products.length);
  }

  if (countCategories) {
    const categories = new Set(products.map((item) => localize(item.category)));
    countCategories.textContent = String(categories.size);
  }

  if (!featuredRoot) return;

  const featured = [...products]
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, 8);

  featuredRoot.innerHTML = featured
    .map((item) => {
      const description = localize(item.description);
      const summaryLimit = lang === "ar" ? 150 : 170;
      const summary =
        description.length > summaryLimit
          ? `${description.slice(0, summaryLimit)}...`
          : description;
      return `
        <article class="product-card tone-${item.imageTone}">
          <span class="product-badge">${localize(item.badge)}</span>
          <div class="product-thumb" aria-hidden="true">
            <span>RNQ</span>
          </div>
          <h3>${localize(item.name)}</h3>
          <p class="product-category">${localize(item.category)}</p>
          <p class="product-description">${summary}</p>
          <div class="price-wrap">
            <span class="price-sale">${window.formatCurrency(item.salePrice)}</span>
            <span class="price-original">${window.formatCurrency(item.originalPrice)}</span>
          </div>
          <a class="btn btn-outline" href="checkout.html?sku=${encodeURIComponent(item.sku)}">${t(
            "common.orderNow"
          )}</a>
        </article>
      `;
    })
    .join("");
})();
