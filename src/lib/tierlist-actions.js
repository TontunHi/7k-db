"use server"

import pool, { initDB } from "@/lib/db"
import fs from "fs"
import path from "path"

async function ensureDB() {
    await initDB()
}

export async function getTierlistCreatorData() {
    await ensureDB()
    
    // 1. Fetch All Heroes from FS (most up to date group)
    const heroesDir = path.join(process.cwd(), "public", "heroes")
    if (!fs.existsSync(heroesDir)) return { heroes: [], typeMap: {} }
    
    const files = await fs.promises.readdir(heroesDir)
    const gradeOrder = { "l++": 0, "l+": 1, "l": 2, "r": 3 }

    const heroes = files
        .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
        .map(file => {
            const grade = getGradeFromFilename(file)
            if (!grade) return null
            return {
                filename: file,
                slug: file.replace(/\.[^/.]+$/, ""),
                grade: grade,
                name: file.replace(/^(l\+\+|l\+|l|r)_/, "").replace(/\.[^/.]+$/, "").replace(/_/g, " ")
            }
        })
        .filter(h => h !== null)
        .sort((a, b) => {
            const ga = gradeOrder[a.grade] ?? 99
            const gb = gradeOrder[b.grade] ?? 99
            if (ga !== gb) return ga - gb
            return a.name.localeCompare(b.name)
        })

    // 2. Fetch existing types from the current tierlist assignments to provide a "guessed" type for each hero
    // This allows the "Show Type" toggle to work without direct metadata in the heroes table.
    const [tierRows] = await pool.query("SELECT hero_filename, hero_type FROM tierlist")
    const typeMap = {}
    tierRows.forEach(row => {
        // We take the last assigned type (or we could take the most common one, but last is usually fine)
        typeMap[row.hero_filename] = row.hero_type
    })

    return {
        heroes,
        typeMap
    }
}

function getGradeFromFilename(filename) {
    const lower = filename.toLowerCase()
    if (lower.startsWith("l++_")) return "l++"
    if (lower.startsWith("l+_")) return "l+"
    if (lower.startsWith("l_")) return "l"
    if (lower.startsWith("r_")) return "r"
    return null
}
