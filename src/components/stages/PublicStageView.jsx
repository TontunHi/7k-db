"use client"

import { useState } from "react"
import Image from "next/image"
import { clsx } from "clsx"
import { Shield, Star, Map, Skull } from "lucide-react"
import { cn } from "@/lib/utils"
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'

const MODES = [
    { id: "stage", label: "Main Stage", icon: Map },
    { id: "nightmare", label: "Nightmare Stage", icon: Skull }
]

export default function PublicStageView({ initialStages, initialNightmares }) {
    const [mode, setMode] = useState("stage") // "stage" or "nightmare"

    const [searchQuery, setSearchQuery] = useState("")

    const baseData = mode === "stage" ? initialStages : initialNightmares
    
    // Filter and Sort Data
    const currentData = baseData
        .filter(stage => stage.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name))

    const ThemeIcon = mode === "stage" ? Map : Skull

    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full bg-[#050505] overflow-hidden font-sans">
            {/* Background Effects (Consistent with Tierlist) */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#FFD700] opacity-10 blur-[100px]"></div>
                <div className={cn(
                    "absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full blur-[120px] transition-colors duration-700",
                    mode === "stage" ? "bg-blue-900/20" : "bg-red-900/20"
                )}></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 pb-32">

                {/* Header Highlight */}
                <div className="text-center mb-12 space-y-6">
                    <div className="inline-block relative group">
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight uppercase italic transform -skew-x-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                            STAGE <span className={cn(
                                "text-transparent bg-clip-text bg-gradient-to-r transition-colors duration-500",
                                mode === "stage" 
                                    ? "from-[#FFD700] via-[#FDB931] to-[#FFA500]" 
                                    : "from-[#FF0000] via-[#FF4444] to-[#800000]"
                            )}>STRATEGY</span>
                        </h1>
                        <div className={cn(
                            "absolute -bottom-2 w-full h-1 bg-gradient-to-r transform -skew-x-12 transition-all duration-300 group-hover:w-[120%] group-hover:-left-[10%]",
                            mode === "stage" 
                                ? "from-[#FFD700] to-[#FFA500] shadow-[0_0_15px_#FFD700]" 
                                : "from-[#FF0000] to-[#800000] shadow-[0_0_15px_#FF0000]"
                        )}></div>
                    </div>

                    <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide leading-relaxed mt-6">
                        Optimized team compositions for <strong className="text-white">efficient clearing</strong>.
                        <br />
                        Dominate the <span className={mode === "stage" ? "text-[#FFD700]" : "text-red-500"}>
                            {MODES.find(m => m.id === mode)?.label}
                        </span> with these guides.
                    </p>
                </div>

                {/* Mode Toggles & Search */}
                <div className="flex flex-col items-center gap-8 mb-16">
                    {/* Search Bar */}
                    <div className="w-full max-w-md relative group">
                        <div className={cn(
                            "absolute inset-0 blur-lg opacity-20 transition-opacity group-hover:opacity-40",
                            mode === "stage" ? "bg-[#FFD700]" : "bg-red-500"
                        )}></div>
                        <input
                            type="text"
                            placeholder="Search stage..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "w-full bg-[#080808]/80 backdrop-blur-md border rounded-xl px-6 py-4 text-center text-lg font-bold text-white uppercase tracking-wider outline-none transition-all placeholder:text-gray-700",
                                mode === "stage"
                                    ? "border-gray-800 focus:border-[#FFD700] focus:shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                                    : "border-gray-800 focus:border-red-500 focus:shadow-[0_0_30px_rgba(220,38,38,0.2)]"
                            )}
                        />
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap justify-center gap-6 p-1">
                        {MODES.map((m) => {
                            const Icon = m.icon
                            const isActive = mode === m.id
                            const isDanger = m.id === "nightmare"
                            
                            return (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m.id)}
                                    className={clsx(
                                        "group relative px-8 py-4 uppercase font-black tracking-[0.2em] text-sm transition-all duration-300 transform",
                                        "border clip-path-polygon hover:scale-105 active:scale-95 flex items-center gap-3",
                                        isActive
                                            ? isDanger 
                                                ? "border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_30px_rgba(255,0,0,0.15)]"
                                                : "border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.15)]"
                                            : "border-gray-800 bg-black/60 text-gray-500 hover:border-gray-500 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {/* Corner Accents */}
                                    <span className={clsx("absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-colors duration-300", 
                                        isActive ? (isDanger ? "border-red-500" : "border-[#FFD700]") : "border-gray-600 group-hover:border-white"
                                    )}></span>
                                    <span className={clsx("absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-colors duration-300", 
                                        isActive ? (isDanger ? "border-red-500" : "border-[#FFD700]") : "border-gray-600 group-hover:border-white"
                                    )}></span>

                                    <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                                    {m.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {currentData.map(stage => (
                        <PublicStageCard key={stage.id} stage={stage} isNightmare={mode === "nightmare"} />
                    ))}
                    {currentData.length === 0 && (
                        <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl bg-white/[0.02]">
                            <p className="text-gray-500 text-lg uppercase tracking-widest">
                                {searchQuery ? "No stages found matching filter" : "No guides available yet"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Note */}
                <div className="text-center pt-12 border-t border-gray-800/50 mt-16">
                    <p className="text-gray-500 text-xs tracking-[0.2em] uppercase font-bold opacity-60">
                        Seven Knights 2 Rebirth Database • Community Driven Project
                    </p>
                </div>
            </div>
        </div>
    )
}

function PublicStageCard({ stage, isNightmare }) {
    if (!stage) return null;

    return (
        <div className={cn(
            "group relative bg-[#080808] border rounded-sm overflow-hidden transition-all duration-300 hover:translate-y-[-4px]",
            isNightmare 
                ? "border-red-900/30 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]" 
                : "border-gray-800 hover:border-[#FFD700]/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]"
        )}>
            {/* Top Gradient Line */}
            <div className={cn(
                "absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500",
                isNightmare ? "via-red-600" : "via-[#FFD700]"
            )}></div>

            {/* Header */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800/50 bg-white/[0.02]">
                <div>
                    <h3 className={cn(
                        "text-2xl md:text-3xl font-black uppercase tracking-tight italic transform -skew-x-6",
                        isNightmare ? "text-red-500" : "text-[#FFD700]"
                    )}>
                        {stage.name}
                    </h3>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gray-700"></span>
                        Updated: {new Date(stage.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                </div>
                    <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-sm border-l-2 border-gray-700 max-w-xl text-sm italic text-gray-400">
                        &quot;{stage.note}&quot;
                    </div>
            </div>

            {/* Teams */}
            <div className="p-6 md:p-8 grid grid-cols-1 xl:grid-cols-2 gap-8 divide-y xl:divide-y-0 xl:divide-x divide-gray-800/50">
                {stage.teams.map((team, idx) => (
                    <div key={team.index || idx} className="space-y-6 pt-8 xl:pt-0 first:pt-0 pl-0 xl:first:pl-0 xl:pl-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={cn(
                                "px-3 py-1 rounded-sm font-bold text-xs uppercase tracking-wider",
                                isNightmare ? "bg-red-900/20 text-red-400 border border-red-900/50" : "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/30"
                            )}>
                                Team {team.index}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide">
                                <Shield className="w-3 h-3" /> Formation: <span className="text-white">{team.formation.replace("-", " - ")}</span>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Heroes */}
                            <FormationGrid 
                                formation={team.formation} 
                                heroes={team.heroes} 
                                staggerAmount="translate-y-8"
                                customClasses={{
                                    container: "grid grid-cols-5 gap-3 pb-8 max-w-full",
                                    emptyRender: ({isFront}) => (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-800 text-xs font-mono">EMPTY</div>
                                    ),
                                    cardString: "bg-black border aspect-[3/4] rounded-sm overflow-hidden transition-all duration-300 group/hero shadow-none",
                                    image: "group-hover/hero:scale-110",
                                    renderOverlay: ({isFront, type, heroFile}) => (
                                        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover/hero:animate-shine" />
                                    )
                                }}
                            />

                            {/* Pet */}
                            <div className="self-start mt-2 border border-gray-800 rounded-sm bg-black/40 relative">
                                <PetDisplay 
                                    petFile={team.pet_file} 
                                    hideLabel={true}
                                    customClasses={{
                                        container: "items-center justify-center p-4 relative group/pet",
                                        wrapper: "w-16 h-16 border-none bg-transparent shadow-none group-hover/pet:scale-110 duration-300",
                                        image: "drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] p-0",
                                        emptyText: "text-2xl font-black text-gray-800"
                                    }}
                                />
                                <span className="absolute -top-2.5 ml-2 bg-[#080808] px-2 text-[10px] font-bold uppercase text-gray-500 tracking-[0.2em] flex items-center gap-1 z-10 block w-max">
                                    <Star className="w-3 h-3 text-[#FFD700]" /> Pet
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
