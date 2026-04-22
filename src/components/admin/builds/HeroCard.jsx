"use client"

import Image from "next/image"
import { Edit, Trash2, Sparkles } from "lucide-react"
import styles from "./builds.module.css"

/**
 * HeroCard - Displays an individual hero and handles primary actions
 */
export default function HeroCard({ hero, onEdit, onDelete }) {
    return (
        <div className={styles.heroCard} onClick={() => onEdit(hero)}>
            <div className={styles.imageWrapper}>
                <Image
                    src={`/heroes/${hero.filename}`}
                    alt={hero.name}
                    fill
                    className={styles.heroImage}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"
                />

                {/* New Hero Indicator */}
                {hero.is_new_hero && (
                    <div className={styles.newBadge}>
                        <Sparkles size={10} />
                        <span>New</span>
                    </div>
                )}

                {/* Hover Overlay */}
                <div className={styles.overlay}>
                    <div className={styles.editBtn}>
                        <Edit size={14} />
                        <span>Edit Build</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete(hero.filename)
                }}
                className={styles.deleteBtn}
                title="Delete Hero"
            >
                <Trash2 size={16} />
            </button>
        </div>
    )
}
