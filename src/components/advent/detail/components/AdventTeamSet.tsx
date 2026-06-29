'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { Video, ExternalLink } from 'lucide-react'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'
import HeroBuildTooltip from './HeroBuildTooltip'
import SafeImage from '@/components/shared/SafeImage'
import { parseHeroDetails, resolveHeroImage } from '@/lib/hero-utils'
import styles from './AdventTeamSet.module.css'

export default function AdventTeamSet({ set, index, heroImageMap }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className={styles.set}>
            <div className={styles.headerWrapper}>
                <div className={styles.topLine} />
                
                {/* Set Header */}
                <div className={styles.header}>
                    <div className={styles.headerInfo}>
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
            </div>

            <div className={styles.body}>
                <div className={styles.layout}>
                    {/* Heroes Grid */}
                    <div className={styles.heroesSection}>
                        <div className={styles.heroesLabel}>
                            <span className={styles.labelText}>Comp</span>
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
                                    cardString: "bg-card border border-border aspect-[3/4] rounded-lg overflow-hidden transition-all duration-300 shadow-inner",
                                    renderWrapper: (cardNode, idx) => {
                                        const heroFile = set.heroes?.[idx];
                                        const heroName = heroFile ? parseHeroDetails(heroFile)?.name : '';
                                        // Slots 0, 1 are left-aligned tooltips, 3, 4 are right-aligned
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

                {/* Speed Order Section (Aligned Left, Clean No Box) */}
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
                        <div className="mt-8 mb-2">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Speed</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {orderedHeroes.map((item, sortedIdx) => {
                                    const heroName = parseHeroDetails(item.heroFile)?.name || '';
                                    const isLast = sortedIdx === orderedHeroes.length - 1;
                                    return (
                                        <div key={item.originalIdx} className="flex items-center gap-2">
                                            <div className="flex flex-col items-center p-0.5 bg-background rounded-xl border border-border relative shadow-lg">
                                                <div className="absolute -top-2 -left-2 min-w-[20px] h-[20px] px-1 text-black rounded-full flex items-center justify-center text-[9px] font-black border-2 border-card z-20 shadow-sm bg-primary">
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

                <div className={styles.skillsWrapper}>
                    <SkillSequence 
                        skillRotation={set.skill_rotation} 
                        heroes={set.heroes} 
                        heroImageMap={heroImageMap}
                        accentColor="var(--primary)"
                        hideHeaderIcon={true}
                    />
                </div>

                {/* Note */}
                {set.note && set.note.trim() !== "" && (
                    <div className={styles.noteSection}>
                        <div className={styles.noteBar} />
                        <div 
                            className={styles.noteHeader}
                        >
                            <span className={styles.noteBadge}>Strategy Note</span>
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
