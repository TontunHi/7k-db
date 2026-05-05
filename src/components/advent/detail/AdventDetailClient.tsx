'use client'

import { useState } from 'react'
import { Users, Compass } from 'lucide-react'
import AdventPhaseSelector from './components/AdventPhaseSelector'
import AdventTeamSet from './components/AdventTeamSet'
import styles from './AdventDetailView.module.css'

export default function AdventDetailClient({ sets, heroImageMap }) {
    const [phase, setPhase] = useState('Phase 1')
    const filteredSets = sets.filter(s => (s.phase || 'Phase 1') === phase)

    return (
        <div className={styles.detailContainer}>
            {/* Phase Selector */}
            <AdventPhaseSelector phase={phase} setPhase={setPhase} />

            {sets.length === 0 ? (
                <div className={styles.emptyState}>
                    <Users className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No team recommendations available yet.</p>
                </div>
            ) : filteredSets.length === 0 ? (
                <div className={styles.emptyState}>
                    <Compass className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No teams registered for {phase}.</p>
                </div>
            ) : (
                <div className={styles.setsList}>
                    {filteredSets.map((set, idx) => (
                        <AdventTeamSet 
                            key={set.id} 
                            set={set} 
                            index={idx} 
                            heroImageMap={heroImageMap} 
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
