"use client"

import { useState, useEffect } from "react"
import { getGuildWarTeams, getItemFiles } from "@/lib/guild-war-actions"
import { getAllHeroes, getPets, getFormations, getHeroSkillsMap } from "@/lib/stage-actions"
import GuildWarManagerView from "./components/GuildWarManagerView"

/**
 * AdminGuildWarPage - Entrance to Guild War tactical management
 */
export default function AdminGuildWarPage() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStrategicData() {
            try {
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

                setData({
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
                })
            } catch (err) {
                console.error("Critical error loading Guild War intelligence:", err)
            } finally {
                setLoading(false)
            }
        }

        loadStrategicData()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="text-[3rem] font-black italic opacity-10 animate-pulse tracking-tighter">DATA_FETCH</div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Initializing Strategic Command...</p>
            </div>
        )
    }

    if (!data) return null

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
