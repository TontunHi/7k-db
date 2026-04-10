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
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "7k-db",
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
});

async function run() {
    console.log("[Migration] Adding 'image' columns to Registry tables...");
    const connection = await pool.getConnection();

    try {
        // Update Pets
        const [petCols] = await connection.query("SHOW COLUMNS FROM pets LIKE 'image'");
        if (petCols.length === 0) {
            console.log("[Migration] Adding 'image' to pets...");
            await connection.query("ALTER TABLE pets ADD COLUMN image VARCHAR(255)");
        }

        // Update Items
        const [itemCols] = await connection.query("SHOW COLUMNS FROM items LIKE 'image'");
        if (itemCols.length === 0) {
            console.log("[Migration] Adding 'image' to items...");
            await connection.query("ALTER TABLE items ADD COLUMN image VARCHAR(255)");
        }

        console.log("[Migration] Registry columns updated successfully.");
    } catch (err) {
        console.error("[Migration Error]", err);
    } finally {
        connection.release();
        await pool.end();
    }
}

run();
