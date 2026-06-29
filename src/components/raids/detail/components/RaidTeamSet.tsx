import { Video, ExternalLink, Users, ScrollText } from 'lucide-react'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import RaidSkillRotation from '@/components/shared/RaidSkillRotation'
import SafeImage from '@/components/shared/SafeImage'
import HeroBuildTooltip from '@/components/advent/detail/components/HeroBuildTooltip'
import { parseHeroDetails, resolveHeroImage } from '@/lib/hero-utils'
import styles from './RaidTeamSet.module.css'

export default function RaidTeamSet({ set, index, heroImageMap, skillsMap }) {
    return (
        <div className={styles.set}>
            {/* Team Header */}
            <div className={styles.header}>
                <div className={styles.headerInfo}>
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
                        Video
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
                                cardString: "bg-black/40 border-[1px] border-white/5 aspect-[3/4] rounded-xl overflow-hidden transition-all duration-500 hover:border-red-500/50",
                                renderWrapper: (cardNode, idx) => {
                                    const heroFile = set.heroes?.[idx];
                                    const heroName = heroFile ? parseHeroDetails(heroFile)?.name : '';
                                    const align = idx < 2 ? 'left' : idx > 2 ? 'right' : 'center';
                                    
                                    return (
                                        <HeroBuildTooltip 
                                            key={idx} 
                                            buildData={set.hero_builds?.[idx]} 
                                            heroName={heroName}
                                            align={align}
                                        >
                                            {cardNode}
                                        </HeroBuildTooltip>
                                    )
                                }
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

                {/* Speed Order Section */}
                {set.heroes && set.heroes.some(h => h) && (() => {
                    const validHeroes = set.heroes
                        .map((heroFile, originalIdx) => ({ heroFile, originalIdx }))
                        .filter(item => item.heroFile);
                    
                    const selOrder = set.selection_order || [];
                    const orderedHeroes = [...validHeroes].sort((a, b) => {
                        const indexA = selOrder.indexOf(a.originalIdx);
                        const indexB = selOrder.indexOf(b.originalIdx);
                        if (indexA === -1 && indexB === -1) return a.originalIdx - b.originalIdx;
                        if (indexA === -1) return 1;
                        if (indexB === -1) return -1;
                        return indexA - indexB;
                    });

                    return (
                        <div className="mt-6 mb-6 space-y-3">
                            <div className="flex items-center gap-2 px-1">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Speed</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 w-full bg-black/40 backdrop-blur-md rounded-2xl border border-white/5 p-4 shadow-lg relative overflow-hidden">
                                {orderedHeroes.map((item, sortedIdx) => {
                                    const heroName = parseHeroDetails(item.heroFile)?.name || '';
                                    const isLast = sortedIdx === orderedHeroes.length - 1;
                                    return (
                                        <div key={item.originalIdx} className="flex items-center gap-2">
                                            <div className="flex flex-col items-center p-0.5 bg-background rounded-xl border border-border relative shadow-lg">
                                                <div className="absolute -top-2 -left-2 min-w-[20px] h-[20px] px-1 text-black rounded-full flex items-center justify-center text-[9px] font-black border-2 border-card z-20 shadow-sm bg-red-500 text-white">
                                                    {sortedIdx + 1}
                                                </div>

                                                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted">
                                                    <SafeImage 
                                                        src={`/heroes/${resolveHeroImage(item.heroFile, heroImageMap) || item.heroFile + '.webp'}`} 
                                                        alt={heroName} 
                                                        fill 
                                                        sizes="40px" 
                                                        className="object-contain" 
                                                    />
                                                </div>
                                            </div>

                                            {!isLast && (
                                                <div className="flex items-center justify-center w-5 opacity-40">
                                                    <span className="text-muted-foreground text-xs font-black">➔</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}

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
