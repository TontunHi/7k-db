"use client"

import Image from "next/image"
import { clsx } from "clsx"
import styles from "./builds.module.css"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

/**
 * HeroCard - Displays an individual hero and handles primary actions
 */
export default function HeroCard({ hero, onEdit, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: hero.filename })

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0.6 : 1,
        cursor: isDragging ? 'grabbing' : 'default'
    }
    return (
        <div 
            ref={setNodeRef}
            style={style}
            className={`${styles.heroCard} group border border-white/5 hover:border-[#FFD700]/30 transition-all duration-500 shadow-2xl relative`}
        >
            <div 
                className={styles.imageWrapper} 
                onClick={() => onEdit(hero)}
            >
                <Image
                    src={`/heroes/${hero.filename}`}
                    alt={hero.name}
                    fill
                    className={`${styles.heroImage} grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700`}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"
                />

                {/* Drag Handle Indicator */}
                <div 
                    {...attributes} 
                    {...listeners}
                    className="absolute bottom-2.5 left-2.5 z-30 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-2"
                    title="Drag to reorder"
                >
                    <div className="w-1 h-3 bg-[#FFD700]/40 rounded-full" />
                    <div className="w-1 h-3 bg-[#FFD700]/40 rounded-full" />
                    <div className="w-1 h-3 bg-[#FFD700]/40 rounded-full" />
                </div>

                {/* NEW Badge */}
                {hero.is_new_hero && (
                    <div className="absolute top-2.5 left-2.5 z-10 px-2.5 py-1 bg-[#FFD700] text-black text-[10px] font-black tracking-wider rounded shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                        New Hero
                    </div>
                )}

                {/* Hover Overlay */}
                <div className={clsx(styles.overlay, "bg-black/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300")}>
                    <div className="px-5 py-2.5 bg-black/90 border border-[#FFD700] rounded-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
                        <span className="text-[#FFD700] text-[11px] font-black uppercase tracking-[0.2em]">
                            EDIT BUILD
                        </span>
                    </div>
                </div>
            </div>

            {/* Delete Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete(hero.filename)
                }}
                className="absolute top-2.5 right-2.5 z-20 w-8 h-8 bg-red-600 hover:bg-red-500 text-white flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl border border-red-400/50"
            >
                <span className="text-lg font-bold">×</span>
            </button>
        </div>
    )
}
