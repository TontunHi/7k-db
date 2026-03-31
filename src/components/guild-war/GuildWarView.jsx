'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Swords, Shield, Video, ExternalLink, Users, Zap, Hash, ArrowRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

function getSkillImagePath(heroFilename, skillNumber) {
    if (!heroFilename) return null
    const folderName = heroFilename.replace('.png', '')
    return `/skills/${folderName}/${skillNumber}.png`
}

function getSlotType(formation, index) {
    if (!formation) return 'neutral'
    
    if (formation === '1-4') {
        if (index === 2) return 'front'
        return 'back'
    }
    if (formation === '4-1') {
        if (index === 2) return 'back'
        return 'front'
    }
    if (formation === '2-3') {
        if (index === 1 || index === 3) return 'front'
        return 'back'
    }
    if (formation === '3-2') {
        if (index === 1 || index === 3) return 'back'
        return 'front'
    }
    
    const [front] = formation.split('-').map(Number)
    if (index < front) return 'front'
    return 'back'
}

function getStaggerClass(formation, index) {
    if (!formation) return ''
    
    // Front members drop down slightly to create a staggered arrow/wedge look
    if (formation === '1-4') {
        if ([0, 1, 3, 4].includes(index)) return 'lg:translate-y-6'
    }
    if (formation === '2-3') {
        if ([0, 2, 4].includes(index)) return 'lg:translate-y-6'
    }
    if (formation === '3-2') {
        if ([1, 3].includes(index)) return 'lg:translate-y-6'
    }
    if (formation === '4-1') {
        if (index === 2) return 'lg:translate-y-6'
    }
    return ''
}

