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

async function syncHeroes(connection) {
    console.log("\n[Heroes] Syncing from public/heroes...");
    const heroesDir = path.join(process.cwd(), "public", "heroes");
    const files = fs.readdirSync(heroesDir).filter(f => f.endsWith(".webp"));

    const defaults = {
        crit_rate: 5,
        crit_dmg: 150,
        weak_hit: 0,
        block_rate: 0,
        dmg_red: 0,
        eff_hit: 0,
        eff_res: 0
    };

    for (const filename of files) {
        const baseFilename = filename.replace(".webp", "");
        
        // Detect Grade from prefix (l+_, l++, l_, r_, uc_, c_)
        const parts = baseFilename.split('_');
        const grade = parts[0].toLowerCase();
        
        // Format Name (Remove grade prefix and snake_case to Title Case)
        const name = parts.slice(1)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        // Check if exists
        const [existing] = await connection.query("SELECT filename, slug FROM heroes WHERE filename = ?", [baseFilename]);

        if (existing.length === 0) {
            console.log(`[Heroes] + Adding new hero: ${name} (${grade.toUpperCase()})`);
            await connection.query(
                "INSERT INTO heroes (filename, slug, name, grade, crit_rate, crit_dmg, weak_hit, block_rate, dmg_red, eff_hit, eff_res) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [baseFilename, baseFilename, name, grade, defaults.crit_rate, defaults.crit_dmg, defaults.weak_hit, defaults.block_rate, defaults.dmg_red, defaults.eff_hit, defaults.eff_res]
            );
        } else {
            // Fix NULL slugs
            if (existing[0].slug === null) {
                console.log(`[Heroes] * Fixing null slug for: ${baseFilename}`);
                await connection.query("UPDATE heroes SET slug = ? WHERE filename = ?", [baseFilename, baseFilename]);
            }
        }
    }
}

async function syncPets(connection) {
    console.log("\n[Pets] Syncing from public/pets...");
    const petsDir = path.join(process.cwd(), "public", "pets");
    const files = fs.readdirSync(petsDir).filter(f => f.endsWith(".webp"));

    const petStats = {
        l: { atk: 564, def: 344, hp: 1895 },
        r: { atk: 371, def: 226, hp: 1246 }
    };

    for (const filename of files) {
        const gradeLetter = filename.split('_')[0].toLowerCase();
        const grade = (gradeLetter === 'l' || gradeLetter === 'l+') ? 'l' : 'r';
        
        const name = filename
            .replace(/^[lr]([+-])?_/, '')
            .replace('.webp', '')
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        const s = petStats[grade] || petStats.r;

        const [existing] = await connection.query("SELECT id FROM pets WHERE image = ?", [filename]);
        
        if (existing.length === 0) {
            console.log(`[Pets] + Adding new pet: ${name} (${grade.toUpperCase()})`);
            await connection.query(
                "INSERT INTO pets (name, grade, atk_all, def, hp, image) VALUES (?, ?, ?, ?, ?, ?)",
                [name, grade, s.atk, s.def, s.hp, filename]
            );
        }
    }
}

async function main() {
    console.log("=== Registry Synchronization Tool ===");
    const connection = await pool.getConnection();

    try {
        await syncHeroes(connection);
        await syncPets(connection);
        console.log("\n[Success] Registry synchronization completed!");
    } catch (err) {
        console.error("\n[Error]", err.message);
    } finally {
        connection.release();
        await pool.end();
    }
}

main();
