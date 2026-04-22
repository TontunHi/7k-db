'use client'
import { Zap, Sparkles } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import styles from './StatsAnalysis.module.css'

export default function StatsAnalysis({ visibleStatFields, heroStats, onStatChange, finalStats, formatValue }) {
    return (
        <div className={styles.container}>
            {/* Base Stats Card */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h3 className={styles.headerTitle}>
                        <Zap className={styles.headerIcon} />
                        Base Registry Stats
                    </h3>
                </div>
                <div className={styles.grid}>
                    {visibleStatFields.map(field => (
                        <div key={field.key} className={styles.statRow}>
                            <div className={styles.statLabelGroup}>
                                <div className={styles.statIconBox}>
                                    <SafeImage src={field.icon} fill className="object-contain" alt="" />
                                </div>
                                <label className={styles.statLabel}>
                                    {field.label.replace(' %', '')}
                                </label>
                            </div>
                            <input 
                                type="number"
                                value={heroStats[field.key] || ""}
                                onChange={(e) => onStatChange(field.key, e.target.value)}
                                placeholder="—"
                                className={styles.statInput}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Analysis Card */}
            <div className={`${styles.card} ${styles.cardAnalysis}`}>
                <div className={styles.cardHeader}>
                    <div className={styles.headerTitleGroup}>
                        <h3 className={styles.analysisTitle}>
                            Final Stats <span className={styles.analysisTitleAccent}>Analysis</span>
                        </h3>
                        <p className={styles.analysisSubtitle}>Total values after all modifiers applied</p>
                    </div>
                    <Zap className={styles.analysisIcon} />
                </div>

                <div className={styles.grid}>
                    {visibleStatFields.map(field => {
                        const isSetBonusActive = finalStats.activeSets.some(set => 
                            Object.keys(set.bonus).some(sk => 
                                sk === field.key || 
                                (sk === 'atk_all_perc' && (field.key === 'atk_phys' || field.key === 'atk_mag')) ||
                                (sk === 'def_perc' && field.key === 'def') ||
                                (sk === 'hp_perc' && field.key === 'hp')
                            )
                        )

                        return (
                            <div key={field.key} className={styles.statRow}>
                                <div className={styles.statLabelGroup}>
                                    <div className={styles.statIconBox}>
                                        <SafeImage src={field.icon} fill className="object-contain" alt="" />
                                    </div>
                                    <span className={styles.statLabel}>{field.label.replace(' %', '')}</span>
                                </div>
                                <div className={styles.finalValue}>
                                    {formatValue(finalStats.stats[field.key])}
                                    {field.unit && <span className={styles.unit}>{field.unit}</span>}
                                    {isSetBonusActive && (
                                        <div className={styles.bonusIndicator} title="Set Bonus Active" />
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Set Bonuses Card */}
            {finalStats.activeSets.length > 0 && (
                <div className={`${styles.card} ${styles.cardBonus}`}>
                    <h3 className={styles.headerTitle}>
                        <Sparkles className={styles.headerIcon} />
                        Active Set Bonuses
                    </h3>
                    <div className={styles.bonusList}>
                        {finalStats.activeSets.map(set => (
                            <div key={set.name} className={styles.bonusItem}>
                                <div className={styles.bonusItemOverlay} />
                                <div className={styles.bonusItemHeader}>
                                    <span className={styles.bonusName}>{set.name} Set</span>
                                    <span className={styles.bonusPieceBadge}>
                                        {set.pieces} Pieces
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
