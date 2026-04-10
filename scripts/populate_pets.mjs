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
    console.log("[Migration] Populating 'pets' table from assets...");
    const connection = await pool.getConnection();

    try {
        const petsDir = path.join(process.cwd(), "public", "pets");
        const files = fs.readdirSync(petsDir).filter(f => f.endsWith(".webp"));

        const stats = {
            l: { atk: 564, def: 344, hp: 1895 },
            r: { atk: 371, def: 226, hp: 1246 }
        };

        for (const filename of files) {
            const gradeLetter = filename.split('_')[0].toLowerCase();
            const grade = gradeLetter === 'l' ? 'l' : 'r';
            
            // Format name: r_croa.webp -> Croa, l_little_feng.webp -> Little Feng
            const name = filename
                .replace(/^[lr]_/, '')
                .replace('.webp', '')
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            const s = stats[grade];

            // Check if already exists
            const [existing] = await connection.query("SELECT id FROM pets WHERE image = ?", [filename]);
            
            if (existing.length > 0) {
                console.log(`[Migration] Updating pet: ${name} (${grade.toUpperCase()})`);
                await connection.query(
                    "UPDATE pets SET name = ?, grade = ?, atk_all = ?, def = ?, hp = ? WHERE image = ?",
                    [name, grade, s.atk, s.def, s.hp, filename]
                );
            } else {
                console.log(`[Migration] Inserting pet: ${name} (${grade.toUpperCase()})`);
                await connection.query(
                    "INSERT INTO pets (name, grade, atk_all, def, hp, image) VALUES (?, ?, ?, ?, ?, ?)",
                    [name, grade, s.atk, s.def, s.hp, filename]
                );
            }
        }

        console.log("[Migration] Pet data population completed.");
    } catch (err) {
        console.error("[Migration Error]", err);
    } finally {
        connection.release();
        await pool.end();
    }
}

run();
