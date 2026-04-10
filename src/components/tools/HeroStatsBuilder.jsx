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







const ITEM_MAIN_STATS = [
    { label: "Weakness Hit Chance", value: 28, unit: "%", key: "weak_hit" },
    { label: "Crit Rate", value: 24, unit: "%", key: "crit_rate" },
    { label: "Crit Damage", value: 36, unit: "%", key: "crit_dmg" },
    { label: "All Attack (%)", value: 28, unit: "%", key: "atk_all_perc" },
    { label: "All Attack", value: 240, unit: "", key: "atk_all" },
    { label: "Defense (%)", value: 28, unit: "%", key: "def_perc" },
    { label: "Defense", value: 160, unit: "", key: "def" },
    { label: "HP (%)", value: 28, unit: "%", key: "hp_perc" },
    { label: "HP", value: 850, unit: "", key: "hp" },
    { label: "Effect Hit Rate", value: 30, unit: "%", key: "eff_hit" },
]

const SUBSTAT_LIST = [
    { label: "All Attack", key: "atk_all", values: [50, 100, 150, 200, 250, 300] },
    { label: "All Attack (%)", key: "atk_all_perc", values: [5, 10, 15, 20, 25, 30] },
    { label: "Defense", key: "def", values: [30, 60, 90, 120, 150, 180] },
    { label: "Defense (%)", key: "def_perc", values: [5, 10, 15, 20, 25, 30] },
    { label: "HP", key: "hp", values: [180, 360, 540, 720, 900, 1080] },
    { label: "HP (%)", key: "hp_perc", values: [5, 10, 15, 20, 25, 30] },
    { label: "Speed", key: "speed", values: [4, 8, 12, 16, 20, 24] },
    { label: "Crit Rate", key: "crit_rate", values: [4, 8, 12, 16, 20, 24] },
    { label: "Crit Damage", key: "crit_dmg", values: [6, 12, 18, 24, 30, 36] },
    { label: "Weakness Hit Chance", key: "weak_hit", values: [4, 8, 12, 16, 20, 24] },
    { label: "Block Rate", key: "block_rate", values: [4, 8, 12, 16, 20, 24] },
    { label: "Effect Hit Rate", key: "eff_hit", values: [5, 10, 15, 20, 25, 30] },
    { label: "Effect Resistance", key: "eff_res", values: [5, 10, 15, 20, 25, 30] }
]

