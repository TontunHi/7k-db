"use client"

import Image from "next/image"
import { clsx } from "clsx"
import styles from "./builds.module.css"
import { Edit2 } from "lucide-react"

/**
 * HeroCard - Displays an individual hero and handles primary actions
 */
export default function HeroCard({ hero, onEdit }) {
    return (
        <div 
            className={`${styles.heroCard} group border border-white/5 hover:border-primary/45 transition-all duration-300 shadow-2xl relative`}
        >
            <div 
                className={styles.imageWrapper} 
                onClick={() => onEdit(hero)}
            >
                <Image
                    src={`/heroes/${hero.filename}`}
                    alt={hero.name}
                    fill
                    className={`${styles.heroImage} grayscale-[0.1] group-hover:grayscale-0 transition-all duration-500`}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"
                />

                {/* NEW Badge */}
                {hero.is_new_hero && (
                    <div className={styles.newBadge}>
                        New
                    </div>
                )}

                {/* Hover Overlay */}
                <div className={clsx(styles.overlay, "bg-black/60 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300")}>
                    <div className="flex flex-col items-center gap-1.5 p-3 bg-black/90 border border-primary/40 rounded-xl transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                        <Edit2 size={14} className="text-primary" />
                        <span className="text-primary text-[10px] font-black uppercase tracking-widest">
                            EDIT BUILD
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
