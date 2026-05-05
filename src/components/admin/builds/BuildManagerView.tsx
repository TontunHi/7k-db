"use client"

import { useState, useEffect } from "react"
import { useBuildEditor } from "./hooks/useBuildEditor"
import HeroCard from "./HeroCard"
import BuildEditorModal from "@/components/admin/BuildEditorModal"
import styles from "./builds.module.css"
import { Marker } from "@/app/admin/components/AdminEditorial"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable"
import { reorderHeroes } from "@/lib/build-db"
import { toast } from "sonner"

/**
 * BuildManagerView - Main Dashboard for Builds Management
 */
export default function BuildManagerView({ heroes: initialHeroes = [] }) {
    const [heroes, setHeroes] = useState(initialHeroes)
    const {
        editorOpen,
        setEditorOpen,
        currentHero,
        editorData,
        isLoading,
        handleDelete,
        handleEdit,
        handleSave
    } = useBuildEditor(heroes)

    // Update local state when props change
    useEffect(() => {
        setHeroes(initialHeroes)
    }, [initialHeroes])

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    )

    const handleDragEnd = async (event) => {
        const { active, over } = event
        if (over && active.id !== over.id) {
            const oldIndex = heroes.findIndex(h => h.filename === active.id)
            const newIndex = heroes.findIndex(h => h.filename === over.id)
            
            const newHeroes = arrayMove(heroes, oldIndex, newIndex)
            setHeroes(newHeroes)

            try {
                const orderedSlugs = newHeroes.map(h => h.slug)
                const result = await reorderHeroes(orderedSlugs)
                if (result.success) {
                    toast.success("Hero order synchronized")
                } else {
                    toast.error("Failed to sync order: " + result.error)
                }
            } catch (err) {
                toast.error("Reordering failed")
            }
        }
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.titleWrapper}>
                        <Marker color="bg-primary" className="w-2 h-10" />
                        <h1 className={styles.title}>HERO BUILDS</h1>
                    </div>
                </div>

                <div className={styles.statsBox}>
                    <span className={styles.statsCount}>{heroes.length}</span>
                    <span className={styles.statsLabel}>Heroes</span>
                </div>
            </header>

            {/* Grid */}
            <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
            >
                <div className={styles.grid}>
                    <SortableContext 
                        items={heroes.map(h => h.filename)} 
                        strategy={rectSortingStrategy}
                    >
                        {heroes.map((hero) => (
                            <HeroCard 
                                key={hero.filename} 
                                hero={hero} 
                                onEdit={handleEdit} 
                                onDelete={handleDelete} 
                            />
                        ))}
                    </SortableContext>
                </div>
            </DndContext>

            {/* Loading Overlay */}
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loader} />
                    <p className={styles.loadingText}>Synchronizing Data...</p>
                </div>
            )}

            {/* Editor Modal */}
            {editorOpen && currentHero && editorData && (
                <BuildEditorModal
                    hero={currentHero}
                    skills={editorData.resources.skills}
                    weapons={editorData.resources.weapons}
                    armors={editorData.resources.armors}
                    accessories={editorData.resources.accessories}
                    initialBuilds={editorData.builds}
                    initialSkillPriority={editorData.heroData.skillPriority}
                    initialIsNewHero={editorData.heroData.is_new_hero}
                    onSave={handleSave}
                    onClose={() => setEditorOpen(false)}
                />
            )}
        </div>
    )
}
