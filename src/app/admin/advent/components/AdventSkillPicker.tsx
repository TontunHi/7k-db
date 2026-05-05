"use client"

import { X } from "lucide-react"
import SafeImage from "@/components/shared/SafeImage"
import { clsx } from "clsx"
import styles from "../advent.module.css"

/**
 * AdventSkillPicker - Modal for selecting hero skills in rotation
 */
export default function AdventSkillPicker({ 
    setIdx, 
    slotIdx, 
    teamHeroes, 
    skillsMap, 
    skillErrors, 
    onSelect, 
    onClose,
    onSkillError 
}) {
    // In Advent, setIdx is actually the index of the set in the sets array
    if (setIdx === undefined || setIdx === null || slotIdx === undefined || slotIdx === null) return null

    function getSkillImagePath(heroFilename, skillNumber) {
        if (!heroFilename) return null
        const folderName = heroFilename.replace(/\.[^/.]+$/, '')
        return `/skills/${folderName}/${skillNumber}.webp`
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <header className={styles.modalHeader}>
                    <div>
                        <h3 className="text-xl font-black text-white">Select Tactical Action</h3>
                        <p className="text-xs text-muted-foreground font-bold tracking-wider">CHOOSE SKILL FOR SLOT {slotIdx + 1}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors">
                        <X size={24} />
                    </button>
                </header>

                <div className={styles.modalBody}>
                    {teamHeroes.map((heroFile, heroIdx) => {
                        if (!heroFile) return null
                        
                        const heroSlug = heroFile.replace(/\.[^/.]+$/, "")
                        const heroName = heroSlug.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/_/g, ' ')
                        const skills = skillsMap?.[heroSlug] || ["4", "3", "2", "1"]

                        return (
                            <div key={heroIdx} className={styles.heroRow}>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-8 h-8 rounded-md overflow-hidden border border-border">
                                        <SafeImage src={`/heroes/${heroFile}`} alt="" fill className="object-cover" />
                                    </div>
                                    <span className="text-xs font-black uppercase text-foreground">{heroName}</span>
                                </div>
                                
                                <div className={styles.heroSkills}>
                                    {skills.map(skillName => {
                                        const skillKey = `${heroIdx}-${skillName}`
                                        const skillPath = getSkillImagePath(heroFile, skillName)
                                        const errKey = `pick-${heroIdx}-${skillName}`

                                        return (
                                            <button
                                                key={skillName}
                                                onClick={() => onSelect(setIdx, slotIdx, skillKey)}
                                                className={clsx(styles.skillPickBtn, "relative")}
                                            >
                                                {skillPath && !skillErrors[errKey] && (
                                                    <SafeImage
                                                        src={skillPath}
                                                        alt=""
                                                        fill
                                                        sizes="100px"
                                                        className="object-cover"
                                                        onError={() => onSkillError(errKey)}
                                                    />
                                                )}
                                                {!skillPath && <span className="text-[10px] font-bold">S{skillName}</span>}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}

                    {!teamHeroes.some(h => h) && (
                        <div className="text-center py-10">
                            <p className="text-sm italic text-muted-foreground">No heroes assigned to this squad yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
