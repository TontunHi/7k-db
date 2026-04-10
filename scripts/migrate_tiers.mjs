import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// Auto-load .env file if it exists
try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && (valueParts.length > 0)) {
                const value = valueParts.join('=').trim().replace(/^['"]|['"]$/g, '');
                process.env[key.trim()] = value;
            }
        });
    }
} catch (e) {}

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, 
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "7k-db",
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
    timezone: 'Z',
    ssl: process.env.DB_SSL === 'true' ? {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false
    } : null
});

async function migrate() {
    console.log("[Migration] Starting tier rank migration (D/E -> C)...");
    const connection = await pool.getConnection();
    
    try {
        const [rowsBefore] = await connection.query("SELECT COUNT(*) as count FROM tierlist WHERE rank_tier IN ('D', 'E')");
        const count = rowsBefore[0].count;
        console.log(`[Migration] Found ${count} entries in Tier D/E.`);

        if (count > 0) {
            console.log(`[Migration] Migrating ${count} entries to Tier C...`);
            // We use INSERT ... ON DUPLICATE KEY UPDATE to handle cases where a hero is already in Tier C
            // However, usually a hero is only in one rank per category.
            // But Tierlist table has UNIQUE KEY (hero_filename, category)
            // So if we update 'D' to 'C', and they already have a 'C' entry, it might conflict.
            
            // Let's do it safely:
            // 1. Identify entries to move.
            // 2. For each, if 'C' already exists for that hero/category, delete the 'D'/'E' one.
            // 3. Else, update 'D'/'E' to 'C'.

            const [entries] = await connection.query("SELECT id, hero_filename, category, rank_tier FROM tierlist WHERE rank_tier IN ('D', 'E')");
            
            for (const entry of entries) {
                const [existingC] = await connection.query(
                    "SELECT id FROM tierlist WHERE hero_filename = ? AND category = ? AND rank_tier = 'C'",
                    [entry.hero_filename, entry.category]
                );

                if (existingC.length > 0) {
                    console.log(`[Migration] Hero ${entry.hero_filename} in category ${entry.category} already has Tier C. Deleting Tier ${entry.rank_tier} entry.`);
                    await connection.query("DELETE FROM tierlist WHERE id = ?", [entry.id]);
                } else {
                    console.log(`[Migration] Updating ${entry.hero_filename} in category ${entry.category} from Tier ${entry.rank_tier} to Tier C.`);
                    await connection.query("UPDATE tierlist SET rank_tier = 'C' WHERE id = ?", [entry.id]);
                }
            }
            console.log("[Migration] Migration completed successfully.");
        } else {
            console.log("[Migration] No entries to migrate.");
        }

    } catch (err) {
        console.error("[Migration ERROR]", err);
    } finally {
        if (connection) connection.release();
        await pool.end();
    }
}

migrate();
