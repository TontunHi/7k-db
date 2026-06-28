"use server"

import pool, { initDB } from "@/lib/db"
import fs from "fs"
import path from "path"
import { type RowDataPacket } from "mysql2"

async function ensureDB() {
    await initDB()
}

export async function getTierlistCreatorData() {
    await ensureDB()
    
    // 1. Fetch All Heroes from FS (most up to date group)
    const heroesDir = path.join(process.cwd(), "public", "heroes")
    if (!fs.existsSync(heroesDir)) return { heroes: [], typeMap: {} as Record<string, string> }
    
    const files = await fs.promises.readdir(heroesDir)
    const gradeOrder: Record<string, number> = {
        "al++": 0,
        "al+": 1,
        "al": 2,
        "ar": 3,
        "a": 4,
        "l++": 5,
        "l+": 6,
        "l": 7,
        "r": 8
    }

    const heroes = files
        .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
        .map(file => {
            const grade = getGradeFromFilename(file, files)
            if (!grade) return null
            return {
                filename: file,
                slug: file.replace(/\.[^/.]+$/, ""),
                grade: grade,
                name: file.replace(/^(a|l\+\+|l\+|l|r)_/, "").replace(/\.[^/.]+$/, "").replace(/_/g, " ")
            }
        })
        .filter((h): h is { filename: string; slug: string; grade: string; name: string } => h !== null)
        .sort((a, b) => {
            const ga = gradeOrder[a.grade] ?? 99
            const gb = gradeOrder[b.grade] ?? 99
            if (ga !== gb) return ga - gb
            return a.name.localeCompare(b.name)
        })

    // 2. Fetch existing types from the current tierlist assignments to provide a "guessed" type for each hero
    // This allows the "Show Type" toggle to work without direct metadata in the heroes table.
    const [tierRows] = await pool.query<({ hero_filename: string; hero_type: string })[] & RowDataPacket[]>("SELECT hero_filename, hero_type FROM tierlist")
    const typeMap: Record<string, string> = {}
    tierRows.forEach(row => {
        // We take the last assigned type (or we could take the most common one, but last is usually fine)
        typeMap[row.hero_filename] = row.hero_type
    })

    return {
        heroes,
        typeMap
    }
}

function getGradeFromFilename(filename: string, allFiles: string[]) {
    const lower = filename.toLowerCase()
    if (lower.startsWith("a_")) {
        const coreName = lower.replace(/^a_/, "").replace(/\.[^/.]+$/, "")
        for (const basePrefix of ["l++_", "l+_", "l_", "r_"]) {
            const baseFilenameWithoutExt = basePrefix + coreName
            if (allFiles.some(file => file.toLowerCase().replace(/\.[^/.]+$/, "") === baseFilenameWithoutExt)) {
                return "a" + basePrefix.slice(0, -1) // e.g. "al+"
            }
        }
        return "a"
    }
    if (lower.startsWith("l++_")) return "l++"
    if (lower.startsWith("l+_")) return "l+"
    if (lower.startsWith("l_")) return "l"
    if (lower.startsWith("r_")) return "r"
    return null
}
