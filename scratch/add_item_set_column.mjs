import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// Manually parse .env file
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

async function migrate() {
    try {
        const connection = await pool.getConnection();
        console.log("[DB] Adding 'item_set' column to items...");
        
        const [columns] = await connection.query("SHOW COLUMNS FROM items LIKE 'item_set'");
        if (columns.length === 0) {
            await connection.query("ALTER TABLE items ADD COLUMN item_set VARCHAR(100) AFTER weapon_group");
            console.log("[DB] Column 'item_set' added successfully.");
        } else {
            console.log("[DB] Column 'item_set' already exists.");
        }
        
        connection.release();
        await pool.end();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
