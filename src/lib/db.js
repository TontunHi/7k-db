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
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS heroes (
        filename VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        grade VARCHAR(50),
        skill_priority JSON
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
        FOREIGN KEY (hero_filename) REFERENCES heroes(filename) ON DELETE CASCADE
      )
    `);

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
        video_url VARCHAR(500),
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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

    console.log("Database tables initialized successfully via secure connection.");
  } catch (err) {
    console.error("Error initializing DB:", err);
  } finally {
    connection.release();
  }
}