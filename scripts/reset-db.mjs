
import mysql from "mysql2/promise";

const dbTables = [
  'arena_teams',
  'guild_war_teams',
  'total_war_teams',
  'total_war_sets',
  'advent_expedition_sets',
  'raid_sets',
  'dungeon_sets',
  'castle_rush_sets',
  'teams',
  'stage_setups',
  'tierlist',
  'builds'
];

async function resetDB() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "7k-db",
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
  });

  try {
    const connection = await pool.getConnection();
    console.log("Connected to Database. Resetting data...");
    
    // Disable foreign key checks for clean truncation/deletion
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");

    for (const table of dbTables) {
      await connection.query(`TRUNCATE TABLE ${table}`);
      console.log(`Cleared table: ${table}`);
    }

    await connection.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Database reset complete.");
    connection.release();
  } catch (error) {
    console.error("Error resetting DB:", error);
  } finally {
    await pool.end();
  }
}

resetDB();
