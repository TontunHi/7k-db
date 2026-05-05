"use server"

import pool, { initDB } from "@/lib/db"
import fs from "fs"
import path from "path"
import { logSiteUpdate } from "@/lib/log-actions"
import { requireAdmin } from "./auth-guard"
import { parseHeroDetails, type HeroDetails } from "./hero-utils"
import { type RowDataPacket } from "mysql2"

async function ensureDB() {
    await initDB()
}

export interface TierlistEntry extends RowDataPacket {
    hero_filename: string;
    category: string;
    rank_tier: string;
    hero_type: string;
}

export async function getTierlistData(category: string) {
    await ensureDB()
    
    // Create a mapping from slug -> actual filename (with extension)
    const heroesDir = path.join(process.cwd(), "public", "heroes")
    let fileMap: Record<string, string> = {}
    if (fs.existsSync(heroesDir)) {
        const files = await fs.promises.readdir(heroesDir)
        files.forEach(f => {
            if (/\.(png|jpg|jpeg|webp)$/i.test(f)) {
                fileMap[f.replace(/\.[^/.]+$/, "")] = f
            }
        })
    }

    const [rows] = await pool.query<TierlistEntry[]>("SELECT * FROM tierlist WHERE category = ?", [category])
    return rows.map(r => ({
        heroFilename: fileMap[r.hero_filename] || `${r.hero_filename}.webp`, // Return full filename
        category: r.category,
        rank: r.rank_tier,
        type: r.hero_type
    }))
}

export async function saveTierlistEntry(data: { heroFilename: string; category: string; rank: string; type: string }) {
    await requireAdmin()
    await ensureDB()
    const { heroFilename, category, rank, type } = data
    const slug = heroFilename.replace(/\.[^/.]+$/, "")

    // 1. Ensure Hero Exists in DB (Minimal)
    const details = parseHeroDetails(heroFilename)
    if (!details) throw new Error("Invalid hero filename")
    const { name, grade } = details

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

export async function removeTierlistEntry(heroFilename: string, category: string) {
    await requireAdmin()
    await ensureDB()
    const slug = heroFilename.replace(/\.[^/.]+$/, "")
    const details = parseHeroDetails(heroFilename)
    const name = details?.name || slug
    await pool.query("DELETE FROM tierlist WHERE hero_filename = ? AND category = ?", [slug, category])
    await logSiteUpdate('TIERLIST', name, 'DELETE', `Removed from Tier List: ${name} [${category.toUpperCase()}]`)
}


export async function getAllHeroesForTierlist() {
    // Read from File System to get ALL heroes in the folder
    const heroesDir = path.join(process.cwd(), "public", "heroes")

    if (!fs.existsSync(heroesDir)) return []

    const files = await fs.promises.readdir(heroesDir)

    // Convert files to hero objects
    const heroes = files
        .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
        .map(file => parseHeroDetails(file))
        .filter((h): h is HeroDetails => h !== null && ["l++", "l+", "l", "r"].includes(h.grade))

    return heroes
}
