"use client"

import { X } from "lucide-react"
import SafeImage from "@/components/shared/SafeImage"
import styles from "../dungeon.module.css"

/**
 * SkillPickerModal - Extracted component for selecting skills from team heroes
 */
export default function SkillPickerModal({ 
    setIdx, 
    slotIdx, 
    teamHeroes, 
    allHeroes, 
    skillsMap, 
    skillErrors, 
    onSelect, 
    onClose,
    onSkillError 
}) {
    if (setIdx === undefined || setIdx === null || slotIdx === undefined || slotIdx === null) return null

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHead}>
                    <div>
                        <h3 className="text-xl font-black uppercase">Tactical Skill Intel</h3>
                        <p className="text-xs text-muted-foreground font-bold tracking-wider">SELECT ACTION FOR SLOT {slotIdx + 1}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {teamHeroes.map((heroFile, heroIdx) => {
                        if (!heroFile) return null
                        
                        // Find full hero data for name and icon
                        const heroData = allHeroes?.find(h => 
                            h.filename === heroFile || 
                            h.filename.replace(/\.[^/.]+$/, "") === heroFile
                        )
                        const heroName = heroData?.name || heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^/.]+$/, '').replace(/_/g, ' ')
                        const actualFile = heroData?.filename || heroFile

                        const heroSlug = heroFile.replace(/\.[^/.]+$/, "")
                        const skills = skillsMap?.[heroSlug] || ["4", "3", "2", "1"]

                        return (
                            <div key={heroIdx} className={styles.heroRow}>
                                <div className={styles.heroLabel}>
                                    <div className={styles.heroIcon}>
                                        <SafeImage src={`/heroes/${actualFile}`} alt={heroName} fill className="object-cover" />
                                    </div>
                                    <span className="uppercase italic">{heroName}</span>
                                </div>
                                
                                <div className={styles.skillGrid}>
                                    {skills.map(skillName => {
                                        const skillKey = `${heroIdx}-${skillName}`
                                        const skillPath = `/skills/${heroSlug}/${skillName}.webp`
                                        const errKey = `pick-${heroIdx}-${skillName}`
                                        const hasError = skillErrors[errKey]

                                        return (
                                            <button
                                                key={skillName}
                                                onClick={() => onSelect(setIdx, slotIdx, skillKey)}
                                                className={styles.skillPickBtn}
                                                title={`Select Skill ${skillName}`}
                                            >
                                                {skillPath && !hasError ? (
                                                    <SafeImage
                                                        src={skillPath}
                                                        alt={`Skill ${skillName}`}
                                                        fill
                                                        className="object-cover"
                                                        onError={() => onSkillError(errKey)}
                                                    />
                                                ) : (
                                                    <span className="text-[10px] font-black text-muted-foreground">S{skillName}</span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}

                    {!teamHeroes.some(h => h) && (
                        <div className="text-center py-10">
                            <p className="text-sm italic text-muted-foreground">No squads deployed yet. Assign heroes to the team first.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
