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

const RULES = {
    "l++": {
        "Attack":   { speed: 29, attack: 1500, def: 571, hp: 3326 },
        "Magic":    { speed: 29, attack: 1500, def: 571, hp: 3326 },
        "Universal":{ speed: 25, attack: 1306, def: 659, hp: 3693 },
        "Support":  { speed: 19, attack: 1095, def: 675, hp: 4458 },
        "Defense":  { speed: 19, attack: 727,  def: 892, hp: 4825 }
    },
    "l+": {
        "Attack":   { speed: 29, attack: 1500, def: 571, hp: 3326 },
        "Magic":    { speed: 29, attack: 1500, def: 571, hp: 3326 },
        "Universal":{ speed: 25, attack: 1306, def: 659, hp: 3693 },
        "Support":  { speed: 19, attack: 1095, def: 675, hp: 4458 },
        "Defense":  { speed: 19, attack: 727,  def: 892, hp: 4825 }
    },
    "l": {
        "Attack":   { speed: 29, attack: 1500, def: 571, hp: 3326 },
        "Magic":    { speed: 29, attack: 1500, def: 571, hp: 3326 },
        "Universal":{ speed: 25, attack: 1306, def: 659, hp: 3693 },
        "Support":  { speed: 19, attack: 1095, def: 675, hp: 4458 },
        "Defense":  { speed: 19, attack: 727,  def: 892, hp: 4825 }
    },
    "r": {
        "Attack":   { speed: 25, attack: 1389, def: 533, hp: 3174 },
        "Magic":    { speed: 25, attack: 1389, def: 533, hp: 3174 },
        "Universal":{ speed: 21, attack: 1238, def: 616, hp: 3528 },
        "Support":  { speed: 16, attack: 1035, def: 632, hp: 4248 },
        "Defense":  { speed: 16, attack: 704,  def: 818, hp: 4572 }
    }
};

async function run() {
    try {
        console.log(`Connecting to database at ${connectionConfig.host}...`);
        const connection = await mysql.createConnection(connectionConfig);
        
        console.log("Fetching heroes of grade L++, L+, L, and R...");
        const [heroes] = await connection.query(
            "SELECT filename, name, grade, hero_group, type FROM heroes WHERE grade IN ('l++', 'l+', 'l', 'r')"
        );
        
        console.log(`Found ${heroes.length} heroes. Applying rules...`);
        let updatedCount = 0;
        
        for (const hero of heroes) {
            const gradeKey = hero.grade.toLowerCase();
            const typeKey = hero.type;
            
            if (!RULES[gradeKey] || !typeKey || !RULES[gradeKey][typeKey]) {
                // Skip if no matching rule
                continue;
            }
            
            const stats = RULES[gradeKey][typeKey];
            
            let atk_phys = 0;
            let atk_mag = 0;
            
            if (hero.hero_group === "Magic") {
                atk_mag = stats.attack;
            } else {
                atk_phys = stats.attack;
            }
            
            await connection.query(
                `UPDATE heroes 
                 SET speed = ?, def = ?, hp = ?, atk_phys = ?, atk_mag = ? 
                 WHERE filename = ?`,
                [stats.speed, stats.def, stats.hp, atk_phys, atk_mag, hero.filename]
            );
            
            updatedCount++;
        }
        
        console.log(`Successfully updated stats for ${updatedCount} heroes!`);
        
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error("Error setting primary stats:", err);
        process.exit(1);
    }
}

run();
