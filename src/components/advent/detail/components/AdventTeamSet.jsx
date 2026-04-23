'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { Video, ExternalLink, Users } from 'lucide-react'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'
import styles from './AdventTeamSet.module.css'

export default function AdventTeamSet({ set, index, heroImageMap }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={styles.set}>
            <div className={styles.topLine} />
            
            {/* Set Header */}
            <div className={styles.header}>
                <div className={styles.headerInfo}>
                    <div className={styles.number}>{index + 1}</div>
                    <h3 className={styles.teamTitle}>
                        {set.team_name || `Set ${index + 1}`}
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
                        Video
                        <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>

            <div className={styles.body}>
                <div className={styles.layout}>
                    <div className={styles.heroesSection}>
                        <div className={styles.heroesLabel}>
                            <Users className={styles.labelIcon} />
                            <span className={styles.labelText}>Team Composition</span>
                            <span className={styles.formationText}>
                                Formation: {set.formation?.replace('-', ' - ')}
                            </span>
                        </div>

                        <div className={styles.gridAndPet}>
                            <FormationGrid 
                                formation={set.formation} 
                                heroes={set.heroes} 
                                heroImageMap={heroImageMap}
                                customClasses={{
                                    container: "grid grid-cols-5 gap-2 pb-2 max-w-[300px] md:max-w-[340px]",
                                    emptyRender: () => (
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-xs">Empty</div>
                                    ),
                                    cardString: "bg-card border border-border aspect-[3/4] rounded-lg overflow-hidden transition-all duration-300 shadow-inner"
                                }}
                            />

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
                    </div>

                </div>

                <div className={styles.skillsWrapper}>
                    <SkillSequence 
                        skillRotation={set.skill_rotation} 
                        heroes={set.heroes} 
                        heroImageMap={heroImageMap}
                        accentColor="var(--primary)"
                    />
                </div>

                {/* Note */}
                {set.note && set.note.trim() !== "" && (
                    <div className={styles.noteSection}>
                        <div className={styles.noteBar} />
                        <div 
                            className={styles.noteHeader}
                            onClick={() => setExpanded(!expanded)}
                        >
                            <span className={styles.noteBadge}>Strategy Note</span>
                            <button className={styles.expandButton}>
                                {expanded ? 'Hide Note' : 'Read Note'}
                            </button>
                        </div>
                        
                        <div className={clsx(
                            styles.noteContent,
                            expanded && styles.noteExpanded
                        )}>
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
