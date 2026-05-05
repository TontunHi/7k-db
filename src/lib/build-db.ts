"use server"

import pool, { initDB } from "@/lib/db"
import fs from "fs"
import path from "path"
import { requireAdmin } from "./auth-guard"
import { type Hero, type ActionResponse } from "./types"
import { type RowDataPacket } from "mysql2"

// Ensure DB is ready
async function ensureDB() {
    await initDB()
}

import { validateData, HeroSchema, BuildSchema, type HeroInput, type Build as BuildInput } from './validation'
import { logSiteUpdate } from './log-actions'

// === DB Operations ===

export async function getHeroData(filename: string) {
    await ensureDB()
    const slug = filename.replace(/\.[^/.]+$/, "")
    const [rows] = await pool.query<Hero[]>("SELECT * FROM heroes WHERE filename = ?", [slug])
    const data = rows[0]

    if (!data) return null

    return {
        filename: data.filename,
        name: data.name,
        grade: data.grade,
        hero_group: data.hero_group,
        is_new_hero: !!data.is_new_hero,
        skillPriority: typeof data.skill_priority === 'string' ? JSON.parse(data.skill_priority) : (data.skill_priority || [])
    }
}

export async function getHeroesMetadata() {
    await ensureDB()
    const [rows] = await pool.query<({ filename: string; is_new_hero: number; type: string | null; sort_order: number })[] & RowDataPacket[]>("SELECT filename, is_new_hero, type, sort_order FROM heroes")
    return rows.reduce((acc: Record<string, { is_new_hero: boolean; type: string | null; sort_order: number }>, r) => {
        acc[r.filename] = { is_new_hero: !!r.is_new_hero, type: r.type || null, sort_order: r.sort_order || 0 }
        return acc
    }, {})
}

export async function getHeroes() {
    await ensureDB()
    const [rows] = await pool.query<Hero[]>("SELECT * FROM heroes ORDER BY is_new_hero DESC, grade DESC, name ASC")
    return rows.map(r => ({
        filename: r.filename,
        name: r.name,
        grade: r.grade,
        is_new_hero: !!r.is_new_hero,
        skillPriority: typeof r.skill_priority === 'string' ? JSON.parse(r.skill_priority) : (r.skill_priority || [])
    }))
}

export async function saveHeroData(hero: HeroInput): Promise<ActionResponse> {
    await requireAdmin()
    
    // Validate data
    const validation = validateData(HeroSchema, hero)
    if (!validation.success) return validation
    const validatedHero = validation.data
    
    await ensureDB()
    const slug = validatedHero.filename.replace(/\.[^/.]+$/, "")
    
    // upsert
    await pool.query(`
    INSERT INTO heroes (filename, name, grade, skill_priority, is_new_hero, sort_order)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
    name = VALUES(name), 
    grade = VALUES(grade), 
    skill_priority = VALUES(skill_priority), 
    is_new_hero = VALUES(is_new_hero),
    sort_order = COALESCE(VALUES(sort_order), sort_order)
  `, [
        slug, 
        validatedHero.name, 
        validatedHero.grade, 
        JSON.stringify(validatedHero.skillPriority || []), 
        validatedHero.is_new_hero ? 1 : 0,
        validatedHero.sort_order ?? 0
    ])

    // Log update
    await logSiteUpdate('HERO', validatedHero.name, 'UPDATE', `Updated data for hero: ${validatedHero.name}`)
    
    return { success: true }
}

