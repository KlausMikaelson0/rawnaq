require("dotenv").config();

const express = require("express");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");
const path = require("path");
const {
  ROOT_DIR,
  PORT,
  SESSION_TTL_HOURS
} = require("./config");
const { db, nowIso } = require("./db");
const { buildStoreSettings } = require("./seed-data");

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

function getStoreSettings() {
  const row = db.prepare("SELECT value FROM settings WHERE key = ?").get("store");
  if (!row) {
    return buildStoreSettings();
  }
  try {
    return JSON.parse(row.value);
  } catch (_error) {
    return buildStoreSettings();
  }
}

function saveStoreSettings(nextSettings) {
  const payload = JSON.stringify(nextSettings);
  db.prepare(
    `
    INSERT INTO settings (key, value, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
  `
  ).run("store", payload, nowIso());
}

function mapProductRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    sku: row.sku,
    name: {
      ar: row.name_ar,
      en: row.name_en
    },
    category: {
      ar: row.category_ar,
      en: row.category_en
    },
    badge: {
      ar: row.badge_ar,
      en: row.badge_en
    },
    description: {
      ar: row.description_ar,
      en: row.description_en
    },
    concentration: {
      ar: row.concentration_ar,
      en: row.concentration_en
    },
    volumeMl: row.volume_ml,
    originalPrice: row.original_price,
    salePrice: row.sale_price,
    discountPercent: row.discount_percent,
    stockStatus: {
      ar: row.stock_status_ar,
      en: row.stock_status_en
    },
    imageTone: row.image_tone,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function parseLocalized(input, fallbackAr, fallbackEn) {
  if (input && typeof input === "object" && !Array.isArray(input)) {
    return {
      ar: String(input.ar || fallbackAr || "").trim(),
      en: String(input.en || fallbackEn || "").trim()
    };
  }

  if (typeof input === "string") {
    const value = input.trim();
    return {
      ar: value || fallbackAr || "",
      en: value || fallbackEn || ""
    };
  }

  return {
    ar: String(fallbackAr || "").trim(),
    en: String(fallbackEn || "").trim()
  };
}

function parseProductPayload(payload, existingRow) {
  const row = existingRow || {};
  const name = parseLocalized(payload.name, row.name_ar, row.name_en);
  const category = parseLocalized(
    payload.category,
    row.category_ar,
    row.category_en
  );
  const badge = parseLocalized(payload.badge, row.badge_ar, row.badge_en);
  const description = parseLocalized(
    payload.description,
    row.description_ar,
    row.description_en
  );
  const concentration = parseLocalized(
    payload.concentration,
    row.concentration_ar,
    row.concentration_en
  );
  const stockStatus = parseLocalized(
    payload.stockStatus,
    row.stock_status_ar || "متوفر",
    row.stock_status_en || "In Stock"
  );

  const sku = String(payload.sku || row.sku || "")
    .trim()
    .toUpperCase();
  if (!sku) {
    throw new Error("SKU is required.");
  }

  if (!name.ar || !name.en) {
    throw new Error("Bilingual product names are required.");
  }

  const volumeMl = Number(payload.volumeMl ?? row.volume_ml ?? 100);
  const originalPrice = Number(payload.originalPrice ?? row.original_price ?? 0);
  const salePrice = Number(payload.salePrice ?? row.sale_price ?? 0);
  const imageTone = Number(payload.imageTone ?? row.image_tone ?? 0);
  const isActive =
    payload.isActive === undefined
      ? Number(row.is_active ?? 1)
      : payload.isActive
        ? 1
        : 0;

  if (!Number.isFinite(volumeMl) || volumeMl <= 0) {
    throw new Error("volumeMl must be a positive number.");
  }
  if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
    throw new Error("originalPrice must be a positive number.");
  }
  if (!Number.isFinite(salePrice) || salePrice <= 0) {
    throw new Error("salePrice must be a positive number.");
  }

  const discountPercent = Math.max(
    0,
    Math.round((1 - salePrice / originalPrice) * 100)
  );

  return {
    sku,
    name_ar: name.ar,
    name_en: name.en,
    category_ar: category.ar || "العطور الشرقية الفاخرة",
    category_en: category.en || "Luxury Oriental Perfumes",
    badge_ar: badge.ar || "عرض خاص",
    badge_en: badge.en || "Special Offer",
    description_ar: description.ar,
    description_en: description.en,
    concentration_ar: concentration.ar || "أو دو بارفان",
    concentration_en: concentration.en || "Eau de Parfum",
    stock_status_ar: stockStatus.ar || "متوفر",
    stock_status_en: stockStatus.en || "In Stock",
    volume_ml: Math.round(volumeMl),
    original_price: Number(originalPrice.toFixed(2)),
    sale_price: Number(salePrice.toFixed(2)),
    discount_percent: discountPercent,
    image_tone: Math.max(0, Math.min(4, Math.round(imageTone))),
    is_active: isActive
  };
}

function getAuthToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return "";
  return header.replace("Bearer ", "").trim();
}

function createSession(userId) {
  const token = nanoid(48);
  const expiresAt = new Date(
    Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000
  ).toISOString();
  db.prepare(
    "INSERT INTO admin_sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)"
  ).run(token, userId, expiresAt, nowIso());
  return {
    token,
    expiresAt
  };
}

function requireAdmin(req, res, next) {
  const token = getAuthToken(req);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const session = db
    .prepare(
      `
      SELECT s.token, s.expires_at, u.id AS user_id, u.username, u.display_name, u.role
      FROM admin_sessions s
      JOIN admin_users u ON u.id = s.user_id
      WHERE s.token = ? AND s.expires_at > ?
      LIMIT 1
    `
    )
    .get(token, nowIso());

  if (!session) {
    return res.status(401).json({ error: "Session is invalid or expired." });
  }

  req.admin = {
    token: session.token,
    id: session.user_id,
    username: session.username,
    displayName: session.display_name,
    role: session.role
  };
  return next();
}

function buildOrderNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  let attempt = 0;
  while (attempt < 7) {
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `RNQ-${datePart}-${randomPart}`;
    const exists = db
      .prepare("SELECT id FROM orders WHERE order_number = ? LIMIT 1")
      .get(orderNumber);
    if (!exists) return orderNumber;
    attempt += 1;
  }
  return `RNQ-${datePart}-${Date.now().toString().slice(-6)}`;
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "rawnaq-api",
    timestamp: nowIso()
  });
});

app.get("/api/public/settings", (_req, res) => {
  res.json({
    config: getStoreSettings()
  });
});

app.get("/api/public/faqs", (req, res) => {
  const language = req.query.lang === "en" ? "en" : "ar";
  const rows = db
    .prepare(
      `
      SELECT id, question_ar, answer_ar, question_en, answer_en, sort_order
      FROM faqs
      WHERE is_active = 1
      ORDER BY sort_order ASC, id ASC
    `
    )
    .all();

  const items = rows.map((row) => ({
    id: row.id,
    question: {
      ar: row.question_ar,
      en: row.question_en
    },
    answer: {
      ar: row.answer_ar,
      en: row.answer_en
    },
    text: {
      question: language === "en" ? row.question_en : row.question_ar,
      answer: language === "en" ? row.answer_en : row.answer_ar
    }
  }));

  res.json({ items });
});

