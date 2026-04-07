"use server"

import pool, { initDB } from "@/lib/db"
import fs from "fs"
import path from "path"
import { logSiteUpdate } from "@/lib/log-actions"
import { requireAdmin } from "./auth-guard"

async function ensureDB() {
    await initDB()
}

export async function getTierlistData(category) {
    await ensureDB()
    
    // Create a mapping from slug -> actual filename (with extension)
    const heroesDir = path.join(process.cwd(), "public", "heroes")
    let fileMap = {}
    if (fs.existsSync(heroesDir)) {
        const files = await fs.promises.readdir(heroesDir)
        files.forEach(f => {
            if (/\.(png|jpg|jpeg|webp)$/i.test(f)) {
                fileMap[f.replace(/\.[^/.]+$/, "")] = f
            }
        })
    }

    const [rows] = await pool.query("SELECT * FROM tierlist WHERE category = ?", [category])
    return rows.map(r => ({
        heroFilename: fileMap[r.hero_filename] || `${r.hero_filename}.webp`, // Return full filename
        category: r.category,
        rank: r.rank_tier,
        type: r.hero_type
    }))
}

export async function saveTierlistEntry(data) {
    await requireAdmin()
    await ensureDB()
    const { heroFilename, category, rank, type } = data
    const slug = heroFilename.replace(/\.[^/.]+$/, "")

    // 1. Ensure Hero Exists in DB (Minimal)
    const grade = getGradeFromFilename(heroFilename)
    const name = getNameFromFilename(heroFilename)

    await pool.query(`
        INSERT IGNORE INTO heroes (filename, name, grade, skill_priority)
        VALUES (?, ?, ?, ?)
    `, [slug, name, grade, '[]'])

    // 2. Save Tier Entry
    await pool.query(`
        INSERT INTO tierlist (hero_filename, category, rank_tier, hero_type)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        rank_tier = VALUES(rank_tier),
        hero_type = VALUES(hero_type)
    `, [slug, category, rank, type])

    await logSiteUpdate('TIERLIST', name, 'UPDATE', `Updated Tier List: ${name} [${category.toUpperCase()}] to Rank ${rank}`)
}

export async function removeTierlistEntry(heroFilename, category) {
    await requireAdmin()
    await ensureDB()
    const slug = heroFilename.replace(/\.[^/.]+$/, "")
    const name = getNameFromFilename(heroFilename)
    await pool.query("DELETE FROM tierlist WHERE hero_filename = ? AND category = ?", [slug, category])
    await logSiteUpdate('TIERLIST', name, 'DELETE', `Removed from Tier List: ${name} [${category.toUpperCase()}]`)
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
