"use client"

import { useState, useEffect, use } from 'react'
import { getRaidInfo, getSetsByRaid, getRaids } from '@/lib/raid-actions'
import { getAllHeroes, getPets, getFormations, getHeroSkillsMap } from '@/lib/stage-actions'
import { Loader2 } from 'lucide-react'
import RaidEditorView from '../components/RaidEditorView'

/**
 * RaidDetailPage - Data Loading Wrapper
 */
export default function RaidDetailPage({ params }: { params: Promise<{ key: string }> }) {
    const { key: raidKey } = use(params)

    const [loading, setLoading] = useState(true)
    const [raid, setRaid] = useState(null)
    const [sets, setSets] = useState([])
    const [allRaids, setAllRaids] = useState([])
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
                const [raidInfo, setsData, heroesData, petsData, formationsData, allRaidsData, skillsData] = await Promise.all([
                    getRaidInfo(raidKey),
                    getSetsByRaid(raidKey),
                    getAllHeroes(),
                    getPets(),
                    getFormations(),
                    getRaids(),
                    getHeroSkillsMap()
                ])
                
                setRaid(raidInfo)
                setSets(setsData)
                setAllRaids(allRaidsData)
                setAssets({
                    heroes: heroesData,
                    pets: petsData,
                    formations: formationsData,
                    skills: skillsData
                })
            } catch (err) {
                console.error("[RAID_EDITOR_LOAD]", err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [raidKey])

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-red-500" />
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest animate-pulse">Syncing Tactical Intel...</p>
            </div>
        )
    }

    if (!raid) {
        return (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-2">
                <h2 className="text-2xl font-black uppercase text-red-500 italic transform -skew-x-3">Sector Compromised</h2>
                <p className="text-muted-foreground font-bold uppercase tracking-wider text-xs opacity-50">Target RAID data not found in registry.</p>
            </div>
        )
    }

    return (
        <RaidEditorView 
            raidKey={raidKey}
            initialRaid={raid}
            initialSets={sets}
            allRaids={allRaids}
            assets={assets}
        />
    )
}
