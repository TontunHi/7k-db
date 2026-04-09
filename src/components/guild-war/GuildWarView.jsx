'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Swords, Shield, Video, ExternalLink, Users, Zap, Hash, ArrowRight, ChevronRight, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import SafeImage from '@/components/shared/SafeImage'

import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'
import { resolveHeroImage } from '@/lib/hero-utils'

export default function GuildWarView({ attackers, defenders, heroImageMap, lastUpdated }) {
    const [activeTab, setActiveTab] = useState('attacker')
    const currentTeams = activeTab === 'attacker' ? attackers : defenders
    
    // Theme colors
    const theme = activeTab === 'attacker' ? {
        base: 'red',
        gradientStart: 'from-red-600',
        gradientMid: 'via-red-950',
        gradientEnd: 'to-black',
        textLight: 'text-red-100',
        textAccent: 'text-red-400',
        bgAccent: 'bg-red-500/10',
        borderAccent: 'border-red-500/30',
        shadowAccent: 'shadow-red-500/20',
        glowColor: 'rgba(239, 68, 68, 0.15)',
        icon: <Swords className="w-8 h-8 text-red-500" />
    } : {
        base: 'amber',
        gradientStart: 'from-amber-600',
        gradientMid: 'via-amber-900',
        gradientEnd: 'to-black',
        textLight: 'text-amber-100',
        textAccent: 'text-amber-400',
        bgAccent: 'bg-amber-500/10',
        borderAccent: 'border-amber-500/30',
        shadowAccent: 'shadow-amber-500/20',
        glowColor: 'rgba(245, 158, 11, 0.15)',
        icon: <Shield className="w-8 h-8 text-amber-500" />
    }

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden pb-32">
            {/* War Backdrop Effects */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(20,20,20,0)_25%,rgba(20,20,20,0.8)_50%,rgba(20,20,20,0)_75%)] bg-[size:250px_250px] animate-[pulse_4s_ease-in-out_infinite]" />
                {activeTab === 'attacker' ? (
                    <>
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-rose-700/10 rounded-full blur-[100px]" />
                    </>
                ) : (
                    <>
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-yellow-700/10 rounded-full blur-[100px]" />
                    </>
                )}
            </div>

            <div className="container mx-auto px-4 py-6 relative z-10">
                
                {/* Header Section */}
                <div className={cn(
                    "relative w-full rounded-[2rem] overflow-hidden border bg-gradient-to-br shadow-2xl mb-8 p-8 md:p-12 transition-all duration-700",
                    activeTab === 'attacker' 
                        ? "border-red-500/20 from-gray-950 via-red-950/20 to-black shadow-red-950/20" 
                        : "border-amber-500/20 from-gray-950 via-amber-950/20 to-black shadow-amber-950/20"
                )}
                    style={{ boxShadow: `0 15px 35px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)` }}
                >
                    {/* Noise texture overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    <div className="absolute top-0 right-0 w-2/3 h-full pointer-events-none transition-all duration-700" 
                         style={{ background: `radial-gradient(circle_at_top_right, ${theme.glowColor} 0%, transparent 60%)` }} />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={cn("p-2.5 rounded-xl border backdrop-blur-xl shadow-lg transition-all duration-500", theme.bgAccent, theme.borderAccent)}>
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        {theme.icon}
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className={cn("text-[9px] font-black uppercase tracking-[0.3em] ml-0.5 mb-1", theme.textAccent)}>Tactical Meta</span>
                                    <div className={cn("h-[1.5px] w-12 rounded-full bg-gradient-to-r", activeTab === 'attacker' ? "from-red-500" : "from-amber-500", "to-transparent")} />
                                </div>
                                {lastUpdated && (
                                    <div className={cn("ml-2 px-3 py-1 rounded-lg border backdrop-blur-md transition-all duration-500", theme.bgAccent, theme.borderAccent)}>
                                        <span className={cn("text-[9px] font-black uppercase tracking-widest tabular-nums", theme.textAccent)}>Updated {lastUpdated}</span>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-2xl italic transform -skew-x-1">
                                {activeTab === 'attacker' ? 'ATTACK' : 'DEFENSE'} <span className="text-gray-500/80 uppercase">Teams</span>
                            </h1>
                            <p className="mt-3 text-gray-400 max-w-lg text-sm md:text-base font-medium leading-relaxed opacity-80">
                                Specialized 3-hero setups for {activeTab === 'attacker' ? 'aggressive attack' : 'strategic defense'}.
                            </p>
                        </div>

                        {/* Theme Switcher Toggle - PREMIUM CONSOLE STYLE */}
                        <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner relative group/tabs">
                            <div className={cn(
                                "absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] h-[calc(100%-12px)] transition-all duration-500 rounded-xl",
                                activeTab === 'attacker' ? "left-1.5 bg-red-500/10 border border-red-500/30" : "left-[calc(50%+1.5px)] bg-amber-500/10 border border-amber-500/30"
                            )} />
                            {[
                                { id: 'attacker', label: 'Attack', icon: Swords, color: 'text-red-500' },
                                { id: 'defender', label: 'Defense', icon: Shield, color: 'text-amber-500' }
                            ].map((tab) => {
                                const isActive = activeTab === tab.id
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "relative z-10 px-6 py-3 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300",
                                            isActive ? tab.color : "text-gray-500 hover:text-gray-300"
                                        )}
                                    >
                                        <Icon size={14} className={cn(isActive && "animate-pulse")} />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Teams List - 2 Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                    {currentTeams.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl bg-gray-950/50 backdrop-blur-sm">
                            <Users className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                            <h2 className="text-2xl font-black text-gray-400 mb-2">No Teams Available</h2>
                            <p className="text-gray-600 max-w-md mx-auto">The administrator hasn&apos;t configured any {activeTab} teams for Guild War yet.</p>
                        </div>
                    ) : (
                        currentTeams.map((set, idx) => {
                            // Extract only the actual placed heroes for a sleek 3-slot layout
                            const activeHeroes = []
                            if (set.heroes) {
                                set.heroes.forEach((h, index) => {
                                    if (h) activeHeroes.push({ file: h, originalIndex: index })
                                })
                            }
                            
                            return (
                                <div 
                                    key={set.id} 
                                    className={cn(
                                        "bg-gradient-to-br border rounded-[2rem] overflow-hidden shadow-2xl relative group transition-all duration-500 flex flex-col hover:-translate-y-1",
                                        activeTab === 'attacker' 
                                            ? "from-gray-900/80 to-black/90 border-white/5 hover:border-red-500/30 hover:shadow-red-500/5" 
                                            : "from-gray-900/80 to-black/90 border-white/5 hover:border-amber-500/30 hover:shadow-amber-500/5"
                                    )}
                                    style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)" }}
                                >
                                    {/* Glass reflection effect */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    
                                    <div className="flex flex-col md:flex-row md:items-center justify-between px-7 py-5 border-b border-white/5 bg-white/5 relative gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border shadow-lg transition-all duration-500",
                                                theme.textAccent, theme.bgAccent, theme.borderAccent
                                            )}>
                                                {idx + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={cn("text-[9px] font-black uppercase tracking-[0.2em] mb-0.5", theme.textAccent)}>{activeTab === 'attacker' ? 'Attack' : 'Defense'} Unit</span>
                                                <h3 className="text-lg md:text-xl font-black text-white tracking-wide">
                                                    {set.team_name || `${activeTab === 'attacker' ? 'Team' : 'Def'} ${idx + 1}`}
                                                </h3>
                                            </div>
                                        </div>
                                        
                                        {set.video_url && (
                                            <a 
                                                href={set.video_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className={cn(
                                                    "flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-black transition-all border shadow-lg uppercase tracking-wider group/guide",
                                                    activeTab === 'attacker' ? "bg-red-500/10 hover:bg-red-500/20 text-red-100 border-red-500/30" : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-100 border-amber-500/30"
                                                )}
                                            >
                                                <Video className="w-4 h-4 text-purple-400 group-hover/guide:scale-110 transition-transform" />
                                                Video Guide
                                                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-40" />
                                            </a>
                                        )}
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col gap-6">
                                        {/* Core Setup Row: Formation Grid + Pet */}
                                        <div className="flex items-center gap-6 bg-black/40 p-7 rounded-2xl border border-white/5 shadow-inner relative overflow-hidden group/setup">
                                            {/* Subtle internal glow */}
                                            <div className={cn("absolute inset-0 opacity-0 group-hover/setup:opacity-100 transition-opacity duration-700", activeTab === 'attacker' ? "bg-red-500/5" : "bg-amber-500/5")} />
                                            
                                            {/* 3-Hero Formation Grid Display */}
                                            <div className="flex-1 max-w-[200px] px-6">
                                                <FormationGrid 
                                                    formation={set.formation} 
                                                    heroes={set.heroes} 
                                                    heroImageMap={heroImageMap}
                                                    staggerAmount="lg:translate-y-6"
                                                    hideEmpty={true}
                                                />
                                            </div>

                                            {/* Divider */}
                                            <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-800 to-transparent mx-2 flex-shrink-0" />

                                            {/* Pet Badge - Moved to Right */}
                                            <PetDisplay 
                                                petFile={set.pet_file} 
                                                hideLabel={true}
                                                customClasses={{
                                                    wrapper: cn("border rounded-[1rem] bg-gradient-to-br from-gray-900 to-black shadow-xl", activeTab === 'attacker' ? "border-red-500/20" : "border-amber-500/20"),
                                                    image: "drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                                }}
                                            />
                                        </div>

                                        {/* Skill Rotation */}
                                        <SkillSequence 
                                            skillRotation={set.skill_rotation} 
                                            heroes={set.heroes} 
                                            heroImageMap={heroImageMap}
                                            customClasses={{
                                                wrapper: "mt-0"
                                            }}
                                        />

                                        {/* Countered By Overlay (Defenders only - Hover) */}
                                        {activeTab === 'defender' && set.counters && set.counters.length > 0 && (
                                            <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
                                                    <span className="text-sm font-black uppercase tracking-widest text-red-400">Counter Stratagems</span>
                                                </div>
                                                <div className="flex flex-wrap justify-center gap-3">
                                                    {set.counters.map(attackerId => {
                                                        const attacker = attackers.find(a => a.id === attackerId)
                                                        if (!attacker) return null
                                                        return (
                                                            <div key={attackerId} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 group/counter hover:bg-red-500/20 transition-all border-dashed shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                                                                <span className="text-[10px] font-black text-red-200 uppercase tracking-tighter">
                                                                    {attacker.team_name || `#${attacker.team_index} Attack`}
                                                                </span>
                                                                <div className="flex -space-x-1.5">
                                                                    {(attacker.heroes || []).filter(h => h).map((heroSlug, i) => (
                                                                        <div key={i} className="relative w-8 h-8 rounded-lg border border-black overflow-hidden bg-gray-950 shadow-2xl">
                                                                            <SafeImage 
                                                                                src={`/heroes/${resolveHeroImage(heroSlug, heroImageMap) || heroSlug + '.webp'}`} 
                                                                                alt="" 
                                                                                fill 
                                                                                className="object-cover" 
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Strategy Note */}
                                        {set.note && set.note.trim() !== "" && (
                                            <div className="mt-auto p-4 bg-white/[0.02] border border-white/5 rounded-[1.5rem] relative overflow-hidden group/note">
                                                <div className={cn("absolute top-0 left-0 w-1 h-full", activeTab === 'attacker' ? "bg-red-500/40" : "bg-amber-500/40")} />
                                                <p className="text-gray-400 leading-relaxed text-xs font-medium italic">
                                                    &quot;{set.note}&quot;
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}
