import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// Auto-load .env file if it exists
try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                const value = valueParts.join('=').trim().replace(/^['"]|['"]$/g, '');
                process.env[key.trim()] = value;
            }
        });
    }
} catch (e) {
    console.warn("[Admin] Could not auto-load .env file");
}

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, 
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "7k-db",
    waitForConnections: true,
    connectionLimit: 1,
    ssl: process.env.DB_SSL === 'true' ? { minVersion: 'TLSv1.2', rejectUnauthorized: false } : null
});

async function syncAdmin() {
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD;

    if (!adminPass) {
        console.error("\x1b[31m[Error] ADMIN_PASSWORD is missing in .env\x1b[0m");
        process.exit(1);
    }

    console.log(`[Admin] Syncing credentials for '${adminUser}'...`);

    try {
        const isHashed = /^\$2[aby]\$\d+\$.*/.test(adminPass);
        const hashedPassword = isHashed ? adminPass : await bcrypt.hash(adminPass, 12);

        const [rows] = await pool.query("SELECT id FROM users WHERE username = ?", [adminUser]);

        if (rows.length > 0) {
            await pool.query("UPDATE users SET password_hash = ? WHERE username = ?", [hashedPassword, adminUser]);
            console.log(`\x1b[32m[Success] Updated password for existing user '${adminUser}'.\x1b[0m`);
        } else {
            await pool.query(
                "INSERT INTO users (username, password_hash, role, permissions) VALUES (?, ?, ?, ?)",
                [adminUser, hashedPassword, 'super_admin', JSON.stringify(['*'])]
            );
            console.log(`\x1b[32m[Success] Created new Super Admin user '${adminUser}'.\x1b[0m`);
        }
    } catch (err) {
        console.error("\x1b[31m[Error]\x1b[0m", err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

syncAdmin();