export async function getHeroBuilds(heroFilename: string) {
    await ensureDB()
    const slug = heroFilename.replace(/\.[^/.]+$/, "")
    const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM builds WHERE hero_filename = ? ORDER BY build_index ASC", [slug])
    return rows.map(row => ({
        ...row,
        id: row.id,
        cLevel: row.c_level,
        mode: typeof row.modes === 'string' ? JSON.parse(row.modes) : (row.modes || []),
        weapons: typeof row.weapons === 'string' ? JSON.parse(row.weapons) : (row.weapons || []),
        armors: typeof row.armors === 'string' ? JSON.parse(row.armors) : (row.armors || []),
        accessories: typeof row.accessories === 'string' ? JSON.parse(row.accessories) : (row.accessories || []),
        substats: typeof row.substats === 'string' ? JSON.parse(row.substats) : (row.substats || []),
        minStats: typeof row.min_stats === 'string' ? JSON.parse(row.min_stats) : (row.min_stats || {}),
    }))
}

export async function saveHeroBuilds(heroFilename: string, builds: BuildInput[]): Promise<ActionResponse> {
    await requireAdmin()
    
    // Validate all builds
    const validatedBuilds = []
    for (const build of builds) {
        const validation = validateData(BuildSchema, build)
        if (!validation.success) return validation
        validatedBuilds.push(validation.data)
    }

    await ensureDB()
    const slug = heroFilename.replace(/\.[^/.]+$/, "")
    const connection = await pool.getConnection()
    try {
        await connection.beginTransaction()

        // Replace all builds strategy
        await connection.query("DELETE FROM builds WHERE hero_filename = ?", [slug])

        for (let i = 0; i < validatedBuilds.length; i++) {
            const build = validatedBuilds[i]
            await connection.query(`
        INSERT INTO builds (hero_filename, c_level, modes, note, weapons, armors, accessories, substats, min_stats, build_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
                slug,
                build.cLevel,
                JSON.stringify(build.mode),
                build.note || null,
                JSON.stringify(build.weapons),
                JSON.stringify(build.armors),
                JSON.stringify(build.accessories),
                JSON.stringify(build.substats),
                JSON.stringify(build.minStats || {}),
                i + 1
            ])
        }

        await connection.commit()
        
        // Log update
        try {
            const [heroRows] = await connection.query("SELECT name FROM heroes WHERE filename = ?", [slug])
            const heroName = heroRows[0]?.name || slug
            await logSiteUpdate('HERO', heroName, 'UPDATE', `Optimized builds for ${heroName}`)
        } catch (logErr) {
            console.error("Auto-logging failed:", logErr)
        }

        return { success: true }
    } catch (error) {
        await connection.rollback()
        console.error("Save error:", error)
        return { success: false, error: error.message }
    } finally {
        connection.release()
    }
}

export async function reorderHeroes(orderedSlugs: string[]): Promise<ActionResponse> {
    await requireAdmin()
    try {
        await ensureDB()
        // Update each hero's sort_order based on its position in the array
        for (let i = 0; i < orderedSlugs.length; i++) {
            await pool.query(
                'UPDATE heroes SET sort_order = ? WHERE filename = ?',
                [i + 1, orderedSlugs[i]]
            )
        }
        
        const { revalidatePath } = await import('next/cache')
        revalidatePath('/admin/builds')
        revalidatePath('/build')
        
        return { success: true }
    } catch (error) {
        console.error("Reorder Heroes Error:", error)
        return { success: false, error: error.message }
    }
}

// === Local File Operations (Images) ===

export async function getItemImages(type: string) {
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

export async function getFilteredItems(type: string, group: string | null = null) {
    await ensureDB()
    let query = "SELECT image FROM items WHERE item_type = ?"
    const params: (string | null)[] = [type === 'weapon' ? 'Weapon' : type === 'armor' ? 'Armor' : 'Accessory']
    
    if (type === 'weapon' && group) {
        query += " AND weapon_group = ?"
        params.push(group)
    }
    
    query += " ORDER BY FIELD(grade, 'l++', 'l+', 'l', 'r', 'uc', 'c'), name ASC"
    
    const [rows] = await pool.query<({ image: string })[] & RowDataPacket[]>(query, params)
    return rows.map(r => r.image)
}

export async function getHeroSkills(heroFilename: string) {
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
