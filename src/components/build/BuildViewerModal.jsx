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

    const sortedSkills = [...allSkills].sort((a, b) => {
        const getNum = (s) => parseInt(s.split('/').pop()) || 0
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
            className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4"
            style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.97) 100%)" }}
        >
            {/* Backdrop click */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Animated glow blob behind modal */}
            <div className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
            />

            {/* Main Container */}
            <div className="relative bg-card border border-border/70 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Decorative top gradient line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-70 z-10" />

                {/* Background noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                        backgroundSize: "128px",
                    }}
                />

                {/* Header Section */}
                <div className="relative flex flex-col md:flex-row gap-4 p-4 md:p-5 border-b border-border/50 bg-gradient-to-b from-card to-card/60 flex-shrink-0">

                    {/* Hero Image with glow */}
                    <div className="relative min-w-[6rem] min-h-[7rem] md:min-w-[7rem] md:min-h-[8rem] rounded-xl overflow-hidden border border-white/10 shadow-2xl flex-shrink-0 group bg-black/30"
                        style={{ boxShadow: "0 0 30px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.07)" }}
                    >
                        {/* Glow effect behind image */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{ background: "radial-gradient(circle at center, hsl(var(--primary) / 0.25) 0%, transparent 70%)" }}
                        />
                        <SafeImage
                            src={`/heroes/${hero.filename}`}
                            width={112}
                            height={128}
                            className="object-contain w-auto h-full max-h-28 md:max-h-32 transition-transform duration-500 group-hover:scale-105"
                            alt={hero.name}
                            fallback="/heroes/placeholder.webp"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/8 rounded-xl pointer-events-none" />
                        {/* Animated shine on hover */}
                        <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                            <div className="absolute -left-full top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent translate-x-0 group-hover:translate-x-[500%] transition-transform duration-700 ease-in-out" />
                        </div>
                    </div>

                    {/* Hero Info & Skills */}
                    <div className="flex-1 flex flex-col justify-center space-y-3">
                        <div>
                            <h2 className="text-2xl font-black text-foreground tracking-tight uppercase italic transform -skew-x-6 drop-shadow-md leading-none">
                                {hero.name}
                            </h2>
                            <div className="mt-1 h-[2px] w-12 bg-gradient-to-r from-primary to-transparent rounded-full" />
                        </div>

                        {/* Skills Row */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            {sortedSkills.map((s, i) => {
                                const rank = getPriorityRank(s)
                                return (
                                    <div key={i} className={clsx(
                                        "relative w-10 h-10 md:w-11 md:h-11 bg-background rounded-lg border overflow-visible transition-all duration-300 group/skill cursor-default",
                                        rank
                                            ? "border-primary/70 shadow-[0_0_12px_rgba(var(--primary-rgb,255,200,50),0.35)] scale-105 hover:scale-110"
                                            : "border-border/60 opacity-50 grayscale hover:grayscale-0 hover:opacity-90 hover:scale-105"
                                    )}>
                                        <div className="relative w-full h-full overflow-hidden rounded-lg">
                                            <SafeImage
                                                src={`/skills/${s}`}
                                                fill
                                                className="object-cover"
                                                alt="skill"
                                                sizes="44px"
                                            />
                                        </div>

                                        {/* Pulse ring for priority skills */}
                                        {rank && (
                                            <div className="absolute inset-0 rounded-lg border-2 border-primary/50 animate-ping opacity-60 pointer-events-none" style={{ animationDuration: '2s' }} />
                                        )}

                                        {/* Priority Badge */}
                                        {rank && (
                                            <div className="absolute -top-1.5 -right-1.5 z-10">
                                                <div className="w-4 h-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[9px] font-bold border border-background shadow-lg">
                                                    {rank}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tooltip */}
                                        {rank && (
                                            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-card text-primary text-[9px] font-bold px-2 py-0.5 rounded-md border border-primary/30 opacity-0 group-hover/skill:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-20">
                                                Priority {rank}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        {(!sortedSkills || sortedSkills.length === 0) && (
                            <p className="text-gray-600 text-xs italic">No skills found</p>
                        )}
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-3.5 right-3.5 p-1.5 bg-white/5 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-400 transition-all duration-200 border border-white/5 hover:border-red-500/30 hover:scale-110 active:scale-95"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 md:p-5 relative flex flex-col justify-center overflow-y-auto md:overflow-hidden bg-background/80">

                    {builds.length > 0 ? (
                        <div className="flex flex-col w-full relative">

                            {/* Left Arrow */}
                            {builds.length > 1 && (
                                <button
                                    onClick={goPrev}
                                    className="absolute left-[-0.75rem] md:left-1 top-1/2 -translate-y-1/2 z-20 p-2 md:p-2.5 rounded-full bg-card/90 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-[0_0_20px_rgba(0,0,0,0.6)] border border-white/10 hover:border-primary/60 hover:scale-110 active:scale-95 group/arrow"
                                    aria-label="Previous build"
                                >
                                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover/arrow:-translate-x-0.5" />
                                </button>
                            )}

                            {/* Right Arrow */}
                            {builds.length > 1 && (
                                <button
                                    onClick={goNext}
                                    className="absolute right-[-0.75rem] md:right-1 top-1/2 -translate-y-1/2 z-20 p-2 md:p-2.5 rounded-full bg-card/90 backdrop-blur-md text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-[0_0_20px_rgba(0,0,0,0.6)] border border-white/10 hover:border-primary/60 hover:scale-110 active:scale-95 group/arrow"
                                    aria-label="Next build"
                                >
                                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover/arrow:translate-x-0.5" />
                                </button>
                            )}

                            {/* Build Card */}
                            <div className="w-full px-5 md:px-10 mb-4 md:mb-0">
                                {(() => {
                                    const build = builds[currentBuildIndex]
                                    return (
                                        <div
                                            key={currentBuildIndex}
                                            className="group relative rounded-2xl p-4 md:p-5 flex flex-col gap-4 md:gap-5 animate-in fade-in zoom-in-95 duration-300 overflow-hidden"
                                            style={{
                                                background: "linear-gradient(145deg, hsl(var(--card)) 0%, hsl(var(--card) / 0.7) 100%)",
                                                border: "1px solid hsl(var(--border) / 0.6)",
                                                boxShadow: "0 4px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)"
                                            }}
                                        >
                                            {/* Subtle inner glow on hover */}
                                            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                                style={{ boxShadow: "inset 0 0 40px hsl(var(--primary) / 0.05)" }}
                                            />

                                            {/* Build Tags */}
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-black uppercase tracking-wider border flex-shrink-0"
                                                    style={{
                                                        background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.05))",
                                                        borderColor: "hsl(var(--primary) / 0.35)",
                                                        color: "hsl(var(--primary))",
                                                        boxShadow: "0 0 12px hsl(var(--primary) / 0.15)"
                                                    }}
                                                >
                                                    LVL {build.cLevel}
                                                </span>
                                                <div className="h-5 w-px bg-border/50 flex-shrink-0" />
                                                <div className="flex gap-2 flex-wrap">
                                                    {build.mode.map(m => (
                                                        <span key={m}
                                                            className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-lg border border-border/50 bg-secondary/30 hover:bg-secondary/60 transition-colors"
                                                        >
                                                            {m}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Main Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 w-full">

                                                {/* Equipment */}
                                                <div className="md:col-span-7 space-y-3">
                                                    <SectionLabel color="primary">Equipment</SectionLabel>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <ViewerItemCard item={build.weapons[0]} type="Weapon" />
                                                        <ViewerItemCard item={build.armors[0]} type="Armor" />
                                                        <ViewerItemCard item={build.weapons[1]} type="Weapon" />
                                                        <ViewerItemCard item={build.armors[1]} type="Armor" />
                                                    </div>
                                                </div>

                                                {/* Accessory */}
                                                <div className="md:col-span-5 space-y-3">
                                                    <SectionLabel color="primary">Accessory & Refining</SectionLabel>
                                                    <div className="flex flex-wrap gap-3 items-start">
                                                        {build.accessories && build.accessories.length > 0 ? build.accessories.map((acc, idx) => (
                                                            <div key={idx} className="flex flex-col gap-2 items-center group/acc">
                                                                <div className="relative w-12 h-12 bg-background border border-border/60 rounded-xl overflow-hidden transition-all duration-300 group-hover/acc:border-primary/50 group-hover/acc:shadow-[0_0_16px_hsl(var(--primary)/0.3)] group-hover/acc:scale-105">
                                                                    <SafeImage src={`/items/accessory/${acc.image}`} fill className="object-cover" alt="acc" sizes="48px" />
                                                                </div>
                                                                {acc.refined ? (
                                                                    <div className="relative w-8 h-8 bg-background/60 border border-cyan-500/40 rounded-lg overflow-hidden animate-in fade-in zoom-in duration-300 transition-all group-hover/acc:border-cyan-400/70 group-hover/acc:shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                                                                        <SafeImage src={`/items/accessory/${acc.refined}`} fill className="object-cover" alt="refined" sizes="32px" />
                                                                        <div className="absolute inset-0 ring-1 ring-inset ring-cyan-400/25 rounded-lg" />
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-8 h-8 border border-dashed border-border/20 rounded-lg flex items-center justify-center opacity-15">
                                                                        <div className="w-1 h-1 bg-border rounded-full" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )) : (
                                                            <span className="text-gray-600 text-xs italic">None selected</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Minimum Stats */}
                                                {build.minStats && Object.keys(build.minStats).length > 0 && (
                                                    <div className="md:col-span-7 pt-4 border-t border-border/30">
                                                        <SectionLabel color="orange">Minimum Stats</SectionLabel>
                                                        <div className="mt-3 inline-grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 rounded-xl p-2.5 w-full lg:w-auto max-w-full"
                                                            style={{
                                                                background: "rgba(0,0,0,0.35)",
                                                                border: "1px solid hsl(var(--border) / 0.35)",
                                                            }}
                                                        >
                                                            {MIN_STATS_KEYS.filter(s => build.minStats[s.key]).map((s) => (
                                                                <div key={s.key}
                                                                    className="flex items-center gap-4 justify-between px-2.5 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/[0.04] cursor-default group/stat"
                                                                >
                                                                    <div className="flex items-center gap-2.5">
                                                                        <div className="w-4 h-4 relative flex-shrink-0 opacity-70 group-hover/stat:opacity-100 transition-opacity">
                                                                            <SafeImage src={s.icon} fill alt="" className="object-contain" />
                                                                        </div>
                                                                        <span className="text-xs font-semibold text-foreground/60 group-hover/stat:text-foreground/80 transition-colors tracking-tight">{s.label}</span>
                                                                    </div>
                                                                    <div className="flex items-baseline gap-0.5 ml-2">
                                                                        <span className="text-sm font-black text-foreground">{build.minStats[s.key]}</span>
                                                                        {s.unit && <span className="text-[10px] font-bold text-primary/70">{s.unit}</span>}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Substats */}
                                                <div className="md:col-span-5 pt-4 border-t border-border/30">
                                                    <SectionLabel color="primary">Substats Priority</SectionLabel>
                                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                                        {build.substats && build.substats.length > 0 ? build.substats.map((sub, idx) => (
                                                            <span key={idx}
                                                                className="group/sub bg-secondary/20 text-foreground border border-border/60 hover:border-primary/60 hover:bg-primary/10 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-sm transition-all duration-200 cursor-default hover:scale-[1.02] hover:shadow-[0_0_10px_hsl(var(--primary)/0.2)]"
                                                            >
                                                                <span className="w-4 h-4 rounded-md bg-background text-primary flex items-center justify-center text-[9px] shadow font-black border border-border/50 group-hover/sub:border-primary/40 transition-colors flex-shrink-0">
                                                                    {idx + 1}
                                                                </span>
                                                                {sub}
                                                            </span>
                                                        )) : (
                                                            <span className="text-gray-600 text-xs italic">None</span>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>

                                            {/* Note */}
                                            {build.note && (
                                                <div className="pt-3 border-t border-border/30">
                                                    <div className="relative text-muted-foreground text-xs leading-relaxed rounded-xl p-4 overflow-hidden"
                                                        style={{
                                                            background: "linear-gradient(135deg, hsl(var(--secondary) / 0.25), hsl(var(--secondary) / 0.1))",
                                                            border: "1px solid hsl(var(--border) / 0.5)"
                                                        }}
                                                    >
                                                        <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
                                                            style={{ background: "linear-gradient(180deg, hsl(var(--primary)), hsl(var(--primary) / 0.3))" }}
                                                        />
                                                        <span className="text-primary font-bold mr-2 text-[10px] uppercase tracking-widest">Note</span>
                                                        <span className="opacity-80">{build.note}</span>
                                                    </div>
                                                </div>
                                            )}


                                        </div>
                                    )
                                })()}
                            </div>

                            {/* Dot pagination — always visible below slider */}
                            {builds.length > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-5 pb-1">
                                    {builds.map((b, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentBuildIndex(idx)}
                                            title={`Build ${idx + 1}`}
                                            className={clsx(
                                                "rounded-full transition-all duration-300 hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                                idx === currentBuildIndex
                                                    ? "h-2 w-6 bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.8)]"
                                                    : "h-2 w-2 bg-border/50 hover:bg-primary/50"
                                            )}
                                            aria-label={`Go to build ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                            <p className="text-sm">No builds available for this hero yet.</p>
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
            "group/card relative rounded-xl p-2.5 flex gap-2.5 items-center shadow-sm transition-all duration-300 min-h-[64px] overflow-hidden cursor-default",
            "hover:scale-[1.02] hover:-translate-y-0.5",
            isWeapon
                ? "hover:shadow-[0_4px_20px_rgba(248,113,113,0.25)] hover:border-red-400/50"
                : "hover:shadow-[0_4px_20px_rgba(96,165,250,0.25)] hover:border-blue-400/50"
        )}
            style={{
                background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--card) / 0.8) 100%)",
                border: "1px solid hsl(var(--border) / 0.6)",
            }}
        >
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
