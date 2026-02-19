"use strict";

(function initCartStore() {
  const CART_KEY = "rawnaq_cart_v1";

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .map((item) => ({
          sku: String(item.sku || "")
            .trim()
            .toUpperCase(),
          quantity: Math.max(1, Math.min(20, Number(item.quantity || 1)))
        }))
        .filter((item) => item.sku);
    } catch (_error) {
      return [];
    }
  }

  function writeCart(items) {
    const normalized = (Array.isArray(items) ? items : [])
      .map((item) => ({
        sku: String(item.sku || "")
          .trim()
          .toUpperCase(),
        quantity: Math.max(1, Math.min(20, Number(item.quantity || 1)))
      }))
      .filter((item) => item.sku);
    localStorage.setItem(CART_KEY, JSON.stringify(normalized));
    return normalized;
  }

  function addItem(sku, quantity) {
    const targetSku = String(sku || "")
      .trim()
      .toUpperCase();
    if (!targetSku) return readCart();
    const qty = Math.max(1, Math.min(20, Number(quantity || 1)));
    const items = readCart();
    const index = items.findIndex((item) => item.sku === targetSku);
    if (index === -1) {
      items.push({ sku: targetSku, quantity: qty });
    } else {
      items[index].quantity = Math.max(1, Math.min(20, items[index].quantity + qty));
    }
    return writeCart(items);
  }

  function updateItem(sku, quantity) {
    const targetSku = String(sku || "")
      .trim()
      .toUpperCase();
    const qty = Math.max(0, Math.min(20, Number(quantity || 0)));
    const items = readCart();
    const next = items
      .map((item) =>
        item.sku === targetSku
          ? {
              ...item,
              quantity: qty
            }
          : item
      )
      .filter((item) => item.quantity > 0);
    return writeCart(next);
  }

  function removeItem(sku) {
    const targetSku = String(sku || "")
      .trim()
      .toUpperCase();
    const next = readCart().filter((item) => item.sku !== targetSku);
    return writeCart(next);
  }

  function clearCart() {
    localStorage.removeItem(CART_KEY);
    return [];
  }

  function getItemCount() {
    return readCart().reduce((sum, item) => sum + item.quantity, 0);
  }

  window.CartStore = Object.freeze({
    getItems: readCart,
    setItems: writeCart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getItemCount
  });
})();
