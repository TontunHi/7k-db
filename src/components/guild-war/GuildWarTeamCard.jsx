'use client'

import { useState } from 'react'
import { 
    ChevronDown, ChevronUp, Zap, Briefcase, ShieldAlert, 
    Video, ExternalLink, Info, CheckCircle2, Layout, Swords, Box
} from 'lucide-react'
import { cn } from '@/lib/utils'
import SafeImage from '@/components/shared/SafeImage'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import { resolveHeroImage } from '@/lib/hero-utils'
import { getSkillImagePath } from '@/lib/formation-utils'

export default function GuildWarTeamCard({ team, heroImageMap, index }) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [showSkillNotes, setShowSkillNotes] = useState(false)

    const hasItems = team.items && (team.items.weapon || team.items.armor || team.items.accessory)

    return (
        <div className={cn(
            "group relative bg-gradient-to-br from-gray-950 via-gray-900 to-black border border-white/5 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:border-indigo-500/30 shadow-2xl",
            isExpanded ? "ring-1 ring-indigo-500/20" : ""
        )}>
            {/* Top Gloss Effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            {/* Header / Summary */}
            <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-black text-indigo-400 text-lg shadow-lg shadow-indigo-500/5">
                            {index + 1}
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                            <div>
                                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                                    {team.team_name || `Tactical Team ${index + 1}`}
                                </h3>
                            </div>

                            {!isExpanded && (
                                <div className="hidden lg:flex items-center gap-6 pl-8 border-l border-white/10 animate-in fade-in slide-in-from-left-4 duration-500">
                                    <div className="flex items-center gap-2.5">
                                        {(team.heroes || []).filter(h => h).map((hero, i) => (
                                            <div key={i} className="relative w-14 h-14 rounded-2xl border-2 border-gray-950 overflow-hidden bg-gray-900 shadow-2xl group-hover:scale-110 transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                                                <SafeImage src={`/heroes/${hero}`} alt="" fill className="object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                    {team.pet_file && (
                                        <div className="flex items-center p-2 rounded-[1.5rem] bg-black/40 border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                                            <div className="relative w-12 h-12">
                                                <SafeImage src={team.pet_file} alt="" fill className="object-contain" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsExpanded(!isExpanded)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all",
                                isExpanded 
                                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                                    : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20"
                            )}
                        >
                            {isExpanded ? 'Minimize' : 'Analyze'}
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                    </div>
                </div>

                {/* Core Setup Preview & Expandable Content */}
                {isExpanded && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-black/40 rounded-[2rem] border border-white/5 p-6 md:p-8">
                            <div className="relative">
                                <FormationGrid 
                                    formation={team.formation} 
                                    heroes={team.heroes} 
                                    heroImageMap={heroImageMap}
                                    hideEmpty={true}
                                    staggerAmount="translate-y-4"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-6">
                                {/* Pet Display (Main + Supports) */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-4">
                                        <PetDisplay 
                                            petFile={team.pet_file} 
                                            hideLabel={true}
                                            customClasses={{
                                                wrapper: "w-20 h-20 border-indigo-500/30 bg-indigo-500/5 shadow-indigo-500/10",
                                                image: "p-2.5"
                                            }}
                                        />
                                        {team.pet_supports && team.pet_supports.filter(p => p).length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-px h-12 bg-white/10 mx-1" />
                                                <div className="flex gap-2.5">
                                                    {team.pet_supports.filter(p => p).map((p, i) => (
                                                        <div key={i} className="group/spet relative w-12 h-12 rounded-xl border border-white/5 bg-black/60 p-1.5 shadow-2xl transition-all hover:border-indigo-500/40 hover:scale-105">
                                                            <SafeImage src={p} alt="" fill className="object-contain p-1" />
                                                            <div className="absolute inset-0 bg-indigo-500/5 rounded-xl opacity-0 group-hover/spet:opacity-100 transition-opacity" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Note */}
                                {team.note && (
                                    <div className="flex gap-3 items-start p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                                        <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                                        <p className="text-gray-400 text-xs leading-relaxed italic">
                                            &quot;{team.note}&quot;
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hero-Specific Gear Matrix */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pl-1">
                                <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                    <Briefcase className="w-4 h-4 text-amber-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Build</h4>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {((team.selection_order && team.selection_order.length > 0) ? team.selection_order : (team.heroes || []).map((h, i) => h ? i : null).filter(idx => idx !== null)).slice(0, 3).map((slotIdx, heroIdx) => {
                                    const heroFile = team.heroes?.[slotIdx]
                                    const itemSet = team.items?.[heroIdx]
                                    if (!heroFile || !itemSet) return null
                                    
                                    const heroName = heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^\/.]+$/, '').replace(/_/g, ' ')

                                    return (
                                        <div key={heroIdx} className="relative flex flex-col p-6 rounded-[2.5rem] bg-black/40 border border-white/5 transition-all duration-500 hover:border-amber-500/20 shadow-2xl overflow-hidden group/hero">
                                            {/* Hero Header */}
                                            <div className="flex items-center gap-5 mb-6">
                                                <div className="relative w-28 h-28 flex-shrink-0">
                                                    <SafeImage src={`/heroes/${heroFile}`} alt={heroName} fill className="object-contain group-hover/hero:scale-110 transition-transform duration-700" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h5 className="text-base font-black text-white uppercase tracking-tight leading-tight">{heroName}</h5>
                                                    <div className="w-8 h-0.5 bg-amber-500/30 rounded-full mt-2" />
                                                </div>
                                            </div>
                                            
                                            {/* Gear Matrix */}
                                            <div className="space-y-5 flex-1">
                                                {/* Primary Gear (W/A) */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    {[
                                                        { type: 'weapon', value: itemSet.weapon, color: 'border-red-500/20 bg-red-500/5' },
                                                        { type: 'armor', value: itemSet.armor, color: 'border-blue-500/20 bg-blue-500/5' }
                                                    ].map((gear, i) => (
                                                        <div key={i} className={cn(
                                                            "relative aspect-square rounded-2xl border flex items-center justify-center overflow-hidden transition-all bg-black/60 shadow-xl",
                                                            gear.value ? gear.color : "border-white/5 opacity-20"
                                                        )}>
                                                            {gear.value ? (
                                                                <SafeImage src={`/items/${gear.type}/${gear.value}`} alt="" fill className="object-contain p-3" />
                                                            ) : <Box size={24} className="text-white/10" />}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Accessories row */}
                                                <div className="flex items-center gap-3">
                                                    {[0, 1, 2].map((accIdx) => {
                                                        const acc = itemSet.accessories?.[accIdx]
                                                        return (
                                                            <div key={accIdx} className={cn(
                                                                "relative flex-1 aspect-square rounded-xl border flex items-center justify-center overflow-hidden transition-all bg-black/60 shadow-lg",
                                                                acc ? "border-amber-500/20 bg-amber-500/5" : "border-white/5 opacity-20"
                                                            )}>
                                                                {acc ? (
                                                                    <SafeImage src={`/items/accessory/${acc}`} alt="" fill className="object-contain p-2" />
                                                                ) : <div className="w-1 h-1 rounded-full bg-white/20" />}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                            
                                            {/* Tactical Intel */}
                                            {itemSet.note && (
                                                <div className="mt-6 pt-5 border-t border-white/5">
                                                    <p className="text-[11px] text-gray-400 leading-relaxed italic text-center">
                                                        &quot;{itemSet.note}&quot;
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Strategic Execution: Skill Rotation */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pl-1">
                                <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                                    <Zap className="w-4 h-4 text-indigo-500" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Skill Rotation</h4>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-5 p-8 bg-black/40 rounded-[2.5rem] border border-white/5 shadow-inner">
                                {(team.skill_rotation || []).map((slot, sIdx) => {
                                    const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                    const hFile = team.heroes?.[hIdx]
                                    const sPath = slot.skill ? getSkillImagePath(hFile, sNum) : null
                                    const isLast = sIdx === (team.skill_rotation.length - 1)

                                    return (
                                        <div key={sIdx} className="flex items-center gap-5">
                                            <div className="flex flex-col items-center gap-3 group/skill">
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter w-14 text-center leading-none">
                                                    {slot.label || `Step ${sIdx+1}`}
                                                </span>
                                                <div className="relative w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-indigo-500/20 shadow-2xl transition-all group-hover/skill:border-indigo-500 group-hover/skill:scale-105 duration-500">
                                                    <div className="absolute inset-0 bg-indigo-500/5 z-0" />
                                                    {sPath ? (
                                                        <SafeImage src={sPath} alt="" fill className="object-cover transition-transform duration-700 group-hover/skill:scale-110" />
                                                    ) : <div className="w-full h-full flex items-center justify-center text-gray-800 text-sm font-bold bg-black/40">?</div>}
                                                </div>
                                            </div>
                                            {!isLast && (
                                                <div className="flex flex-col items-center opacity-20">
                                                    <div className="w-4 h-0.5 bg-indigo-500 rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Counter Teams Section */}
                        {team.counter_teams && team.counter_teams.length > 0 && (
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="w-5 h-5 text-rose-500" />
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest text-rose-500">Counter Overhaul</h4>
                                </div>
                                
                                <div className="space-y-4">
                                    {team.counter_teams.map((ct, ctIdx) => (
                                        <CounterTeamDisplay key={ctIdx} ct={ct} heroImageMap={heroImageMap} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function CounterTeamDisplay({ ct, heroImageMap }) {
    const [isCollapsed, setIsCollapsed] = useState(true)
    
    return (
        <div className="rounded-[2rem] bg-black/40 border border-white/5 overflow-hidden transition-all hover:border-rose-500/20">
            {/* Header */}
            <div 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-all"
            >
                <div className="flex items-center gap-5">
                    <div>
                        <span className="font-black text-white text-sm tracking-tight block group-hover/counter:text-rose-400 transition-colors">
                            {ct.team_name || 'Generic Counter'}
                        </span>
                        
                        {isCollapsed && (
                            <div className="flex items-center gap-4 mt-2 animate-in fade-in slide-in-from-left-2">
                                <div className="flex items-center gap-1.5">
                                    {(ct.selection_order || []).slice(0, 3).map((slotIdx, i) => {
                                        const h = ct.heroes?.[slotIdx]
                                        if (!h) return null
                                        return (
                                            <div key={i} className="relative w-10 h-10 rounded-lg border border-gray-950 overflow-hidden bg-gray-900 shadow-lg">
                                                <SafeImage src={`/heroes/${h}`} alt="" fill className="object-cover" />
                                            </div>
                                        )
                                    })}
                                </div>
                                {ct.pet_file && (
                                    <div className="flex items-center p-1 rounded-lg bg-black/40 border border-white/10">
                                        <div className="relative w-7 h-7">
                                            <SafeImage src={ct.pet_file} alt="" fill className="object-contain" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                <div className={cn("transition-all duration-300", isCollapsed ? "text-gray-600" : "text-rose-500 rotate-180")}>
                    <ChevronDown size={20} />
                </div>
            </div>

            {!isCollapsed && (
                <div className="p-6 border-t border-white/5 space-y-8 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-black/20 rounded-[1.5rem] p-6 border border-white/5">
                        <div className="relative scale-90 -ml-4">
                            <FormationGrid 
                                formation={ct.formation} 
                                heroes={ct.heroes} 
                                heroImageMap={heroImageMap}
                                hideEmpty={true}
                                staggerAmount="translate-y-2"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <PetDisplay 
                                    petFile={ct.pet_file} 
                                    hideLabel={true}
                                    customClasses={{ wrapper: "w-14 h-14 border-rose-500/30 bg-rose-500/5", image: "p-2" }}
                                />
                                {ct.pet_supports && ct.pet_supports.filter(p => p).length > 0 && (
                                    <div className="flex gap-1.5">
                                        {ct.pet_supports.filter(p => p).map((p, i) => (
                                            <div key={i} className="relative w-10 h-10 rounded-lg border border-white/5 bg-black/60 p-1">
                                                <SafeImage src={p} alt="" fill className="object-contain" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {ct.note && (
                                <p className="text-gray-400 text-[11px] leading-relaxed italic border-l-2 border-rose-500/30 pl-3">
                                    {ct.note}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Counter Strategy Loadout */}
                    {ct.items && ct.items.length > 0 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 pl-1">
                                <div className="p-2 bg-rose-500/10 rounded-xl border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                                    <Briefcase className="w-4 h-4 text-rose-500" />
                                </div>
                                <div>
                                    <h5 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Build Counter</h5>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {((ct.selection_order && ct.selection_order.length > 0) ? ct.selection_order : (ct.heroes || []).map((h, i) => h ? i : null).filter(idx => idx !== null)).slice(0, 3).map((slotIdx, heroIdx) => {
                                    const heroFile = ct.heroes?.[slotIdx]
                                    const itemSet = ct.items?.[heroIdx]
                                    if (!heroFile || !itemSet) return null
                                    const heroName = heroFile.replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '').replace(/\.[^\/.]+$/, '').replace(/_/g, ' ')

                                    return (
                                        <div key={heroIdx} className="relative flex flex-col p-5 rounded-[2rem] bg-black/60 border border-white/5 transition-all duration-500 hover:border-rose-500/20 shadow-xl overflow-hidden group/chero">
                                            {/* Header */}
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="relative w-20 h-20 flex-shrink-0">
                                                    <SafeImage src={`/heroes/${heroFile}`} alt="" fill className="object-contain group-hover/chero:scale-110 transition-transform duration-700" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h6 className="text-[13px] font-black text-white uppercase tracking-tight leading-tight">{heroName}</h6>
                                                    <div className="w-6 h-0.5 bg-rose-500/30 rounded-full mt-1.5" />
                                                </div>
                                            </div>

                                            {/* Gear Matrix */}
                                            <div className="space-y-4 flex-1">
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { type: 'weapon', value: itemSet.weapon, color: 'border-red-500/20 bg-red-500/5' },
                                                        { type: 'armor', value: itemSet.armor, color: 'border-blue-500/20 bg-blue-500/5' }
                                                    ].map((gear, i) => (
                                                        <div key={i} className={cn(
                                                            "relative aspect-square rounded-xl border flex items-center justify-center overflow-hidden transition-all bg-black/40",
                                                            gear.value ? gear.color : "border-white/5 opacity-10"
                                                        )}>
                                                            {gear.value ? (
                                                                <SafeImage src={`/items/${gear.type}/${gear.value}`} alt="" fill className="object-contain p-2.5" />
                                                            ) : <Box size={16} className="text-white/5" />}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {[0, 1, 2].map(accIdx => (
                                                        <div key={accIdx} className={cn(
                                                            "relative flex-1 aspect-square rounded-lg border flex items-center justify-center overflow-hidden transition-all bg-black/40",
                                                            itemSet.accessories?.[accIdx] ? "border-amber-500/20 bg-amber-500/5" : "border-white/5 opacity-10"
                                                        )}>
                                                            {itemSet.accessories?.[accIdx] ? (
                                                                <SafeImage src={`/items/accessory/${itemSet.accessories[accIdx]}`} alt="" fill className="object-contain p-2" />
                                                            ) : <div className="w-1 h-1 rounded-full bg-white/10" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {itemSet.note && (
                                                <div className="mt-4 pt-4 border-t border-white/5">
                                                    <p className="text-[10px] text-gray-500 italic leading-tight text-center">
                                                        &quot;{itemSet.note}&quot;
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Counter Skills */}
                    {ct.skill_rotation && ct.skill_rotation.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-indigo-500" />
                                <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Skill Rotation</h5>
                            </div>
                            <div className="flex flex-wrap gap-2 p-4 bg-black/60 rounded-2xl border border-white/5">
                                {ct.skill_rotation.map((slot, sIdx) => {
                                    const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                    const hFile = ct.heroes?.[hIdx]
                                    const sPath = slot.skill ? getSkillImagePath(hFile, sNum) : null
                                    const isLast = sIdx === (ct.skill_rotation.length - 1)
                                    
                                    return (
                                        <div key={sIdx} className="flex items-center gap-2">
                                            <div className="flex flex-col items-center gap-1.5 group/skill">
                                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter w-10 text-center leading-none">
                                                    {slot.label || sIdx + 1}
                                                </span>
                                                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-indigo-500/30 shadow-lg transition-all group-hover/skill:border-indigo-500 group-hover/skill:scale-105">
                                                    {sPath ? <SafeImage src={sPath} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-700 text-[10px]">?</div>}
                                                </div>
                                            </div>
                                            {!isLast && (
                                                <div className="w-2 h-px bg-indigo-500/20 mt-3" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
