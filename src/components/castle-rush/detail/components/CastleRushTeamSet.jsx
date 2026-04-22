import { Video, ExternalLink, ScrollText } from 'lucide-react'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'
import styles from './CastleRushTeamSet.module.css'

export default function CastleRushTeamSet({ set, index, heroImageMap }) {
    return (
        <div className={styles.set}>
            {/* Team Header */}
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <div className={styles.number}>{index + 1}</div>
                    <div>
                        <h3 className={styles.teamTitle}>
                            {set.team_name || `Team ${index + 1}`}
                        </h3>
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
                                container: "grid grid-cols-5 gap-2 md:gap-3 pb-6 max-w-full",
                                emptyRender: () => (
                                    <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs">Empty</div>
                                ),
                                cardString: "bg-black border-2 aspect-[3/4] rounded-lg overflow-hidden transition-all duration-300"
                            }}
                        />
                    </div>

                    {/* Pet */}
                    <div className={styles.petWrapper}>
                        <PetDisplay 
                            petFile={set.pet_file} 
                            hideLabel={true}
                            customClasses={{
                                wrapper: "w-20 h-20 border-none bg-transparent shadow-none"
                            }}
                        />
                    </div>
                </div>

                {/* Skill Rotation */}
                <SkillSequence 
                    skillRotation={set.skill_rotation} 
                    heroes={set.heroes} 
                    heroImageMap={heroImageMap}
                    customClasses={{
                        container: "mt-6 space-y-3",
                    }}
                    accentColor="var(--primary)"
                />

                {/* Strategy Note */}
                {set.note && set.note.trim() !== "" && (
                    <div className={styles.noteSection}>
                        <div className={styles.noteGlow} />
                        <div className={styles.noteContainer}>
                            <div className={styles.noteHeader}>
                                <div className={styles.noteIconWrapper}>
                                    <ScrollText className={styles.noteIcon} />
                                </div>
                                <span className={styles.noteBadge}>Strategy Note</span>
                            </div>
                            <p className={styles.noteText}>
                                {set.note}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
