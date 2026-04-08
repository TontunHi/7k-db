'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Swords, Shield, Video, ExternalLink, Users, Zap, Hash, ArrowRight, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'

export default function GuildWarView({ attackers, defenders, heroImageMap }) {
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
                                        {/* Core Setup Row: Formation Grid + Pet */}
                                        <div className="flex items-center gap-4 bg-gray-950/40 p-4 rounded-xl border border-gray-800/40">
                                            
                                            {/* 5-Slot Formation Grid Display */}
                                            <FormationGrid 
                                                formation={set.formation} 
                                                heroes={set.heroes} 
                                                heroImageMap={heroImageMap}
                                                staggerAmount="lg:translate-y-6"
                                            />

                                            {/* Divider */}
                                            <div className="w-px h-12 bg-gray-800/50 mx-2" />

                                            {/* Pet Badge - Moved to Right */}
                                            <PetDisplay 
                                                petFile={set.pet_file} 
                                                hideLabel={true}
                                                customClasses={{
                                                    wrapper: cn("border rounded-lg bg-gradient-to-b from-gray-900 to-black shadow-lg", activeTab === 'attacker' ? "border-red-950/50" : "border-amber-950/50"),
                                                    image: "drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                                                }}
                                            />
                                        </div>

                                        {/* Skill Rotation - Extra Compact */}
                                        <SkillSequence 
                                            skillRotation={set.skill_rotation} 
                                            heroes={set.heroes} 
                                            heroImageMap={heroImageMap}
                                            customClasses={{
                                                wrapper: "mt-0"
                                            }}
                                        />

                                        {/* Strategy Note - Extra Compact */}
                                        {set.note && set.note.trim() !== "" && (
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
