"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, Shield, Swords, Zap, Sparkles, X, ChevronRight, RotateCcw, Plus, Calculator, ChevronLeft } from "lucide-react"
import { clsx } from "clsx"
import SafeImage from "../shared/SafeImage"

const STAT_FIELDS = [
    { key: "atk_phys", label: "Physical Attack", icon: "/about_website/icon_physical_attack.webp", group: "Physical" },
    { key: "atk_mag", label: "Magic Attack", icon: "/about_website/icon_physical_attack.webp", group: "Magic" },
    { key: "def", label: "Defense", icon: "/about_website/icon_defense.webp" },
    { key: "hp", label: "HP", icon: "/about_website/icon_hp.webp" },
    { key: "speed", label: "Speed", icon: "/about_website/icon_speed.webp" },
    { key: "crit_rate", label: "Crit Rate %", icon: "/about_website/icon_crit_rate.webp" },
    { key: "crit_dmg", label: "Crit Damage %", icon: "/about_website/icon_crit_damage.webp" },
    { key: "weak_hit", label: "Weakness %", icon: "/about_website/icon_weakness_hit_chance.webp" },
    { key: "block_rate", label: "Block Rate %", icon: "/about_website/icon_block_rate.webp" },
    { key: "dmg_red", label: "Dmg Reduction %", icon: "/about_website/icon_damage_taken_reduction.webp" },
    { key: "eff_hit", label: "Effect Hit %", icon: "/about_website/icon_effect_hit_rate.webp" },
    { key: "eff_res", label: "Effect Res %", icon: "/about_website/icon_effect_resistance.webp" }
]







const SUBSTAT_LIST = [
    { label: "All Attack", key: "atk_all" },
    { label: "All Attack (%)", key: "atk_all_perc" },
    { label: "Defense", key: "def" },
    { label: "Defense (%)", key: "def_perc" },
    { label: "HP", key: "hp" },
    { label: "HP (%)", key: "hp_perc" },
    { label: "Speed", key: "speed" },
    { label: "Crit Rate", key: "crit_rate" },
    { label: "Crit Damage", key: "crit_dmg" },
    { label: "Weakness Hit Chance", key: "weak_hit" },
    { label: "Block Rate", key: "block_rate" },
    { label: "Effect Hit Rate", key: "eff_hit" },
    { label: "Effect Resistance", key: "eff_res" }
]

const getInitialItemState = () => ({
    item: null,
    substats: Array(4).fill(null).map(() => ({ key: null, value: '' }))
})