app.get("/api/public/products", (req, res) => {
  const search = String(req.query.search || "").trim().toLowerCase();
  const category = String(req.query.category || "").trim().toLowerCase();
  const sortBy = String(req.query.sort || "featured");
  const featured = String(req.query.featured || "false") === "true";
  const limit = Number(req.query.limit || 0);

  let rows = db
    .prepare(
      `
      SELECT *
      FROM products
      WHERE is_active = 1
      ORDER BY id ASC
    `
    )
    .all();

  if (search) {
    rows = rows.filter((row) => {
      const haystack = [
        row.sku,
        row.name_ar,
        row.name_en,
        row.category_ar,
        row.category_en,
        row.description_ar,
        row.description_en
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }

  if (category) {
    rows = rows.filter((row) => {
      return (
        row.category_ar.toLowerCase() === category ||
        row.category_en.toLowerCase() === category
      );
    });
  }

  if (sortBy === "price-low") {
    rows = rows.sort((a, b) => a.sale_price - b.sale_price);
  } else if (sortBy === "price-high") {
    rows = rows.sort((a, b) => b.sale_price - a.sale_price);
  } else if (sortBy === "discount" || featured) {
    rows = rows.sort((a, b) => b.discount_percent - a.discount_percent);
  }

  if (limit > 0) {
    rows = rows.slice(0, limit);
  }

  res.json({
    items: rows.map(mapProductRow)
  });
});

app.get("/api/public/products/:sku", (req, res) => {
  const sku = String(req.params.sku || "")
    .trim()
    .toUpperCase();
  const row = db
    .prepare("SELECT * FROM products WHERE sku = ? AND is_active = 1 LIMIT 1")
    .get(sku);
  if (!row) {
    return res.status(404).json({ error: "Product not found." });
  }
  return res.json({
    item: mapProductRow(row)
  });
});

app.post("/api/public/contact", (req, res) => {
  const fullName = String(req.body.fullName || req.body.name || "").trim();
  const phone = String(req.body.phone || "").trim();
  const email = String(req.body.email || "").trim();
  const message = String(req.body.message || "").trim();

  if (!fullName || !message) {
    return res.status(400).json({ error: "Full name and message are required." });
  }

  db.prepare(
    `
    INSERT INTO contact_messages (full_name, phone, email, message, created_at)
    VALUES (?, ?, ?, ?, ?)
  `
  ).run(fullName, phone || null, email || null, message, nowIso());

  return res.status(201).json({
    ok: true,
    message: "Message submitted successfully."
  });
});

app.post("/api/public/orders", (req, res) => {
  const allowedMethods = new Set(["card", "apple_pay", "mada"]);
  const paymentMethod = String(req.body.paymentMethod || "card");
  if (!allowedMethods.has(paymentMethod)) {
    return res.status(400).json({ error: "Unsupported payment method." });
  }

  const customer = req.body.customer || {};
  const fullName = String(customer.fullName || "").trim();
  const phone = String(customer.phone || "").trim();
  const email = String(customer.email || "").trim();
  const city = String(customer.city || "").trim();
  const address = String(customer.address || "").trim();

  if (!fullName || !phone) {
    return res
      .status(400)
      .json({ error: "Customer full name and phone are required." });
  }

  const rawItems = Array.isArray(req.body.items) ? req.body.items : [];
  const itemMap = new Map();
  rawItems.forEach((entry) => {
    const sku = String(entry.sku || "")
      .trim()
      .toUpperCase();
    const quantity = Math.max(1, Math.min(20, Number(entry.quantity || 1)));
    if (!sku) return;
    const existing = itemMap.get(sku) || 0;
    itemMap.set(sku, existing + quantity);
  });

  const items = Array.from(itemMap.entries()).map(([sku, quantity]) => ({
    sku,
    quantity
  }));

  if (!items.length) {
    return res.status(400).json({ error: "At least one order item is required." });
  }

  const settings = getStoreSettings();
  const currency = settings.currency?.en || "SAR";
  const notes = String(req.body.notes || "").trim();

  try {
    const result = db.transaction(() => {
      let customerRow = null;
      if (email) {
        customerRow = db
          .prepare("SELECT * FROM customers WHERE email = ? ORDER BY id DESC LIMIT 1")
          .get(email);
      }
      if (!customerRow && phone) {
        customerRow = db
          .prepare("SELECT * FROM customers WHERE phone = ? ORDER BY id DESC LIMIT 1")
          .get(phone);
      }

      let customerId;
      const timestamp = nowIso();
      if (customerRow) {
        db.prepare(
          `
          UPDATE customers
          SET full_name = ?, email = ?, phone = ?, city = ?, address = ?, updated_at = ?
          WHERE id = ?
        `
        ).run(
          fullName,
          email || null,
          phone,
          city || null,
          address || null,
          timestamp,
          customerRow.id
        );
        customerId = customerRow.id;
      } else {
        const created = db
          .prepare(
            `
            INSERT INTO customers (
              full_name, email, phone, city, address, notes, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `
          )
          .run(
            fullName,
            email || null,
            phone,
            city || null,
            address || null,
            null,
            timestamp,
            timestamp
          );
        customerId = created.lastInsertRowid;
      }

      const productLookup = db.prepare(
        "SELECT * FROM products WHERE sku = ? AND is_active = 1 LIMIT 1"
      );
      const orderItems = [];
      let subtotal = 0;
      items.forEach((item) => {
        const product = productLookup.get(item.sku);
        if (!product) {
          throw new Error(`Product not found or inactive: ${item.sku}`);
        }
        const unitPrice = Number(product.sale_price);
        const totalPrice = Number((unitPrice * item.quantity).toFixed(2));
        subtotal += totalPrice;
        orderItems.push({
          product_id: product.id,
          sku: product.sku,
          product_name_ar: product.name_ar,
          product_name_en: product.name_en,
          quantity: item.quantity,
          unit_price: unitPrice,
          total_price: totalPrice
        });
      });
      subtotal = Number(subtotal.toFixed(2));
      const shippingCost = 0;
      const total = Number((subtotal + shippingCost).toFixed(2));

      const orderNumber = buildOrderNumber();
      const orderCreated = db
        .prepare(
          `
          INSERT INTO orders (
            order_number, customer_id, status, payment_method, payment_state,
            currency, subtotal, shipping_cost, total, notes, created_at, updated_at
          ) VALUES (?, ?, 'new', ?, 'pending_integration', ?, ?, ?, ?, ?, ?, ?)
        `
        )
        .run(
          orderNumber,
          customerId,
          paymentMethod,
          currency,
          subtotal,
          shippingCost,
          total,
          notes || null,
          timestamp,
          timestamp
        );

      const orderId = orderCreated.lastInsertRowid;
      const insertOrderItem = db.prepare(
        `
        INSERT INTO order_items (
          order_id, product_id, sku, product_name_ar, product_name_en,
          quantity, unit_price, total_price, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      );
      orderItems.forEach((item) => {
        insertOrderItem.run(
          orderId,
          item.product_id,
          item.sku,
          item.product_name_ar,
          item.product_name_en,
          item.quantity,
          item.unit_price,
          item.total_price,
          timestamp
        );
      });

      return {
        orderId,
        orderNumber,
        subtotal,
        shippingCost,
        total,
        currency,
        itemsCount: orderItems.length
      };
    })();

    return res.status(201).json({
      ok: true,
      order: result
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || "Unable to create order."
    });
  }
});

app.post("/api/admin/login", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password are required."
    });
  }

  const user = db
    .prepare("SELECT * FROM admin_users WHERE username = ? LIMIT 1")
    .get(username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const session = createSession(user.id);
  return res.json({
    token: session.token,
    expiresAt: session.expiresAt,
    user: {
      id: user.id,
      username: user.username,
      displayName: user.display_name,
      role: user.role
    }
  });
});

app.post("/api/admin/logout", requireAdmin, (req, res) => {
  db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(req.admin.token);
  return res.json({ ok: true });
});

app.get("/api/admin/me", requireAdmin, (req, res) => {
  return res.json({
    user: {
      id: req.admin.id,
      username: req.admin.username,
      displayName: req.admin.displayName,
      role: req.admin.role
    }
  });
});

app.get("/api/admin/dashboard", requireAdmin, (_req, res) => {
  const products = db.prepare("SELECT COUNT(*) AS total FROM products").get().total;
  const orders = db.prepare("SELECT COUNT(*) AS total FROM orders").get().total;
  const customers = db
    .prepare("SELECT COUNT(*) AS total FROM customers")
    .get().total;
  const revenue = db.prepare("SELECT COALESCE(SUM(total), 0) AS total FROM orders").get()
    .total;
  const messages = db
    .prepare("SELECT COUNT(*) AS total FROM contact_messages")
    .get().total;

  return res.json({
    stats: {
      products,
      orders,
      customers,
      revenue,
      messages
    }
  });
});

app.get("/api/admin/settings", requireAdmin, (_req, res) => {
  res.json({ config: getStoreSettings() });
});

app.put("/api/admin/settings", requireAdmin, (req, res) => {
  const config = req.body.config;
  if (!config || typeof config !== "object") {
    return res.status(400).json({ error: "A valid config object is required." });
  }
  saveStoreSettings(config);
  return res.json({ ok: true, config: getStoreSettings() });
});

app.get("/api/admin/products", requireAdmin, (req, res) => {
  const search = String(req.query.search || "").trim().toLowerCase();
  let rows = db
    .prepare("SELECT * FROM products ORDER BY id DESC")
    .all();
  if (search) {
    rows = rows.filter((row) => {
      const haystack = [
        row.sku,
        row.name_ar,
        row.name_en,
        row.category_ar,
        row.category_en
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });
  }
  res.json({ items: rows.map(mapProductRow) });
});

app.post("/api/admin/products", requireAdmin, (req, res) => {
  try {
    const next = parseProductPayload(req.body || {}, null);
    const existing = db
      .prepare("SELECT id FROM products WHERE sku = ? LIMIT 1")
      .get(next.sku);
    if (existing) {
      return res.status(409).json({ error: "SKU already exists." });
    }
    const timestamp = nowIso();
    const created = db
      .prepare(
        `
        INSERT INTO products (
          sku, name_ar, name_en, category_ar, category_en, badge_ar, badge_en,
          description_ar, description_en, concentration_ar, concentration_en,
          volume_ml, original_price, sale_price, discount_percent, stock_status_ar,
          stock_status_en, image_tone, is_active, created_at, updated_at
        ) VALUES (
          @sku, @name_ar, @name_en, @category_ar, @category_en, @badge_ar, @badge_en,
          @description_ar, @description_en, @concentration_ar, @concentration_en,
          @volume_ml, @original_price, @sale_price, @discount_percent, @stock_status_ar,
          @stock_status_en, @image_tone, @is_active, @created_at, @updated_at
        )
      `
      )
      .run({
        ...next,
        created_at: timestamp,
        updated_at: timestamp
      });

    const row = db
      .prepare("SELECT * FROM products WHERE id = ? LIMIT 1")
      .get(created.lastInsertRowid);
    return res.status(201).json({
      ok: true,
      item: mapProductRow(row)
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Invalid payload." });
  }
});

app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const current = db.prepare("SELECT * FROM products WHERE id = ? LIMIT 1").get(id);
  if (!current) {
    return res.status(404).json({ error: "Product not found." });
  }

  try {
    const next = parseProductPayload(req.body || {}, current);
    const conflictingSku = db
      .prepare("SELECT id FROM products WHERE sku = ? AND id != ? LIMIT 1")
      .get(next.sku, id);
    if (conflictingSku) {
      return res.status(409).json({ error: "SKU already exists." });
    }

    db.prepare(
      `
      UPDATE products
      SET sku = @sku, name_ar = @name_ar, name_en = @name_en,
          category_ar = @category_ar, category_en = @category_en,
          badge_ar = @badge_ar, badge_en = @badge_en,
          description_ar = @description_ar, description_en = @description_en,
          concentration_ar = @concentration_ar, concentration_en = @concentration_en,
          volume_ml = @volume_ml, original_price = @original_price,
          sale_price = @sale_price, discount_percent = @discount_percent,
          stock_status_ar = @stock_status_ar, stock_status_en = @stock_status_en,
          image_tone = @image_tone, is_active = @is_active, updated_at = @updated_at
      WHERE id = @id
    `
    ).run({
      ...next,
      id,
      updated_at: nowIso()
    });

    const row = db.prepare("SELECT * FROM products WHERE id = ? LIMIT 1").get(id);
    return res.json({ ok: true, item: mapProductRow(row) });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Invalid payload." });
  }
});

app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare("SELECT id FROM products WHERE id = ? LIMIT 1").get(id);
  if (!row) {
    return res.status(404).json({ error: "Product not found." });
  }
  db.prepare("UPDATE products SET is_active = 0, updated_at = ? WHERE id = ?").run(
    nowIso(),
    id
  );
  return res.json({ ok: true });
});

app.get("/api/admin/orders", requireAdmin, (_req, res) => {
  const rows = db
    .prepare(
      `
      SELECT
        o.id, o.order_number, o.status, o.payment_method, o.payment_state,
        o.currency, o.subtotal, o.shipping_cost, o.total, o.created_at, o.updated_at,
        c.id AS customer_id, c.full_name, c.email, c.phone,
        COUNT(oi.id) AS items_count
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `
    )
    .all();

  const items = rows.map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    paymentMethod: row.payment_method,
    paymentState: row.payment_state,
    currency: row.currency,
    subtotal: row.subtotal,
    shippingCost: row.shipping_cost,
    total: row.total,
    itemsCount: row.items_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    customer: {
      id: row.customer_id,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone
    }
  }));

  res.json({ items });
});

app.get("/api/admin/orders/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const order = db
    .prepare(
      `
      SELECT
        o.id, o.order_number, o.status, o.payment_method, o.payment_state,
        o.currency, o.subtotal, o.shipping_cost, o.total, o.notes,
        o.created_at, o.updated_at,
        c.id AS customer_id, c.full_name, c.email, c.phone, c.city, c.address
      FROM orders o
      JOIN customers c ON c.id = o.customer_id
      WHERE o.id = ?
      LIMIT 1
    `
    )
    .get(id);

  if (!order) {
    return res.status(404).json({ error: "Order not found." });
  }

  const items = db
    .prepare(
      `
      SELECT id, product_id, sku, product_name_ar, product_name_en, quantity, unit_price, total_price
      FROM order_items
      WHERE order_id = ?
      ORDER BY id ASC
    `
    )
    .all(id);

  return res.json({
    item: {
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentMethod: order.payment_method,
      paymentState: order.payment_state,
      currency: order.currency,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      total: order.total,
      notes: order.notes,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      customer: {
        id: order.customer_id,
        fullName: order.full_name,
        email: order.email,
        phone: order.phone,
        city: order.city,
        address: order.address
      },
      items: items.map((entry) => ({
        id: entry.id,
        productId: entry.product_id,
        sku: entry.sku,
        productName: {
          ar: entry.product_name_ar,
          en: entry.product_name_en
        },
        quantity: entry.quantity,
        unitPrice: entry.unit_price,
        totalPrice: entry.total_price
      }))
    }
  });
});

app.put("/api/admin/orders/:id/status", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const status = String(req.body.status || "").trim().toLowerCase();
  const allowed = new Set([
    "new",
    "confirmed",
    "preparing",
    "shipped",
    "completed",
    "cancelled"
  ]);
  if (!allowed.has(status)) {
    return res.status(400).json({ error: "Invalid order status." });
  }

  const updated = db
    .prepare("UPDATE orders SET status = ?, updated_at = ? WHERE id = ?")
    .run(status, nowIso(), id);
  if (!updated.changes) {
    return res.status(404).json({ error: "Order not found." });
  }
  return res.json({ ok: true });
});

app.get("/api/admin/customers", requireAdmin, (_req, res) => {
  const rows = db
    .prepare(
      `
      SELECT
        c.id, c.full_name, c.email, c.phone, c.city, c.address, c.created_at, c.updated_at,
        COUNT(o.id) AS orders_count,
        COALESCE(SUM(o.total), 0) AS total_spent
      FROM customers c
      LEFT JOIN orders o ON o.customer_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `
    )
    .all();

  const items = rows.map((row) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    city: row.city,
    address: row.address,
    ordersCount: row.orders_count,
    totalSpent: row.total_spent,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));

  return res.json({ items });
});

app.get("/api/admin/export", requireAdmin, (_req, res) => {
  const snapshot = {
    exportedAt: nowIso(),
    settings: {
      store: getStoreSettings()
    },
    tables: {
      products: db.prepare("SELECT * FROM products ORDER BY id ASC").all(),
      customers: db.prepare("SELECT * FROM customers ORDER BY id ASC").all(),
      orders: db.prepare("SELECT * FROM orders ORDER BY id ASC").all(),
      order_items: db.prepare("SELECT * FROM order_items ORDER BY id ASC").all(),
      faqs: db.prepare("SELECT * FROM faqs ORDER BY id ASC").all(),
      admin_users: db
        .prepare(
          "SELECT id, username, password_hash, display_name, role, created_at, updated_at FROM admin_users ORDER BY id ASC"
        )
        .all()
    }
  };

  return res.json({ snapshot });
});

app.post("/api/admin/import", requireAdmin, (req, res) => {
  const snapshot = req.body.snapshot;
  if (!snapshot || typeof snapshot !== "object") {
    return res.status(400).json({ error: "Invalid snapshot payload." });
  }

  const settings = snapshot.settings || {};
  const tables = snapshot.tables || {};

  const requiredTables = [
    "products",
    "customers",
    "orders",
    "order_items",
    "faqs",
    "admin_users"
  ];
  for (const table of requiredTables) {
    if (!Array.isArray(tables[table])) {
      return res.status(400).json({ error: `Missing table payload: ${table}` });
    }
  }

  try {
    db.transaction(() => {
      db.exec("DELETE FROM admin_sessions");
      db.exec("DELETE FROM order_items");
      db.exec("DELETE FROM orders");
      db.exec("DELETE FROM customers");
      db.exec("DELETE FROM products");
      db.exec("DELETE FROM faqs");
      db.exec("DELETE FROM admin_users");

      if (settings.store) {
        saveStoreSettings(settings.store);
      }

      const insertWithColumns = (table, columns, rows) => {
        if (!rows.length) return;
        const placeholders = columns.map(() => "?").join(", ");
        const statement = db.prepare(
          `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`
        );
        rows.forEach((row) => {
          statement.run(columns.map((column) => row[column]));
        });
      };

      insertWithColumns(
        "products",
        [
          "id",
          "sku",
          "name_ar",
          "name_en",
          "category_ar",
          "category_en",
          "badge_ar",
          "badge_en",
          "description_ar",
          "description_en",
          "concentration_ar",
          "concentration_en",
          "volume_ml",
          "original_price",
          "sale_price",
          "discount_percent",
          "stock_status_ar",
          "stock_status_en",
          "image_tone",
          "is_active",
          "created_at",
          "updated_at"
        ],
        tables.products
      );

      insertWithColumns(
        "customers",
        [
          "id",
          "full_name",
          "email",
          "phone",
          "city",
          "address",
          "notes",
          "created_at",
          "updated_at"
        ],
        tables.customers
      );

      insertWithColumns(
        "orders",
        [
          "id",
          "order_number",
          "customer_id",
          "status",
          "payment_method",
          "payment_state",
          "currency",
          "subtotal",
          "shipping_cost",
          "total",
          "notes",
          "created_at",
          "updated_at"
        ],
        tables.orders
      );

      insertWithColumns(
        "order_items",
        [
          "id",
          "order_id",
          "product_id",
          "sku",
          "product_name_ar",
          "product_name_en",
          "quantity",
          "unit_price",
          "total_price",
          "created_at"
        ],
        tables.order_items
      );

      insertWithColumns(
        "faqs",
        [
          "id",
          "question_ar",
          "answer_ar",
          "question_en",
          "answer_en",
          "sort_order",
          "is_active",
          "created_at",
          "updated_at"
        ],
        tables.faqs
      );

      insertWithColumns(
        "admin_users",
        [
          "id",
          "username",
          "password_hash",
          "display_name",
          "role",
          "created_at",
          "updated_at"
        ],
        tables.admin_users
      );
    })();
    return res.json({ ok: true });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Import failed." });
  }
});

const pageNames = new Set([
  "index",
  "products",
  "about",
  "privacy",
  "terms",
  "returns",
  "contact",
  "checkout",
  "admin",
  "faq",
  "cart"
]);

app.use(
  "/assets",
  express.static(path.join(ROOT_DIR, "assets"), {
    etag: true,
    maxAge: "7d"
  })
);

app.use(
  "/en",
  express.static(path.join(ROOT_DIR, "en"), {
    etag: true,
    maxAge: "1h",
    extensions: ["html"]
  })
);

app.get("/", (_req, res) => {
  return res.sendFile(path.join(ROOT_DIR, "index.html"));
});

app.get("/:page", (req, res, next) => {
  const page = req.params.page.replace(".html", "");
  if (!pageNames.has(page)) {
    return next();
  }
  return res.sendFile(path.join(ROOT_DIR, `${page}.html`));
});

app.get("*", (req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "Endpoint not found." });
  }
  return res.status(404).sendFile(path.join(ROOT_DIR, "index.html"));
});

app.listen(PORT, () => {
  process.stdout.write(`Rawnaq server is running on port ${PORT}\n`);
});
