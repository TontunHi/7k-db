"use client"

import { useState, useEffect, use } from 'react'
import { getSetsByTier } from '@/lib/total-war-actions'
import { getAllHeroes, getPets, getFormations, getHeroSkillsMap } from '@/lib/stage-actions'
import { Loader2 } from 'lucide-react'
import TotalWarEditorView from '../components/TotalWarEditorView'

/**
 * AdminTotalWarTierPage - Data Loading Wrapper
 */
export default function AdminTotalWarTierPage({ params }: { params: Promise<{ tier: string }> }) {
    const { tier: tierKey } = use(params)

    const [loading, setLoading] = useState(true)
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
                const [setsData, heroesData, petsData, formsData, skillsData] = await Promise.all([
                    getSetsByTier(tierKey),
                    getAllHeroes(),
                    getPets(),
                    getFormations(),
                    getHeroSkillsMap()
                ])
                
                setSets(setsData)
                setAssets({
                    heroes: heroesData,
                    pets: petsData,
                    formations: formsData,
                    skills: skillsData
                })
            } catch (err) {
                console.error("[TOTAL_WAR_LOAD_ERROR]", err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [tierKey])

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-red-500" />
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest animate-pulse">Synchronizing Tactical Matrix...</p>
            </div>
        )
    }

    return (
        <TotalWarEditorView 
            tierKey={tierKey}
            initialSets={sets}
            assets={assets}
        />
    )
}
