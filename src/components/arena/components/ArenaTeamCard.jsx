import { Video, ExternalLink } from 'lucide-react'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'
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
                    <div className={styles.number}>
                        {index + 1}
                    </div>
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

                    <div className={styles.petArea}>
                        <div className={styles.petBox}>
                            <PetDisplay petFile={set.pet_file} hideLabel={true} />
                        </div>
                    </div>
                </div>

                {/* Skill Rotation */}
                <SkillSequence 
                    skillRotation={set.skill_rotation} 
                    heroes={set.heroes} 
                    heroImageMap={heroImageMap} 
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
