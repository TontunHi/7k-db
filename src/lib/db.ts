import mysql, { type Pool } from "mysql2/promise";
import { env } from "./env";

declare global {
  var mysqlPool: Pool | undefined;
  var dbInitialized: boolean | undefined;
  var rbacInitialized: boolean | undefined;
}

const pool: Pool =
  global.mysqlPool ||
  mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z',
    ssl: env.DB_SSL ? {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false
    } : null
  });

if (env.NODE_ENV !== "production") {
  global.mysqlPool = pool;
}

// ─── DB DEBUG WRAPPER ────────────────────────────────────────────────
const patchQuery = (obj: any, label: string) => {
  if (obj.__patchedQuery) return;
  const original = obj.query.bind(obj);
  obj.query = async (sql: string, params?: any[]) => {
    const start = Date.now();
    
    try {
      const result = await original(sql, params);
      if (env.DB_DEBUG) {
        const duration = Date.now() - start;
        console.log(`\x1b[36m[DB ${label}]\x1b[0m \x1b[90m(${duration}ms)\x1b[0m ${sql}`);
        if (params && params.length > 0) {
          console.log(`\x1b[36m[PARAMS]\x1b[0m`, params);
        }
      }
      return result;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (env.DB_DEBUG) {
        console.error(`\x1b[31m[DB ERROR]\x1b[0m ${message}\n\x1b[90mSQL: ${sql}\x1b[0m`);
      }
      throw err;
    }
  };
  obj.__patchedQuery = true;
};

if (!(pool as any).__patched) {
  patchQuery(pool, 'QUERY');

  const originalGetConnection = pool.getConnection.bind(pool);
  pool.getConnection = async () => {
    const connection = await originalGetConnection();
    patchQuery(connection, 'TX/CONN');
    return connection;
  };
  (pool as any).__patched = true;
}

export default pool;

let initializationPromise: Promise<void> | null = null;

export async function initDB() {
  if (global.dbInitialized) {
      if (global.rbacInitialized) return;
      try {
          const [rows] = await pool.query<any[]>("SHOW TABLES LIKE 'users'");
          if (rows.length > 0) {
              global.rbacInitialized = true;
              return;
          }
      } catch (e) {
          // If query fails, let the full migration handle it
      }
  }

  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    global.dbInitialized = true;
    global.rbacInitialized = true;
  })();
  return initializationPromise;
}
