"use client"

import { useTierlistEditor } from "./hooks/useTierlistEditor"
import TierlistMatrix from "./TierlistMatrix"
import HeroPool from "./HeroPool"
import AssignmentModal from "./AssignmentModal"
import { clsx } from "clsx"
import styles from "./tierlist.module.css"

const CATEGORIES = ["PVE", "PVP", "Raid", "GVG", "ART", "Tower"]
const RANKS = ["EX", "S", "A", "B", "C"]
const TYPES = ["Attack", "Magic", "Defense", "Support", "Universal"]

/**
 * TierlistManagerView - Orchestrator for the Tierlist Administration
 */
export default function TierlistManagerView({ heroes }) {
    const {
        category,
        setCategory,
        tierData,
        isDragging,
        modal,
        handlers
    } = useTierlistEditor()

    // Filter heroes not assigned in current category
    const poolHeroes = heroes.filter(h => !tierData.some(t => t.heroFilename === h.filename))

    return (
        <div 
            className={styles.container}
            style={{ 
                userSelect: isDragging ? "none" : "auto", 
                cursor: isDragging ? "grabbing" : "auto" 
            }}
        >
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">
                Tier List <span className="text-primary">Management</span>
            </h1>

            {/* Tabs */}
            <div className={styles.tabsContainer}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={clsx(
                            styles.tab,
                            category === cat && styles.tabActive
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Matrix */}
            <TierlistMatrix 
                ranks={RANKS}
                types={TYPES}
                tierData={tierData}
                onDragStart={handlers.startDrag}
                onClick={(e, entry) => handlers.handleAssign({ filename: entry.heroFilename, name: entry.heroFilename })}
                onRemove={(e, entry) => {
                    e.stopPropagation()
                    if (confirm(`Remove ${entry.heroFilename}?`)) handlers.handleRemove(entry.heroFilename)
                }}
            />

            {/* Pool */}
            <HeroPool 
                heroes={poolHeroes}
                onDragStart={handlers.startDrag}
                onClick={(hero) => handlers.handleAssign(hero)}
            />

            {/* Modal */}
            <AssignmentModal 
                hero={modal.selectedHero}
                step={modal.selectionStep}
                tempRank={modal.tempRank}
                ranks={RANKS}
                types={TYPES}
                onSelectRank={modal.setTempRank}
                onSelectType={handlers.handleSave}
                onBack={() => modal.setSelectionStep(1)}
                onClose={() => modal.setSelectedHero(null)}
            />
        </div>
    )
}
