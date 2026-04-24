"use client"

import Link from 'next/link'
import { 
    Sword, Map, Skull, Landmark, Trophy, Crown, Compass, Swords, Wand2, Sparkles, Zap, ArrowRight 
} from 'lucide-react'
import { clsx } from 'clsx'
import styles from './FeatureCard.module.css'

const ICON_MAP = {
    Sword, Map, Skull, Landmark, Trophy, Crown, Compass, Swords, Wand2, Sparkles, Zap
}

export default function FeatureCard({ title, description, iconName, href, size = "default" }) {
    const Icon = ICON_MAP[iconName] || Sword

    return (
        <Link
            href={href}
            className={clsx(styles.card, styles[size])}
        >
            {/* Background Effects */}
            <div className={styles.bgRadialGlow} />
            <div className={styles.topGlow} />

            <div className={styles.content}>
                {/* Icon Section */}
                <div className={styles.iconWrapper}>
                    <div className={styles.iconOverlay} />
                    <Icon className={styles.icon} />
                </div>

                {/* Text Section */}
                <div className={styles.textContainer}>
                    <h3 className={styles.title}>
                        {title}
                    </h3>
                    {description && size !== "small" && size !== "tiny" && (
                        <p className={styles.description}>
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer / Indicator */}
            {size !== "tiny" && (
                <div className={styles.footer}>
                    <span className={styles.actionText}>Explore</span>
                    <ArrowRight className={styles.arrowIcon} />
                </div>
            )}

            {/* Premium Sweep Effect */}
            <div className={styles.sweep} />
        </Link>
    )
}
