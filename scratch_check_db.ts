import pool, { initDB } from "./src/lib/db";

async function checkData() {
    await initDB();
    const [rows] = await pool.query("SELECT * FROM dungeon_sets WHERE dungeon_key = '01_fire'");
    console.log("Rows for 01_fire:", rows);
    process.exit(0);
}

checkData();
