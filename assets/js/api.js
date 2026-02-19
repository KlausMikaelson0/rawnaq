"use strict";

(function initApiClient() {
  const ADMIN_TOKEN_KEY = "rawnaq_admin_token_v1";
  const ADMIN_EXPIRES_KEY = "rawnaq_admin_token_exp_v1";
  let cachedSettings = null;

  async function requestJSON(url, options) {
    const response = await fetch(url, options || {});
    const isJson =
      (response.headers.get("content-type") || "").includes("application/json");
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
      const message =
        (payload && (payload.error || payload.message)) ||
        `Request failed with status ${response.status}`;
      throw new Error(message);
    }
    return payload;
  }

  function withQuery(url, params) {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      query.set(key, String(value));
    });
    const queryString = query.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  function getAdminToken() {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
    } catch (_error) {
      return "";
    }
  }

  function setAdminToken(token, expiresAt) {
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, token || "");
      localStorage.setItem(ADMIN_EXPIRES_KEY, expiresAt || "");
    } catch (_error) {
      // ignore
    }
  }

  function clearAdminToken() {
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_EXPIRES_KEY);
    } catch (_error) {
      // ignore
    }
  }

  function adminHeaders() {
    const token = getAdminToken();
    return token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {};
  }

  const PublicAPI = {
    async getSettings(forceRefresh) {
      if (!forceRefresh && cachedSettings) return cachedSettings;
      const payload = await requestJSON("/api/public/settings");
      cachedSettings = payload.config || null;
      return cachedSettings;
    },
    async getProducts(params) {
      const payload = await requestJSON(withQuery("/api/public/products", params));
      return payload.items || [];
    },
    async getProductBySku(sku) {
      const payload = await requestJSON(
        `/api/public/products/${encodeURIComponent(sku)}`
      );
      return payload.item || null;
    },
    async getFaqs(language) {
      const payload = await requestJSON(
        withQuery("/api/public/faqs", { lang: language || "ar" })
      );
      return payload.items || [];
    },
    async createOrder(orderPayload) {
      const payload = await requestJSON("/api/public/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderPayload || {})
      });
      return payload.order;
    },
    async sendContact(messagePayload) {
      return requestJSON("/api/public/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(messagePayload || {})
      });
    }
  };

  const AdminAPI = {
    getToken: getAdminToken,
    clearToken: clearAdminToken,
    async login(username, password) {
      const payload = await requestJSON("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
      if (payload.token) {
        setAdminToken(payload.token, payload.expiresAt);
      }
      return payload;
    },
    async logout() {
      const payload = await requestJSON("/api/admin/logout", {
        method: "POST",
        headers: {
          ...adminHeaders()
        }
      });
      clearAdminToken();
      return payload;
    },
    async me() {
      return requestJSON("/api/admin/me", {
        headers: {
          ...adminHeaders()
        }
      });
    },
    async dashboard() {
      return requestJSON("/api/admin/dashboard", {
        headers: {
          ...adminHeaders()
        }
      });
    },
    async getSettings() {
      return requestJSON("/api/admin/settings", {
        headers: {
          ...adminHeaders()
        }
      });
    },
    async updateSettings(config) {
      return requestJSON("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...adminHeaders()
        },
        body: JSON.stringify({ config })
      });
    },
    async getProducts(search) {
      return requestJSON(withQuery("/api/admin/products", { search }), {
        headers: {
          ...adminHeaders()
        }
      });
    },
    async createProduct(product) {
      return requestJSON("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...adminHeaders()
        },
        body: JSON.stringify(product || {})
      });
    },
    async updateProduct(productId, product) {
      return requestJSON(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...adminHeaders()
        },
        body: JSON.stringify(product || {})
      });
    },
    async deleteProduct(productId) {
      return requestJSON(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          ...adminHeaders()
        }
      });
    },
    async resetProducts() {
      return requestJSON("/api/admin/products/reset-default", {
        method: "POST",
        headers: {
          ...adminHeaders()
        }
      });
    },
    async getOrders() {
      return requestJSON("/api/admin/orders", {
        headers: {
          ...adminHeaders()
        }
      });
    },
    async getOrder(orderId) {
      return requestJSON(`/api/admin/orders/${orderId}`, {
        headers: {
          ...adminHeaders()
        }
      });
    },
    async updateOrderStatus(orderId, status) {
      return requestJSON(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...adminHeaders()
        },
        body: JSON.stringify({ status })
      });
    },
    async getCustomers() {
      return requestJSON("/api/admin/customers", {
        headers: {
          ...adminHeaders()
        }
      });
    },
    async exportSnapshot() {
      return requestJSON("/api/admin/export", {
        headers: {
          ...adminHeaders()
        }
      });
    },
    async importSnapshot(snapshot) {
      return requestJSON("/api/admin/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...adminHeaders()
        },
        body: JSON.stringify({ snapshot })
      });
    }
  };

  window.PublicAPI = PublicAPI;
  window.AdminAPI = AdminAPI;
})();
