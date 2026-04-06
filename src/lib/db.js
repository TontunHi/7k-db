import mysql from "mysql2/promise";

const pool =
  global.mysqlPool ||
  mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    // เพิ่มการอ่าน Port จาก Environment (TiDB ใช้ 4000)
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, 
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "7k_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // เพิ่มการตั้งค่า SSL เพื่อให้ผ่าน Policy ของ TiDB Serverless
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true
    }
  });

if (process.env.NODE_ENV !== "production") {
  global.mysqlPool = pool;
}

export default pool;

// Helper to init DB
export async function initDB() {
  if (global.dbInitialized) return;

  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS heroes (
        filename VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        grade VARCHAR(50),
        skill_priority JSON,
        is_new_hero TINYINT(1) DEFAULT 0
      )
    `);

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

    // Add min_stats column to builds if missing
    try {
      await connection.query(`ALTER TABLE builds ADD COLUMN min_stats JSON AFTER substats`);
    } catch (e) {
      // Column already exists, ignore
    }

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

    // Add skill_rotation column if missing (for existing databases)
    try {
      await connection.query(`ALTER TABLE castle_rush_sets ADD COLUMN skill_rotation JSON AFTER heroes_json`);
    } catch (e) {
      // Column already exists, ignore
    }

    // Add team_name column if missing (for existing databases)
    try {
      await connection.query(`ALTER TABLE castle_rush_sets ADD COLUMN team_name VARCHAR(100) AFTER set_index`);
    } catch (e) {
      // Column already exists, ignore
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS dungeon_sets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        dungeon_key VARCHAR(50) NOT NULL,
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

    // Add skill_rotation column if missing (for existing databases)
    try {
      await connection.query(`ALTER TABLE dungeon_sets ADD COLUMN skill_rotation JSON AFTER heroes_json`);
    } catch (e) {
      // Column already exists, ignore
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
        set_index INT NOT NULL DEFAULT 1,
        team_name VARCHAR(100),
        team1_formation VARCHAR(50) NOT NULL DEFAULT '2-3',
        team1_pet_file VARCHAR(255),
        team1_heroes_json JSON,
        team1_skill_rotation JSON,
        team2_formation VARCHAR(50) NOT NULL DEFAULT '2-3',
        team2_pet_file VARCHAR(255),
        team2_heroes_json JSON,
        team2_skill_rotation JSON,
        video_url VARCHAR(500),
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add team_name column if missing (for existing databases)
    try {
      await connection.query(`ALTER TABLE advent_expedition_sets ADD COLUMN team_name VARCHAR(100) AFTER set_index`);
    } catch (e) {
      // Column already exists, ignore
    }

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
        type VARCHAR(50) NOT NULL, /* attacker or defender */
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

    // ─── Migrate total_war_teams: old schema had 'tier' column, new schema uses 'set_id' ───
    // Add set_id column if missing
    try {
      await connection.query(`ALTER TABLE total_war_teams ADD COLUMN set_id INT NOT NULL DEFAULT 0 AFTER id`);
    } catch (e) { /* Already exists */ }

    // Drop old 'tier' column if still present
    try {
      await connection.query(`ALTER TABLE total_war_teams DROP COLUMN tier`);
    } catch (e) { /* Already dropped */ }

    // Add foreign key if missing (may fail if FK already exists — that's fine)
    try {
      await connection.query(`ALTER TABLE total_war_teams ADD CONSTRAINT fk_tw_team_set FOREIGN KEY (set_id) REFERENCES total_war_sets(id) ON DELETE CASCADE`);
    } catch (e) { /* Already exists */ }

    // Add is_new_hero column to heroes table if missing
    try {
      await connection.query(`ALTER TABLE heroes ADD COLUMN is_new_hero TINYINT(1) DEFAULT 0 AFTER skill_priority`);
    } catch (e) {
      // Column already exists, ignore
    }

    // ─── Site Updates Log ─────────────────────────────────────────────────────
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

    // ─── One-time Migration: Filename -> Slug (Extension-Agnostic) ───────────
    // If the user uses different extensions, we now link by "slug" (no extension)
    try {
        await connection.query("SET FOREIGN_KEY_CHECKS = 0");
        
        // Update main hero table - Strip any extension (.png, .webp, .jpg, etc.)
        await connection.query(`
            UPDATE heroes 
            SET filename = LEFT(filename, LENGTH(filename) - LOCATE('.', REVERSE(filename))) 
            WHERE filename LIKE '%.%'
        `);
        
        // Update dependent tables
        await connection.query(`
            UPDATE builds 
            SET hero_filename = LEFT(hero_filename, LENGTH(hero_filename) - LOCATE('.', REVERSE(hero_filename))) 
            WHERE hero_filename LIKE '%.%'
        `);
        
        await connection.query(`
            UPDATE tierlist 
            SET hero_filename = LEFT(hero_filename, LENGTH(hero_filename) - LOCATE('.', REVERSE(hero_filename))) 
            WHERE hero_filename LIKE '%.%'
        `);

        // Update JSON columns in all other tables
        const jsonTables = [
            { table: 'raid_sets', cols: ['heroes_json'] },
            { table: 'teams', cols: ['heroes_json'] },
            { table: 'castle_rush_sets', cols: ['heroes_json'] },
            { table: 'dungeon_sets', cols: ['heroes_json'] },
            { table: 'advent_expedition_sets', cols: ['team1_heroes_json', 'team2_heroes_json'] },
            { table: 'arena_teams', cols: ['heroes_json'] },
            { table: 'guild_war_teams', cols: ['heroes_json'] },
            { table: 'total_war_teams', cols: ['heroes_json'] }
        ];

        const stripExt = (arr) => {
            if (!Array.isArray(arr)) return arr;
            return arr.map(item => typeof item === 'string' ? item.replace(/\.[^/.]+$/, "") : item);
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
    } catch (e) {
        console.warn("[Migration] Slug migration error or already done:", e.message);
        await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    }

    console.log("Database tables initialized successfully via secure connection.");
    global.dbInitialized = true;
  } catch (err) {
    console.error("Error initializing DB:", err);
  } finally {
    connection.release();
  }
}