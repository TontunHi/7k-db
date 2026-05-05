"use server"

import { getHeroBuilds, saveHeroBuilds, getItemImages, getHeroSkills, getHeroData, saveHeroData, getFilteredItems } from "@/lib/build-db"
import { logSiteUpdate } from "@/lib/log-actions"
import { requireAdmin } from "./auth-guard"

export async function openEditor(filename) {
    const heroDataRaw = await getHeroData(filename)
    const heroGroup = heroDataRaw?.hero_group || null

    const [builds, weapons, armors, accessories, skills] = await Promise.all([
        getHeroBuilds(filename),
        getFilteredItems('weapon', heroGroup),
        getItemImages('armor'),
        getItemImages('accessory'),
        getHeroSkills(filename)
    ])

    return {
        builds,
        heroData: heroDataRaw || { skillPriority: [], is_new_hero: false }, // Default if no data
        resources: {
            weapons,
            armors,
            accessories: accessories,
            skills
        }
    }
}

export async function saveEditor(filename, builds, skillPriority, heroName, grade, isNewHero) {
    await requireAdmin()
    // Save Hero Data first (Global Skill Priority)
    await saveHeroData({
        filename,
        name: heroName,
        grade: grade,
        is_new_hero: isNewHero,
        skillPriority
    })

    // Log the update
    const displayName = heroName || filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')
    await logSiteUpdate('HERO', displayName, 'UPDATE', `Updated build for ${displayName}`)

    // Save Builds
    return await saveHeroBuilds(filename, builds)
}
