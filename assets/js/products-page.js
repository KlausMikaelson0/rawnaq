"use strict";

(function initProductsPage() {
  if (document.body?.dataset?.page !== "products") return;
  const products = window.PRODUCTS || [];

  const listRoot = document.getElementById("productsGrid");
  const filtersRoot = document.getElementById("categoryFilters");
  const searchInput = document.getElementById("searchProducts");
  const sortSelect = document.getElementById("sortProducts");
  const countLabel = document.getElementById("resultsCount");

  if (!listRoot || !filtersRoot || !countLabel) return;

  const state = {
    category: "الكل",
    query: "",
    sortBy: "featured"
  };

  const categories = ["الكل", ...new Set(products.map((item) => item.category))];

  function renderFilters() {
    filtersRoot.innerHTML = categories
      .map(
        (category) => `
      <button class="chip ${state.category === category ? "active" : ""}" data-category="${category}">
        ${category}
      </button>
    `
      )
      .join("");

    filtersRoot.querySelectorAll("button[data-category]").forEach((button) => {
      button.addEventListener("click", () => {
        state.category = button.dataset.category || "الكل";
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
        state.category === "الكل" || item.category === state.category;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query)
      );
    });

    items = applySort(items);
    return items;
  }

  function renderProducts() {
    const items = filterProducts();
    countLabel.textContent = `${items.length} منتج`;

    if (!items.length) {
      listRoot.innerHTML = `
        <div class="empty-state">
          <h3>لا توجد نتائج مطابقة</h3>
          <p>غيّر كلمات البحث أو اختر تصنيفًا مختلفًا لعرض منتجات أخرى.</p>
        </div>
      `;
      return;
    }

    listRoot.innerHTML = items
      .map((item) => {
        return `
          <article class="product-card tone-${item.imageTone}" id="product-${item.id}">
            <span class="product-badge">${item.badge}</span>
            <div class="product-thumb" aria-hidden="true">
              <span>${item.volumeMl}ml</span>
            </div>
            <h3>${item.name}</h3>
            <p class="product-category">${item.category}</p>
            <p class="product-description">${item.description}</p>
            <ul class="product-meta">
              <li><strong>SKU:</strong> ${item.sku}</li>
              <li><strong>التركيز:</strong> ${item.concentration}</li>
              <li><strong>الحجم:</strong> ${item.volumeMl} مل</li>
              <li><strong>الثبات:</strong> عالي</li>
            </ul>
            <div class="price-wrap">
              <span class="price-sale">${window.formatCurrency(item.salePrice)}</span>
              <span class="price-original">${window.formatCurrency(item.originalPrice)}</span>
              <span class="discount">خصم ${item.discountPercent}%</span>
            </div>
            <div class="card-actions">
              <button class="btn btn-gold">اشترِ الآن</button>
              <a class="btn btn-outline" href="contact.html">استفسر قبل الطلب</a>
            </div>
          </article>
        `;
      })
      .join("");
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
