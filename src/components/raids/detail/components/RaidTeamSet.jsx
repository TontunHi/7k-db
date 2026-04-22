import { Video, ExternalLink, Users, ScrollText } from 'lucide-react'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import RaidSkillRotation from '@/components/shared/RaidSkillRotation'
import styles from './RaidTeamSet.module.css'

export default function RaidTeamSet({ set, index, heroImageMap, skillsMap }) {
    return (
        <div className={styles.set}>
            {/* Team Header */}
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <div className={styles.number}>{index + 1}</div>
                    <h3 className={styles.teamTitle}>
                        {set.team_name || `Team ${index + 1}`}
                    </h3>
                </div>
                
                {set.video_url && (
                    <a 
                        href={set.video_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.videoLink}
                    >
                        <Video className="w-4 h-4" />
                        Field Recording
                        <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                    </a>
                )}
            </div>

            <div className={styles.body}>
                <div className={styles.topRow}>
                    {/* Heroes Grid */}
                    <div className={styles.heroesArea}>
                        <div className={styles.formationInfo}>
                            <Users className={styles.formationIcon} />
                            <span className={styles.formationLabel}>
                                Formation: {set.formation?.replace('-', ' - ')}
                            </span>
                        </div>
                        <FormationGrid 
                            formation={set.formation} 
                            heroes={set.heroes} 
                            heroImageMap={heroImageMap}
                            customClasses={{
                                container: "grid grid-cols-5 gap-3 max-w-full",
                                emptyRender: () => null,
                                cardString: "bg-black/40 border-[1px] border-white/5 aspect-[3/4] rounded-xl overflow-hidden transition-all duration-500 hover:border-red-500/50"
                            }}
                        />
                    </div>

                    {/* Pet */}
                    <div className={styles.petArea}>
                        <PetDisplay 
                            petFile={set.pet_file} 
                            hideLabel={true}
                            customClasses={{
                                wrapper: "w-24 h-24 md:w-28 md:h-28 border-none bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-3 shadow-xl"
                            }}
                        />
                    </div>
                </div>

                {/* Skill Rotation */}
                <RaidSkillRotation 
                    skillRotation={set.skill_rotation} 
                    heroes={set.heroes} 
                    skillsMap={skillsMap}
                />
                
                {/* Strategy Note */}
                {set.note && set.note.trim() !== "" && (
                    <div className={styles.noteSection}>
                        <div className={styles.noteContainer}>
                            <div className={styles.noteHeader}>
                                <ScrollText className={styles.noteIcon} />
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
