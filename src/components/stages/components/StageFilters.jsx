import { clsx } from 'clsx'
import { Map, Skull } from 'lucide-react'
import styles from './StageFilters.module.css'

const MODES = [
    { id: "stage", label: "Main Stage", icon: Map },
    { id: "nightmare", label: "Nightmare Stage", icon: Skull }
]

export default function StageFilters({ mode, setMode, searchQuery, setSearchQuery }) {
    const isNightmare = mode === 'nightmare'

    return (
        <div className={styles.container}>
            {/* Search Bar */}
            <div className={styles.searchWrapper}>
                <div className={clsx(styles.searchGlow, isNightmare ? styles.searchGlowNightmare : styles.searchGlowStage)} />
                <input
                    type="text"
                    placeholder="Search stage..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={clsx(
                        styles.searchInput,
                        isNightmare ? styles.searchInputFocusNightmare : styles.searchInputFocusStage
                    )}
                />
            </div>

            {/* Toggles */}
            <div className={styles.toggles}>
                {MODES.map((m) => {
                    const Icon = m.icon
                    const isActive = mode === m.id
                    const isDanger = m.id === "nightmare"
                    
                    return (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={clsx(
                                styles.toggleButton,
                                isActive && (isDanger ? styles.activeNightmare : styles.activeStage)
                            )}
                        >
                            <span className={clsx(styles.corner, styles.topLeft)}></span>
                            <span className={clsx(styles.corner, styles.bottomRight)}></span>
                            <Icon className={clsx(styles.icon, isActive && styles.iconActive)} />
                            {m.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
