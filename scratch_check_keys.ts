import pool, { initDB } from "./src/lib/db";

async function checkDungeonKeys() {
    await initDB();
    const [rows] = await pool.query("SELECT DISTINCT dungeon_key FROM dungeon_sets");
    console.log("Dungeon Keys in DB:", rows);
    process.exit(0);
}

checkDungeonKeys();
