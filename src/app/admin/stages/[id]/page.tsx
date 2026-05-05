"use client"

import { useState, useEffect, use } from 'react'
import { getStageById, getPets, getFormations, getAllHeroes } from '@/lib/stage-actions'
import { Loader2 } from 'lucide-react'
import StageEditorView from '../components/StageEditorView'

/**
 * StageEditorPage - Data Loading Wrapper
 */
export default function StageEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const isNew = id === 'new'

    const [loading, setLoading] = useState(true)
    const [assets, setAssets] = useState({ heroes: [], pets: [], formations: [] })
    const [initialData, setInitialData] = useState({
        type: 'stage',
        name: '',
        note: '',
        teams: []
    })

    useEffect(() => {
        async function load() {
            try {
                const [heroes, pets, formations] = await Promise.all([
                    getAllHeroes(),
                    getPets(),
                    getFormations()
                ])

                setAssets({ heroes, pets, formations })

                if (!isNew) {
                    const data = await getStageById(Number(id))
                    if (data) {
                        setInitialData({
                            type: data.type,
                            name: data.name,
                            note: data.note || '',
                            teams: data.teams || []
                        })
                    }
                } else {
                    // Default for new setup: 1 team
                    setInitialData(prev => ({
                        ...prev,
                        teams: [{ index: 1, formation: "1-4", pet_file: null, heroes: Array(5).fill(null) }]
                    }))
                }
            } catch (err) {
                console.error("[STAGE_EDITOR_LOAD]", err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [isNew, id])

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest animate-pulse">Syncing Intel...</p>
        </div>
    )

    return (
        <StageEditorView 
            id={id}
            isNew={isNew}
            initialData={initialData}
            assets={assets}
        />
    )
}
