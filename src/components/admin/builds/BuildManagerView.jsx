"use client"

import { useBuildEditor } from "./hooks/useBuildEditor"
import HeroCard from "./HeroCard"
import BuildEditorModal from "@/components/admin/BuildEditorModal"
import styles from "./builds.module.css"
import { Marker } from "@/app/admin/components/AdminEditorial"

/**
 * BuildManagerView - Main Dashboard for Builds Management
 */
export default function BuildManagerView({ heroes = [] }) {
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
            <div className={styles.grid}>
                {heroes.map((hero) => (
                    <HeroCard 
                        key={hero.filename} 
                        hero={hero} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
                    />
                ))}
            </div>

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
