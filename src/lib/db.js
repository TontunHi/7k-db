import mysql from "mysql2/promise";

const pool =
  global.mysqlPool ||
  mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "7k_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
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
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content LONGTEXT,
        excerpt TEXT,
        cover_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
        formation VARCHAR(50) NOT NULL,
        pet_file VARCHAR(255),
        heroes_json JSON,
        video_url VARCHAR(500),
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

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

    console.log("Database tables initialized");
  } catch (err) {
    console.error("Error initializing DB:", err);
  } finally {
    connection.release();
  }
}
