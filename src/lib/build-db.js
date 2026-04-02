"use server"

import pool, { initDB } from "@/lib/db"
import fs from "fs"
import path from "path"

// Ensure DB is ready
let dbInitialized = false
async function ensureDB() {
    if (!dbInitialized) {
        await initDB()
        dbInitialized = true
    }
}

// === DB Operations ===

export async function getHeroData(filename) {
    await ensureDB()
    const [rows] = await pool.query("SELECT * FROM heroes WHERE filename = ?", [filename])
    const data = rows[0]

    if (!data) return null

    return {
        filename: data.filename,
        name: data.name,
        grade: data.grade,
        is_new_hero: !!data.is_new_hero,
        skillPriority: typeof data.skill_priority === 'string' ? JSON.parse(data.skill_priority) : (data.skill_priority || [])
    }
}

export async function getHeroesMetadata() {
    await ensureDB()
    const [rows] = await pool.query("SELECT filename, is_new_hero FROM heroes")
    return rows.reduce((acc, r) => {
        acc[r.filename] = { is_new_hero: !!r.is_new_hero }
        return acc
    }, {})
}

export async function getHeroes() {
    await ensureDB()
    const [rows] = await pool.query("SELECT * FROM heroes ORDER BY is_new_hero DESC, grade DESC, name ASC")
    return rows.map(r => ({
        filename: r.filename,
        name: r.name,
        grade: r.grade,
        is_new_hero: !!r.is_new_hero,
        skillPriority: typeof r.skill_priority === 'string' ? JSON.parse(r.skill_priority) : (r.skill_priority || [])
    }))
}

export async function saveHeroData(hero) {
    await ensureDB()
    // upsert
    await pool.query(`
    INSERT INTO heroes (filename, name, grade, skill_priority, is_new_hero)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    name = VALUES(name), grade = VALUES(grade), skill_priority = VALUES(skill_priority), is_new_hero = VALUES(is_new_hero)
  `, [hero.filename, hero.name, hero.grade, JSON.stringify(hero.skillPriority || []), hero.is_new_hero ? 1 : 0])
}

export async function getHeroBuilds(heroFilename) {
    await ensureDB()
    const [rows] = await pool.query("SELECT * FROM builds WHERE hero_filename = ?", [heroFilename])
    return rows.map(row => ({
        ...row,
        id: row.id,
        cLevel: row.c_level,
        mode: row.modes,
        weapons: typeof row.weapons === 'string' ? JSON.parse(row.weapons) : row.weapons,
        armors: typeof row.armors === 'string' ? JSON.parse(row.armors) : row.armors,
        accessories: typeof row.accessories === 'string' ? JSON.parse(row.accessories) : row.accessories,
        substats: typeof row.substats === 'string' ? JSON.parse(row.substats) : row.substats,
    }))
}

export async function saveHeroBuilds(heroFilename, builds) {
    await ensureDB()
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()

        // Replace all builds strategy
        await connection.query("DELETE FROM builds WHERE hero_filename = ?", [heroFilename])

        for (const build of builds) {
            await connection.query(`
        INSERT INTO builds (hero_filename, c_level, modes, note, weapons, armors, accessories, substats)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                heroFilename,
                build.cLevel,
                JSON.stringify(build.mode),
                build.note,
                JSON.stringify(build.weapons),
                JSON.stringify(build.armors),
                JSON.stringify(build.accessories),
                JSON.stringify(build.substats)
            ])
        }

        await connection.commit()
        return true
    } catch (error) {
        await connection.rollback()
        console.error("Save error:", error)
        throw new Error("Failed to save builds")
    } finally {
        connection.release()
    }
}

// === Local File Operations (Images) ===

export async function getItemImages(type) {
    const dir = path.join(process.cwd(), "public", "items", type)
    if (!fs.existsSync(dir)) return []
    const files = await fs.promises.readdir(dir)
    const validFiles = files.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))

    // Sorted by Grade: l > r > un > c
    // Filename convention assumption: Grade_Name.png (e.g. l_Ring.png) OR just starts with key.

    const getGradeRank = (filename) => {
        const lower = filename.toLowerCase()
        if (lower.startsWith("l_") || lower.startsWith("l+") || lower.startsWith("l++")) return 4
        if (lower.startsWith("r_")) return 3
        if (lower.startsWith("un_")) return 2
        if (lower.startsWith("c_")) return 1
        return 0
    }

    return validFiles.sort((a, b) => {
        const rankA = getGradeRank(a)
        const rankB = getGradeRank(b)

        if (rankA !== rankB) return rankB - rankA // Higher rank first
        return a.localeCompare(b) // Alphabetical if same rank
    })
}

export async function getHeroSkills(heroFilename) {
    const exactName = heroFilename.replace(/\.[^/.]+$/, "")
    const dirExact = path.join(process.cwd(), "public", "skills", exactName)

    const coreName = heroFilename.replace(/^(l\+\+|l\+|l|r)_/, "").replace(/\.[^/.]+$/, "").replace(/_/g, " ").trim()
    const dirCore = path.join(process.cwd(), "public", "skills", coreName)

    let targetDir = null

    if (fs.existsSync(dirExact)) {
        targetDir = dirExact
    } else if (fs.existsSync(dirCore)) {
        targetDir = dirCore
    }

    if (!targetDir) return []

    const files = await fs.promises.readdir(targetDir)
    const valid = files.filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))

    return valid.sort((a, b) => {
        const numA = parseInt(a.replace(/\.[^/.]+$/, "")) || 0
        const numB = parseInt(b.replace(/\.[^/.]+$/, "")) || 0
        return numB - numA // 4, 3, 2, 1
    }).map(f => `${path.basename(targetDir)}/${f}`)
}
