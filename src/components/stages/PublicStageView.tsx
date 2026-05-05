"use client"

import { clsx } from "clsx"
import { useStages } from "./hooks/useStages"
import StageHeader from "./components/StageHeader"
import StageFilters from "./components/StageFilters"
import StageCard from "./components/StageCard"
import styles from './PublicStageView.module.css'

const MODES = [
    { id: "stage", label: "Main Stage" },
    { id: "nightmare", label: "Nightmare Stage" }
]

export default function PublicStageView({ initialStages, initialNightmares, heroImageMap }) {
    const {
        mode, setMode,
        searchQuery, setSearchQuery,
        filteredStages
    } = useStages(initialStages, initialNightmares)

    const modeLabel = MODES.find(m => m.id === mode)?.label

    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.gridPattern} />
                <div className={styles.topGlow} />
                <div className={clsx(
                    styles.bottomGlow,
                    mode === "stage" ? styles.glowStage : styles.glowNightmare
                )} />
            </div>

            <div className={styles.content}>
                {/* Header */}
                <StageHeader mode={mode} modeLabel={modeLabel} />

                {/* Filters */}
                <StageFilters 
                    mode={mode} 
                    setMode={setMode} 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                />

                {/* Content Grid */}
                <div className={styles.stageGrid}>
                    {filteredStages.map(stage => (
                        <StageCard 
                            key={stage.id} 
                            stage={stage} 
                            isNightmare={mode === "nightmare"} 
                            heroImageMap={heroImageMap} 
                        />
                    ))}
                    {filteredStages.length === 0 && (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyText}>
                                {searchQuery ? "No stages found matching filter" : "No guides available yet"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Note */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Seven Knights 2 Rebirth Database • Community Driven Project
                    </p>
                </div>
            </div>
        </div>
    )
}

