"use client"

import { X, ArrowLeft } from "lucide-react"
import SafeImage from "@/components/shared/SafeImage"
import styles from "./tierlist.module.css"

/**
 * AssignmentModal - Step-by-step selection for Rank and Type
 */
export default function AssignmentModal({ 
    hero, 
    step, 
    tempRank, 
    ranks, 
    types, 
    onSelectRank, 
    onSelectType, 
    onBack, 
    onClose 
}) {
    if (!hero) return null

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h3 className={styles.modalTitle}>
                        Assign <span className={styles.modalHeroName}>{hero.name}</span>
                    </h3>
                    <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal">
                        <X size={20} />
                    </button>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <p className={styles.stepTitle}>Select Rank Tier</p>
                        <div className={styles.optionGrid}>
                            {ranks.map(r => (
                                <button
                                    key={r}
                                    onClick={() => onSelectRank(r)}
                                    className={styles.optionBtn}
                                >
                                    <div className="relative h-12 w-12">
                                        <SafeImage src={`/logo_tiers/rank_tier/${r}.webp`} fill className="object-contain" alt={r} sizes="48px" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <button onClick={onBack} className={styles.backBtn}>
                            <ArrowLeft size={14} /> Back to Rank
                        </button>
                        
                        <div className="flex items-center gap-3 mb-6 p-3 bg-accent rounded-xl border border-border">
                            <span className="text-xs font-bold text-muted-foreground uppercase">Target Rank:</span>
                            <div className="relative w-8 h-8">
                                <SafeImage src={`/logo_tiers/rank_tier/${tempRank}.webp`} fill className="object-contain" alt={tempRank} sizes="32px" />
                            </div>
                        </div>

                        <p className={styles.stepTitle}>Select Hero Type</p>
                        <div className={styles.optionGrid}>
                            {types.map(t => (
                                <button
                                    key={t}
                                    onClick={() => onSelectType(t)}
                                    className={styles.optionBtn}
                                >
                                    <div className="relative h-10 w-24">
                                        <SafeImage src={`/logo_tiers/type/${t.toLowerCase()}.webp`} fill className="object-contain" alt={t} sizes="96px" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
