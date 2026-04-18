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

async function checkSchema() {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("DESCRIBE items");
        console.log(JSON.stringify(rows, null, 2));
        connection.release();
        await pool.end();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
