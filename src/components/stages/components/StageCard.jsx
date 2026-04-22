import { clsx } from 'clsx'
import { Shield } from 'lucide-react'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import styles from './StageCard.module.css'

export default function StageCard({ stage, isNightmare, heroImageMap }) {
    if (!stage) return null;

    return (
        <div className={clsx(
            styles.card,
            isNightmare ? styles.cardNightmare : styles.cardStage
        )}>
            {/* Top Gradient Line */}
            <div className={clsx(
                styles.topLine,
                isNightmare ? styles.topLineNightmare : styles.topLineStage
            )}></div>

            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h3 className={clsx(
                        styles.title,
                        isNightmare ? styles.titleNightmare : styles.titleStage
                    )}>
                        {stage.name}
                    </h3>
                    <p className={styles.meta}>
                        <span className={styles.dot}></span>
                        Updated: {new Date(stage.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                </div>
                {stage.note && stage.note.trim() !== "" && (
                    <div className={styles.note}>
                        &quot;{stage.note}&quot;
                    </div>
                )}
            </div>

            {/* Teams */}
            <div className={styles.teamsGrid}>
                {stage.teams.map((team, idx) => (
                    <div key={team.index || idx} className={styles.teamSection}>
                        <div className={styles.teamHeader}>
                            <div className={clsx(
                                styles.badge,
                                isNightmare ? styles.badgeNightmare : styles.badgeStage
                            )}>
                                Team {team.index}
                            </div>
                            <div className={styles.formationInfo}>
                                <Shield className="w-3 h-3" /> Formation: <span className={styles.formationName}>{team.formation.replace("-", " - ")}</span>
                            </div>
                        </div>

                        <div className={styles.teamLayout}>
                            {/* Heroes */}
                            <FormationGrid 
                                formation={team.formation} 
                                heroes={team.heroes} 
                                heroImageMap={heroImageMap}
                                staggerAmount="translate-y-8"
                                customClasses={{
                                    container: "grid grid-cols-5 gap-3 pb-8 max-w-full",
                                    emptyRender: () => (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-800 text-xs font-mono">EMPTY</div>
                                    ),
                                    cardString: "bg-black border aspect-[3/4] rounded-sm overflow-hidden transition-all duration-300 group/hero shadow-none",
                                    image: "group-hover/hero:scale-110",
                                    renderOverlay: () => (
                                        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover/hero:animate-shine" />
                                    )
                                }}
                            />

                            {/* Pet */}
                            <div className={styles.petContainer}>
                                <PetDisplay 
                                    petFile={team.pet_file} 
                                    hideLabel={true}
                                    customClasses={{
                                        container: "items-center justify-center p-4 relative group/pet",
                                        wrapper: "w-16 h-16 border-none bg-transparent shadow-none group-hover/pet:scale-110 duration-300",
                                        image: "drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] p-0",
                                        emptyText: "text-2xl font-black text-gray-800"
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
