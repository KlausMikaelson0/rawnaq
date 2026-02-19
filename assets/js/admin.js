"use strict";

(async function initAdminPanel() {
  if (document.body?.dataset?.page !== "admin") return;
  if (!window.AdminAPI) return;

  const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : "ar";
  const t = window.translateText || ((keyPath) => keyPath);
  const adminApi = window.AdminAPI;
  const defaultConfig = window.DEFAULT_STORE_CONFIG || {};

  const settingsStatus = document.getElementById("adminSettingsStatus");
  const productsStatus = document.getElementById("adminProductsStatus");
  const ordersStatus = document.getElementById("adminOrdersStatus");
  const customersStatus = document.getElementById("adminCustomersStatus");
  const productSearch = document.getElementById("productSearch");
  const productSelect = document.getElementById("productSelect");
  const ordersList = document.getElementById("ordersList");
  const customersList = document.getElementById("customersList");
  const layout = document.querySelector(".admin-layout");
  const pageContainer = document.querySelector(".container");

  if (!layout || !pageContainer) return;

  const ORDER_STATUSES = [
    "new",
    "confirmed",
    "preparing",
    "shipped",
    "completed",
    "cancelled"
  ];
  const ORDER_STATUS_LABELS = {
    ar: {
      new: "جديد",
      confirmed: "مؤكد",
      preparing: "قيد التجهيز",
      shipped: "تم الشحن",
      completed: "مكتمل",
      cancelled: "ملغي"
    },
    en: {
      new: "New",
      confirmed: "Confirmed",
      preparing: "Preparing",
      shipped: "Shipped",
      completed: "Completed",
      cancelled: "Cancelled"
    }
  };

  let config = defaultConfig;
  let products = [];
  let orders = [];
  let customers = [];
  let currentProductId = null;

  function byId(id) {
    return document.getElementById(id);
  }

  function setStatus(target, text) {
    if (target) target.textContent = text || "";
  }

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

  function labelStatus(status) {
    return (ORDER_STATUS_LABELS[lang] && ORDER_STATUS_LABELS[lang][status]) || status;
  }

  function hideApp() {
    layout.hidden = true;
    byId("adminAuthActions").hidden = true;
    byId("adminLoginPanel").hidden = false;
  }

  function showApp() {
    layout.hidden = false;
    byId("adminAuthActions").hidden = false;
    byId("adminLoginPanel").hidden = true;
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
      },
      payment: {
        ...(config.payment || {}),
        methods: ["card", "apple_pay", "mada"]
      }
    };
  }

  function productPayloadFromForm() {
    return {
      sku: byId("productSku").value.trim(),
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
      salePrice: Math.max(1, Number(byId("productSalePrice").value || 1)),
      imageTone: 0,
      isActive: true
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

    if (currentProductId && filtered.find((item) => item.id === currentProductId)) {
      return;
    }
    currentProductId = filtered[0] ? filtered[0].id : null;
  }

  function getCurrentProduct() {
    return products.find((item) => item.id === currentProductId) || null;
  }

  function clearProductForm() {
    byId("productSku").value = "";
    byId("productNameAr").value = "";
    byId("productNameEn").value = "";
    byId("productCategoryAr").value = "";
    byId("productCategoryEn").value = "";
    byId("productBadgeAr").value = "";
    byId("productBadgeEn").value = "";
    byId("productDescriptionAr").value = "";
    byId("productDescriptionEn").value = "";
    byId("productConcentrationAr").value = "";
    byId("productConcentrationEn").value = "";
    byId("productVolumeMl").value = 100;
    byId("productOriginalPrice").value = 300;
    byId("productSalePrice").value = 250;
  }

  function fillProductForm() {
    const item = getCurrentProduct();
    if (!item) {
      clearProductForm();
      return;
    }

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

  function renderOrders() {
    if (!ordersList) return;
    if (!orders.length) {
      ordersList.innerHTML = `<div class="empty-state"><p>${lang === "ar" ? "لا توجد طلبات حتى الآن." : "No orders yet."}</p></div>`;
      return;
    }

    ordersList.innerHTML = orders
      .map((order) => {
        return `
          <article class="feature-card">
            <h3>#${order.orderNumber}</h3>
            <p>${order.customer.fullName} • ${order.customer.phone || "-"}</p>
            <p>${window.formatCurrency(order.total)} • ${new Date(order.createdAt).toLocaleString()}</p>
            <label>
              ${lang === "ar" ? "الحالة" : "Status"}
              <select class="select" data-order-status-id="${order.id}">
                ${ORDER_STATUSES.map((status) => {
                  const selected = status === order.status ? "selected" : "";
                  return `<option value="${status}" ${selected}>${labelStatus(status)}</option>`;
                }).join("")}
              </select>
            </label>
            <button class="btn btn-outline" data-order-save-id="${order.id}" type="button">
              ${lang === "ar" ? "تحديث الحالة" : "Update Status"}
            </button>
          </article>
        `;
      })
      .join("");

    ordersList.querySelectorAll("[data-order-save-id]").forEach((button) => {
      button.addEventListener("click", async () => {
        const orderId = Number(button.getAttribute("data-order-save-id"));
        const select = ordersList.querySelector(
          `[data-order-status-id="${orderId}"]`
        );
        if (!select) return;
        try {
          await adminApi.updateOrderStatus(orderId, select.value);
          setStatus(
            ordersStatus,
            lang === "ar" ? "تم تحديث حالة الطلب." : "Order status updated."
          );
          await loadOrders();
        } catch (error) {
          setStatus(ordersStatus, error.message);
        }
      });
    });
  }

  function renderCustomers() {
    if (!customersList) return;
    if (!customers.length) {
      customersList.innerHTML = `<div class="empty-state"><p>${lang === "ar" ? "لا توجد بيانات عملاء حتى الآن." : "No customers yet."}</p></div>`;
      return;
    }

    customersList.innerHTML = customers
      .map((customer) => {
        return `
          <article class="feature-card">
            <h3>${customer.fullName}</h3>
            <p>${customer.phone || "-"} • ${customer.email || "-"}</p>
            <p>${lang === "ar" ? "عدد الطلبات" : "Orders"}: ${customer.ordersCount}</p>
            <p>${lang === "ar" ? "إجمالي الإنفاق" : "Total Spend"}: ${window.formatCurrency(
              customer.totalSpent
            )}</p>
          </article>
        `;
      })
      .join("");
  }

  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json"
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(href);
  }

  async function loadSettings() {
    const response = await adminApi.getSettings();
    config = response.config || defaultConfig;
    fillSettings();
  }

  async function loadProducts() {
    const response = await adminApi.getProducts(productSearch?.value || "");
    products = response.items || [];
    renderProductSelect();
    fillProductForm();
  }

  async function loadOrders() {
    const response = await adminApi.getOrders();
    orders = response.items || [];
    renderOrders();
  }

  async function loadCustomers() {
    const response = await adminApi.getCustomers();
    customers = response.items || [];
    renderCustomers();
  }

  async function loadAll() {
    await Promise.all([loadSettings(), loadProducts(), loadOrders(), loadCustomers()]);
  }

  function buildAuthElements() {
    const loginPanel = document.createElement("section");
    loginPanel.className = "admin-panel";
    loginPanel.id = "adminLoginPanel";
    loginPanel.innerHTML = `
      <h2>${lang === "ar" ? "تسجيل دخول الإدارة" : "Admin Login"}</h2>
      <p class="muted">
        ${lang === "ar"
          ? "استخدم بيانات الدخول المسلّمة مع المشروع."
          : "Use the admin credentials delivered with the project."}
      </p>
      <form id="adminLoginForm" class="form-grid">
        <label>
          ${lang === "ar" ? "اسم المستخدم" : "Username"}
          <input id="adminUsername" class="input" type="text" required />
        </label>
        <label>
          ${lang === "ar" ? "كلمة المرور" : "Password"}
          <input id="adminPassword" class="input" type="password" required />
        </label>
        <button class="btn btn-gold" type="submit">
          ${lang === "ar" ? "تسجيل الدخول" : "Sign In"}
        </button>
        <p id="adminLoginStatus" class="form-status"></p>
      </form>
    `;

    const authActions = document.createElement("div");
    authActions.className = "admin-actions";
    authActions.id = "adminAuthActions";
    authActions.innerHTML = `
      <span id="adminUserInfo" class="muted"></span>
      <button id="adminLogoutBtn" class="btn btn-outline" type="button">
        ${lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
      </button>
    `;

    pageContainer.insertBefore(loginPanel, layout);
    pageContainer.insertBefore(authActions, layout);
  }

  function bindEvents() {
    byId("saveSettingsBtn")?.addEventListener("click", async () => {
      try {
        config = readSettingsForm();
        await adminApi.updateSettings(config);
        setStatus(settingsStatus, t("admin.savedSettings"));
      } catch (error) {
        setStatus(settingsStatus, error.message);
      }
    });

    byId("resetSettingsBtn")?.addEventListener("click", async () => {
      try {
        config = defaultConfig;
        await adminApi.updateSettings(defaultConfig);
        fillSettings();
        setStatus(settingsStatus, t("admin.resetSettings"));
      } catch (error) {
        setStatus(settingsStatus, error.message);
      }
    });

    byId("exportBackupBtn")?.addEventListener("click", async () => {
      try {
        const response = await adminApi.exportSnapshot();
        downloadJson("rawnaq-store-backup.json", response.snapshot);
        setStatus(settingsStatus, t("admin.exported"));
      } catch (error) {
        setStatus(settingsStatus, error.message);
      }
    });

    byId("importBackupInput")?.addEventListener("change", async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        await adminApi.importSnapshot(parsed);
        await loadAll();
        setStatus(settingsStatus, t("admin.imported"));
      } catch (error) {
        setStatus(settingsStatus, error.message || t("admin.importFailed"));
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

    byId("newProductBtn")?.addEventListener("click", () => {
      currentProductId = null;
      clearProductForm();
      if (productSelect) productSelect.value = "";
    });

    byId("saveProductBtn")?.addEventListener("click", async () => {
      try {
        const payload = productPayloadFromForm();
        if (currentProductId) {
          await adminApi.updateProduct(currentProductId, payload);
        } else {
          const created = await adminApi.createProduct(payload);
          currentProductId = created.item.id;
        }
        await loadProducts();
        setStatus(productsStatus, t("admin.savedProduct"));
      } catch (error) {
        setStatus(productsStatus, error.message);
      }
    });

    byId("resetProductsBtn")?.addEventListener("click", async () => {
      try {
        await adminApi.resetProducts();
        await loadProducts();
        setStatus(productsStatus, t("admin.resetProducts"));
      } catch (error) {
        setStatus(productsStatus, error.message);
      }
    });

    byId("refreshOrdersBtn")?.addEventListener("click", async () => {
      try {
        await loadOrders();
        setStatus(ordersStatus, lang === "ar" ? "تم تحديث الطلبات." : "Orders refreshed.");
      } catch (error) {
        setStatus(ordersStatus, error.message);
      }
    });

    byId("refreshCustomersBtn")?.addEventListener("click", async () => {
      try {
        await loadCustomers();
        setStatus(
          customersStatus,
          lang === "ar" ? "تم تحديث العملاء." : "Customers refreshed."
        );
      } catch (error) {
        setStatus(customersStatus, error.message);
      }
    });

    byId("adminLogoutBtn")?.addEventListener("click", async () => {
      try {
        await adminApi.logout();
      } catch (_error) {
        adminApi.clearToken();
      } finally {
        hideApp();
      }
    });

    byId("adminLoginForm")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = String(byId("adminUsername")?.value || "").trim();
      const password = String(byId("adminPassword")?.value || "");
      const loginStatus = byId("adminLoginStatus");
      if (loginStatus) loginStatus.textContent = "";
      try {
        const response = await adminApi.login(username, password);
        if (byId("adminUserInfo")) {
          byId("adminUserInfo").textContent = `${response.user.displayName} (${response.user.username})`;
        }
        showApp();
        await loadAll();
      } catch (error) {
        if (loginStatus) loginStatus.textContent = error.message;
      }
    });
  }

  buildAuthElements();
  bindEvents();
  hideApp();

  try {
    const me = await adminApi.me();
    if (byId("adminUserInfo")) {
      byId("adminUserInfo").textContent = `${me.user.displayName} (${me.user.username})`;
    }
    showApp();
    await loadAll();
  } catch (_error) {
    hideApp();
  }
})();
