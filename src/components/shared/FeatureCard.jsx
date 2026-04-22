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

export default function FeatureCard({ title, description, iconName, href, color, glow }) {
    const Icon = ICON_MAP[iconName] || Sword

    // Note: 'color' and 'glow' currently contain Tailwind classes. 
    // We combine them with CSS Module classes for structure.
    return (
        <Link
            href={href}
            className={clsx(styles.card, glow)}
        >
            {/* Top Border Glow */}
            <div className={clsx(styles.topGlow, "bg-gradient-to-r", color)} />

            {/* Background Radial Glow */}
            <div className={clsx(styles.bgRadialGlow, "bg-gradient-to-br", color)} />

            <div className={styles.content}>
                {/* Icon Container */}
                <div className={styles.iconWrapper}>
                    <div className={clsx(styles.iconOverlay, "bg-gradient-to-br", color)} />
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

