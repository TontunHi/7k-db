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
    console.log("[Migration] Starting Registry System setup...");
    const connection = await pool.getConnection();

    try {
        // 1. Update Heroes Table
        console.log("[Migration] Updating 'heroes' table...");
        const heroColumns = [
            { name: "type", type: "VARCHAR(50)" },
            { name: "hero_group", type: "VARCHAR(50)" },
            { name: "atk_phys", type: "INT DEFAULT 0" },
            { name: "atk_mag", type: "INT DEFAULT 0" },
            { name: "def", type: "INT DEFAULT 0" },
            { name: "hp", type: "INT DEFAULT 0" },
            { name: "speed", type: "INT DEFAULT 0" },
            { name: "crit_rate", type: "DECIMAL(10,2) DEFAULT 0.00" },
            { name: "crit_dmg", type: "DECIMAL(10,2) DEFAULT 0.00" },
            { name: "weak_hit", type: "DECIMAL(10,2) DEFAULT 0.00" },
            { name: "block_rate", type: "DECIMAL(10,2) DEFAULT 0.00" },
            { name: "dmg_red", type: "DECIMAL(10,2) DEFAULT 0.00" },
            { name: "eff_hit", type: "DECIMAL(10,2) DEFAULT 0.00" },
            { name: "eff_res", type: "DECIMAL(10,2) DEFAULT 0.00" }
        ];

        for (const col of heroColumns) {
            const [rows] = await connection.query("SHOW COLUMNS FROM heroes LIKE ?", [col.name]);
            if (rows.length === 0) {
                console.log(`[Migration] Adding column '${col.name}' to heroes...`);
                await connection.query(`ALTER TABLE heroes ADD COLUMN ${col.name} ${col.type}`);
            }
        }

        // 2. Create Pets Table
        console.log("[Migration] Creating 'pets' table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS pets (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                grade VARCHAR(50),
                atk_all INT DEFAULT 0,
                def INT DEFAULT 0,
                hp INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Create Items Table
        console.log("[Migration] Creating 'items' table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                grade VARCHAR(50),
                item_type ENUM('Weapon', 'Armor', 'Accessory') NOT NULL,
                atk_all_perc DECIMAL(10,2) DEFAULT 0.00,
                def_perc DECIMAL(10,2) DEFAULT 0.00,
                hp_perc DECIMAL(10,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("[Migration] Registry setup completed successfully.");
    } catch (err) {
        console.error("[Migration Error]", err);
    } finally {
        connection.release();
        await pool.end();
    }
}

run();
