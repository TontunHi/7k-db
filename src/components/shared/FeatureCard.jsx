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

export default function FeatureCard({ title, description, iconName, href }) {
    const Icon = ICON_MAP[iconName] || Sword

    return (
        <Link
            href={href}
            className={styles.card}
        >
            {/* Top Border Glow */}
            <div className={styles.topGlow} />

            {/* Background Radial Glow */}
            <div className={styles.bgRadialGlow} />

            <div className={styles.content}>
                {/* Icon Container */}
                <div className={styles.iconWrapper}>
                    <div className={styles.iconOverlay} />
                    <Icon className={styles.icon} />
                </div>

                <div className={styles.textContainer}>
                    <h3 className={styles.title}>
                        {title}
                    </h3>
                    {description && (
                        <p className={styles.description}>
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Arrow indicator */}
            <div className={styles.arrow}>
                <ArrowRight className={styles.arrowIcon} />
            </div>

            {/* Animated Light Sweep Effect */}
            <div className={styles.sweep} />
        </Link>
    )
}