export default function HeroStatsBuilder({ heroes = [], items = [] }) {
    const [isSelectionMode, setIsSelectionMode] = useState(true)
    const [selectedHero, setSelectedHero] = useState(null)
    const [search, setSearch] = useState("")
    const [heroStats, setHeroStats] = useState({})
    const [equippedItems, setEquippedItems] = useState({
        Weapon1: getInitialItemState(),
        Armor1: getInitialItemState(),
        Weapon2: getInitialItemState(),
        Armor2: getInitialItemState()
    })
    const [showItemSelector, setShowItemSelector] = useState(null)

    const formatValue = (val) => {
        if (val === "" || val === undefined) return "0"
        const num = parseFloat(val)
        if (isNaN(num)) return "0"
        return Number.isInteger(num) ? num.toString() : num.toFixed(2)
    }

    useEffect(() => {
        const saved = localStorage.getItem("hero-build-state-v5")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (parsed.hero) {
                    const hero = heroes.find(h => h.filename === parsed.hero.filename)
                    if (hero) {
                        setSelectedHero(hero)
                        setHeroStats(parsed.stats || {})
                        setEquippedItems(parsed.equipped || {
                            Weapon1: getInitialItemState(),
                            Armor1: getInitialItemState(),
                            Weapon2: getInitialItemState(),
                            Armor2: getInitialItemState()
                        })
                        setIsSelectionMode(false)
                    }
                }
            } catch (e) {
                console.error("Failed to load saved build", e)
            }
        }
    }, [heroes])

    useEffect(() => {
        if (selectedHero) {
            const state = {
                hero: selectedHero,
                stats: heroStats,
                equipped: equippedItems
            }
            localStorage.setItem("hero-build-state-v5", JSON.stringify(state))
        }
    }, [selectedHero, heroStats, equippedItems])

    const filteredHeroes = useMemo(() => {
        return heroes.filter(h => 
            h.name.toLowerCase().includes(search.toLowerCase()) || 
            h.filename.toLowerCase().includes(search.toLowerCase())
        )
    }, [heroes, search])

    const handleSelectHero = (hero) => {
        setSelectedHero(hero)
        const baseStats = {}
        STAT_FIELDS.forEach(f => {
            baseStats[f.key] = hero[f.key] || ""
        })
        setHeroStats(baseStats)
        setIsSelectionMode(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const getAvailableItems = (slotKey) => {
        if (!selectedHero) return []
        if (slotKey.startsWith('Weapon')) {
            const isMagic = selectedHero.hero_group === "Magic"
            return items
                .filter(i => i.item_type === 'Weapon')
                .filter(i => {
                    // Filter logic: Magic heroes get Staff/Orb/Scripture, Physical get Sword/Flail/etc.
                    // This can be refined based on naming conventions in your database if needed.
                    // For now, staying consistent with previous hardcoded categories.
                    const name = i.name.toLowerCase()
                    const magicTerms = ['staff', 'orb', 'scripture']
                    const isMagicItem = magicTerms.some(t => name.includes(t))
                    return isMagic ? isMagicItem : !isMagicItem
                })
                .map(i => ({
                    ...i,
                    image: `/items/weapon/${i.image}`
                }))
        } else {
            return items
                .filter(i => i.item_type === 'Armor')
                .map(i => ({
                    ...i,
                    image: `/items/armor/${i.image}`
                }))
        }
    }


    const handleStatChange = (key, val) => {
        setHeroStats(prev => ({ ...prev, [key]: val }))
    }

    const availableSubstats = useMemo(() => {
        return SUBSTAT_LIST
    }, [])


    const handleItemAction = (slotKey, action, payload) => {

        setEquippedItems(prev => {
            const newState = { ...prev }
            if (action === 'EQUIP') {
                newState[slotKey] = { ...newState[slotKey], item: payload }
            } else if (action === 'CLEAR') {
                newState[slotKey] = getInitialItemState()
            } else if (action === 'SUBSTAT_KEY') {
                const { index, key } = payload
                const newSubstats = [...newState[slotKey].substats]
                newSubstats[index] = { ...newSubstats[index], key }
                newState[slotKey] = { ...newState[slotKey], substats: newSubstats }
            } else if (action === 'SUBSTAT_VALUE') {
                const { index, value } = payload
                const newSubstats = [...newState[slotKey].substats]
                newSubstats[index] = { ...newSubstats[index], value }
                newState[slotKey] = { ...newState[slotKey], substats: newSubstats }
            }
            return newState
        })
    }

    const resetBuild = () => {
        if (confirm("Reset current build?")) {
            setSelectedHero(null)
            setHeroStats({})
            setEquippedItems({
                Weapon1: getInitialItemState(),
                Armor1: getInitialItemState(),
                Weapon2: getInitialItemState(),
                Armor2: getInitialItemState()
            })
            setIsSelectionMode(true)
            localStorage.removeItem("hero-build-state-v5")
        }
    }

    const finalStats = useMemo(() => {
        const totals = { ...heroStats }
        Object.keys(totals).forEach(key => totals[key] = parseFloat(totals[key]) || 0)
        
        const atkKey = selectedHero?.hero_group === "Physical" ? "atk_phys" : "atk_mag"
        
        Object.values(equippedItems).forEach(slot => {
            // Add Base Item Stats
            if (slot.item) {
                if (slot.item.atk_all_perc) totals[atkKey] += parseFloat(slot.item.atk_all_perc)
                if (slot.item.def_perc) totals.def += parseFloat(slot.item.def_perc)
                if (slot.item.hp_perc) totals.hp += parseFloat(slot.item.hp_perc)
            }

            // Add Substats
            slot.substats.forEach(sub => {
                if (sub.key && sub.value) {
                    const val = parseFloat(sub.value) || 0
                    if (sub.key === 'atk_all' || sub.key === 'atk_all_perc') {
                        totals[atkKey] += val
                    } else if (sub.key === 'def_perc') {
                        totals.def += val
                    } else if (sub.key === 'hp_perc') {
                        totals.hp += val
                    } else {
                        totals[sub.key] = (totals[sub.key] || 0) + val
                    }
                }
            })
        })
        return totals
    }, [heroStats, equippedItems, selectedHero])



    const visibleStatFields = useMemo(() => {
        if (!selectedHero) return STAT_FIELDS
        return STAT_FIELDS.filter(f => !f.group || f.group === selectedHero.hero_group)
    }, [selectedHero])

    if (isSelectionMode) {
        return (
            <div className="min-h-screen bg-[#050505] text-white p-6 lg:p-12 font-inter animate-in fade-in duration-700">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-6">
                        <h1 className="text-6xl font-black italic tracking-tighter uppercase text-white leading-none">
                            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700]">Legend</span>
                        </h1>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.4em] max-w-lg mx-auto leading-relaxed">Select a hero from the pool to initiate high-performance build analysis and simulation</p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-10">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 border-b border-white/5 pb-8">
                            <div className="relative w-full md:w-[600px]">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FFD700]/40 w-6 h-6" />
                                <input 
                                    type="text"
                                    placeholder="Search legend pool..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 text-lg font-bold text-white outline-none focus:border-[#FFD700]/50 transition-all placeholder:text-gray-800 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8 animate-in slide-in-from-bottom-5 duration-700">
                            {filteredHeroes.map(hero => (
                                <button
                                    key={hero.filename}
                                    onClick={() => handleSelectHero(hero)}
                                    className="group relative flex flex-col items-center transition-all hover:scale-105 active:scale-95"
                                >
                                    <div className="relative aspect-[11/14] w-full rounded-[2.5rem] overflow-hidden border-2 border-white/5 group-hover:border-[#FFD700] transition-all shadow-2xl bg-black/40">
                                        <SafeImage src={`/heroes/${hero.filename}.webp`} fill className="object-contain transition-transform duration-700 group-hover:scale-110" alt={hero.name} />
                                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 lg:p-8 font-inter animate-in fade-in duration-500">
            <div className="max-w-[1600px] mx-auto space-y-8">
                
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-[#0a0a0a] border border-white/5 p-6 rounded-[2.5rem] shadow-2xl">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => setIsSelectionMode(true)}
                            className="p-3 bg-white/5 border border-white/5 rounded-2xl text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
                        >
                            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="h-16 w-16 relative rounded-2xl overflow-hidden border-2 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.2)] flex-shrink-0">
                            <SafeImage src={`/heroes/${selectedHero.filename}.webp`} fill className="object-contain" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 bg-[#FFD700] text-black text-[8px] font-black uppercase rounded">{selectedHero.grade}</span>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">{selectedHero.hero_group} Type</span>
                            </div>
                            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">{selectedHero.name}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            <Calculator className="w-4 h-4 text-[#FFD700]" />
                            Real-time Calculation Active
                        </div>
                        <button 
                            onClick={resetBuild}
                            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-500 hover:text-white transition-all group"
                        >
                            <RotateCcw className="w-4 h-4 group-hover:rotate-[-180deg] transition-transform duration-500" />
                            Reset
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    
                    <div className="xl:col-span-5 space-y-8">
                        
                        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-3">
                                <Zap className="w-4 h-4 text-[#FFD700]" />
                                Base Registry Stats
                            </h3>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                {visibleStatFields.map(field => (
                                    <div key={field.key} className="flex items-center justify-between group border-b border-white/[0.03] pb-2">
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <div className="w-4 h-4 relative opacity-50 group-hover:opacity-100 transition-opacity">
                                                <SafeImage src={field.icon} fill className="object-contain" />
                                            </div>
                                            <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest group-hover:text-white transition-colors">
                                                {field.label.replace(' %', '')}
                                            </label>
                                        </div>
                                        <input 
                                            type="number"
                                            value={heroStats[field.key] || ""}
                                            onChange={(e) => handleStatChange(field.key, e.target.value)}
                                            placeholder="—"
                                            className="w-16 bg-transparent text-right text-xs font-black text-[#FFD700] outline-none placeholder:text-gray-900"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-[#FFD700]/20 rounded-[2.5rem] p-10 shadow-[0_0_80px_rgba(255,215,0,0.05)] space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Simulation Summary</h3>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">Final Attributes [Base + Gear]</p>
                                </div>
                                <Sparkles className="w-6 h-6 text-[#FFD700] animate-pulse" />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-6 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-3xl space-y-3">
                                    <div className="text-[9px] font-black text-[#FFD700] uppercase tracking-widest opacity-60">Attack</div>
                                    <div className="text-3xl font-black text-white italic tracking-tighter tabular-nums">
                                        {selectedHero.hero_group === "Physical" ? formatValue(finalStats.atk_phys) : formatValue(finalStats.atk_mag)}
                                    </div>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
                                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest opacity-60">Defense</div>
                                    <div className="text-3xl font-black text-white italic tracking-tighter tabular-nums">{formatValue(finalStats.def)}</div>
                                </div>
                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-3">
                                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest opacity-60">Health</div>
                                    <div className="text-3xl font-black text-white italic tracking-tighter tabular-nums">{formatValue(finalStats.hp)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['Weapon1', 'Armor1', 'Weapon2', 'Armor2'].map((slotKey) => (
                            <div key={slotKey} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-7 shadow-xl space-y-6 flex flex-col">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "w-8 h-8 rounded-lg flex items-center justify-center",
                                            slotKey.startsWith('Weapon') ? "bg-orange-500/10 text-orange-500" : "bg-blue-500/10 text-blue-500"
                                        )}>
                                            {slotKey.startsWith('Weapon') ? <Swords size={16} /> : <Shield size={16} />}
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-[#FFD700] italic">
                                            {slotKey.replace(/([A-Z])(\d)/, '$1')}
                                        </span>
                                    </div>
                                    {equippedItems[slotKey].item && (
                                        <button 
                                            onClick={() => handleItemAction(slotKey, 'CLEAR')}
                                            className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/10 px-3 py-1 rounded-lg transition-all"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>

                                <div 
                                    onClick={() => setShowItemSelector(slotKey)}
                                    className={clsx(
                                        "relative h-24 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center group overflow-hidden",
                                        equippedItems[slotKey].item ? "border-[#FFD700]/30 bg-[#FFD700]/5" : "border-white/5 bg-black/40 hover:border-white/10 hover:bg-black/60"
                                    )}
                                >
                                    {equippedItems[slotKey].item ? (
                                        <div className="flex items-center gap-5 px-6 w-full">
                                            <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-[#FFD700]/20 shadow-2xl">
                                                <SafeImage src={equippedItems[slotKey].item.image} fill className="object-contain" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-[10px] font-black text-white uppercase tracking-tight leading-tight line-clamp-2">{equippedItems[slotKey].item.name}</h4>
                                            </div>
                                        </div>
                                    ) : (
                                        <Plus className="w-4 h-4 text-gray-800 group-hover:text-gray-500 transition-colors" />
                                    )}
                                </div>

                                {equippedItems[slotKey].item && (
                                    <div className="space-y-3 pt-4 border-t border-white/5 flex-1">
                                        <div className="grid grid-cols-1 gap-2">
                                            {equippedItems[slotKey].substats.map((sub, idx) => (
                                                <div key={idx} className="flex items-center gap-2 group/sub">
                                                    <div className="relative flex-1">
                                                        <select
                                                            value={sub.key || ''}
                                                            onChange={(e) => handleItemAction(slotKey, 'SUBSTAT_KEY', { index: idx, key: e.target.value })}
                                                            className="w-full bg-black border border-white/5 hover:border-white/20 rounded-xl px-4 py-2.5 text-[10px] font-black text-gray-500 focus:text-white outline-none focus:border-[#FFD700] appearance-none cursor-pointer transition-all shadow-inner"
                                                        >
                                                            <option value="">Choose Stat...</option>
                                                            {availableSubstats.map(f => {
                                                                const isUsed = equippedItems[slotKey].substats.some((s, sIdx) => sIdx !== idx && s.key === f.key)
                                                                return <option key={f.key} value={f.key} disabled={isUsed}>{f.label}</option>
                                                            })}

                                                        </select>
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700">
                                                            <ChevronRight size={10} className="rotate-90" />
                                                        </div>
                                                    </div>
                                                    <input 
                                                        type="number"
                                                        value={sub.value}
                                                        onChange={(e) => handleItemAction(slotKey, 'SUBSTAT_VALUE', { index: idx, value: e.target.value })}
                                                        placeholder="0"
                                                        className="w-16 bg-black border border-white/5 rounded-xl px-2 py-2.5 text-[10px] font-black text-[#FFD700] outline-none focus:border-[#FFD700] hover:border-white/20 transition-all text-center tabular-nums shadow-inner"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {showItemSelector && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300">
                    <div className="w-full max-w-4xl bg-[#0a0a0a] border border-[#FFD700]/10 rounded-[4rem] overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.9)]">
                        <div className="p-10 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                                {showItemSelector.replace(/([A-Z])(\d)/, '$1')} Gallery
                            </h3>
                            <button onClick={() => setShowItemSelector(null)} className="p-4 bg-white/5 rounded-2xl text-white hover:bg-red-500 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                            {getAvailableItems(showItemSelector).map(w => (
                                <button 
                                    key={w.id}

                                    onClick={() => {
                                        handleItemAction(showItemSelector, 'EQUIP', w)
                                        setShowItemSelector(null)
                                    }}
                                    className="group space-y-3 flex flex-col items-center text-center transition-all hover:scale-105"
                                >
                                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-[#FFD700] transition-all shadow-2xl">
                                        <SafeImage src={w.image} fill className="object-cover" />
                                    </div>
                                    <span className="text-[9px] font-black text-gray-500 uppercase group-hover:text-white leading-tight">{w.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
