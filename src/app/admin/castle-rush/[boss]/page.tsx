"use client"

import { useState, useEffect, use } from 'react'
import { getBossInfo, getSetsByBoss, getBosses } from '@/lib/castle-rush-actions'
import { getAllHeroes, getPets, getFormations, getHeroSkillsMap } from '@/lib/stage-actions'
import { Loader2 } from 'lucide-react'
import CastleRushEditorView from '../components/CastleRushEditorView'

/**
 * BossDetailPage - Data Loading Wrapper
 */
export default function BossDetailPage({ params }: { params: Promise<{ boss: string }> }) {
    const { boss: bossKey } = use(params)

    const [loading, setLoading] = useState(true)
    const [boss, setBoss] = useState(null)
    const [sets, setSets] = useState([])
    const [allBosses, setAllBosses] = useState([])
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
                const [bossInfo, setsData, heroesData, petsData, formationsData, allBossesData, skillsData] = await Promise.all([
                    getBossInfo(bossKey),
                    getSetsByBoss(bossKey),
                    getAllHeroes(),
                    getPets(),
                    getFormations(),
                    getBosses(),
                    getHeroSkillsMap()
                ])
                
                setBoss(bossInfo)
                setSets(setsData)
                setAllBosses(allBossesData)
                setAssets({
                    heroes: heroesData,
                    pets: petsData,
                    formations: formationsData,
                    skills: skillsData
                })
            } catch (err) {
                console.error("[CASTLE_RUSH_LOAD_ERROR]", err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [bossKey])

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-1 bg-amber-500/20 relative overflow-hidden rounded-full">
                    <div className="absolute inset-y-0 left-0 bg-amber-500 animate-[loading_1.5s_infinite]" style={{ width: '40%' }} />
                </div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] animate-pulse">SYNCHRONIZING TACTICAL DATA</p>
            </div>
        )
    }

    if (!boss) {
        return (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-2">
                <h2 className="text-2xl font-black uppercase text-amber-500 italic transform -skew-x-3">Intel Missing</h2>
                <p className="text-muted-foreground font-bold uppercase tracking-wider text-xs opacity-50">Target BOSS data not found in registry.</p>
            </div>
        )
    }

    return (
        <CastleRushEditorView 
            bossKey={bossKey}
            initialBoss={boss}
            initialSets={sets}
            allBosses={allBosses}
            assets={assets}
        />
    )
}
