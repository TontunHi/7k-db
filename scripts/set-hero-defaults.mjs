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

const connectionConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "7k-db",
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
};

async function run() {
    try {
        console.log(`Connecting to database at ${connectionConfig.host}...`);
        const connection = await mysql.createConnection(connectionConfig);
        
        console.log("Updating all heroes to: hero_group = 'Physical', type = 'Attack'...");
        const [result] = await connection.query(
            "UPDATE heroes SET hero_group = 'Physical', type = 'Attack'"
        );
        
        console.log(`Successfully updated ${result.affectedRows} heroes!`);
        
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error("Error setting hero defaults:", err);
        process.exit(1);
    }
}

run();
