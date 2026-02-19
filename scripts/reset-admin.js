#!/usr/bin/env node

require("dotenv").config();

const bcrypt = require("bcryptjs");
const { db, nowIso } = require("../server/db");
const {
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASSWORD
} = require("../server/config");

function readArg(name) {
  const match = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  return match ? match.split("=")[1] : "";
}

const username = readArg("username") || DEFAULT_ADMIN_USERNAME;
const password = readArg("password") || DEFAULT_ADMIN_PASSWORD;

if (!username || !password) {
  process.stderr.write("Username and password are required.\n");
  process.exit(1);
}

const passwordHash = bcrypt.hashSync(password, 10);
const timestamp = nowIso();

const existing = db.prepare("SELECT id FROM admin_users ORDER BY id ASC LIMIT 1").get();

if (existing) {
  db.prepare(
    `
      UPDATE admin_users
      SET username = ?, password_hash = ?, updated_at = ?
      WHERE id = ?
    `
  ).run(username, passwordHash, timestamp, existing.id);
} else {
  db.prepare(
    `
      INSERT INTO admin_users (
        username, password_hash, display_name, role, created_at, updated_at
      ) VALUES (?, ?, 'Store Owner', 'owner', ?, ?)
    `
  ).run(username, passwordHash, timestamp, timestamp);
}

db.prepare("DELETE FROM admin_sessions").run();

process.stdout.write("Admin credentials have been reset.\n");
process.stdout.write(`Username: ${username}\n`);
process.stdout.write(`Password: ${password}\n`);
