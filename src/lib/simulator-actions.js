"use server"

import { getItemImages, getHeroSkills, getHeroData } from "./build-db"
import fs from "fs"
import path from "path"

export async function getSimulatorHeroes() {
    const heroesDir = path.join(process.cwd(), "public", "heroes")
    if (!fs.existsSync(heroesDir)) return []

    const files = await fs.promises.readdir(heroesDir)
    
    // Grade ranking Map
    const gradeOrder = { "l++": 0, "l+": 1, "l": 2, "r": 3 }

    function getGradeFromFilename(filename) {
        if (filename.startsWith("l++_")) return "l++"
        if (filename.startsWith("l+_")) return "l+"
        if (filename.startsWith("l_")) return "l"
        if (filename.startsWith("r_")) return "r"
        return null
    }

    const heroes = files
        .filter(file => /\.(png|jpg|jpeg|webp)$/i.test(file))
        .map(file => {
            const grade = getGradeFromFilename(file)
            if (!grade) return null // Filter out anything not in l++, l+, l, r

            return {
                filename: file,
                slug: file.replace(/\.[^/.]+$/, ""),
                grade: grade,
                name: file.replace(/^(l\+\+|l\+|l|r)_/, "").replace(/\.[^/.]+$/, "").replace(/_/g, " ")
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
    const [weapons, armors, accessories, skills, heroData] = await Promise.all([
        getItemImages("weapon"),
        getItemImages("armor"),
        getItemImages("accessory"),
        heroFilename ? getHeroSkills(heroFilename) : [],
        heroFilename ? getHeroData(heroFilename) : null
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
