"use server"

import { getHeroBuilds, saveHeroBuilds, getItemImages, getHeroSkills, getHeroData, saveHeroData } from "@/lib/build-db"

export async function openEditor(filename) {
    const [builds, heroDataRaw] = await Promise.all([
        getHeroBuilds(filename),
        getHeroData(filename)
    ])

    // Fetch all resources needed for the editor
    const [weapons, armors, accessories, skills] = await Promise.all([
        getItemImages('weapon'),
        getItemImages('armor'),
        getItemImages('accessories'),
        getHeroSkills(filename)
    ])

    return {
        builds,
        heroData: heroDataRaw || { skillPriority: [] }, // Default if no data
        resources: {
            weapons,
            armors,
            accessories,
            skills
        }
    }
}

export async function saveEditor(filename, builds, skillPriority, heroName, grade) {
    // Save Hero Data first (Global Skill Priority)
    await saveHeroData({
        filename,
        name: heroName,
        grade: grade,
        skillPriority
    })

    // Save Builds
    return await saveHeroBuilds(filename, builds)
}
