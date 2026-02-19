"use strict";

(function initCartPage() {
  if (document.body?.dataset?.page !== "cart") return;

  const cartRoot = document.getElementById("cartItems");
  const summaryRoot = document.getElementById("cartSummary");
  const statusRoot = document.getElementById("cartStatus");
  const checkoutLink = document.getElementById("cartCheckoutLink");

  if (!cartRoot || !summaryRoot || !checkoutLink || !window.CartStore) return;

  const localize = window.localizeValue || ((value) => value);
  const t = window.translateText || ((keyPath) => keyPath);
  const cartStore = window.CartStore;
  const productCache = new Map();

  function setStatus(message) {
    if (statusRoot) statusRoot.textContent = message || "";
  }

  function buildCheckoutUrl() {
    const items = cartStore.getItems();
    const encoded = encodeURIComponent(JSON.stringify(items));
    checkoutLink.setAttribute("href", `checkout.html?cart=${encoded}`);
  }

  async function fetchProductBySku(sku) {
    if (productCache.has(sku)) {
      return productCache.get(sku);
    }
    const item = await window.PublicAPI.getProductBySku(sku);
    productCache.set(sku, item);
    return item;
  }

  async function resolveCartItems() {
    const items = cartStore.getItems();
    if (!items.length) return [];

    const resolved = [];
    for (const item of items) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const product = await fetchProductBySku(item.sku);
        if (product) {
          resolved.push({
            ...item,
            product
          });
        }
      } catch (_error) {
        // ignore broken cart entries
      }
    }
    return resolved;
  }

  function renderSummary(items) {
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.salePrice * item.quantity,
      0
    );
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    summaryRoot.innerHTML = `
      <ul class="order-lines">
        <li><span>${t("cart.totalItems")}</span><strong>${totalItems}</strong></li>
        <li><span>${t("checkout.subtotal")}</span><strong>${window.formatCurrency(subtotal)}</strong></li>
        <li class="order-total"><span>${t("checkout.total")}</span><strong>${window.formatCurrency(subtotal)}</strong></li>
      </ul>
    `;
  }

  function bindActions() {
    cartRoot.querySelectorAll("[data-action='remove']").forEach((button) => {
      button.addEventListener("click", async () => {
        const sku = button.dataset.sku || "";
        cartStore.removeItem(sku);
        await render();
      });
    });

    cartRoot.querySelectorAll("[data-action='quantity']").forEach((input) => {
      input.addEventListener("change", async () => {
        const sku = input.dataset.sku || "";
        const quantity = Number(input.value || 1);
        cartStore.updateItem(sku, quantity);
        await render();
      });
    });

    const clearButton = document.getElementById("clearCartBtn");
    if (clearButton) {
      clearButton.addEventListener("click", async () => {
        cartStore.clearCart();
        await render();
      });
    }
  }

  async function render() {
    setStatus("");
    const items = await resolveCartItems();
    buildCheckoutUrl();

    if (!items.length) {
      cartRoot.innerHTML = `
        <div class="empty-state">
          <h3>${t("cart.emptyTitle")}</h3>
          <p>${t("cart.emptyDesc")}</p>
          <a class="btn btn-gold" href="products.html">${t("cart.goShopping")}</a>
        </div>
      `;
      summaryRoot.innerHTML = "";
      checkoutLink.classList.add("is-disabled");
      checkoutLink.setAttribute("aria-disabled", "true");
      return;
    }

    checkoutLink.classList.remove("is-disabled");
    checkoutLink.removeAttribute("aria-disabled");

    cartRoot.innerHTML = items
      .map((entry) => {
        return `
          <article class="product-card tone-${entry.product.imageTone}">
            <div class="product-thumb" aria-hidden="true"><span>${entry.product.volumeMl}ml</span></div>
            <h3>${localize(entry.product.name)}</h3>
            <p class="product-category">${localize(entry.product.category)}</p>
            <p class="product-description">${localize(entry.product.description).slice(0, 180)}...</p>
            <div class="dual-inputs">
              <label>
                ${t("checkout.qty")}
                <input data-action="quantity" data-sku="${entry.sku}" class="input" type="number" min="1" max="20" value="${entry.quantity}" />
              </label>
              <div>
                <span class="muted">${t("cart.lineTotal")}</span>
                <strong>${window.formatCurrency(entry.product.salePrice * entry.quantity)}</strong>
              </div>
            </div>
            <div class="card-actions">
              <button data-action="remove" data-sku="${entry.sku}" class="btn btn-outline" type="button">${t("cart.remove")}</button>
            </div>
          </article>
        `;
      })
      .join("");

    renderSummary(items);
    bindActions();
  }

  render().catch((error) => {
    setStatus(error.message || "Unable to load cart.");
  });
})();
