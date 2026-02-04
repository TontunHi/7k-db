'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { createStage, updateStage, getStageById, getPets, getFormations, getAllHeroes } from '@/lib/stage-actions'
import TeamBuilder from '@/components/admin/TeamBuilder'
import { Save, ArrowLeft, Loader2, LayoutGrid, Skull, Plus } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function StageEditorPage({ params }) {
    const { id } = use(params)
    const router = useRouter()
    const isNew = id === 'new'

    // State
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [assets, setAssets] = useState({ heroes: [], pets: [], formations: [] })

    const [formData, setFormData] = useState({
        type: 'stage',
        name: '',
        note: '',
        teams: [] // [{ index: 1, formation: "1-4", pet_file: "", heroes: [Array(5)] }]
    })

    // Fetch Initial Data
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
                    const data = await getStageById(id)
                    if (data) {
                        setFormData({
                            type: data.type,
                            name: data.name,
                            note: data.note || '',
                            teams: data.teams || []
                        })
                    }
                } else {
                    // Default for new: 1 team
                    setFormData(prev => ({
                        ...prev,
                        teams: [{ index: 1, formation: "1-4", pet_file: null, heroes: Array(5).fill(null) }]
                    }))
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [isNew, id])

    // Logic for Type Change
    const handleTypeChange = (newType) => {
        if (newType === 'stage') {
            // Force 1 team
            setFormData(prev => ({
                ...prev,
                type: 'stage',
                teams: [prev.teams[0]] // Keep only first
            }))
        } else {
            // Nightmare allows 2
            setFormData(prev => ({
                ...prev,
                type: 'nightmare',
                teams: [
                    prev.teams[0],
                    prev.teams[1] || { index: 2, formation: "1-4", pet_file: null, heroes: Array(5).fill(null) }
                ]
            }))
        }
    }

    // Team Logic
    const updateTeam = (index, newTeamData) => {
        const newTeams = [...formData.teams]
        const idx = newTeams.findIndex(t => t.index === index)
        if (idx !== -1) {
            newTeams[idx] = newTeamData
            setFormData({ ...formData, teams: newTeams })
        }
    }

    // No addTeam2 or removeTeam2 needed as it's automatic based on mode

    // Save
    const handleSave = async () => {
        setSaving(true)
        try {
            if (isNew) {
                await createStage(formData)
            } else {
                await updateStage(id, formData)
            }
            router.push('/admin/stages')
        } catch (err) {
            alert('Failed to save: ' + err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="h-[50vh] flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
    )

    return (
        <div className="space-y-8 pb-20 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-4 z-20 bg-background/80 backdrop-blur-md p-4 -mx-4 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center gap-4">
                    <Link href="/admin/stages" className="p-2 hover:bg-muted rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black">{isNew ? 'Create New Setup' : 'Edit Setup'}</h1>
                        <p className="text-xs text-muted-foreground font-mono">
                            {formData.type === 'stage' ? 'Single Team Mode' : 'Nightmare Dual Team Mode'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || !formData.name}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                </button>
            </div>

            {/* Basic Info */}
            <section className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name & Type */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Setup Name</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Stage 10-5 or Nightmare Tier 1"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 font-bold text-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Mode Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleTypeChange('stage')}
                                    className={cn(
                                        "flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all font-bold",
                                        formData.type === 'stage'
                                            ? "border-primary bg-primary/10 text-primary"
                                            : "border-border hover:border-primary/50 text-muted-foreground"
                                    )}
                                >
                                    <LayoutGrid className="w-5 h-5" /> Normal Stage
                                </button>
                                <button
                                    onClick={() => handleTypeChange('nightmare')}
                                    className={cn(
                                        "flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all font-bold",
                                        formData.type === 'nightmare'
                                            ? "border-destructive bg-destructive/10 text-destructive"
                                            : "border-border hover:border-destructive/50 text-muted-foreground"
                                    )}
                                >
                                    <Skull className="w-5 h-5" /> Nightmare
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Note (Optional)</label>
                        <textarea
                            value={formData.note}
                            onChange={e => setFormData({ ...formData, note: e.target.value })}
                            placeholder="Add strategy notes or requirements..."
                            className="w-full h-full min-h-[150px] bg-background border border-border rounded-xl px-4 py-3 resize-none focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                    </div>
                </div>
            </section>

            {/* Team Builders */}
            <div className="space-y-8">
                {/* Tabs for Teams (if Nightmare) */}
                {formData.type === 'nightmare' && (
                    <div className="flex gap-4 border-b border-border pb-2">
                        {formData.teams.map(t => (
                            <button
                                key={t.index}
                                className="px-6 py-2 rounded-t-xl font-bold bg-card border-x border-t border-border text-foreground hover:bg-accent/10"
                            >
                                Team {t.index}
                            </button>
                        ))}
                    </div>
                )}

                {/* Render Team Builders */}
                {formData.teams.map((team) => (
                    <TeamBuilder
                        key={team.index}
                        team={team}
                        index={team.index}
                        heroesList={assets.heroes}
                        petsList={assets.pets}
                        formations={assets.formations}
                        onUpdate={(updated) => updateTeam(team.index, updated)}
                    // removed onRemove
                    />
                ))}
            </div>
        </div>
    )
}
