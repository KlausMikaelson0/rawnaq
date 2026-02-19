"use strict";

(async function initCheckoutPage() {
  if (document.body?.dataset?.page !== "checkout") return;
  if (!window.PublicAPI) return;

  const config = window.getStoreConfig
    ? window.getStoreConfig()
    : window.DEFAULT_STORE_CONFIG || {};
  const localize = window.localizeValue || ((value) => value);
  const t = window.translateText || ((keyPath) => keyPath);
  const cartStore = window.CartStore;

  const methodsRoot = document.getElementById("paymentMethods");
  const badgesRoot = document.getElementById("paymentBadges");
  const summaryRoot = document.getElementById("orderSummary");
  const secureInfo = document.getElementById("secureInfo");
  const form = document.getElementById("checkoutForm");
  const status = document.getElementById("checkoutStatus");
  const cardFields = document.getElementById("cardFields");
  const payButton = document.getElementById("checkoutSubmit");

  if (!methodsRoot || !summaryRoot || !form || !payButton) return;

  const params = new URLSearchParams(window.location.search);
  const requestedSku = String(params.get("sku") || "")
    .trim()
    .toUpperCase();
  const requestedQty = Math.max(1, Number(params.get("qty") || 1));
  const requestedCart = params.get("cart");

  if (cartStore) {
    if (requestedCart) {
      try {
        const parsed = JSON.parse(requestedCart);
        if (Array.isArray(parsed)) {
          cartStore.setItems(parsed);
        }
      } catch (_error) {
        // ignore malformed cart query
      }
    } else if (requestedSku) {
      cartStore.addItem(requestedSku, requestedQty);
    }
  }

  const rawItems = cartStore ? cartStore.getItems() : [];
  if (!rawItems.length) {
    summaryRoot.innerHTML = `
      <div class="empty-state">
        <h3>${t("cart.emptyTitle")}</h3>
        <p>${t("cart.emptyDesc")}</p>
        <a class="btn btn-gold" href="products.html">${t("cart.goShopping")}</a>
      </div>
    `;
    payButton.disabled = true;
    return;
  }

  const products = [];
  for (const item of rawItems) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const product = await window.PublicAPI.getProductBySku(item.sku);
      if (product) {
        products.push({
          ...item,
          product
        });
      }
    } catch (_error) {
      // ignore missing products in cart
    }
  }

  if (!products.length) {
    payButton.disabled = true;
    return;
  }

  const methodLabels = {
    card: {
      title: t("checkout.card"),
      description: t("checkout.cardDesc")
    },
    apple_pay: {
      title: t("checkout.applePay"),
      description: t("checkout.applePayDesc")
    },
    mada: {
      title: t("checkout.mada"),
      description: t("checkout.madaDesc")
    }
  };

  const enabledMethods = Array.isArray(config.payment?.methods)
    ? config.payment.methods.filter((code) => methodLabels[code])
    : ["card", "apple_pay", "mada"];

  let selectedMethod = enabledMethods[0] || "card";

  function renderBadges() {
    if (!badgesRoot) return;
    const badges = Array.isArray(config.payment?.secureBadges)
      ? config.payment.secureBadges
      : [];
    badgesRoot.innerHTML = badges
      .map((badge) => `<span class="trust-pill">${badge}</span>`)
      .join("");
  }

  function renderMethods() {
    methodsRoot.innerHTML = enabledMethods
      .map((method) => {
        const item = methodLabels[method];
        const isActive = method === selectedMethod ? "active" : "";
        return `
          <button type="button" class="method-card ${isActive}" data-method="${method}">
            <strong>${item.title}</strong>
            <span>${item.description}</span>
          </button>
        `;
      })
      .join("");

    methodsRoot.querySelectorAll("button[data-method]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedMethod = button.dataset.method || "card";
        renderMethods();
        toggleCardFields();
        updatePayButton();
      });
    });
  }

  function toggleCardFields() {
    if (!cardFields) return;
    cardFields.hidden = selectedMethod !== "card";
    cardFields
      .querySelectorAll("input")
      .forEach((input) => (input.required = selectedMethod === "card"));
  }

  function updatePayButton() {
    const total = products.reduce(
      (sum, item) => sum + item.product.salePrice * item.quantity,
      0
    );
    payButton.textContent = `${t("checkout.payNow")} • ${window.formatCurrency(total)}`;
  }

  function renderSummary() {
    const subtotal = products.reduce(
      (sum, item) => sum + item.product.salePrice * item.quantity,
      0
    );
    const total = subtotal;

    summaryRoot.innerHTML = `
      <h3>${t("checkout.total")}</h3>
      <div class="cards-grid">
        ${products
          .map((entry) => {
            return `
              <article class="product-card tone-${entry.product.imageTone}">
                <h3>${localize(entry.product.name)}</h3>
                <p class="product-category">${localize(entry.product.category)}</p>
                <ul class="order-lines">
                  <li><span>${t("common.sku")}</span><strong>${entry.product.sku}</strong></li>
                  <li><span>${t("checkout.qty")}</span><strong>${entry.quantity}</strong></li>
                  <li><span>${t("cart.lineTotal")}</span><strong>${window.formatCurrency(
                    entry.product.salePrice * entry.quantity
                  )}</strong></li>
                </ul>
              </article>
            `;
          })
          .join("")}
      </div>
      <ul class="order-lines">
        <li><span>${t("cart.totalItems")}</span><strong>${products.reduce(
          (sum, item) => sum + item.quantity,
          0
        )}</strong></li>
        <li><span>${t("checkout.subtotal")}</span><strong>${window.formatCurrency(subtotal)}</strong></li>
        <li class="order-total"><span>${t("checkout.total")}</span><strong>${window.formatCurrency(total)}</strong></li>
      </ul>
    `;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (status) status.textContent = "";

    const submitOriginal = payButton.textContent;
    payButton.disabled = true;
    payButton.textContent = "...";

    try {
      const data = new FormData(form);
      const order = await window.PublicAPI.createOrder({
        paymentMethod: selectedMethod,
        customer: {
          fullName: String(data.get("fullName") || "").trim(),
          email: String(data.get("email") || "").trim(),
          phone: String(data.get("phone") || "").trim(),
          city: String(data.get("city") || "").trim(),
          address: String(data.get("address") || "").trim()
        },
        notes: String(data.get("notes") || "").trim(),
        items: products.map((entry) => ({
          sku: entry.product.sku,
          quantity: entry.quantity
        }))
      });

      if (cartStore) {
        cartStore.clearCart();
      }
      if (window.refreshLayout) {
        window.refreshLayout();
      }
      if (status) {
        status.textContent = `${t("checkout.success")} #${order.orderNumber}`;
      }
      summaryRoot.innerHTML = `
        <div class="content-card">
          <h3>#${order.orderNumber}</h3>
          <p>${t("checkout.success")}</p>
        </div>
      `;
      payButton.disabled = true;
      payButton.textContent = `${t("checkout.payNow")} ✓`;
      form.reset();
      toggleCardFields();
    } catch (error) {
      if (status) status.textContent = error.message || "Unable to submit order.";
    } finally {
      if (!payButton.disabled) {
        payButton.textContent = submitOriginal;
      }
    }
  });

  if (secureInfo) {
    secureInfo.textContent = t("checkout.secureInfo");
  }

  renderBadges();
  renderMethods();
  toggleCardFields();
  renderSummary();
  updatePayButton();
})();
