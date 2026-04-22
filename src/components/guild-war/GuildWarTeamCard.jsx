'use client'

import { useState } from 'react'
import { 
    ChevronDown, ChevronUp, Zap, Briefcase, ShieldAlert, 
    Video, ExternalLink, Info, CheckCircle2, Layout, Swords, Box,
    Shield, Target, Activity, Search, LayoutGrid, PawPrint
} from 'lucide-react'
import { cn } from '@/lib/utils'
import SafeImage from '@/components/shared/SafeImage'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import { resolveHeroImage } from '@/lib/hero-utils'
import { getSkillImagePath, getSlotType, getStaggerClass } from '@/lib/formation-utils'

export default function GuildWarTeamCard({ team, heroImageMap, index }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Layout, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        { id: 'equipment', label: 'Equipment', icon: Briefcase, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { id: 'skills', label: 'Rotation', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { id: 'counters', label: 'Counters', icon: ShieldAlert, color: 'text-rose-400', bg: 'bg-rose-500/10', count: team.counter_teams?.length || 0 },
    ]

    return (
        <div className={cn(
            "group relative transition-all duration-700 ease-in-out",
            isExpanded ? "mb-12" : "mb-4"
        )}>
            {/* Main Container */}
            <div className={cn(
                "relative overflow-hidden rounded-[2.5rem] transition-all duration-500",
                "bg-[#0a0a0c] border border-white/5",
                isExpanded ? "shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8),0_0_40px_rgba(99,102,241,0.05)] border-indigo-500/20" : "hover:border-white/10"
            )}>
                {/* Background Glow when expanded */}
                <div className={cn(
                    "absolute -top-[50%] -right-[20%] w-[80%] h-[150%] rounded-full blur-[120px] transition-opacity duration-1000 pointer-events-none",
                    isExpanded ? "bg-indigo-500/5 opacity-100" : "opacity-0"
                )} />

                {/* --- HEADER (Persistent Summary) --- */}
                <div 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="relative z-10 cursor-pointer transition-colors hover:bg-white/[0.015]"
                >
                    {/* Collapsed Hero Banner */}
                    {!isExpanded && (
                        <div className="relative overflow-hidden">
                            {/* Subtle top accent line */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
                            
                            <div className="flex items-stretch min-h-[96px]">
                                {/* Hero Portraits — full height, side by side */}
                                <div className="flex-1 flex items-center">
                                    {(team.heroes || []).filter(h => h).map((hero, i, arr) => (
                                        <div 
                                            key={i} 
                                            className="relative flex-1 min-w-0" 
                                            style={{ maxWidth: `${100 / Math.max(arr.length, 3)}%` }}
                                        >
                                            <div className="relative w-full h-24 overflow-hidden">
                                                <SafeImage src={`/heroes/${hero}`} alt="" fill className="object-cover object-[center_30%] scale-110" />
                                                {/* Gradient overlay — fade right to blend into card content */}
                                                {i === arr.length - 1 && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0c]" />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/60 to-transparent" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Team info — right side */}
                                <div className="flex-shrink-0 w-auto flex flex-col justify-center px-6 gap-2 min-w-[180px]">
                                    <div className="flex items-center gap-2">
                                        {team.type && team.type !== 'general' && (
                                            <span className={cn(
                                                "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                                team.type === 'attacker' 
                                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                                                    : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                                            )}>
                                                {team.type}
                                            </span>
                                        )}
                                        {team.formation && (
                                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                                                {team.formation}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                                        {team.team_name || 'Unnamed Formation'}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        {team.pet_file && (
                                            <div className="relative w-6 h-6 rounded-lg border border-white/10 bg-black/40 overflow-hidden">
                                                <SafeImage src={team.pet_file.startsWith('/') ? team.pet_file : `/pets/${team.pet_file}`} alt="" fill className="object-contain p-0.5" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Expand chevron */}
                                <div className="flex-shrink-0 flex items-center pr-6">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 text-gray-500 group-hover:border-white/20 transition-all">
                                        <ChevronDown size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Expanded header — team name + tab bar */}
                    {isExpanded && (
                        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 mb-1">
                                    {team.type && team.type !== 'general' && (
                                        <span className={cn(
                                            "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                            team.type === 'attacker' 
                                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                                                : "bg-sky-500/10 text-sky-400 border-sky-500/20"
                                        )}>
                                            {team.type}
                                        </span>
                                    )}
                                    {team.formation && (
                                        <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                                            {team.formation}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                                    {team.team_name || 'Unnamed Formation'}
                                </h3>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden lg:flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-white/5">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setActiveTab(tab.id)
                                            }}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                activeTab === tab.id 
                                                    ? "bg-white text-black shadow-xl" 
                                                    : "text-gray-500 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            <tab.icon size={14} />
                                            {tab.label}
                                            {tab.count !== undefined && tab.count > 0 && (
                                                <span className="ml-1 opacity-50">({tab.count})</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                                
                                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white bg-white text-black rotate-180 transition-all duration-500">
                                    <ChevronDown size={18} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- EXPANDED CONTENT --- */}
                {isExpanded && (
                    <div className="relative z-10 border-t border-white/5 animate-fade-in">
                        
                        {/* Mobile/Tablet Tab Switcher */}
                        <div className="flex lg:hidden overflow-x-auto no-scrollbar border-b border-white/5 bg-black/20">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex-1 flex flex-col items-center gap-2 px-6 py-4 transition-all min-w-[100px]",
                                        activeTab === tab.id ? "bg-white/[0.02]" : "opacity-40"
                                    )}
                                >
                                    <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? tab.color : "text-white")} />
                                    <span className={cn("text-[9px] font-black uppercase tracking-tighter", activeTab === tab.id ? "text-white" : "text-gray-500")}>
                                        {tab.label}
                                    </span>
                                    {activeTab === tab.id && (
                                        <div className={cn("absolute bottom-0 left-0 right-0 h-0.5", tab.id === 'overview' ? 'bg-indigo-500' : tab.id === 'equipment' ? 'bg-amber-500' : tab.id === 'skills' ? 'bg-purple-500' : 'bg-rose-500')} />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="p-6 sm:p-10">
                            {/* TAB CONTENT: OVERVIEW */}
                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-slide-up">
                                    {/* Formation Card */}
                                    <div className="xl:col-span-7 bg-white/[0.01] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group/form">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/50 to-transparent opacity-30" />
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                                <LayoutGrid size={16} className="text-indigo-400" />
                                            </div>
                                            <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Formation</h4>
                                        </div>
                                        
                                            <div className="relative py-10 px-4 flex items-center justify-center min-h-[280px]">
                                                <div className="grid grid-cols-5 gap-2 sm:gap-4 max-w-[450px] w-full">
                                                    {[0, 1, 2, 3, 4].map(slotIdx => {
                                                        const heroFile = team.heroes?.[slotIdx]
                                                        const type = getSlotType(team.formation, slotIdx)
                                                        const isFront = type === 'front'
                                                        const stagger = getStaggerClass(team.formation, slotIdx)
                                                        
                                                        return (
                                                            <div key={slotIdx} className={cn(
                                                                "relative aspect-[3/4] transition-all duration-500",
                                                                stagger,
                                                                heroFile 
                                                                    ? (isFront ? "rounded-2xl border border-sky-500/30 bg-sky-500/10 shadow-lg shadow-sky-500/5 overflow-hidden" : "rounded-2xl border border-rose-500/30 bg-rose-500/10 shadow-lg shadow-rose-500/5 overflow-hidden")
                                                                    : "opacity-0 pointer-events-none"
                                                            )}>
                                                                {heroFile && (
                                                                    <div className="relative flex-1 w-full h-full">
                                                                        <SafeImage src={`/heroes/${heroFile}`} alt="" fill className="object-cover" />
                                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                    </div>

                                    {/* Side Info Panel */}
                                    <div className="xl:col-span-5 flex flex-col gap-6">
                                        {/* Pet Bento Box */}
                                        <div className="bg-white/[0.01] border border-white/5 rounded-[2rem] p-6">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                                    <PawPrint size={16} className="text-purple-400" />
                                                </div>
                                                <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Pet</h4>
                                            </div>
                                            
                                             <div className="flex flex-col items-center gap-4 w-full">
                                                <div className="relative group/main-pet">
                                                    <PetDisplay 
                                                        petFile={team.pet_file ? (team.pet_file.startsWith('/') ? team.pet_file : `/pets/${team.pet_file}`) : null} 
                                                        hideLabel={true}
                                                        customClasses={{
                                                            wrapper: "w-28 h-28 border-indigo-500/20 bg-indigo-500/5 shadow-2xl ring-1 ring-white/5",
                                                            image: "p-4"
                                                        }}
                                                    />
                                                </div>
                                                
                                                {/* Compact Supports */}
                                                {team.pet_supports && team.pet_supports.filter(p => p).length > 0 && (
                                                    <div className="flex items-center justify-center gap-2">
                                                        {team.pet_supports.filter(p => p).map((p, i) => (
                                                            <div key={i} className="relative w-10 h-10 rounded-xl border border-white/5 bg-black/40 p-2 shadow-xl hover:border-indigo-500/30 transition-colors">
                                                                <SafeImage src={p.startsWith('/') ? p : `/pets/${p}`} alt="" fill className="object-contain p-1" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Analyst Notes */}
                                        {team.note && (
                                            <div className="flex-1 bg-indigo-500/[0.02] border border-indigo-500/10 rounded-[2rem] p-8 flex flex-col justify-center relative overflow-hidden">
                                                <Info size={40} className="absolute -bottom-2 -right-2 text-indigo-500/5 rotate-12" />
                                                <p className="text-indigo-200/80 text-sm leading-relaxed italic relative z-10 text-center">
                                                    "{team.note}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAB CONTENT: EQUIPMENT */}
                            {activeTab === 'equipment' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
                                    {((team.selection_order && team.selection_order.length > 0) ? team.selection_order : (team.heroes || []).map((h, i) => h ? i : null).filter(idx => idx !== null)).slice(0, 3).map((slotIdx, heroIdx) => {
                                        const heroFile = team.heroes?.[slotIdx]
                                        const itemSet = team.items?.[heroIdx]
                                        if (!heroFile || !itemSet) return null
                                        const heroName = heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^\/.]+$/, '').replace(/_/g, ' ')

                                        return (
                                            <div key={heroIdx} className="group/hcard relative bg-[#0d0d10] border border-white/5 rounded-[2.5rem] p-6 overflow-hidden transition-all hover:border-amber-500/20">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full opacity-0 group-hover/hcard:opacity-100 transition-opacity" />
                                                
                                                <div className="flex flex-col items-center text-center mb-6">
                                                    <div className="relative w-28 h-28 mb-4">
                                                        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent rounded-full blur-xl opacity-0 group-hover/hcard:opacity-100 transition-opacity" />
                                                        <SafeImage src={`/heroes/${heroFile}`} alt={heroName} fill className="object-contain relative z-10 group-hover/hcard:scale-110 transition-transform duration-700" />
                                                    </div>
                                                    <h5 className="text-base font-black text-white uppercase tracking-tight leading-tight">{heroName}</h5>
                                                    <div className="w-10 h-[2px] bg-amber-500/30 rounded-full mt-3" />
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className={cn("relative aspect-square rounded-2xl border flex items-center justify-center bg-black/40 shadow-inner overflow-hidden", itemSet.weapon ? "border-red-500/20" : "border-white/5")}>
                                                            {itemSet.weapon ? <SafeImage src={`/items/weapon/${itemSet.weapon}`} alt="" fill className="object-contain p-6" /> : <Box size={16} className="opacity-10" />}
                                                        </div>
                                                        <div className={cn("relative aspect-square rounded-2xl border flex items-center justify-center bg-black/40 shadow-inner overflow-hidden", itemSet.armor ? "border-blue-500/20" : "border-white/5")}>
                                                            {itemSet.armor ? <SafeImage src={`/items/armor/${itemSet.armor}`} alt="" fill className="object-contain p-6" /> : <Box size={16} className="opacity-10" />}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[0, 1, 2].map(idx => (
                                                            <div key={idx} className={cn("relative aspect-square rounded-xl border flex items-center justify-center bg-black/40 shadow-inner overflow-hidden", itemSet.accessories?.[idx] ? "border-amber-500/20" : "border-white/5")}>
                                                                {itemSet.accessories?.[idx] ? <SafeImage src={`/items/accessory/${itemSet.accessories[idx]}`} alt="" fill className="object-contain p-5" /> : <div className="w-1 h-1 rounded-full bg-white/10" />}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {itemSet.note && (
                                                    <div className="mt-6 pt-5 border-t border-white/5">
                                                        <p className="text-[10px] text-gray-400 italic leading-relaxed text-center group-hover/hcard:text-amber-200/60 transition-colors">
                                                            {itemSet.note}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {/* TAB CONTENT: ROTATION */}
                            {activeTab === 'skills' && (
                                <div className="animate-slide-up">
                                    <div className="bg-[#0d0d10] border border-white/5 rounded-[2.5rem] p-8 sm:p-12">
                                        <div className="flex flex-wrap items-center justify-center gap-y-12 gap-x-4 sm:gap-x-12">
                                            {(team.skill_rotation || []).map((slot, sIdx) => {
                                                const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                                const hFile = team.heroes?.[hIdx]
                                                const sPath = slot.skill ? getSkillImagePath(hFile, sNum) : null
                                                const isLast = sIdx === (team.skill_rotation.length - 1)

                                                return (
                                                    <div key={sIdx} className="flex items-center gap-4 sm:gap-12">
                                                        <div className="flex flex-col items-center group/skill">
                                                            <div className="relative mb-4">
                                                                <div className="absolute -inset-2 bg-purple-500/10 rounded-[2rem] blur opacity-0 group-hover/skill:opacity-100 transition-opacity" />
                                                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] overflow-hidden border-2 border-white/5 bg-black shadow-2xl group-hover/skill:border-purple-500/40 group-hover/skill:scale-105 transition-all duration-500">
                                                                    {sPath ? <SafeImage src={sPath} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-800 text-2xl font-black">?</div>}
                                                                </div>
                                                                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-black shadow-xl ring-4 ring-[#0d0d10]">
                                                                    {sIdx + 1}
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover/skill:text-purple-400 transition-colors">
                                                                {slot.label || ""}
                                                            </span>
                                                        </div>
                                                        {!isLast && (
                                                            <div className="hidden sm:block">
                                                                <div className="w-12 h-[1px] bg-gradient-to-r from-purple-500/20 to-transparent" />
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB CONTENT: COUNTERS */}
                            {activeTab === 'counters' && (
                                <div className="space-y-8 animate-slide-up">
                                    {/* Specific Counter Targets List */}
                                    {team.counters && team.counters.length > 0 && (
                                        <div className="bg-rose-500/5 border border-rose-500/10 rounded-[2rem] p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                                    <Target size={16} className="text-rose-400" />
                                                </div>
                                                <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Primary Targets</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-4">
                                                {team.counters.map((target, tIdx) => (
                                                    <div key={tIdx} className="flex items-center gap-3 bg-black/40 border border-white/5 pr-4 rounded-xl overflow-hidden">
                                                        <div className="relative w-10 h-10 border-r border-white/5">
                                                            <SafeImage src={`/heroes/${target}`} alt="" fill className="object-cover" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                            {target.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^\/.]+$/, '').replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-6">
                                        {!team.counter_teams || team.counter_teams.length === 0 ? (
                                            <div className="py-20 flex flex-col items-center justify-center bg-black/20 rounded-[2.5rem] border border-dashed border-white/5">
                                                <Shield className="w-12 h-12 text-gray-800 mb-4" />
                                                <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">No adaptive counters cataloged</p>
                                            </div>
                                        ) : (
                                            (team.counter_teams || []).map((ct, ctIdx) => (
                                                <CounterTeamModule key={ctIdx} ct={ct} heroImageMap={heroImageMap} />
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function CounterTeamModule({ ct, heroImageMap }) {
    const [isCollapsed, setIsCollapsed] = useState(true)
    
    return (
        <div className={cn(
            "rounded-[2rem] overflow-hidden transition-all duration-500",
            "bg-[#0a0a0c] border border-white/5 hover:border-rose-500/20",
            !isCollapsed && "ring-1 ring-rose-500/10"
        )}>
            {/* Collapsed Banner */}
            <div 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="cursor-pointer hover:bg-white/[0.015] transition-colors"
            >
                {/* Subtle top accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-500/20 to-transparent pointer-events-none" />
                
                <div className="flex items-stretch min-h-[80px]">
                    {/* Hero Portraits */}
                    <div className="flex-1 flex items-center">
                        {(ct.heroes || []).filter(h => h).map((hero, i, arr) => (
                            <div
                                key={i}
                                className="relative flex-1 min-w-0"
                                style={{ maxWidth: `${100 / Math.max(arr.length, 3)}%` }}
                            >
                                <div className="relative w-full h-20 overflow-hidden">
                                    <SafeImage src={`/heroes/${hero}`} alt="" fill className="object-cover object-[center_30%] scale-110" />
                                    {i === arr.length - 1 && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0c]" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c]/70 to-transparent" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Counter info */}
                    <div className="flex-shrink-0 flex flex-col justify-center px-5 gap-1.5 min-w-[160px]">
                        {ct.formation && (
                            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 self-start">
                                {ct.formation}
                            </span>
                        )}
                        <h5 className="font-black text-white text-sm tracking-tight leading-tight">
                            {ct.team_name || 'Counter Team'}
                        </h5>
                        {ct.pet_file && (
                            <div className="relative w-5 h-5 rounded-md border border-white/10 bg-black/40 overflow-hidden">
                                <SafeImage src={ct.pet_file.startsWith('/') ? ct.pet_file : `/pets/${ct.pet_file}`} alt="" fill className="object-contain p-0.5" />
                            </div>
                        )}
                    </div>

                    {/* Chevron */}
                    <div className="flex-shrink-0 flex items-center pr-5">
                        <ChevronDown 
                            className={cn("transition-transform duration-500 text-gray-600 hover:text-white", !isCollapsed && "rotate-180")} 
                            size={18} 
                        />
                    </div>
                </div>
            </div>

            {!isCollapsed && (
                <div className="p-6 sm:p-8 border-t border-white/5 space-y-8 animate-slide-up">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Summary */}
                        <div className="lg:col-span-5 space-y-6">
                              <div className="relative py-6 px-2 flex items-center justify-center min-h-[180px]">
                                    <div className="grid grid-cols-5 gap-2 w-full max-w-[300px]">
                                        {[0, 1, 2, 3, 4].map(slotIdx => {
                                            const heroFile = ct.heroes?.[slotIdx]
                                            const type = getSlotType(ct.formation, slotIdx)
                                            const isFront = type === 'front'
                                            const stagger = getStaggerClass(ct.formation, slotIdx)
                                            
                                            return (
                                                <div key={slotIdx} className={cn(
                                                    "relative aspect-[3/4] transition-all duration-500",
                                                    stagger,
                                                    heroFile 
                                                        ? (isFront ? "rounded-xl border border-sky-500/30 bg-sky-500/10 shadow-md overflow-hidden" : "rounded-xl border border-rose-500/30 bg-rose-500/10 shadow-md overflow-hidden")
                                                        : "opacity-0 pointer-events-none"
                                                )}>
                                                    {heroFile && (
                                                        <div className="relative flex-1 w-full h-full">
                                                            <SafeImage src={`/heroes/${heroFile}`} alt="" fill className="object-cover" />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-4 bg-rose-500/5 border border-rose-500/10 rounded-[2rem] p-8">
                                <div className="flex flex-col items-center gap-4">
                                    <PetDisplay 
                                        petFile={ct.pet_file ? (ct.pet_file.startsWith('/') ? ct.pet_file : `/pets/${ct.pet_file}`) : null} 
                                        hideLabel={true}
                                        customClasses={{ wrapper: "w-20 h-20 border-rose-500/20 bg-rose-500/10 shadow-2xl ring-1 ring-white/5", image: "p-3" }}
                                    />
                                    
                                    {/* Compact Supports for Counter Team */}
                                    {ct.pet_supports && ct.pet_supports.filter(p => p).length > 0 && (
                                        <div className="flex items-center justify-center gap-2">
                                            {ct.pet_supports.filter(p => p).map((p, i) => (
                                                <div key={i} className="relative w-10 h-10 rounded-lg border border-white/5 bg-black/40 p-1.5 shadow-lg">
                                                    <SafeImage src={p.startsWith('/') ? p : `/pets/${p}`} alt="" fill className="object-contain p-1" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {ct.note && <p className="text-[11px] text-rose-200/60 italic leading-relaxed text-center max-w-[240px]">{ct.note}</p>}
                            </div>
                        </div>

                        {/* Items */}
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {((ct.selection_order && ct.selection_order.length > 0) ? ct.selection_order : (ct.heroes || []).map((h, i) => h ? i : null).filter(idx => idx !== null)).slice(0, 3).map((slotIdx, heroIdx) => {
                                const heroFile = ct.heroes?.[slotIdx]
                                const itemSet = ct.items?.[heroIdx]
                                if (!heroFile || !itemSet) return null
                                return (
                                    <div key={heroIdx} className="bg-black/40 border border-white/5 rounded-3xl p-4 flex flex-col items-center">
                                        <div className="relative w-16 h-16 mb-3">
                                            <SafeImage src={`/heroes/${heroFile}`} alt="" fill className="object-contain" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 w-full mb-2">
                                            <div className="aspect-square rounded-lg border border-white/5 bg-black/40 relative">
                                                {itemSet.weapon && <SafeImage src={`/items/weapon/${itemSet.weapon}`} alt="" fill className="object-contain p-2" />}
                                            </div>
                                            <div className="aspect-square rounded-lg border border-white/5 bg-black/40 relative">
                                                {itemSet.armor && <SafeImage src={`/items/armor/${itemSet.armor}`} alt="" fill className="object-contain p-2" />}
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5 w-full">
                                            {[0, 1, 2].map(idx => (
                                                <div key={idx} className="flex-1 aspect-square rounded-lg border border-white/5 bg-black/40 relative">
                                                    {itemSet.accessories?.[idx] && <SafeImage src={`/items/accessory/${itemSet.accessories[idx]}`} alt="" fill className="object-contain p-1.5" />}
                                                </div>
                                            ))}
                                        </div>
                                        {itemSet.note && (
                                            <div className="mt-3 w-full p-2 bg-rose-500/5 rounded-xl border border-rose-500/10">
                                                <p className="text-[9px] text-rose-200/60 italic text-center leading-tight">
                                                    {itemSet.note}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        
                        {/* Skill Rotation for Counter Team */}
                        {ct.skill_rotation && ct.skill_rotation.length > 0 && (
                            <div className="lg:col-span-12 mt-10 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                        <Zap size={16} className="text-purple-400" />
                                    </div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Skill Rotation</h4>
                                </div>
                                
                                <div className="bg-[#0d0d10] border border-white/5 rounded-[2rem] p-6 overflow-x-auto no-scrollbar">
                                    <div className="flex flex-nowrap items-center justify-center gap-x-6 sm:gap-x-10 min-w-max min-h-[120px]">
                                        {ct.skill_rotation.map((slot, sIdx) => {
                                            const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                            const hFile = ct.heroes?.[hIdx]
                                            const sPath = slot.skill ? getSkillImagePath(hFile, sNum) : null
                                            const isLast = sIdx === (ct.skill_rotation.length - 1)

                                            return (
                                                <div key={sIdx} className="flex items-center gap-4 sm:gap-10">
                                                    <div className="flex flex-col items-center group/skill">
                                                        <div className="relative mb-4">
                                                            <div className="absolute -inset-2 bg-purple-500/10 rounded-[2rem] blur opacity-0 group-hover/skill:opacity-100 transition-opacity" />
                                                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] overflow-hidden border-2 border-white/5 bg-black shadow-2xl group-hover/skill:border-purple-500/40 group-hover/skill:scale-105 transition-all duration-500">
                                                                {sPath ? <SafeImage src={sPath} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-800 text-xl font-black">?</div>}
                                                            </div>
                                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-[9px] font-black shadow-xl ring-2 ring-[#0d0d10]">
                                                                {sIdx + 1}
                                                            </div>
                                                        </div>
                                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest group-hover/skill:text-purple-400 transition-colors">
                                                            {slot.label || ""}
                                                        </span>
                                                    </div>
                                                    {!isLast && (
                                                        <div className="hidden sm:block">
                                                            <div className="w-8 h-[1px] bg-gradient-to-r from-purple-500/20 to-transparent" />
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
