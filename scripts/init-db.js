#!/usr/bin/env node

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");
const {
  DB_PATH,
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASSWORD
} = require("../server/config");
const {
  buildStoreSettings,
  buildFaqs,
  generateProducts
} = require("../server/seed-data");

const shouldReset = process.argv.includes("--reset");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

if (shouldReset && fs.existsSync(DB_PATH)) {
  fs.unlinkSync(DB_PATH);
  process.stdout.write(`Database removed: ${DB_PATH}\n`);
}

if (shouldReset) {
  [ `${DB_PATH}-wal`, `${DB_PATH}-shm` ].forEach((pathToRemove) => {
    if (fs.existsSync(pathToRemove)) {
      fs.unlinkSync(pathToRemove);
      process.stdout.write(`Database sidecar removed: ${pathToRemove}\n`);
    }
  });
}

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
db.pragma("busy_timeout = 5000");

const nowIso = new Date().toISOString();

db.exec(`
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category_ar TEXT NOT NULL,
  category_en TEXT NOT NULL,
  badge_ar TEXT NOT NULL,
  badge_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  concentration_ar TEXT NOT NULL,
  concentration_en TEXT NOT NULL,
  volume_ml INTEGER NOT NULL,
  original_price REAL NOT NULL,
  sale_price REAL NOT NULL,
  discount_percent INTEGER NOT NULL,
  stock_status_ar TEXT NOT NULL DEFAULT 'متوفر',
  stock_status_en TEXT NOT NULL DEFAULT 'In Stock',
  image_tone INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  city TEXT,
  address TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT NOT NULL UNIQUE,
  customer_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  payment_method TEXT NOT NULL,
  payment_state TEXT NOT NULL DEFAULT 'pending_integration',
  currency TEXT NOT NULL DEFAULT 'SAR',
  subtotal REAL NOT NULL,
  shipping_cost REAL NOT NULL DEFAULT 0,
  total REAL NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER,
  sku TEXT NOT NULL,
  product_name_ar TEXT NOT NULL,
  product_name_en TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_ar TEXT NOT NULL,
  answer_ar TEXT NOT NULL,
  question_en TEXT NOT NULL,
  answer_en TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_products_category_ar ON products(category_ar);
CREATE INDEX IF NOT EXISTS idx_products_category_en ON products(category_en);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
`);

const seedTransaction = db.transaction(() => {
  const settingsCount = db
    .prepare("SELECT COUNT(*) AS total FROM settings WHERE key = 'store'")
    .get().total;
  if (!settingsCount) {
    db.prepare(
      "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)"
    ).run("store", JSON.stringify(buildStoreSettings()), nowIso);
  }

  const productCount = db.prepare("SELECT COUNT(*) AS total FROM products").get()
    .total;
  if (!productCount) {
    const products = generateProducts();
    const insertProduct = db.prepare(`
      INSERT INTO products (
        sku, name_ar, name_en, category_ar, category_en, badge_ar, badge_en,
        description_ar, description_en, concentration_ar, concentration_en,
        volume_ml, original_price, sale_price, discount_percent, stock_status_ar,
        stock_status_en, image_tone, is_active, created_at, updated_at
      ) VALUES (
        @sku, @name_ar, @name_en, @category_ar, @category_en, @badge_ar, @badge_en,
        @description_ar, @description_en, @concentration_ar, @concentration_en,
        @volume_ml, @original_price, @sale_price, @discount_percent, @stock_status_ar,
        @stock_status_en, @image_tone, 1, @created_at, @updated_at
      )
    `);

    products.forEach((product) => {
      insertProduct.run({
        ...product,
        created_at: nowIso,
        updated_at: nowIso
      });
    });
  }

  const faqCount = db.prepare("SELECT COUNT(*) AS total FROM faqs").get().total;
  if (!faqCount) {
    const insertFaq = db.prepare(`
      INSERT INTO faqs (
        question_ar, answer_ar, question_en, answer_en,
        sort_order, is_active, created_at, updated_at
      ) VALUES (
        @question_ar, @answer_ar, @question_en, @answer_en,
        @sort_order, 1, @created_at, @updated_at
      )
    `);
    buildFaqs().forEach((faq) => {
      insertFaq.run({
        ...faq,
        created_at: nowIso,
        updated_at: nowIso
      });
    });
  }

  const adminCount = db.prepare("SELECT COUNT(*) AS total FROM admin_users").get()
    .total;
  if (!adminCount) {
    const passwordHash = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10);
    db.prepare(
      `
      INSERT INTO admin_users (
        username, password_hash, display_name, role, created_at, updated_at
      ) VALUES (?, ?, ?, 'owner', ?, ?)
    `
    ).run(
      DEFAULT_ADMIN_USERNAME,
      passwordHash,
      "Store Owner",
      nowIso,
      nowIso
    );
  }
});

seedTransaction();

const productTotal = db.prepare("SELECT COUNT(*) AS total FROM products").get().total;
const faqTotal = db.prepare("SELECT COUNT(*) AS total FROM faqs").get().total;
const adminTotal = db.prepare("SELECT COUNT(*) AS total FROM admin_users").get().total;

process.stdout.write("Database initialized successfully.\n");
process.stdout.write(`Path: ${DB_PATH}\n`);
process.stdout.write(`Products: ${productTotal}\n`);
process.stdout.write(`FAQs: ${faqTotal}\n`);
process.stdout.write(`Admin users: ${adminTotal}\n`);
process.stdout.write(`Admin username: ${DEFAULT_ADMIN_USERNAME}\n`);
process.stdout.write(`Admin password: ${DEFAULT_ADMIN_PASSWORD}\n`);

db.close();
