"use client"

import SafeImage from "../shared/SafeImage"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { clsx } from "clsx"
import { useState } from "react"

const MIN_STATS_KEYS = [
    { key: "physAtk", label: "Physical Attack", icon: "/about_website/icon_physical_attack.webp" },
    { key: "defense", label: "Defense", icon: "/about_website/icon_defense.webp" },
    { key: "hp", label: "HP", icon: "/about_website/icon_hp.webp" },
    { key: "speed", label: "Speed", icon: "/about_website/icon_speed.webp" },
    { key: "critRate", label: "Crit Rate", icon: "/about_website/icon_crit_rate.webp", unit: "%" },
    { key: "critDamage", label: "Crit Damage", icon: "/about_website/icon_crit_damage.webp", unit: "%" },
    { key: "weaknessHit", label: "Weakness Hit Chance", icon: "/about_website/icon_weakness_hit_chance.webp", unit: "%" },
    { key: "blockRate", label: "Block Rate", icon: "/about_website/icon_block_rate.webp", unit: "%" },
    { key: "damageReduction", label: "Damage Taken Reduction", icon: "/about_website/icon_damage_taken_reduction.webp", unit: "%" },
    { key: "effectHit", label: "Effect Hit Rate", icon: "/about_website/icon_effect_hit_rate.webp", unit: "%" },
    { key: "effectResist", label: "Effect Resistance", icon: "/about_website/icon_effect_resistance.webp", unit: "%" }
]

