import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

const pool =
  global.mysqlPool ||
  mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, 
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "7k-db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z',
    ssl: process.env.DB_SSL === 'true' ? {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false // Necessary for TiDB Cloud/Cloud providers without explicit CA file
    } : null
  });

if (process.env.NODE_ENV !== "production") {
  global.mysqlPool = pool;
}

// ─── DB DEBUG WRAPPER ────────────────────────────────────────────────
const patchQuery = (obj, label) => {
  const original = obj.query.bind(obj);
  obj.query = async (...args) => {
    const start = Date.now();
    const sql = args[0];
    const params = args[1];
    
    try {
      const result = await original(...args);
      if (process.env.DB_DEBUG === 'true') {
        const duration = Date.now() - start;
        console.log(`\x1b[36m[DB ${label}]\x1b[0m \x1b[90m(${duration}ms)\x1b[0m ${sql}`);
        if (params && params.length > 0) {
          console.log(`\x1b[36m[PARAMS]\x1b[0m`, params);
        }
      }
      return result;
    } catch (err) {
      if (process.env.DB_DEBUG === 'true') {
        console.error(`\x1b[31m[DB ERROR]\x1b[0m ${err.message}\n\x1b[90mSQL: ${sql}\x1b[0m`);
      }
      throw err;
    }
  };
};

patchQuery(pool, 'QUERY');

const originalGetConnection = pool.getConnection.bind(pool);
pool.getConnection = async () => {
  const connection = await originalGetConnection();
  patchQuery(connection, 'TX/CONN');
  return connection;
};

export default pool;

let initializationPromise = null;

export async function initDB() {
  if (global.dbInitialized) {
      if (global.rbacInitialized) return;
      // Quick check to see if RBAC was missed while global was true
      try {
          const [rows] = await pool.query("SHOW TABLES LIKE 'users'");
          if (rows.length > 0) {
              global.rbacInitialized = true;
              return;
          }
      } catch (e) {
          // If query fails, let the full migration handle it
      }
  }

  // Prevent multiple parallel initializations
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    // Migrations are now handled externally via scripts/migrate.mjs
    // We just set flags here to avoid re-running checks unnecessarily.
    global.dbInitialized = true;
    global.rbacInitialized = true;
  })();
  return initializationPromise;
}