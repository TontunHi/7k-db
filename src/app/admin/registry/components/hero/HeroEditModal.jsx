"use client"

import { X, Save, Loader2 } from "lucide-react"
import SafeImage from "@/components/shared/SafeImage"
import styles from "./HeroRegistry.module.css"

const TYPES = ["Attack", "Magic", "Defense", "Support", "Universal"]
const GROUPS = ["Physical", "Magic"]

const STAT_FIELDS = [
    { key: "atk_phys", label: "Phys Atk", type: "number" },
    { key: "atk_mag", label: "Mag Atk", type: "number" },
    { key: "def", label: "Defense", type: "number" },
    { key: "hp", label: "HP", type: "number" },
    { key: "speed", label: "Speed", type: "number" },
    { key: "crit_rate", label: "Crit %", type: "float" },
    { key: "crit_dmg", label: "Crit Dmg %", type: "float" },
    { key: "weak_hit", label: "Weakness %", type: "float" },
    { key: "block_rate", label: "Block %", type: "float" },
    { key: "dmg_red", label: "Dmg Red %", type: "float" },
    { key: "eff_hit", label: "Eff Hit %", type: "float" },
    { key: "eff_res", label: "Eff Res %", type: "float" }
]

export default function HeroEditModal({ hero, formData, isSaving, onUpdateField, onSave, onClose }) {
    if (!hero) return null

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <header className={styles.modalHeader}>
                    <div className={styles.modalTitleGroup}>
                        <div className={styles.modalImageWrapper}>
                            <SafeImage 
                                src={`/heroes/${hero.filename}.webp`} 
                                fill 
                                className="object-cover" 
                            />
                        </div>
                        <div>
                            <h3 className={styles.modalHeroTitle}>{hero.name}</h3>
                            <p className={styles.modalHeroGrade}>{hero.grade}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className={styles.closeButton}>
                        <X size={20} />
                    </button>
                </header>

                <div className={styles.modalBody}>
                    {/* Classification */}
                    <div className={styles.sectionGroup}>
                        <h4 className={styles.sectionTitle}>
                            <div className={styles.sectionIndicator} />
                            Classification
                        </h4>
                        <div className={styles.formGrid}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Hero Group</label>
                                <select 
                                    value={formData.hero_group}
                                    onChange={(e) => onUpdateField("hero_group", e.target.value)}
                                    className={styles.select}
                                >
                                    {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Role Type</label>
                                <select 
                                    value={formData.type}
                                    onChange={(e) => onUpdateField("type", e.target.value)}
                                    className={styles.select}
                                >
                                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className={styles.sectionGroup}>
                        <h4 className={styles.sectionTitle}>
                            <div className={styles.sectionIndicator} />
                            Base Stats (Lv 30 +5)
                        </h4>
                        <div className={styles.formGrid}>
                            {STAT_FIELDS.map((stat) => (
                                <div key={stat.key} className={styles.fieldGroup}>
                                    <label className={styles.label}>{stat.label}</label>
                                    <input 
                                        type="number"
                                        step={stat.type === "float" ? "0.01" : "1"}
                                        value={formData[stat.key]}
                                        onChange={(e) => onUpdateField(stat.key, parseFloat(e.target.value) || 0)}
                                        className={styles.input}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <footer className={styles.modalFooter}>
                    <button 
                        onClick={onSave}
                        disabled={isSaving}
                        className={styles.saveButton}
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Update Registry
                    </button>
                </footer>
            </div>
        </div>
    )
}
