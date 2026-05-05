"use client"

import { useState, useEffect, use } from 'react'
import { getBossInfo, getSetsByBoss, getBosses } from '@/lib/advent-actions'
import { getAllHeroes, getPets, getFormations, getHeroSkillsMap } from '@/lib/stage-actions'
import { getFilteredItems } from '@/lib/build-db'
import { Loader2 } from 'lucide-react'
import AdventEditorView from '../components/AdventEditorView'

/**
 * AdventBossDetailPage - Data Loading Wrapper
 */
export default function AdventBossDetailPage({ params }: { params: Promise<{ boss: string }> }) {
    const { boss: bossKey } = use(params)

    const [loading, setLoading] = useState(true)
    const [boss, setBoss] = useState(null)
    const [sets, setSets] = useState([])
    const [allBosses, setAllBosses] = useState([])
    const [assets, setAssets] = useState({
        heroes: [],
        pets: [],
        formations: [],
        skills: {},
        items: { weapons: [], armors: [], accessories: [] }
    })

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            try {
                const [bossInfo, setsData, heroesData, petsData, formationsData, allBossesData, skillsData, weapons, armors, accessories] = await Promise.all([
                    getBossInfo(bossKey),
                    getSetsByBoss(bossKey),
                    getAllHeroes(),
                    getPets(),
                    getFormations(),
                    getBosses(),
                    getHeroSkillsMap(),
                    getFilteredItems('weapon'),
                    getFilteredItems('armor'),
                    getFilteredItems('accessory')
                ])
                
                setBoss(bossInfo)
                setSets(setsData)
                setAllBosses(allBossesData)
                setAssets({
                    heroes: heroesData,
                    pets: petsData,
                    formations: formationsData,
                    skills: skillsData,
                    items: { weapons, armors, accessories }
                })
            } catch (err) {
                console.error("[ADVENT_LOAD_ERROR]", err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [bossKey])

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest animate-pulse">Initializing Tactical Matrix...</p>
            </div>
        )
    }

    if (!boss) {
        return (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-2">
                <h2 className="text-2xl font-black uppercase text-violet-500 italic transform -skew-x-3">Intel Missing</h2>
                <p className="text-muted-foreground font-bold uppercase tracking-wider text-xs opacity-50">Target BOSS data not found in expedition registry.</p>
            </div>
        )
    }

    return (
        <AdventEditorView 
            bossKey={bossKey}
            initialBoss={boss}
            initialSets={sets}
            allBosses={allBosses}
            assets={assets}
        />
    )
}
