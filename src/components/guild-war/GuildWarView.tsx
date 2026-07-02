import GuildWarHeader from './components/GuildWarHeader'
import GuildWarContent from './GuildWarContent'
import styles from './GuildWarView.module.css'

export default function GuildWarView({ teams, heroImageMap, lastUpdated }) {
    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.glowTop} />
                <div className={styles.glowBottom} />
                <div className={styles.gridPattern} />
                <div className={styles.overlay} />
            </div>

            <div className={styles.content}>
                {/* Banner */}
                <GuildWarHeader lastUpdated={lastUpdated} />

                {/* Search + Teams (client-side interactive) */}
                <GuildWarContent teams={teams} heroImageMap={heroImageMap} />
            </div>

            {/* Footer gradient */}
            <div className={styles.footerGradient} />
        </div>
    )
}
