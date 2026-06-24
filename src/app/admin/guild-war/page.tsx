import { getGuildWarTeams, getItemFiles } from "@/lib/guild-war-actions"
import { getAllHeroes, getPets, getFormations, getHeroSkillsMap } from "@/lib/stage-actions"
import { requireAdmin } from "@/lib/auth-guard"
import GuildWarManagerView from "./components/GuildWarManagerView"

export const dynamic = 'force-dynamic'

export const metadata = { 
    title: 'Guild War Management | Admin',
    description: 'Configure tactical team strategies for Guild War.'
}

/**
 * AdminGuildWarPage - Server Component
 * Handles permission validation and initial data fetching for Guild War.
 */
export default async function AdminGuildWarPage() {
    await requireAdmin('MANAGE_GUILD_WAR')

    const [teams, heroes, pets, formations, items, skills] = await Promise.all([
        getGuildWarTeams('all'),
        getAllHeroes(),
        getPets(),
        getFormations(),
        getItemFiles(),
        getHeroSkillsMap()
    ])

    const sortItems = (list) => {
        const gradeOrder = { 'l': 10, 'r': 5, 'un': 3, 'c': 1 }
        return [...list].sort((a, b) => {
            const fA = a.filename || a
            const fB = b.filename || b
            const getGrade = (f) => gradeOrder[f.split('_')[0].toLowerCase()] || 0
            const ga = getGrade(fA), gb = getGrade(fB)
            if (ga !== gb) return gb - ga
            return fA.localeCompare(fB)
        })
    }

    const data = {
        teams,
        heroes,
        pets,
        formations,
        items: {
            weapons: sortItems(items.weapons),
            armors: sortItems(items.armors),
            accessories: sortItems(items.accessories)
        },
        skills
    }

    return (
        <GuildWarManagerView
            initialTeams={data.teams}
            initialHeroes={data.heroes}
            initialPets={data.pets}
            initialFormations={data.formations}
            initialItems={data.items}
            initialSkills={data.skills}
        />
    )
}