export default function BuildViewerModal({ hero, data, onClose }) {
    const [currentBuildIndex, setCurrentBuildIndex] = useState(0)

    if (!data) return null

    const { builds, heroData, skills: allSkills } = data
    const { skillPriority } = heroData

    const sortedSkills = allSkills
        .filter(s => {
            const filename = s.split('/').pop().split('.')[0]
            return ["1", "2", "3", "4"].includes(filename)
        })
        .sort((a, b) => {
            const getNum = (s) => parseInt(s.split('/').pop().split('.')[0]) || 0
            return getNum(b) - getNum(a)
        })

    const getPriorityRank = (skillPath) => {
        if (!skillPriority) return null
        const index = skillPriority.indexOf(skillPath)
        return index !== -1 ? index + 1 : null
    }

    const goNext = () => setCurrentBuildIndex(prev => (prev === builds.length - 1 ? 0 : prev + 1))
    const goPrev = () => setCurrentBuildIndex(prev => (prev === 0 ? builds.length - 1 : prev - 1))

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
            style={{ backdropFilter: "blur(8px)", backgroundColor: "color-mix(in srgb, var(--background), transparent 20%)" }}
        >
            {/* Backdrop click */}
            <div className="absolute inset-0 z-0" onClick={onClose} />

            {/* Main Container */}
            <div className="relative z-10 bg-card border border-border rounded-3xl w-full max-w-4xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                
                {/* Close button - High Contrast & High Z-index */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[10000] p-2 bg-muted hover:bg-destructive/80 rounded-full text-muted-foreground hover:text-destructive-foreground transition-all border border-border shadow-xl backdrop-blur-md"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content Wrapper */}
                <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar overflow-x-hidden">
                    
                    {/* Header Section */}
                    <div className="relative flex flex-col md:flex-row gap-5 p-5 md:p-8 bg-muted/30 border-b border-border">
                        {/* Hero Portrait */}
                        <div className="relative w-20 h-24 md:w-28 md:h-32 rounded-2xl overflow-hidden border border-border shadow-lg flex-shrink-0 group mx-auto md:mx-0 bg-background">
                            <SafeImage
                                src={`/heroes/${hero.filename}${hero.filename?.endsWith('.webp') ? '' : '.webp'}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110 brightness-[1.05] contrast-[1.05] dark:brightness-100 dark:contrast-100"
                                alt={hero.name}
                                sizes="(max-width: 768px) 80px, 112px"
                            />

                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-center space-y-4 text-center md:text-left">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight uppercase italic transform -skew-x-6 drop-shadow-lg">
                                    {hero.name}
                                </h2>
                            </div>

                            {/* Skills Row */}
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                {sortedSkills.map((s, i) => {
                                    const rank = getPriorityRank(s)
                                    return (
                                        <div key={i} className={clsx(
                                            "relative w-10 h-10 md:w-11 md:h-11 bg-background rounded-xl border transition-all duration-300",
                                            rank ? "border-primary/60 shadow-[0_0_15px_var(--primary-opacity)]" : "border-border/5 opacity-40"
                                        )}>
                                            <SafeImage 
                                                src={`/skills/${s}`} 
                                                fill 
                                                className="object-cover rounded-xl" 
                                                alt="skill" 
                                                sizes="44px"
                                            />
                                            {rank && (
                                                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[9px] font-black border border-background">
                                                    {rank}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Build Content */}
                    <div className="p-5 md:p-8 space-y-8">
                        {builds.length > 0 ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {(() => {
                                    const build = builds[currentBuildIndex]
                                    return (
                                        <div key={currentBuildIndex} className="space-y-8">
                                            {/* Build Metadata */}
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                                        Level {build.cLevel}
                                                    </span>
                                                    <div className="w-px h-4 bg-border hidden sm:block" />
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {build.mode.map(m => (
                                                        <span key={m} className="px-3 py-1 rounded-lg bg-muted border border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                            {m}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Equipment Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {/* Left Column: Gear */}
                                                <div className="space-y-6">
                                                    <SectionLabel>Combat Equipment</SectionLabel>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <ViewerItemCard item={build.weapons[0]} type="Weapon" />
                                                        <ViewerItemCard item={build.armors[0]} type="Armor" />
                                                        <ViewerItemCard item={build.weapons[1]} type="Weapon" />
                                                        <ViewerItemCard item={build.armors[1]} type="Armor" />
                                                    </div>
                                                    
                                                    <SectionLabel>Accessory & Refining</SectionLabel>
                                                    <div className="flex flex-wrap gap-4">
                                                        {build.accessories.map((acc, idx) => (
                                                            <div key={idx} className="flex items-center gap-2 group/acc p-2 rounded-2xl bg-muted border border-border">
                                                                <div className="relative w-12 h-12 bg-background rounded-xl border border-border overflow-hidden">
                                                                    <SafeImage 
                                                                        src={`/items/accessory/${acc.image}`} 
                                                                        fill 
                                                                        className="object-cover" 
                                                                        alt="acc" 
                                                                        sizes="48px"
                                                                    />
                                                                </div>
                                                                {acc.refined && (
                                                                    <div className="relative w-8 h-8 bg-background rounded-lg border border-cyan-500/30 overflow-hidden shadow-[0_0_10px_rgba(0,255,255,0.1)]">
                                                                        <SafeImage 
                                                                            src={`/items/accessory/${acc.refined}`} 
                                                                            fill 
                                                                            className="object-cover" 
                                                                            alt="refined" 
                                                                            sizes="32px"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Right Column: Stats */}
                                                <div className="space-y-6">
                                                    <SectionLabel>Minimum Stats Priority</SectionLabel>
                                                    <div className="rounded-2xl bg-muted/40 border border-border p-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                                                        {MIN_STATS_KEYS.filter(s => build.minStats[s.key]).map((s) => (
                                                            <div key={s.key} className="flex items-center justify-between pb-2 border-b border-border last:border-0">
                                                                <div className="flex items-center gap-2.5">
                                                                    <div className="relative w-4 h-4 opacity-70">
                                                                        <SafeImage src={s.icon} fill alt="" className="object-contain" />
                                                                    </div>
                                                                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">{s.label}</span>
                                                                </div>
                                                                <div className="flex items-baseline gap-0.5">
                                                                    <span className="text-sm font-black text-foreground">{build.minStats[s.key]}</span>
                                                                    {s.unit && <span className="text-[9px] font-black text-primary">{s.unit}</span>}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <SectionLabel>Substats Priority</SectionLabel>
                                                    <div className="flex flex-wrap gap-2">
                                                        {build.substats.map((sub, idx) => (
                                                            <span key={idx} className="px-3 py-2 rounded-xl bg-muted border border-border text-xs font-bold text-foreground flex items-center gap-2 hover:border-primary/30 transition-all">
                                                                <span className="w-4 h-4 rounded bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center">{idx + 1}</span>
                                                                {sub}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Note */}
                                            {build.note && (
                                                <div className="rounded-3xl p-6 bg-muted/50 border border-border relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                                                    <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Tactical Note</h5>
                                                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">{build.note}</p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })()}
                            </div>
                        ) : (
                            <div className="py-20 text-center text-muted-foreground italic">No builds available.</div>
                        )}
                    </div>

                    {/* Pagination - Stay at bottom of scrollable area */}
                    {builds.length > 1 && (
                        <div className="sticky bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-card via-card/90 to-transparent flex items-center justify-center gap-2">
                            <button onClick={goPrev} className="p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all"><ChevronLeft className="w-5 h-5"/></button>
                            <div className="flex gap-2 mx-4">
                                {builds.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentBuildIndex(idx)}
                                        className={clsx("h-1.5 rounded-full transition-all", idx === currentBuildIndex ? "w-8 bg-primary" : "w-1.5 bg-foreground/20")}
                                    />
                                ))}
                            </div>
                            <button onClick={goNext} className="p-2 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-all"><ChevronRight className="w-5 h-5"/></button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Section Label Helper ────────────────────────────────────
function SectionLabel({ children, color = "primary" }) {
    const dotColor = color === "orange" ? "bg-orange-500" : "bg-primary"
    return (
        <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/70">
            <span className={clsx("w-1.5 h-1.5 rotate-45 flex-shrink-0", dotColor)} />
            {children}
        </h4>
    )
}

// ─── Equipment Item Card ─────────────────────────────────────
function ViewerItemCard({ item, type }) {
    if (!item?.image) return (
        <div className="rounded-xl h-16 flex items-center justify-center text-muted-foreground/30 text-[8px] uppercase tracking-widest font-bold border border-dashed border-border/30">
            —
        </div>
    )

    const isWeapon = type === "Weapon"

    return (
        <div className={clsx(
            "group/card relative rounded-xl p-2.5 flex gap-2.5 items-center transition-all duration-300 min-h-[64px] overflow-hidden cursor-default",
            "bg-card border border-border/80 shadow-sm",
            "hover:scale-[1.02] hover:-translate-y-0.5",
            isWeapon
                ? "dark:hover:shadow-[0_4px_20px_rgba(248,113,113,0.15)] hover:border-red-400/50"
                : "dark:hover:shadow-[0_4px_20px_rgba(96,165,250,0.15)] hover:border-blue-400/50"
        )}>
            {/* Hover color bleed */}
            <div className={clsx(
                "absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl",
                isWeapon
                    ? "bg-gradient-to-br from-red-500/5 to-transparent"
                    : "bg-gradient-to-br from-blue-500/5 to-transparent"
            )} />

            <div className={clsx(
                "relative w-11 h-11 bg-background rounded-lg flex-shrink-0 overflow-hidden border transition-all duration-300",
                isWeapon
                    ? "border-red-500/20 group-hover/card:border-red-400/50 group-hover/card:shadow-[0_0_10px_rgba(248,113,113,0.3)]"
                    : "border-blue-500/20 group-hover/card:border-blue-400/50 group-hover/card:shadow-[0_0_10px_rgba(96,165,250,0.3)]"
            )}>
                <SafeImage
                    src={`/items/${type.toLowerCase()}/${item.image}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover/card:scale-110"
                    alt={type}
                    sizes="44px"
                />
            </div>

            <div className="min-w-0 flex-1 relative z-10">
                <div className={clsx(
                    "text-[9px] font-black uppercase leading-none mb-1.5 tracking-widest",
                    isWeapon ? "text-red-400" : "text-blue-400"
                )}>
                    {type}
                </div>
                <div className="text-[11px] text-foreground font-semibold tracking-tight whitespace-normal leading-tight group-hover/card:text-foreground transition-colors line-clamp-2">
                    {item.stat}
                </div>
            </div>
        </div>
    )
}
