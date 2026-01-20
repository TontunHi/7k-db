"use server"

import { getHeroBuilds, getHeroData, getHeroSkills } from "@/lib/build-db"

export async function fetchHeroBuildData(filename) {
    const [builds, heroDataRaw, skills] = await Promise.all([
        getHeroBuilds(filename),
        getHeroData(filename),
        getHeroSkills(filename)
    ])

    return {
        builds,
        heroData: heroDataRaw || { skillPriority: [] },
        skills
    }
}
