"use strict";

(function initHomePage() {
  if (document.body?.dataset?.page !== "home") return;
  const products = window.PRODUCTS || [];
  if (!products.length) return;

  const featuredRoot = document.getElementById("featuredProducts");
  const countProducts = document.getElementById("statProductsCount");
  const countCategories = document.getElementById("statCategoriesCount");

  if (countProducts) {
    countProducts.textContent = String(products.length);
  }

  if (countCategories) {
    const categories = new Set(products.map((item) => item.category));
    countCategories.textContent = String(categories.size);
  }

  if (!featuredRoot) return;

  const featured = [...products]
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, 8);

  featuredRoot.innerHTML = featured
    .map((item) => {
      const summary = item.description.slice(0, 140) + "...";
      return `
        <article class="product-card tone-${item.imageTone}">
          <span class="product-badge">${item.badge}</span>
          <div class="product-thumb" aria-hidden="true">
            <span>RNQ</span>
          </div>
          <h3>${item.name}</h3>
          <p class="product-category">${item.category}</p>
          <p class="product-description">${summary}</p>
          <div class="price-wrap">
            <span class="price-sale">${window.formatCurrency(item.salePrice)}</span>
            <span class="price-original">${window.formatCurrency(item.originalPrice)}</span>
          </div>
          <a class="btn btn-outline" href="products.html#product-${item.id}">اطلب الآن</a>
        </article>
      `;
    })
    .join("");
})();
