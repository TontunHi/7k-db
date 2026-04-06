"use client"

import SafeImage from "../shared/SafeImage"
import { X, Sword, Shield, Heart, Zap, Sparkles, Sparkle, Target, ShieldCheck, ShieldAlert, Wand2, ShieldX } from "lucide-react"
import { clsx } from "clsx"

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
    if (!data) return null

    const { builds, heroData, skills: allSkills } = data
    const { skillPriority } = heroData

    // Sort All Skills: 4 -> 3 -> 2 -> 1 based on filename
    const sortedSkills = [...allSkills].sort((a, b) => {
        const getNum = (s) => parseInt(s.split('/').pop()) || 0
        return getNum(b) - getNum(a) // Descending
    })

    // Helper to get priority rank
    const getPriorityRank = (skillPath) => {
        if (!skillPriority) return null
        const index = skillPriority.indexOf(skillPath)
        return index !== -1 ? index + 1 : null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">

            {/* Main Container */}
            <div className="bg-card border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col relative shadow-[0_0_60px_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Decorative Top Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 p-8 border-b border-border bg-card/50">

                    {/* Hero Image */}
                    <div className="relative w-auto h-auto min-w-[5rem] min-h-[6rem] md:min-w-[7rem] md:min-h-[8rem] rounded-xl overflow-hidden border border-border shadow-2xl flex-shrink-0 group bg-black/20">
                        <SafeImage 
                            src={`/heroes/${hero.filename}`} 
                            width={120} 
                            height={144} 
                            className="object-contain w-auto h-full max-h-32 md:max-h-40" 
                            alt={hero.name} 
                            fallback="/heroes/placeholder.webp"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl"></div>
                        {/* Shine */}
                        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                    </div>

                    {/* Hero Info & Skills */}
                    <div className="flex-1 flex flex-col justify-center space-y-4">
                        <div>
                            <h2 className="text-3xl font-black text-foreground tracking-tight uppercase italic transform -skew-x-6 drop-shadow-md">
                                {hero.name}
                            </h2>
                        </div>

                        {/* Skills Row (4 3 2 1) */}
                        <div className="flex flex-wrap items-center gap-4">
                            {sortedSkills.map((s, i) => {
                                const rank = getPriorityRank(s)
                                return (
                                    <div key={i} className={clsx(
                                        "relative w-12 h-12 md:w-14 md:h-14 bg-background rounded-lg border overflow-visible transition-all duration-300 group/skill",
                                        rank ? "border-primary shadow-lg scale-105" : "border-border opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                                    )}>
                                        <div className="relative w-full h-full overflow-hidden rounded-lg">
                                            <SafeImage 
                                                src={`/skills/${s}`} 
                                                fill 
                                                className="object-cover" 
                                                alt="skill" 
                                                sizes="(max-width: 768px) 56px, 64px"
                                            />
                                        </div>

                                        {/* Priority Badge - Top Right */}
                                        {rank && (
                                            <div className="absolute -top-2 -right-2 z-10">
                                                <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-background shadow-lg">
                                                    {rank}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tooltip for skill priority */}
                                        {rank && (
                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 rounded opacity-0 group-hover/skill:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                Priority {rank}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        {(!sortedSkills || sortedSkills.length === 0) && (
                            <p className="text-gray-600 text-xs italic">No skills found (Add to public/skills folder)</p>
                        )}
                    </div>

                    <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all border border-transparent hover:border-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-background custom-scrollbar">

                    {builds.length > 0 ? builds.map((build, i) => (
                        <div key={i} className="group bg-card border border-border rounded-2xl p-6 relative hover:border-primary/50 transition-all shadow-sm hover:shadow-lg">
                            {/* Build Tags */}
                            {/* Build Tags */}
                            <div className="flex items-center gap-4 mb-8">
                                <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-lg text-sm font-black uppercase tracking-wider border border-primary/20">
                                    LVL {build.cLevel}
                                </span>
                                <div className="h-6 w-px bg-border"></div>
                                <div className="flex gap-2">
                                    {build.mode.map(m => (
                                        <span key={m} className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.15em] bg-secondary/50 px-3 py-1.5 rounded-md border border-border">
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full">

                                {/* Left Side: Equipment */}
                                <div className="lg:col-span-6 space-y-5">
                                    <h4 className="flex items-center gap-3 text-foreground/80 text-xs font-bold uppercase tracking-[0.25em]">
                                        <span className="w-1.5 h-1.5 bg-primary rotate-45"></span> Equipment
                                    </h4>

                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <ViewerItemCard item={build.weapons[0]} type="Weapon" />
                                        <ViewerItemCard item={build.armors[0]} type="Armor" />
                                        <ViewerItemCard item={build.weapons[1]} type="Weapon" />
                                        <ViewerItemCard item={build.armors[1]} type="Armor" />
                                    </div>
                                </div>

                                {/* Right Side: Accessory Section */}
                                <div className="lg:col-span-6 space-y-5">
                                    <h4 className="flex items-center gap-3 text-foreground/80 text-xs font-bold uppercase tracking-[0.25em]">
                                        <span className="w-1.5 h-1.5 bg-primary rotate-45"></span> Accessory & Refining
                                    </h4>
                                    <div className="flex flex-wrap gap-3 md:gap-4 items-start">
                                        {build.accessories && build.accessories.length > 0 ? build.accessories.map((acc, idx) => (
                                            <div key={idx} className="flex flex-col gap-2.5 items-center">
                                                {/* Main Accessory */}
                                                <div className="relative w-12 h-12 md:w-14 md:h-14 bg-background border border-border rounded-xl overflow-hidden shadow-sm group-hover:border-primary/50 transition-colors">
                                                    <SafeImage 
                                                        src={`/items/accessory/${acc.image}`} 
                                                        fill 
                                                        className="object-cover" 
                                                        alt="acc" 
                                                        sizes="64px"
                                                    />
                                                </div>
                                                {/* Refining Icon */}
                                                {acc.refined ? (
                                                    <div className="relative w-8 h-8 md:w-10 md:h-10 bg-background/50 border border-cyan-500/30 rounded-lg overflow-hidden shadow-inner flex-shrink-0 animate-in fade-in zoom-in duration-300">
                                                        <SafeImage 
                                                            src={`/items/accessory/${acc.refined}`} 
                                                            fill 
                                                            className="object-cover" 
                                                            alt="refined" 
                                                            sizes="40px"
                                                        />
                                                        <div className="absolute inset-0 ring-1 ring-inset ring-cyan-400/20 rounded-lg"></div>
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 md:w-10 md:h-10 border border-dashed border-border/20 rounded-lg flex items-center justify-center opacity-10">
                                                        <div className="w-0.5 h-0.5 bg-border rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        )) : (
                                            <span className="text-gray-600 text-xs italic">None selected</span>
                                        )}
                                    </div>
                                </div>

                                {/* Minimum Stats - Compact Rows */}
                                {build.minStats && Object.keys(build.minStats).length > 0 && (
                                    <div className="col-span-full pt-6 border-t border-border/30 mb-8">
                                        <h4 className="flex items-center gap-3 text-foreground/80 text-xs font-bold uppercase tracking-[0.25em] mb-4">
                                            <span className="w-1.5 h-1.5 bg-orange-500 rotate-45"></span> Minimum Stats
                                        </h4>
                                        <div className="flex flex-col rounded-2xl overflow-hidden border border-border/40 bg-black/40 max-w-sm">
                                            {MIN_STATS_KEYS.filter(s => build.minStats[s.key]).map((s, idx, arr) => {
                                                return (
                                                    <div 
                                                        key={s.key} 
                                                        className={clsx(
                                                            "flex items-center justify-between px-5 py-2.5 transition-colors hover:bg-white/5",
                                                            idx !== arr.length - 1 && "border-b border-border/10"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-4 h-4 relative flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                                                <SafeImage 
                                                                    src={s.icon} 
                                                                    fill 
                                                                    alt="" 
                                                                    className="object-contain"
                                                                />
                                                            </div>
                                                            <span className="text-xs font-bold text-foreground/70 tracking-tight">{s.label}</span>
                                                        </div>
                                                        <div className="flex items-baseline gap-0.5">
                                                            <span className="text-sm font-black text-foreground">
                                                                {build.minStats[s.key]}
                                                            </span>
                                                            {s.unit && (
                                                                <span className="text-[10px] font-bold text-primary/80">{s.unit}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Row: Substats */}
                                <div className="col-span-full pt-6 border-t border-border/30">
                                    <h4 className="flex items-center gap-3 text-foreground/80 text-xs font-bold uppercase tracking-[0.25em] mb-4">
                                        <span className="w-1.5 h-1.5 bg-primary rotate-45"></span> Substats Priority
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {build.substats && build.substats.length > 0 ? build.substats.map((sub, idx) => (
                                            <span key={idx} className="group/sub relative bg-secondary/30 text-foreground border border-border hover:border-primary px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2.5 shadow-sm transition-colors cursor-default">
                                                <span className="w-4 h-4 rounded bg-background text-primary flex items-center justify-center text-[9px] shadow-sm font-black">{idx + 1}</span>
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
                                <div className="mt-8 pt-6 border-t border-border">
                                    <div className="relative text-muted-foreground text-sm leading-relaxed bg-secondary/20 p-5 rounded-xl border border-border">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl"></div>
                                        <span className="text-primary font-bold mr-2 text-xs uppercase tracking-wider">Note:</span>
                                        {build.note}
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
                            <p>No builds available for this hero yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ViewerItemCard({ item, type }) {
    if (!item?.image) return (
        <div className="bg-secondary/20 border border-border rounded-xl h-20 flex items-center justify-center text-muted-foreground text-[9px] uppercase tracking-widest font-bold">
            Empty Slot
        </div>
    )

    return (
        <div className="bg-card border border-border rounded-xl p-2.5 md:p-3 flex gap-3 md:gap-4 items-center shadow-sm hover:border-primary/50 transition-colors group/card min-h-[72px]">
            <div className="relative w-11 h-11 md:w-12 md:h-12 bg-background rounded-lg flex-shrink-0 overflow-hidden border border-border shadow-sm group-hover/card:border-primary/30 transition-colors">
                <SafeImage 
                    src={`/items/${type.toLowerCase()}/${item.image}`} 
                    fill 
                    className="object-cover" 
                    alt={type} 
                    sizes="56px"
                />
            </div>
            <div className="min-w-0 flex-1">
                <div className={clsx("text-[10px] font-black uppercase leading-none mb-1.5 tracking-wider", type === "Weapon" ? "text-red-400" : "text-blue-400")}>
                    {type}
                </div>
                <div className="text-xs text-foreground font-bold tracking-tight whitespace-normal leading-tight group-hover/card:text-primary transition-colors">
                    {item.stat}
                </div>
            </div>
        </div>
    )
}
