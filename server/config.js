const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");

const DB_PATH =
  process.env.DB_PATH || path.join(ROOT_DIR, "data", "store.db");

const PORT = Number(process.env.PORT || 3000);
const SESSION_TTL_HOURS = Number(process.env.SESSION_TTL_HOURS || 24);

const DEFAULT_ADMIN_USERNAME =
  process.env.ADMIN_USERNAME || "admin@rawnaq.local";
const DEFAULT_ADMIN_PASSWORD =
  process.env.ADMIN_PASSWORD || "Rawnaq@2026";

module.exports = {
  ROOT_DIR,
  DB_PATH,
  PORT,
  SESSION_TTL_HOURS,
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASSWORD
};
