"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createStage, updateStage } from '@/lib/stage-actions'
import TeamBuilder from '@/components/admin/TeamBuilder'
import { Save, ArrowLeft, Loader2, LayoutGrid, Skull } from 'lucide-react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { toast } from 'sonner'
import styles from '../stages.module.css'

/**
 * StageEditorView - UI for creating/editing stage guides
 */
export default function StageEditorView({ id, isNew, initialData, assets }) {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState(initialData)

    // Logic for Type Change
    const handleTypeChange = (newType) => {
        if (newType === 'stage') {
            setFormData(prev => ({
                ...prev,
                type: 'stage',
                teams: [prev.teams[0]] // Force single team
            }))
        } else {
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

    const updateTeam = (index, newTeamData) => {
        const newTeams = [...formData.teams]
        const idx = newTeams.findIndex(t => t.index === index)
        if (idx !== -1) {
            newTeams[idx] = newTeamData
            setFormData({ ...formData, teams: newTeams })
        }
    }

    const handleSave = async () => {
        if (!formData.name) {
            toast.error("Please provide a name for this setup")
            return
        }
        
        setSaving(true)
        try {
            const result = isNew 
                ? await createStage(formData) 
                : await updateStage(id, formData)

            if (result.success) {
                toast.success(isNew ? "Setup created successfully" : "Setup updated")
                router.push('/admin/stages')
                router.refresh()
            } else {
                toast.error(result.error || "Failed to save setup")
            }
        } catch (err) {
            toast.error("A system error occurred during saving")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className={styles.container}>
            {/* Sticky Header */}
            <header className={styles.editorHeader}>
                <div className="flex items-center gap-4">
                    <Link href="/admin/stages" className="p-2 hover:bg-accent rounded-full transition-colors text-muted-foreground">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-black italic uppercase">{isNew ? 'New Command' : 'Edit Command'}</h1>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                            {formData.type === 'stage' ? 'Single Objective' : 'Dual Tactical Operation'}
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={handleSave}
                    disabled={saving || !formData.name}
                    className={styles.saveBtn}
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>{isNew ? 'Deploy' : 'Update'}</span>
                </button>
            </header>

            {/* Basic Info */}
            <section className={styles.formSection}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Strategic Name</label>
                            <input
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Stage 12-10 Hard"
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Operation Mode</label>
                            <div className={styles.typeToggleGrid}>
                                <button
                                    onClick={() => handleTypeChange('stage')}
                                    className={clsx(
                                        styles.typeToggleBtn,
                                        formData.type === 'stage' && styles.toggleActiveNormal
                                    )}
                                >
                                    <LayoutGrid size={18} /> Normal
                                </button>
                                <button
                                    onClick={() => handleTypeChange('nightmare')}
                                    className={clsx(
                                        styles.typeToggleBtn,
                                        formData.type === 'nightmare' && styles.toggleActiveNightmare
                                    )}
                                >
                                    <Skull size={18} /> Nightmare
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Intelligence / Strategy Notes</label>
                        <textarea
                            value={formData.note}
                            onChange={e => setFormData({ ...formData, note: e.target.value })}
                            placeholder="Detail the hero requirements or boss mechanics..."
                            className={clsx(styles.input, "h-full min-h-[120px] resize-none")}
                        />
                    </div>
                </div>
            </section>

            {/* Team Management */}
            <div className="space-y-6">
                {formData.type === 'nightmare' && (
                    <div className={styles.teamTabs}>
                        {formData.teams.map(t => (
                            <div key={t.index} className={clsx(styles.teamTab, styles.teamTabActive)}>
                                Squad {t.index}
                            </div>
                        ))}
                    </div>
                )}

                <div className="space-y-12">
                    {formData.teams.map((team) => (
                        <TeamBuilder
                            key={team.index}
                            team={team}
                            index={team.index}
                            heroesList={assets.heroes}
                            petsList={assets.pets}
                            formations={assets.formations}
                            onUpdate={(updated) => updateTeam(team.index, updated)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
