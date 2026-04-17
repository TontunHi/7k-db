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
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z',
    ssl: process.env.DB_SSL === 'true' ? {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false
    } : null
});

async function runMigrations() {
    console.log("[DB] Starting database migration...");
    const connection = await pool.getConnection();
    
    try {
        // ─── 0. Create Core Settings ───────────────────────────────────────
        await connection.query(`
          CREATE TABLE IF NOT EXISTS site_settings (
            setting_key VARCHAR(100) PRIMARY KEY,
            setting_value TEXT NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);

        const getSettingInternal = async (key) => {
            try {
                const [rows] = await connection.query("SELECT setting_value FROM site_settings WHERE setting_key = ?", [key]);
                return rows.length > 0 ? rows[0].setting_value : null;
            } catch (e) { return null; }
        };

        const saveSettingInternal = async (key, value) => {
            await connection.query("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?", [key, String(value), String(value)]);
        };

        // ─── 1. Heroes Table & Slug Migration ────────────────────────────────
        await connection.query(`
          CREATE TABLE IF NOT EXISTS heroes (
            filename VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255),
            grade VARCHAR(50),
            skill_priority JSON,
            is_new_hero TINYINT(1) DEFAULT 0
          )
        `);

        // Split Alter for TiDB Compatibility
        const [heroColumns] = await connection.query('SHOW COLUMNS FROM heroes LIKE "slug"');
        if (heroColumns.length === 0) {
          try {
            console.log("[DB] Adding 'slug' column to heroes...");
            await connection.query(`ALTER TABLE heroes ADD COLUMN slug VARCHAR(255) AFTER filename`);
            await connection.query(`CREATE UNIQUE INDEX idx_hero_slug ON heroes(slug)`);
          } catch (e) { 
            console.warn("[DB] Could not add slug column/index:", e.message); 
          }
        }

        // Populate slug if null
        const [finalHeroCols] = await connection.query('SHOW COLUMNS FROM heroes LIKE "slug"');
        if (finalHeroCols.length > 0) {
            try {
                const [heroes] = await connection.query(`SELECT filename, slug FROM heroes WHERE slug IS NULL`);
                if (heroes.length > 0) {
                    console.log(`[DB] Migrating ${heroes.length} hero slugs...`);
                    for (const h of heroes) {
                        const slug = h.filename.replace(/\\.[^/.]+$/, "");
                        await connection.query(`UPDATE heroes SET slug = ? WHERE filename = ?`, [slug, h.filename]);
                    }
                }
            } catch (e) {
                console.warn("[DB] Could not migrate slugs:", e.message);
            }
        }

        // ─── 2. Content Tables ──────────────────────────────────────────────
        await connection.query(`
          CREATE TABLE IF NOT EXISTS builds (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hero_filename VARCHAR(255),
            c_level VARCHAR(10),
            modes JSON,
            note TEXT,
            weapons JSON,
            armors JSON,
            accessories JSON,
            substats JSON,
            min_stats JSON,
            FOREIGN KEY (hero_filename) REFERENCES heroes(filename) ON DELETE CASCADE
          )
        `);

        try {
            const [check] = await connection.query(`SHOW COLUMNS FROM builds LIKE "min_stats"`);
            if (check.length === 0) { await connection.query(`ALTER TABLE builds ADD COLUMN min_stats JSON AFTER substats`); }
        } catch (e) {}

        await connection.query(`
          CREATE TABLE IF NOT EXISTS tierlist (
            id INT AUTO_INCREMENT PRIMARY KEY,
            hero_filename VARCHAR(255),
            category VARCHAR(50),
            rank_tier VARCHAR(10),
            hero_type VARCHAR(50),
            FOREIGN KEY (hero_filename) REFERENCES heroes(filename) ON DELETE CASCADE,
            UNIQUE KEY unique_hero_cat (hero_filename, category)
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS stage_setups (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type ENUM('stage', 'nightmare') NOT NULL DEFAULT 'stage',
            name VARCHAR(255) NOT NULL,
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS teams (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setup_id INT NOT NULL,
            team_index INT NOT NULL DEFAULT 1,
            formation VARCHAR(50) NOT NULL,
            pet_file VARCHAR(255),
            heroes_json JSON,
            FOREIGN KEY (setup_id) REFERENCES stage_setups(id) ON DELETE CASCADE
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS castle_rush_sets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            boss_key VARCHAR(50) NOT NULL,
            set_index INT NOT NULL DEFAULT 1,
            team_name VARCHAR(100),
            formation VARCHAR(50) NOT NULL,
            pet_file VARCHAR(255),
            heroes_json JSON,
            skill_rotation JSON,
            video_url VARCHAR(500),
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        const castleCols = [
            { name: 'skill_rotation', type: 'JSON', after: 'heroes_json' },
            { name: 'team_name', type: 'VARCHAR(100)', after: 'set_index' }
        ];
        for (const c of castleCols) {
            const [check] = await connection.query('SHOW COLUMNS FROM castle_rush_sets LIKE ?', [c.name]);
            if (check.length === 0) {
                try { await connection.query(`ALTER TABLE castle_rush_sets ADD COLUMN ${c.name} ${c.type} AFTER ${c.after}`); } catch (e) {}
            }
        }

        await connection.query(`
          CREATE TABLE IF NOT EXISTS dungeon_sets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            dungeon_key VARCHAR(50) NOT NULL,
            set_index INT NOT NULL DEFAULT 1,
            formation VARCHAR(50) NOT NULL,
            pet_file VARCHAR(255),
            aura VARCHAR(20),
            heroes_json JSON,
            skill_rotation JSON,
            video_url VARCHAR(500),
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        const dungeonCols = [
            { name: 'aura', type: 'VARCHAR(20)', after: 'pet_file' },
            { name: 'skill_rotation', type: 'JSON', after: 'heroes_json' }
        ];
        for (const c of dungeonCols) {
            const [check] = await connection.query('SHOW COLUMNS FROM dungeon_sets LIKE ?', [c.name]);
            if (check.length === 0) {
                try { await connection.query(`ALTER TABLE dungeon_sets ADD COLUMN ${c.name} ${c.type} AFTER ${c.after}`); } catch (e) {}
            }
        }

        await connection.query(`
          CREATE TABLE IF NOT EXISTS raid_sets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            raid_key VARCHAR(50) NOT NULL,
            set_index INT NOT NULL DEFAULT 1,
            formation VARCHAR(50) NOT NULL,
            pet_file VARCHAR(255),
            heroes_json JSON,
            skill_rotation JSON,
            video_url VARCHAR(500),
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS advent_expedition_sets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            boss_key VARCHAR(50) NOT NULL,
            phase VARCHAR(20) DEFAULT 'Phase 1',
            set_index INT NOT NULL DEFAULT 1,
            team_name VARCHAR(100),
            formation VARCHAR(50) NOT NULL DEFAULT '2-3',
            pet_file VARCHAR(255),
            heroes_json JSON,
            skill_rotation JSON,
            video_url VARCHAR(500),
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        try {
            const [check] = await connection.query('SHOW COLUMNS FROM advent_expedition_sets LIKE "team_name"');
            if (check.length === 0) { await connection.query(`ALTER TABLE advent_expedition_sets ADD COLUMN team_name VARCHAR(100) AFTER set_index`); }
        } catch (e) {}

        await connection.query(`
          CREATE TABLE IF NOT EXISTS arena_teams (
            id INT AUTO_INCREMENT PRIMARY KEY,
            team_index INT NOT NULL DEFAULT 1,
            team_name VARCHAR(100),
            formation VARCHAR(50) NOT NULL,
            pet_file VARCHAR(255),
            heroes_json JSON,
            skill_rotation JSON,
            video_url VARCHAR(500),
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS guild_war_teams (
            id INT AUTO_INCREMENT PRIMARY KEY,
            team_index INT NOT NULL DEFAULT 1,
            type VARCHAR(50) NOT NULL,
            team_name VARCHAR(100),
            formation VARCHAR(50) NOT NULL,
            pet_file VARCHAR(255),
            heroes_json JSON,
            skill_rotation JSON,
            video_url VARCHAR(500),
            note TEXT,
            counters_json JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Check and add counters_json if not exists
        try {
            const [columns] = await connection.query("SHOW COLUMNS FROM guild_war_teams LIKE 'counters_json'");
            if (columns.length === 0) {
                console.log("[Migration] Adding counters_json to guild_war_teams...");
                await connection.query("ALTER TABLE guild_war_teams ADD COLUMN counters_json JSON");
            }
        } catch (colErr) {
            console.warn("[Migration] Could not add counters_json column:", colErr.message);
        }

        await connection.query(`
          CREATE TABLE IF NOT EXISTS total_war_sets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            tier ENUM('legendary','superb','elite','normal') NOT NULL,
            set_index INT NOT NULL DEFAULT 1,
            set_name VARCHAR(100),
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS total_war_teams (
            id INT AUTO_INCREMENT PRIMARY KEY,
            set_id INT NOT NULL,
            team_index INT NOT NULL DEFAULT 1,
            team_name VARCHAR(100),
            formation VARCHAR(50) NOT NULL DEFAULT '2-3',
            pet_file VARCHAR(255),
            heroes_json JSON,
            skill_rotation JSON,
            video_url VARCHAR(500),
            note TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (set_id) REFERENCES total_war_sets(id) ON DELETE CASCADE
          )
        `);

        try {
            const [cols] = await connection.query('SHOW COLUMNS FROM total_war_teams LIKE "set_id"');
            if (cols.length === 0) {
                await connection.query(`ALTER TABLE total_war_teams ADD COLUMN set_id INT NOT NULL DEFAULT 0 AFTER id`);
                try { await connection.query(`ALTER TABLE total_war_teams ADD CONSTRAINT fk_tw_team_set FOREIGN KEY (set_id) REFERENCES total_war_sets(id) ON DELETE CASCADE`); } catch (e) {}
            }
            const [tierCols] = await connection.query('SHOW COLUMNS FROM total_war_teams LIKE "tier"');
            if (tierCols.length > 0) { await connection.query(`ALTER TABLE total_war_teams DROP COLUMN tier`); }
        } catch (e) {}

        try {
            const [checkNewHero] = await connection.query('SHOW COLUMNS FROM heroes LIKE "is_new_hero"');
            if (checkNewHero.length === 0) { await connection.query(`ALTER TABLE heroes ADD COLUMN is_new_hero TINYINT(1) DEFAULT 0`); }
        } catch (e) {}

        // ─── 3. System Tables ──────────────────────────────────────────────
        await connection.query(`
          CREATE TABLE IF NOT EXISTS site_updates (
            id INT AUTO_INCREMENT PRIMARY KEY,
            content_type VARCHAR(50) NOT NULL,
            target_name VARCHAR(200) NOT NULL,
            action_type ENUM('CREATE','UPDATE','DELETE') NOT NULL DEFAULT 'UPDATE',
            message VARCHAR(500) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        try {
            const [checkLog] = await connection.query('SHOW COLUMNS FROM site_updates LIKE "admin_name"');
            if (checkLog.length === 0) { 
                await connection.query(`ALTER TABLE site_updates ADD COLUMN admin_name VARCHAR(100) AFTER message`); 
            }
        } catch (e) {}
        
        await connection.query(`
          CREATE TABLE IF NOT EXISTS global_credits (
            id INT AUTO_INCREMENT PRIMARY KEY,
            platform ENUM('youtube', 'tiktok', 'facebook', 'discord', 'other') NOT NULL DEFAULT 'other',
            name VARCHAR(200) NOT NULL,
            link VARCHAR(500) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        const defaults = { 'contact_form_enabled': 'true' };
        for (const [key, val] of Object.entries(defaults)) {
            await connection.query(`INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)`, [key, val]);
        }

        await connection.query(`
          CREATE TABLE IF NOT EXISTS contact_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            email VARCHAR(200) NOT NULL,
            subject VARCHAR(200),
            message TEXT NOT NULL,
            status ENUM('unread', 'read') NOT NULL DEFAULT 'unread',
            ip_address VARCHAR(45),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS analytics_views (
            id INT AUTO_INCREMENT PRIMARY KEY,
            page_path VARCHAR(255) NOT NULL,
            ip_hash VARCHAR(64) NOT NULL,
            session_id VARCHAR(64) NOT NULL,
            user_agent TEXT,
            event_type ENUM('pageview', 'exit') DEFAULT 'pageview',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        await connection.query(`
          CREATE TABLE IF NOT EXISTS analytics_clicks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            link_url VARCHAR(500) NOT NULL,
            link_id VARCHAR(100),
            page_path VARCHAR(255) NOT NULL,
            ip_hash VARCHAR(64) NOT NULL,
            session_id VARCHAR(64) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        
        // ─── 4. RBAC: Users Table & Super Admin Init ────────────────────────
        await connection.query(`
          CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role ENUM('super_admin', 'admin') NOT NULL DEFAULT 'admin',
            permissions JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // First-time Super Admin Initialization
        const [existingUsers] = await connection.query("SELECT id FROM users LIMIT 1");
        if (existingUsers.length === 0 && process.env.ADMIN_PASSWORD) {
            const adminUser = process.env.ADMIN_USER || 'admin';
            console.log(`[RBAC] Initializing first Super Admin '${adminUser}' from environment...`);
            
            const rawPassword = process.env.ADMIN_PASSWORD;
            // Check if it's already a bcrypt hash (starts with $2a$, $2b$, or $2y$)
            const isHashed = /^\$2[aby]\$\d+\$.*/.test(rawPassword);
            
            const hashedPassword = isHashed 
                ? rawPassword 
                : await bcrypt.hash(rawPassword, 12);
            
            await connection.query(
                "INSERT INTO users (username, password_hash, role, permissions) VALUES (?, ?, ?, ?)",
                [adminUser, hashedPassword, 'super_admin', JSON.stringify(['*'])]
            );
            console.log(`[RBAC] Super Admin '${adminUser}' created successfully (${isHashed ? 'using pre-hashed secret' : 'hashed with 12 rounds'}).`);
        }

        // ─── 4. Extension Strip Migration (One-time) ────────────────────────
        const migrationDone = await getSettingInternal('migration_v1_ext_strip');
        if (!migrationDone) {
            try {
                console.log("[Migration] Starting filename-to-slug extension strip...");
                await connection.query("SET FOREIGN_KEY_CHECKS = 0");
                
                await connection.query(`UPDATE heroes SET filename = LEFT(filename, LENGTH(filename) - LOCATE('.', REVERSE(filename))) WHERE filename LIKE '%.%'`);
                
                const tablesToUpdate = ['builds', 'tierlist'];
                for (const t of tablesToUpdate) {
                    await connection.query(`UPDATE ${t} SET hero_filename = LEFT(hero_filename, LENGTH(hero_filename) - LOCATE('.', REVERSE(hero_filename))) WHERE hero_filename LIKE '%.%'`);
                }

                const jsonTables = [
                    { table: 'raid_sets', cols: ['heroes_json'] },
                    { table: 'teams', cols: ['heroes_json'] },
                    { table: 'castle_rush_sets', cols: ['heroes_json'] },
                    { table: 'dungeon_sets', cols: ['heroes_json'] },
                    { table: 'advent_expedition_sets', cols: ['heroes_json'] },
                    { table: 'arena_teams', cols: ['heroes_json'] },
                    { table: 'guild_war_teams', cols: ['heroes_json'] },
                    { table: 'total_war_teams', cols: ['heroes_json'] }
                ];

                const stripExt = (arr) => {
                    if (!Array.isArray(arr)) return arr;
                    return arr.map(item => typeof item === 'string' ? item.replace(/\\.[^/.]+$/, "") : item);
                };

                for (const target of jsonTables) {
                    const [rows] = await connection.query(`SELECT id, ${target.cols.join(', ')} FROM ${target.table}`);
                    for (const row of rows) {
                        let needsUpdate = false;
                        const updates = {};
                        for (const col of target.cols) {
                            if (!row[col]) continue;
                            const original = typeof row[col] === 'string' ? JSON.parse(row[col]) : row[col];
                            const sanitized = stripExt(original);
                            if (JSON.stringify(original) !== JSON.stringify(sanitized)) {
                                updates[col] = JSON.stringify(sanitized);
                                needsUpdate = true;
                            }
                        }
                        if (needsUpdate) {
                            const setClause = Object.keys(updates).map(col => `${col} = ?`).join(', ');
                            await connection.query(`UPDATE ${target.table} SET ${setClause} WHERE id = ?`, [...Object.values(updates), row.id]);
                        }
                    }
                }

                await connection.query("SET FOREIGN_KEY_CHECKS = 1");
                await saveSettingInternal('migration_v1_ext_strip', 'done');
                console.log("[Migration] Successfully finished extension strip.");
            } catch (e) {
                console.warn("[Migration] Extension strip failed:", e.message);
                await connection.query("SET FOREIGN_KEY_CHECKS = 1");
            }
        }

        console.log("[DB] Migrations completed successfully.");
    } catch (err) {
        console.error("[DB ERROR] Error running migrations:", err);
        process.exit(1);
    } finally {
        if (connection) connection.release();
        await pool.end();
        process.exit(0);
    }
}

runMigrations();
