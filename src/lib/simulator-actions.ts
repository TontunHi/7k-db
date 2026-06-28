"use server"

import { getItemImages, getHeroSkills, getHeroData, getFilteredItems, getHeroesMetadata } from "./build-db"
import fs from "fs"
import path from "path"

export async function getSimulatorHeroes() {
    const heroesDir = path.join(process.cwd(), "public", "heroes")
    if (!fs.existsSync(heroesDir)) return []

    const [files, metadata] = await Promise.all([
        fs.promises.readdir(heroesDir),
        getHeroesMetadata()
    ])
    
    const imageFiles = files.filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
    
    // Grade ranking Map
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

    function getGradeFromFilename(filename: string, allFiles: string[]): string | null {
        if (filename.startsWith("a_")) {
            const coreName = filename.replace(/^a_/, "").replace(/\.[^/.]+$/, "")
            for (const basePrefix of ["l++_", "l+_", "l_", "r_"]) {
                const baseFilenameWithoutExt = basePrefix + coreName
                if (allFiles.some(file => file.replace(/\.[^/.]+$/, "") === baseFilenameWithoutExt)) {
                    return "a" + basePrefix.slice(0, -1) // e.g. "al+"
                }
            }
            return "a"
        }
        if (filename.startsWith("l++_")) return "l++"
        if (filename.startsWith("l+_")) return "l+"
        if (filename.startsWith("l_")) return "l"
        if (filename.startsWith("r_")) return "r"
        return null
    }

    const heroes = imageFiles
        .map(file => {
            const grade = getGradeFromFilename(file, imageFiles)
            if (!grade) return null // Filter out anything not in l++, l+, l, r, a
            const slug = file.replace(/\.[^/.]+$/, "")

            return {
                filename: file,
                slug: slug,
                grade: grade,
                name: file.replace(/^(l\+\+|l\+|l|r|a)_/, "").replace(/\.[^/.]+$/, "").replace(/_/g, " "),
                type: metadata[slug]?.type || null
            }
        })
        .filter(h => h !== null)
        .sort((a, b) => {
            // Sort by Grade first
            const ga = gradeOrder[a.grade] ?? 99
            const gb = gradeOrder[b.grade] ?? 99
            if (ga !== gb) return ga - gb
            // Then by Name
            return a.name.localeCompare(b.name)
        })

    return heroes
}

export async function getSimulatorData(heroFilename) {
    // Phase 1: Fetch basic hero data to get group
    const heroData = heroFilename ? await getHeroData(heroFilename) : null
    const heroGroup = heroData?.hero_group || null

    // Phase 2: Fetch resources (weapons filtered by group)
    const [weapons, armors, accessories, skills] = await Promise.all([
        getFilteredItems("weapon", heroGroup),
        getItemImages("armor"),
        getItemImages("accessory"),
        heroFilename ? getHeroSkills(heroFilename) : []
    ])

    return {
        weapons,
        armors,
        accessories,
        skills,
        heroData
    }
}

export async function getAllItemImages() {
    const [weapons, armors, accessories] = await Promise.all([
        getItemImages("weapon"),
        getItemImages("armor"),
        getItemImages("accessory")
    ])
    return { weapons, armors, accessories }
}
