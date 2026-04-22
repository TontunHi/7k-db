"use client"

import { useState, useEffect, use } from 'react'
import { getDungeonInfo, getSetsByDungeon } from '@/lib/dungeon-actions'
import { getAllHeroes, getPets, getFormations, getHeroSkillsMap } from '@/lib/stage-actions'
import { Loader2 } from 'lucide-react'
import DungeonEditorView from '../components/DungeonEditorView'

/**
 * DungeonDetailPage - Data Loading Wrapper
 */
export default function DungeonDetailPage({ params }) {
    const { key: dungeonKey } = use(params)

    const [loading, setLoading] = useState(true)
    const [dungeon, setDungeon] = useState(null)
    const [sets, setSets] = useState([])
    const [assets, setAssets] = useState({
        heroes: [],
        pets: [],
        formations: [],
        skills: {}
    })

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            try {
                const [dungeonInfo, setsData, heroesData, petsData, formationsData, skillsData] = await Promise.all([
                    getDungeonInfo(dungeonKey),
                    getSetsByDungeon(dungeonKey),
                    getAllHeroes(),
                    getPets(),
                    getFormations(),
                    getHeroSkillsMap()
                ])
                
                setDungeon(dungeonInfo)
                setSets(setsData)
                setAssets({
                    heroes: heroesData,
                    pets: petsData,
                    formations: formationsData,
                    skills: skillsData
                })
            } catch (err) {
                console.error("[DUNGEON_EDITOR_LOAD]", err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [dungeonKey])

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest animate-pulse">Accessing Sector Data...</p>
            </div>
        )
    }

    if (!dungeon) {
        return (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-2">
                <h2 className="text-2xl font-black uppercase text-red-500">Sector Missing</h2>
                <p className="text-muted-foreground">The requested dungeon tactical data could not be found.</p>
            </div>
        )
    }

    return (
        <DungeonEditorView 
            dungeonKey={dungeonKey}
            initialDungeon={dungeon}
            initialSets={sets}
            assets={assets}
        />
    )
}