export default function GuildWarView({ attackers, defenders }) {
    const [activeTab, setActiveTab] = useState('attacker')
    const currentTeams = activeTab === 'attacker' ? attackers : defenders
    
    // Theme colors
    const theme = activeTab === 'attacker' ? {
        base: 'red',
        gradientStart: 'from-red-600',
        gradientMid: 'via-red-900',
        gradientEnd: 'to-black',
        textLight: 'text-red-100',
        textAccent: 'text-red-400',
        bgAccent: 'bg-red-500/20',
        borderAccent: 'border-red-500/30',
        shadowAccent: 'shadow-red-500/20',
        icon: <Swords className="w-8 h-8 text-red-500" />
    } : {
        base: 'amber',
        gradientStart: 'from-amber-600',
        gradientMid: 'via-amber-900',
        gradientEnd: 'to-black',
        textLight: 'text-amber-100',
        textAccent: 'text-amber-400',
        bgAccent: 'bg-amber-500/20',
        borderAccent: 'border-amber-500/30',
        shadowAccent: 'shadow-amber-500/20',
        icon: <Shield className="w-8 h-8 text-amber-500" />
    }

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden pb-24">
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

            <div className="container mx-auto px-4 py-8 relative z-10">
                
                {/* Header Section */}
                <div className={cn(
                    "relative w-full rounded-3xl overflow-hidden border bg-gradient-to-br shadow-2xl mb-10 p-10 md:p-14 transition-all duration-700",
                    activeTab === 'attacker' ? "border-red-900/50 from-gray-950 via-red-950/40 to-black" : "border-amber-900/50 from-gray-950 via-amber-950/40 to-black"
                )}>
                    <div className="absolute -top-24 -right-24 opacity-5 pointer-events-none transform rotate-12 scale-150">
                        {activeTab === 'attacker' ? <Swords size={400} /> : <Shield size={400} />}
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={cn("p-2 rounded-xl border backdrop-blur-md", theme.bgAccent, theme.borderAccent)}>
                                    {theme.icon}
                                </div>
                                <span className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border", theme.textAccent, theme.bgAccent, theme.borderAccent)}>
                                    Guild War Meta
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight drop-shadow-2xl">
                                {activeTab === 'attacker' ? 'ATTACK TEAMS' : 'DEFENSE TEAMS'}
                            </h1>
                            <p className="mt-3 text-gray-400 max-w-lg text-base font-medium">
                                Dominate the battlefield. Deploy the absolute best 3-hero setups tailored specifically for Guild War {activeTab} strategies.
                            </p>
                        </div>

                        {/* Theme Switcher Toggle - TECH STYLE */}
                        <div className="flex justify-center gap-4 p-1 shrink-0">
                            {[
                                { id: 'attacker', label: 'Attackers', icon: Swords },
                                { id: 'defender', label: 'Defenders', icon: Shield }
                            ].map((tab) => {
                                const isActive = activeTab === tab.id
                                const Icon = tab.icon
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "group relative px-6 py-3 uppercase font-black tracking-[0.2em] text-xs transition-all duration-300 transform",
                                            "border clip-path-polygon hover:scale-105 active:scale-95 flex items-center gap-2",
                                            isActive
                                                ? (tab.id === 'attacker' 
                                                    ? "border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_30px_rgba(255,0,0,0.15)]"
                                                    : "border-amber-500 bg-amber-500/10 text-amber-500 shadow-[0_0_30px_rgba(255,215,0,0.15)]")
                                                : "border-gray-800 bg-black/60 text-gray-500 hover:border-gray-500 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        <span className={cn("absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 transition-colors duration-300", 
                                            isActive ? (tab.id === 'attacker' ? "border-red-500" : "border-amber-500") : "border-gray-600 group-hover:border-white"
                                        )}></span>
                                        <span className={cn("absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 transition-colors duration-300", 
                                            isActive ? (tab.id === 'attacker' ? "border-red-500" : "border-amber-500") : "border-gray-600 group-hover:border-white"
                                        )}></span>
                                        <Icon className={cn("w-4 h-4", isActive && "animate-pulse")} />
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
                            <p className="text-gray-600 max-w-md mx-auto">The administrator hasn't configured any {activeTab} teams for Guild War yet.</p>
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
                                        "bg-gradient-to-br border rounded-2xl overflow-hidden shadow-xl relative group transition-all duration-500 flex flex-col",
                                        activeTab === 'attacker' 
                                            ? "from-gray-950 to-black border-red-900/20 hover:border-red-500/40" 
                                            : "from-gray-950 to-black border-amber-900/20 hover:border-amber-500/40"
                                    )}
                                >
                                    {/* Glass reflection effect */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    
                                    <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-gray-800/80 bg-black/60 relative gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm border shadow-md",
                                                theme.textAccent, theme.bgAccent, theme.borderAccent
                                            )}>
                                                {idx + 1}
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="text-base md:text-lg font-black text-white tracking-wide">
                                                    {set.team_name || `${activeTab === 'attacker' ? 'Team' : 'Def'} ${idx + 1}`}
                                                </h3>
                                            </div>
                                        </div>
                                        
                                        {set.video_url && (
                                            <a 
                                                href={set.video_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-white rounded-lg text-xs font-bold transition-all border border-gray-700"
                                            >
                                                <Video className="w-3.5 h-3.5 text-purple-400" />
                                                Video Guide
                                                <ExternalLink className="w-3 h-3 ml-0.5 text-gray-400" />
                                            </a>
                                        )}
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col gap-4">
                                        {/* Core Setup Row: Pet + 5-Slot Formation Grid */}
                                        <div className="flex items-center gap-4 bg-gray-950/40 p-4 rounded-xl border border-gray-800/40">
                                            
                                            {/* Pet Badge - Compact */}
                                            <div className="flex flex-col items-center shrink-0">
                                                <div className={cn(
                                                    "relative w-16 h-16 flex items-center justify-center rounded-lg border bg-gradient-to-b from-gray-900 to-black shadow-lg",
                                                    activeTab === 'attacker' ? "border-red-950" : "border-amber-950"
                                                )}>
                                                    {set.pet_file ? (
                                                        <Image src={set.pet_file} alt="Pet" fill className="object-contain p-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <span className="text-gray-700 text-[10px] font-bold">-</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="w-px h-12 bg-gray-800/50" />
                                            
                                            {/* 5-Slot Formation Grid Display */}
                                            <div className="flex-1 grid grid-cols-5 gap-1.5 max-w-[280px]">
                                                {[0, 1, 2, 3, 4].map((i) => {
                                                    const hFile = set.heroes?.[i]
                                                    const positionType = getSlotType(set.formation, i)
                                                    const staggerLevel = getStaggerClass(set.formation, i)
                                                    const isFront = positionType === 'front'

                                                    return (
                                                        <div 
                                                            key={i} 
                                                            className={cn(
                                                                "relative aspect-[3/4] rounded-lg overflow-hidden border-2 flex flex-col transition-all duration-500 shadow-lg",
                                                                staggerLevel,
                                                                hFile 
                                                                    ? (isFront 
                                                                        ? "border-sky-500/70 bg-sky-950/20" 
                                                                        : "border-rose-600/70 bg-rose-950/20")
                                                                    : "border-gray-800/40 border-dashed bg-black/20"
                                                            )}
                                                        >
                                                            {hFile && (
                                                                <>
                                                                    <div className="relative flex-1">
                                                                        <Image
                                                                            src={`/heroes/${hFile}`}
                                                                            alt="Hero"
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                                                                    </div>
                                                                </>
                                                            )}
                                                            {!hFile && (
                                                                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                                                    <div className={cn(
                                                                        "w-1.5 h-1.5 rounded-full",
                                                                        isFront ? "bg-sky-500" : "bg-gray-600"
                                                                    )} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Skill Rotation - Extra Compact */}
                                        {set.skill_rotation?.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 px-1">
                                                    <Zap className={cn("w-3 h-3", theme.textAccent)} />
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Skill Sequence</span>
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-1.5 w-full bg-black/40 rounded-xl border border-gray-800/30 p-3">
                                                    {set.skill_rotation.map((slot, sIdx) => {
                                                        const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                                        const hFile = set.heroes?.[hIdx]
                                                        const sPath = slot.skill ? getSkillImagePath(hFile, sNum) : null
                                                        const isLast = sIdx === set.skill_rotation.length - 1;
                                                        const displayLabel = slot.label || String(sIdx + 1);

                                                        return (
                                                            <div key={sIdx} className="flex items-center gap-1">
                                                                <div className="flex flex-col items-center group/skill p-0.5 bg-gray-900/90 rounded-lg border border-gray-800 hover:bg-gray-800 transition-all duration-300 relative">
                                                                    <div className={cn(
                                                                        "absolute -top-1.5 -left-1.5 min-w-[16px] h-4 px-1 text-white rounded-full flex items-center justify-center text-[8px] font-black border border-black z-10 shadow-lg",
                                                                        activeTab === 'attacker' ? "bg-gradient-to-br from-red-500 to-rose-700" : "bg-gradient-to-br from-amber-500 to-orange-600"
                                                                    )}>
                                                                        {displayLabel}
                                                                    </div>
                                                                    <div className={cn(
                                                                        "relative w-9 h-9 rounded-md overflow-hidden border bg-gray-950",
                                                                        activeTab === 'attacker' ? "border-gray-800" : "border-gray-800"
                                                                    )}>
                                                                        {hFile && sPath ? (
                                                                            <Image src={sPath} alt="" fill className="object-cover" />
                                                                        ) : (
                                                                            <div className="w-full h-full flex items-center justify-center text-gray-800 text-[10px] font-bold">-</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                {!isLast && <ArrowRight size={8} className="text-gray-900 opacity-50" />}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Strategy Note - Extra Compact */}
                                        {set.note && (
                                            <div className="mt-auto p-3 bg-white/[0.02] border border-gray-800/30 rounded-lg relative">
                                                <p className="text-gray-500 leading-snug text-[11px] italic line-clamp-3">
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
