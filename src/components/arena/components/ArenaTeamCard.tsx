import { Video, ExternalLink } from 'lucide-react'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'
import SafeImage from '@/components/shared/SafeImage'
import styles from './ArenaTeamCard.module.css'

export default function ArenaTeamCard({ set, index, heroImageMap }) {
    return (
        <div className={styles.card}>
            <div className={styles.scanline} />
            <div className={styles.sweep} />
            <div className={styles.cardGlow} />
            
            {/* Team Header */}
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <div className={styles.titleGroup}>

                        <h3 className={styles.teamName}>
                            {set.team_name || `Arena Team ${index + 1}`}
                        </h3>
                    </div>
                </div>
            
                {set.video_url && (
                    <a 
                        href={set.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.videoLink}
                    >
                        <Video className={styles.videoIcon} />
                        Video Guide
                        <ExternalLink className={styles.externalIcon} />
                    </a>
                )}
            </div>

            <div className={styles.body}>
                {/* Core Setup: Formation + Pet */}
                <div className={styles.coreRow}>
                    <div className={styles.formationArea}>
                        <FormationGrid 
                            formation={set.formation} 
                            heroes={set.heroes} 
                            heroImageMap={heroImageMap} 
                            customClasses={{
                                container: "grid grid-cols-5 gap-3 pb-2 w-full max-w-[450px]",
                                cardString: "bg-slate-900/40 border-slate-700/50 aspect-[3/4] rounded-xl shadow-2xl"
                            }}
                        />
                    </div>

                    <div className="flex flex-col items-center gap-3 shrink-0">
                        <div className={styles.petBox}>
                            <PetDisplay petFile={set.pet_file} hideLabel={true} />
                        </div>

                        {set.pet_supports && set.pet_supports.some(p => p !== null) && (
                            <div className="flex gap-1.5 justify-center">
                                {set.pet_supports.map((pet, pIdx) => pet && (
                                    <div key={pIdx} className="relative w-8 h-8 rounded-lg border border-border bg-slate-900/40 overflow-hidden flex items-center justify-center group/support-pet hover:border-blue-500/50 transition-colors shadow-md">
                                        <SafeImage 
                                            src={pet} 
                                            alt="" 
                                            fill 
                                            sizes="32px"
                                            className="object-contain p-1 group-hover/support-pet:scale-110 transition-transform duration-300" 
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Skill Rotation */}
                <SkillSequence 
                    skillRotation={set.skill_rotation} 
                    heroes={set.heroes} 
                    heroImageMap={heroImageMap} 
                    hideHeaderIcon={true}
                />

                {/* Strategy Note */}
                {set.note && set.note.trim() !== "" && (
                    <div className={styles.noteSection}>
                        <div className={styles.noteBar} />
                        <p className={styles.noteText}>
                            &quot;{set.note}&quot;
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
