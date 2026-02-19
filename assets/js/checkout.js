"use strict";

(function initCheckoutPage() {
  if (document.body?.dataset?.page !== "checkout") return;

  const config = window.StoreState
    ? window.StoreState.getConfig()
    : window.DEFAULT_STORE_CONFIG || {};
  const products = window.StoreState
    ? window.StoreState.getProducts()
    : window.DEFAULT_PRODUCTS || [];
  const localize = window.localizeValue || ((value) => value);
  const t = window.translateText || ((keyPath) => keyPath);

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
  const requestedSku = params.get("sku");
  const quantity = Math.max(1, Number(params.get("qty") || 1));

  const selectedProduct =
    products.find((item) => item.sku === requestedSku) || products[0] || null;
  if (!selectedProduct) return;

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
    const total = selectedProduct.salePrice * quantity;
    payButton.textContent = `${t("checkout.payNow")} • ${window.formatCurrency(total)}`;
  }

  function renderSummary() {
    const subtotal = selectedProduct.salePrice * quantity;
    const total = subtotal;
    const productName = localize(selectedProduct.name);

    summaryRoot.innerHTML = `
      <h3>${productName}</h3>
      <p class="product-category">${localize(selectedProduct.category)}</p>
      <ul class="order-lines">
        <li><span>${t("common.sku")}</span><strong>${selectedProduct.sku}</strong></li>
        <li><span>${t("common.size")}</span><strong>${selectedProduct.volumeMl} ${t("common.ml")}</strong></li>
        <li><span>${t("common.concentration")}</span><strong>${localize(selectedProduct.concentration)}</strong></li>
        <li><span>${t("checkout.qty")}</span><strong>${quantity}</strong></li>
        <li><span>${t("checkout.subtotal")}</span><strong>${window.formatCurrency(subtotal)}</strong></li>
        <li class="order-total"><span>${t("checkout.total")}</span><strong>${window.formatCurrency(total)}</strong></li>
      </ul>
    `;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (status) status.textContent = "";

    const submitOriginal = payButton.textContent;
    payButton.disabled = true;
    payButton.textContent = "...";

    window.setTimeout(() => {
      if (status) {
        status.textContent = t("checkout.success");
      }
      payButton.disabled = false;
      payButton.textContent = submitOriginal;
      form.reset();
      toggleCardFields();
    }, 700);
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
