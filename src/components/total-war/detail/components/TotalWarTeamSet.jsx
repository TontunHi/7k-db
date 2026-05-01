"use client"
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'
import styles from './TotalWarTeamSet.module.css'

export default function TotalWarTeamSet({ set, setIdx, tier, heroImageMap }) {
    const [isCollapsed, setIsCollapsed] = useState(true)

    return (
        <div className={styles.set}>
            {/* Set Header */}
            <div className={styles.setHeader} onClick={() => setIsCollapsed(!isCollapsed)}>
                <div 
                    className={styles.setNumber}
                    style={{ backgroundColor: tier.accent, color: '#000' }}
                >
                    {setIdx + 1}
                </div>
                <h2 className={styles.setTitle}>
                    {set.set_name || `Set ${setIdx + 1}`}
                </h2>
                <div 
                    className={styles.setDivider}
                    style={{ background: `linear-gradient(to right, ${tier.accent}40, transparent)` }}
                />
                <span className={styles.setMeta}>
                    {set.teams?.length || 0} / {tier.maxTeams} teams
                </span>
                <div className={styles.collapseBtn}>
                    {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                </div>
            </div>

            {/* Teams in this Set */}
            {!isCollapsed && (
                <>
                    {(!set.teams || set.teams.length === 0) ? (
                        <div className={styles.emptyTeams}>
                            No teams in this set yet.
                        </div>
                    ) : (
                        <div className={styles.teamsList}>
                            {set.teams.map((team, teamIdx) => (
                                <div key={team.id} className={styles.team}>
                                    {/* Team Header */}
                                    <div className={styles.teamHeader}>
                                        <div 
                                            className={styles.teamNumber}
                                            style={{ backgroundColor: tier.accent, color: '#000' }}
                                        >
                                            {teamIdx + 1}
                                        </div>
                                        <h3 className={styles.teamName}>
                                            {team.team_name || `Team ${teamIdx + 1}`}
                                        </h3>
                                        <span className={styles.teamFormation}>
                                            {team.formation?.replace('-', ' - ')}
                                        </span>
                                        {team.video_url && (
                                            <a 
                                                href={team.video_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className={styles.videoLink}
                                            >
                                                Watch Video
                                            </a>
                                        )}
                                    </div>

                                    <div className={styles.teamBody}>
                                        <div className={styles.coreLayout}>
                                            <div className={styles.gridArea}>
                                                <FormationGrid 
                                                    formation={team.formation} 
                                                    heroes={team.heroes} 
                                                    heroImageMap={heroImageMap}
                                                    customClasses={{
                                                        container: "grid grid-cols-5 gap-2 md:gap-3 pb-6 max-w-full",
                                                        emptyRender: () => (
                                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-xs">Empty</div>
                                                        ),
                                                        cardString: "bg-card border-2 border-border aspect-[3/4] rounded-lg overflow-hidden transition-all duration-300 shadow-inner"
                                                    }}
                                                />
                                            </div>
                                            <PetDisplay 
                                                petFile={team.pet_file} 
                                                hideLabel={true}
                                                customClasses={{ wrapper: "w-20 h-20 border-none bg-transparent shadow-none" }}
                                            />
                                        </div>

                                        <SkillSequence 
                                            skillRotation={team.skill_rotation} 
                                            heroes={team.heroes} 
                                            heroImageMap={heroImageMap}
                                            customClasses={{ container: "mt-4 space-y-3" }}
                                            accentColor={tier.accent}
                                        />

                                        {team.note && team.note.trim() !== "" && (
                                            <div className={styles.note}>
                                                <p className={styles.noteText}>{team.note}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Set Note */}
                    {set.note && set.note.trim() !== "" && (
                        <div className={styles.setNote}>
                            <p className={styles.setNoteText}>{set.note}</p>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
