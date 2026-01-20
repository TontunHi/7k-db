"use server"

import pool, { initDB } from "@/lib/db"
import fs from "fs"
import path from "path"

let dbInitialized = false
async function ensureDB() {
    if (!dbInitialized) {
        await initDB()
        dbInitialized = true
    }
}

export async function getTierlistData(category) {
    await ensureDB()
    const [rows] = await pool.query("SELECT * FROM tierlist WHERE category = ?", [category])
    return rows.map(r => ({
        heroFilename: r.hero_filename,
        category: r.category,
        rank: r.rank_tier,
        type: r.hero_type
    }))
}

export async function saveTierlistEntry(data) {
    await ensureDB()
    const { heroFilename, category, rank, type } = data

    // We should probably ensure the hero exists in 'heroes' table first if we have FK constraints?
    // If we simply read from files, they might not be in DB. 
    // The previous 'build-db' logic tried to save hero data on upload.
    // If we have files manually added, they won't be in DB.
    // So we might need to INSERT IGNORE into heroes table strictly for FK satisfaction?
    // OR we remove the FK constraint? 
    // The `initDB` has `FOREIGN KEY (hero_filename) REFERENCES heroes(filename) ON DELETE CASCADE`.
    // So we MUST insert into heroes table first if it's missing.

    // 1. Ensure Hero Exists in DB (Minimal)
    const grade = getGradeFromFilename(heroFilename)
    const name = getNameFromFilename(heroFilename)

    await pool.query(`
        INSERT IGNORE INTO heroes (filename, name, grade, skill_priority)
        VALUES (?, ?, ?, ?)
    `, [heroFilename, name, grade, '[]'])

    // 2. Save Tier Entry
    await pool.query(`
        INSERT INTO tierlist (hero_filename, category, rank_tier, hero_type)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        rank_tier = VALUES(rank_tier),
        hero_type = VALUES(hero_type)
    `, [heroFilename, category, rank, type])
}

export async function removeTierlistEntry(heroFilename, category) {
    await ensureDB()
    await pool.query("DELETE FROM tierlist WHERE hero_filename = ? AND category = ?", [heroFilename, category])
}

// Logic to parse filename
function getGradeFromFilename(filename) {
    if (filename.startsWith("l++_")) return "l++"
    if (filename.startsWith("l+_")) return "l+"
    if (filename.startsWith("l_")) return "l"
    if (filename.startsWith("r_")) return "r"
    return "unknown"
}

function getNameFromFilename(filename) {
    return filename
        .replace(/^(l\+\+|l\+|l|r)_/, "") // Remove grade prefix
        .replace(/\.[^/.]+$/, "")         // Remove extension
        .replace(/_/g, " ")               // Replace underscores
}

export async function getAllHeroesForTierlist() {
    // Read from File System to get ALL heroes in the folder
    const heroesDir = path.join(process.cwd(), "public", "heroes")

    if (!fs.existsSync(heroesDir)) return []

    const files = await fs.promises.readdir(heroesDir)

    // Convert files to hero objects
    const heroes = files
        .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
        .map(file => {
            const grade = getGradeFromFilename(file)
            return {
                filename: file,
                grade: grade,
                name: getNameFromFilename(file)
            }
        })
        // Filter specifically for requested grades
        .filter(h => ["l++", "l+", "l", "r"].includes(h.grade))

    return heroes
}