const getInitialItemState = () => ({
    item: null,
    mainStatKey: ITEM_MAIN_STATS[3].key, // Default to All Attack (%)
    substats: Array(4).fill(null).map(() => ({ key: null, level: 0 }))
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
            const currentSlot = newState[slotKey]
            
            if (action === 'EQUIP') {
                newState[slotKey] = { ...newState[slotKey], item: payload }
            } else if (action === 'SET_MAIN_STAT') {
                newState[slotKey] = { ...newState[slotKey], mainStatKey: payload.key }
            } else if (action === 'CLEAR') {
                newState[slotKey] = getInitialItemState()
            } else if (action === 'SUBSTAT_KEY') {
                const { index, key } = payload
                const newSubstats = [...currentSlot.substats]
                newSubstats[index] = { ...newSubstats[index], key, level: 0 }
                newState[slotKey] = { ...currentSlot, substats: newSubstats }
            } else if (action === 'LEVEL_UP') {
                const { index } = payload
                const totalLevels = currentSlot.substats.reduce((sum, s) => sum + (s.level || 0), 0)
                const statInfo = SUBSTAT_LIST.find(s => s.key === currentSlot.substats[index].key)
                
                if (totalLevels < 5 && currentSlot.substats[index].level < (statInfo?.values.length - 1)) {
                    const newSubstats = [...currentSlot.substats]
                    newSubstats[index] = { ...newSubstats[index], level: (newSubstats[index].level || 0) + 1 }
                    newState[slotKey] = { ...currentSlot, substats: newSubstats }
                }
            } else if (action === 'LEVEL_DOWN') {
                const { index } = payload
                if (currentSlot.substats[index].level > 0) {
                    const newSubstats = [...currentSlot.substats]
                    newSubstats[index] = { ...newSubstats[index], level: (newSubstats[index].level || 0) - 1 }
                    newState[slotKey] = { ...currentSlot, substats: newSubstats }
                }
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
        const base = { ...heroStats }
        Object.keys(base).forEach(key => base[key] = parseFloat(base[key]) || 0)
        
        const atkKey = (selectedHero?.hero_group === "Physical" || selectedHero?.hero_group === "Attack") ? "atk_phys" : "atk_mag"
        
        // Accumulators for bonuses
        const extraFlat = { atk: 0, def: 0, hp: 0, speed: 0 }
        const extraPerc = { atk: 0, def: 0, hp: 0 }
        const otherStats = { 
            crit_rate: 0, crit_dmg: 0, weak_hit: 0, 
            block_rate: 0, eff_hit: 0, eff_res: 0 
        }
        
        Object.values(equippedItems).forEach(slot => {
            // 1. Add Base Item Stats (Legacy Flat Stats)
            if (slot.item) {
                if (slot.item.atk_all_perc) extraFlat.atk += parseFloat(slot.item.atk_all_perc)
                if (slot.item.def_perc) extraFlat.def += parseFloat(slot.item.def_perc)
                if (slot.item.hp_perc) extraFlat.hp += parseFloat(slot.item.hp_perc)
            }

            // 2. Add Selected Main Stat
            if (slot.item && slot.mainStatKey) {
                const mainStat = ITEM_MAIN_STATS.find(s => s.key === slot.mainStatKey)
                if (mainStat) {
                    const val = mainStat.value
                    if (mainStat.key === 'atk_all') extraFlat.atk += val
                    else if (mainStat.key === 'atk_all_perc') extraPerc.atk += val
                    else if (mainStat.key === 'def') extraFlat.def += val
                    else if (mainStat.key === 'def_perc') extraPerc.def += val
                    else if (mainStat.key === 'hp') extraFlat.hp += val
                    else if (mainStat.key === 'hp_perc') extraPerc.hp += val
                    else if (otherStats[mainStat.key] !== undefined) {
                        otherStats[mainStat.key] += val
                    }
                }
            }

            // 3. Add Substats (Determine if Flat or Perc)
            slot.substats.forEach(sub => {
                if (sub.key) {
                    const statInfo = SUBSTAT_LIST.find(s => s.key === sub.key)
                    if (statInfo) {
                        const val = parseFloat(statInfo.values[sub.level || 0]) || 0
                        
                        // Categorize based on key
                        if (sub.key === 'atk_all') extraFlat.atk += val
                        else if (sub.key === 'atk_all_perc') extraPerc.atk += val
                        else if (sub.key === 'def') extraFlat.def += val
                        else if (sub.key === 'def_perc') extraPerc.def += val
                        else if (sub.key === 'hp') extraFlat.hp += val
                        else if (sub.key === 'hp_perc') extraPerc.hp += val
                        else if (sub.key === 'speed') extraFlat.speed += val
                        else if (otherStats[sub.key] !== undefined) {
                            otherStats[sub.key] += val
                        }
                    }
                }
            })
        })

        // Final Calculation based on "Base Stat Only" principle
        const res = { ...base }
        
        // Attack
        const baseAtk = base[atkKey] || 0
        res[atkKey] = baseAtk + (baseAtk * (extraPerc.atk / 100)) + extraFlat.atk
        
        // Defense
        const baseDef = base.def || 0
        res.def = baseDef + (baseDef * (extraPerc.def / 100)) + extraFlat.def
        
        // HP
        const baseHp = base.hp || 0
        res.hp = baseHp + (baseHp * (extraPerc.hp / 100)) + extraFlat.hp
        
        // Speed
        res.speed = (base.speed || 0) + extraFlat.speed
        
        // Others (Additive Percentages)
        Object.keys(otherStats).forEach(key => {
            res[key] = (base[key] || 0) + otherStats[key]
        })

        return res
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
                            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700]">Hero</span>
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

                        {/* Final Stats Analysis Grid */}
                        <div className="bg-[#0a0a0a] border border-cyan-500/20 rounded-[2.5rem] p-8 shadow-2xl space-y-6 group">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Final Stats <span className="text-cyan-400">Analysis</span></h3>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none">Total values after all modifiers applied</p>
                                </div>
                                <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                {visibleStatFields.map(field => (
                                    <div key={field.key} className="flex items-center justify-between group/stat border-b border-white/[0.03] pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 relative opacity-40 group-hover/stat:opacity-100 transition-opacity">
                                                <SafeImage src={field.icon} fill className="object-contain" />
                                            </div>
                                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{field.label.replace(' %', '')}</span>
                                        </div>
                                        <div className="text-xs font-black text-white tabular-nums tracking-tighter italic">
                                            {formatValue(finalStats[field.key])}
                                            {field.unit && <span className="ml-0.5 text-[8px] opacity-40">{field.unit}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {['Weapon1', 'Armor1', 'Weapon2', 'Armor2'].map((slotKey) => (
                            <div key={slotKey} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-7 shadow-xl space-y-6 flex flex-col">
                                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-black uppercase tracking-widest text-[#FFD700] italic">
                                            {slotKey.replace(/\d+$/, '')}
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
                                        <div className="flex items-start gap-4 px-5 w-full">
                                            <div className="w-20 h-20 relative rounded-2xl overflow-hidden border-2 border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.1)] flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                                                <SafeImage src={equippedItems[slotKey].item.image} fill className="object-cover" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                            </div>
                                            
                                            <div className="flex-1 min-w-0 py-1 space-y-2">
                                                <div>
                                                    <h4 className="text-[11px] font-black text-white uppercase tracking-tight leading-tight line-clamp-1 group-hover:text-[#FFD700] transition-colors">
                                                        {equippedItems[slotKey].item.name}
                                                    </h4>
                                                    {(() => {
                                                        const item = equippedItems[slotKey].item
                                                        const statValue = item.atk_all_perc || item.def_perc || item.hp_perc
                                                        const statName = item.atk_all_perc ? "ATTACK" : (item.def_perc ? "DEFENSE" : "HP")
                                                        const statColor = item.atk_all_perc ? "text-orange-500" : (item.def_perc ? "text-blue-500" : "text-green-500")
                                                        
                                                        if (!statValue) return null
                                                        return (
                                                            <div className={clsx("text-[10px] font-black italic tracking-widest mt-0.5 uppercase", statColor)}>
                                                                {statName} +{statValue}
                                                            </div>
                                                        )
                                                    })()}
                                                </div>

                                                <div className="h-px bg-white/5 w-full"></div>

                                                <div className="space-y-1.5">
                                                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em]">Item Main Stat</p>
                                                    <div className="relative group/select">
                                                        <select 
                                                            value={equippedItems[slotKey].mainStatKey || ""}
                                                            onChange={(e) => handleItemAction(slotKey, 'SET_MAIN_STAT', { key: e.target.value })}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-3 pr-8 py-2 text-[10px] font-black text-cyan-400 outline-none focus:border-cyan-500/50 transition-all appearance-none cursor-pointer hover:bg-white/[0.07] shadow-inner"
                                                        >
                                                            {ITEM_MAIN_STATS.map(s => (
                                                                <option key={s.key} value={s.key} className="bg-[#0a0a0a] text-white">
                                                                    {s.label} (+{formatValue(s.value)}{s.unit})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500/50 group-hover/select:text-cyan-400 transition-colors">
                                                            <ChevronRight size={12} className="rotate-90" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-100 transition-all duration-500">
                                            <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:border-[#FFD700]/50 transition-all">
                                                <Plus className="w-6 h-6 text-white" />
                                            </div>
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Equip Item</span>
                                        </div>
                                    )}
                                </div>

                                {equippedItems[slotKey].item && (
                                    <div className="space-y-3 pt-4 border-t border-white/5 flex-1">
                                        <div className="grid grid-cols-1 gap-2">
                                            {equippedItems[slotKey].substats.map((sub, idx) => {
                                                const currentStat = SUBSTAT_LIST.find(s => s.key === sub.key)
                                                const totalLevels = equippedItems[slotKey].substats.reduce((sum, s) => sum + (s.level || 0), 0)
                                                const isAllSelected = equippedItems[slotKey].substats.every(s => s.key !== null)
                                                
                                                return (
                                                    <div key={idx} className="flex items-center gap-2 group/sub">
                                                        <div className="relative flex-1">
                                                            <select
                                                                value={sub.key || ''}
                                                                onChange={(e) => handleItemAction(slotKey, 'SUBSTAT_KEY', { index: idx, key: e.target.value })}
                                                                className="w-full bg-black border border-white/5 hover:border-white/20 rounded-xl px-4 py-2.5 text-[10px] font-black text-gray-400 focus:text-white outline-none focus:border-[#FFD700] appearance-none cursor-pointer transition-all shadow-inner"
                                                            >
                                                                <option value="">Choose Stat...</option>
                                                                {SUBSTAT_LIST.map(f => {
                                                                    const isUsed = equippedItems[slotKey].substats.some((s, sIdx) => sIdx !== idx && s.key === f.key)
                                                                    return <option key={f.key} value={f.key} disabled={isUsed}>{f.label}</option>
                                                                })}
                                                            </select>
                                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-700">
                                                                <ChevronRight size={10} className="rotate-90" />
                                                            </div>
                                                        </div>
                                                        
                                                        {sub.key && (
                                                            <div className="flex items-center gap-1.5 bg-black/50 border border-white/5 p-1 rounded-xl">
                                                                <div className="w-12 text-center text-[10px] font-black text-white px-1">
                                                                    {currentStat ? currentStat.values[sub.level || 0] : 0}
                                                                    {sub.key.includes('_perc') || sub.key.includes('rate') || sub.key.includes('dmg') || sub.key.includes('hit') || sub.key.includes('res') ? '%' : ''}
                                                                </div>
                                                                
                                                                <div className="flex items-center gap-1">
                                                                    <button 
                                                                        onClick={() => handleItemAction(slotKey, 'LEVEL_DOWN', { index: idx })}
                                                                        disabled={!isAllSelected || sub.level <= 0}
                                                                        className="w-6 h-6 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                                                                    >
                                                                        -
                                                                    </button>
                                                                    <span className="w-4 text-center text-[9px] font-bold text-[#FFD700]">
                                                                        {sub.level || 0}
                                                                    </span>
                                                                    <button 
                                                                        onClick={() => handleItemAction(slotKey, 'LEVEL_UP', { index: idx })}
                                                                        disabled={!isAllSelected || totalLevels >= 5 || sub.level >= (currentStat?.values.length - 1)}
                                                                        className="w-6 h-6 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                            {!equippedItems[slotKey].substats.every(s => s.key !== null) && (
                                                <div className="text-[8px] font-bold text-gray-600 uppercase tracking-widest text-center animate-pulse">
                                                    Select all 4 stats to unlock levels
                                                </div>
                                            )}
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
