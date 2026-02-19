"use strict";

(function initStoreState() {
  const CONFIG_KEY = "rawnaq_store_config_v2";
  const PRODUCTS_KEY = "rawnaq_store_products_v2";

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function deepMerge(base, override) {
    if (Array.isArray(base)) {
      return Array.isArray(override) ? deepClone(override) : deepClone(base);
    }

    if (base && typeof base === "object") {
      const merged = {};
      const overrideObject =
        override && typeof override === "object" && !Array.isArray(override)
          ? override
          : {};

      Object.keys(base).forEach((key) => {
        merged[key] = deepMerge(base[key], overrideObject[key]);
      });

      Object.keys(overrideObject).forEach((key) => {
        if (!(key in merged)) {
          merged[key] = deepClone(overrideObject[key]);
        }
      });

      return merged;
    }

    return override === undefined ? deepClone(base) : deepClone(override);
  }

  function readStorageJSON(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (_error) {
      return null;
    }
  }

  function writeStorageJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_error) {
      // ignore write failures
    }
  }

  function getDefaultConfig() {
    return deepClone(window.DEFAULT_STORE_CONFIG || {});
  }

  function getDefaultProducts() {
    return deepClone(window.DEFAULT_PRODUCTS || []);
  }

  function getConfig() {
    const defaults = getDefaultConfig();
    const stored = readStorageJSON(CONFIG_KEY);
    if (!stored) return defaults;
    return deepMerge(defaults, stored);
  }

  function saveConfig(nextConfig) {
    const normalized = deepMerge(getDefaultConfig(), nextConfig || {});
    writeStorageJSON(CONFIG_KEY, normalized);
    return normalized;
  }

  function resetConfig() {
    try {
      localStorage.removeItem(CONFIG_KEY);
    } catch (_error) {
      // ignore
    }
    return getDefaultConfig();
  }

  function getProducts() {
    const defaults = getDefaultProducts();
    const stored = readStorageJSON(PRODUCTS_KEY);

    if (!Array.isArray(stored) || !stored.length) {
      return defaults;
    }

    const byId = new Map();
    stored.forEach((item) => {
      if (item && typeof item.id === "number") {
        byId.set(item.id, item);
      }
    });

    return defaults.map((item) => {
      const override = byId.get(item.id);
      return override ? deepMerge(item, override) : item;
    });
  }

  function saveProducts(nextProducts) {
    if (!Array.isArray(nextProducts)) {
      return getProducts();
    }
    writeStorageJSON(PRODUCTS_KEY, nextProducts);
    return getProducts();
  }

  function updateProduct(productId, patch) {
    const products = getProducts();
    const index = products.findIndex((item) => item.id === productId);
    if (index === -1) return products;
    products[index] = deepMerge(products[index], patch || {});
    saveProducts(products);
    return products;
  }

  function resetProducts() {
    try {
      localStorage.removeItem(PRODUCTS_KEY);
    } catch (_error) {
      // ignore
    }
    return getDefaultProducts();
  }

  function exportSnapshot() {
    return {
      exportedAt: new Date().toISOString(),
      config: getConfig(),
      products: getProducts()
    };
  }

  function importSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== "object") return false;
    const validConfig = snapshot.config && typeof snapshot.config === "object";
    const validProducts = Array.isArray(snapshot.products);
    if (!validConfig || !validProducts) return false;

    saveConfig(snapshot.config);
    saveProducts(snapshot.products);
    return true;
  }

  window.StoreState = Object.freeze({
    getConfig,
    saveConfig,
    resetConfig,
    getProducts,
    saveProducts,
    updateProduct,
    resetProducts,
    exportSnapshot,
    importSnapshot
  });
})();
