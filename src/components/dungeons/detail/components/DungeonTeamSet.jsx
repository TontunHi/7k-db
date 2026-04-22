import { clsx } from 'clsx'
import { Video, ExternalLink } from 'lucide-react'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'
import styles from './DungeonTeamSet.module.css'

export default function DungeonTeamSet({ set, index, heroImageMap }) {
    return (
        <div className={styles.set}>
            {/* Team Header */}
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <div className={styles.number}>{index + 1}</div>
                    <div>
                        <h3 className={styles.teamTitle}>Team {index + 1}</h3>
                        <p className={styles.formationText}>
                            Formation: {set.formation?.replace('-', ' - ')}
                        </p>
                    </div>
                </div>
                
                {set.video_url && (
                    <a 
                        href={set.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.videoLink}
                    >
                        <Video className="w-4 h-4" />
                        Watch Video
                        <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>

            <div className={styles.body}>
                <div className={styles.layout}>
                    {/* Heroes Grid */}
                    <div className={styles.heroesArea}>
                        <FormationGrid 
                            formation={set.formation} 
                            heroes={set.heroes} 
                            heroImageMap={heroImageMap}
                            customClasses={{
                                container: "grid grid-cols-5 gap-3 pb-6 max-w-full",
                                emptyRender: () => (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs text-center p-1">Empty</div>
                                ),
                                cardString: "bg-black border-2 border-gray-800 aspect-[3/4] rounded-lg overflow-hidden transition-all duration-300"
                            }}
                        />

                        {/* Skill Rotation */}
                        {set.skill_rotation?.length > 0 && (
                            <div className={styles.skillSection}>
                                <SkillSequence 
                                    skillRotation={set.skill_rotation} 
                                    heroes={set.heroes} 
                                    heroImageMap={heroImageMap}
                                    accentColor="var(--primary)"
                                />
                            </div>
                        )}
                    </div>

                    {/* Pet & Aura */}
                    <div className={styles.petArea}>
                        <div className={styles.petWrapper}>
                            {/* Aura Glow Effect */}
                            {set.aura && (
                                <div className={clsx(
                                    styles.auraGlow,
                                    set.aura === 'blue' ? styles.auraBlue : styles.auraRed
                                )} />
                            )}

                            <PetDisplay 
                                petFile={set.pet_file} 
                                hideLabel={true}
                                customClasses={{
                                    wrapper: clsx(
                                        "w-24 h-24 border-2 bg-gray-900/50 shadow-xl hover:scale-105 transition-transform relative z-10",
                                        set.aura === 'blue' ? "border-blue-500 shadow-blue-500/10" : 
                                        set.aura === 'red' ? "border-red-500 shadow-red-500/10" : 
                                        "border-[#FFD700]/20 shadow-[#FFD700]/5"
                                    )
                                }}
                            />

                            {/* Aura Badge */}
                            {set.aura && (
                                <div className={clsx(
                                    styles.auraBadge,
                                    set.aura === 'blue' ? styles.auraBadgeBlue : styles.auraBadgeRed
                                )}>
                                    <div className={styles.auraBadgeDot} />
                                    <span className={styles.auraBadgeText}>{set.aura} Aura</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Mobile Video Button */}
                {set.video_url && (
                    <a 
                        href={set.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.mobileVideoLink}
                    >
                        <Video className="w-4 h-4" />
                        Watch Video Guide
                    </a>
                )}

                {/* Note */}
                {set.note && set.note.trim() !== "" && (
                    <div className={styles.note}>
                        <p className={styles.noteText}>&quot;{set.note}&quot;</p>
                    </div>
                )}
            </div>
        </div>
    )
}
