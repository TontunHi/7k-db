import { clsx } from 'clsx'
import styles from './AdventPhaseSelector.module.css'

export default function AdventPhaseSelector({ phase, setPhase }) {
    const phases = ['Phase 1', 'Phase 2'];

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {phases.map(p => (
                    <button
                        key={p}
                        onClick={() => setPhase(p)}
                        className={clsx(
                            styles.button,
                            phase === p && styles.active
                        )}
                    >
                        {p}
                    </button>
                ))}
            </div>
        </div>
    )
}
