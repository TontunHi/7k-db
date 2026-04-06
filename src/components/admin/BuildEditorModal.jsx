"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, Plus, Trash, X, Save, Check, Grid } from "lucide-react"
import { clsx } from "clsx"
import { toast } from "sonner"
import SafeImage from "@/components/shared/SafeImage"

// Predefined Options
const WEAPON_MAIN_STATS = [
    "Weakness Hit Chance",
    "Crit Rate",
    "Crit Damage",
    "All Attack (%)",
    "All Attack",
    "Defense (%)",
    "Defense",
    "HP (%)",
    "HP",
    "Effect Hit Rate"
]

const ARMOR_MAIN_STATS = [
    "Damage Taken Reduction",
    "Block Rate",
    "All Attack (%)",
    "All Attack",
    "Defense (%)",
    "Defense",
    "HP (%)",
    "HP",
    "Effect Resistance"
]

const AVAILABLE_SUBSTATS = [
    "All Attack (%)",
    "Defense (%)",
    "HP (%)",
    "Crit Rate",
    "Weakness Hit Chance",
    "Effect Hit Rate",
    "All Attack",
    "Defense",
    "HP",
    "Speed",
    "Crit Damage",
    "Block Rate",
    "Effect Resistance"
]

const MIN_STATS_KEYS = [
    { key: "physAtk", label: "Physical Attack" },
    { key: "defense", label: "Defense" },
    { key: "hp", label: "HP" },
    { key: "speed", label: "Speed" },
    { key: "critRate", label: "Crit Rate" },
    { key: "critDamage", label: "Crit Damage" },
    { key: "weaknessHit", label: "Weakness Hit Chance" },
    { key: "blockRate", label: "Block Rate" },
    { key: "damageReduction", label: "Damage Taken Reduction" },
    { key: "effectHit", label: "Effect Hit Rate" },
    { key: "effectResist", label: "Effect Resistance" }
]

export default function BuildEditorModal({ hero, skills, weapons, armors, accessories, initialBuilds, initialSkillPriority, onSave, onClose }) {
    const [builds, setBuilds] = useState(initialBuilds || [])
    const [skillPriority, setSkillPriority] = useState(initialSkillPriority || [])
    const [isNewHero, setIsNewHero] = useState(hero.is_new_hero || false)
    const [isSaving, setIsSaving] = useState(false)

    // Item Selector State
    const [selectorOpen, setSelectorOpen] = useState(false)
    const [selectorTarget, setSelectorTarget] = useState(null)
    const [selectorItems, setSelectorItems] = useState([])
    const [multiSelection, setMultiSelection] = useState([])

    const emptyBuild = {
        id: Date.now(),
        cLevel: "C0",
        mode: ["PVE", "PVP"],
        note: "",
        weapons: [{ image: "", stat: WEAPON_MAIN_STATS[0] }, { image: "", stat: WEAPON_MAIN_STATS[0] }],
        armors: [{ image: "", stat: ARMOR_MAIN_STATS[0] }, { image: "", stat: ARMOR_MAIN_STATS[0] }],
        accessories: [],
        substats: [],
        minStats: {}
    }

    const handleAddBuild = () => {
        setBuilds([...builds, { ...emptyBuild, id: Date.now() }])
    }

    const handleRemoveBuild = (index) => {
        if (!window.confirm("Are you sure you want to delete this build?")) return
        const newBuilds = [...builds]
        newBuilds.splice(index, 1)
        setBuilds(newBuilds)
        toast.info("Build removed.")
    }

    const updateBuild = (index, field, value) => {
        const newBuilds = [...builds]
        newBuilds[index][field] = value
        setBuilds(newBuilds)
    }

    const updateItem = (buildIndex, type, itemIndex, field, value) => {
        const newBuilds = [...builds]
        newBuilds[buildIndex][type][itemIndex][field] = value
        setBuilds(newBuilds)
    }

    const updateMinStat = (buildIndex, key, value) => {
        const newBuilds = [...builds]
        const currentStats = { ...(newBuilds[buildIndex].minStats || {}) }
        if (value === "") {
            delete currentStats[key]
        } else {
            currentStats[key] = value
        }
        newBuilds[buildIndex].minStats = currentStats
        setBuilds(newBuilds)
    }

    const toggleSkillPriority = (skillPath) => {
        let current = [...skillPriority]
        if (current.includes(skillPath)) {
            current = current.filter(s => s !== skillPath)
        } else {
            current = [...current, skillPath]
        }
        setSkillPriority(current)
    }

    const toggleSubstat = (buildIndex, stat) => {
        const newBuilds = [...builds]
        const current = newBuilds[buildIndex].substats || []
        if (current.includes(stat)) {
            newBuilds[buildIndex].substats = current.filter(s => s !== stat)
        } else {
            if (current.length >= 5) return toast.error("Max 5 Substats")
            newBuilds[buildIndex].substats = [...current, stat]
        }
        setBuilds(newBuilds)
    }

    const openItemSelector = (items, buildIndex, type, itemIndex = null) => {
        setSelectorItems(items)
        setSelectorTarget({ buildIndex, type, itemIndex })

        if (type === "accessories") {
            const currentAccs = builds[buildIndex].accessories?.map(a => a.image) || []
            setMultiSelection(currentAccs)
        }

        if (type === "refining") {
            // No multi-selection for refining, it's a single selection per slot
            setMultiSelection([])
        }

        setSelectorOpen(true)
    }

    const handleSelectorClick = (image) => {
        if (!selectorTarget) return
        const { buildIndex, type, itemIndex } = selectorTarget

        if (type === "accessories") {
            if (multiSelection.includes(image)) {
                setMultiSelection(multiSelection.filter(i => i !== image))
            } else {
                if (multiSelection.length >= 5) return toast.error("Max 5 Accessory")
                setMultiSelection([...multiSelection, image])
            }
        } else if (type === "refining") {
            const newBuilds = [...builds]
            newBuilds[buildIndex].accessories[itemIndex].refined = image
            setBuilds(newBuilds)
            setSelectorOpen(false)
        } else {
            const newBuilds = [...builds]
            newBuilds[buildIndex][type][itemIndex].image = image
            setBuilds(newBuilds)
            setSelectorOpen(false)
        }
    }

    const confirmMultiSelect = () => {
        if (!selectorTarget || selectorTarget.type !== "accessories") return
        const { buildIndex } = selectorTarget
        const newBuilds = [...builds]

        // Keep the order of selection (multiSelection) instead of auto-sorting
        newBuilds[buildIndex].accessories = multiSelection.map(img => ({ image: img }))
        setBuilds(newBuilds)
        setSelectorOpen(false)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await onSave(builds, skillPriority, isNewHero)
            onClose()
        } catch (err) {
            console.error(err)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gradient-to-b from-gray-900/80 to-transparent">
                    <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-200 flex items-center gap-3 tracking-tight">
                        <div className="p-2 bg-[#FFD700]/10 rounded-xl">
                            <Grid className="w-5 h-5 text-[#FFD700]" />
                        </div>
                        Edit Builds <span className="text-gray-500 font-medium text-lg ml-2">{hero.name}</span>
                    </h2>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700">
                            <input
                                type="checkbox"
                                id="newHeroCheckbox"
                                checked={isNewHero}
                                onChange={(e) => setIsNewHero(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-700 text-[#FFD700] focus:ring-[#FFD700] bg-black cursor-pointer"
                            />
                            <label htmlFor="newHeroCheckbox" className="text-sm font-bold text-gray-300 cursor-pointer select-none">
                                New Hero
                            </label>
                        </div>
                        <button onClick={handleAddBuild} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:shadow-lg">
                            <Plus className="w-4 h-4" /> New Build
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-400 hover:to-yellow-400 text-black font-extrabold px-6 py-2 rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-[#FFD700]/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save All
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-xl text-gray-400 transition-colors ml-2">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                    {/* Global Skill Priority Section */}
                    <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-gray-900/60 to-[#0a0a0a] rounded-2xl border border-gray-800 shadow-inner">
                        <div className="relative w-24 h-32 rounded-xl overflow-hidden border-2 border-gray-700 flex-shrink-0 shadow-xl shadow-black">
                            <Image 
                                src={`/heroes/${hero.filename}`} 
                                fill 
                                className="object-cover" 
                                alt={hero.name} 
                                sizes="(max-width: 768px) 96px, 120px"
                            />
                        </div>

                        <div className="flex-1">
                            <p className="text-[#FFD700] font-bold uppercase tracking-widest text-xs mb-4">Global Skill Priority</p>
                            <div className="flex flex-wrap gap-4">
                                {skills.length > 0 ? [...skills]
                                    .sort((a, b) => {
                                        const numA = parseInt(a.replace(/\.[^/.]+$/, '')) || 0
                                        const numB = parseInt(b.replace(/\.[^/.]+$/, '')) || 0
                                        return numB - numA
                                    })
                                    .map((s, i) => {
                                        const isSelected = skillPriority.includes(s)
                                        const order = isSelected ? skillPriority.indexOf(s) + 1 : null
                                        return (
                                            <div
                                                key={i}
                                                onClick={() => toggleSkillPriority(s)}
                                                className={clsx(
                                                    "relative w-16 h-16 bg-black rounded-xl cursor-pointer transition-all border-2 group shadow-md",
                                                    isSelected ? "border-[#FFD700] ring-4 ring-[#FFD700]/20 scale-105" : "border-gray-800 hover:border-gray-500 hover:scale-105"
                                                )}
                                            >
                                                <SafeImage 
                                                    src={`/skills/${s}`} 
                                                    fill 
                                                    className="object-cover rounded-lg" 
                                                    alt="skill" 
                                                    sizes="64px"
                                                />
                                                {isSelected && (
                                                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-[#FFD700] to-yellow-600 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-lg shadow-[#FFD700]/50 border-2 border-black z-10 transform scale-110">
                                                        {order}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }) : (
                                    <div className="text-sm text-gray-500 bg-black/50 px-4 py-2 rounded-lg border border-gray-800">No skills found. Check public/skills/[hero_name]</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Build List */}
                    {builds.map((build, bIndex) => (
                        <div key={build.id} className="relative bg-black border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group/build">
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                            <button
                                onClick={() => handleRemoveBuild(bIndex)}
                                className="absolute top-6 right-6 text-red-400 hover:text-white bg-red-950/30 hover:bg-red-600 p-3 rounded-xl transition-all border border-red-900/50 hover:border-red-500 z-10 hover:scale-110 shadow-lg"
                                title="Delete Build"
                            >
                                <Trash className="w-5 h-5" />
                            </button>

                            <div className="flex flex-wrap gap-6 items-end mb-8 pr-16 relative z-10">
                                <div className="w-36">
                                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2 ml-1">C Level</label>
                                    <div className="relative">
                                        <select
                                            value={build.cLevel}
                                            onChange={(e) => updateBuild(bIndex, "cLevel", e.target.value)}
                                            className="w-full bg-gray-900 border-2 border-gray-800 rounded-xl px-4 py-3 text-sm text-[#FFD700] font-black outline-none focus:border-[#FFD700] transition-colors appearance-none shadow-inner cursor-pointer"
                                        >
                                            {["C0", "C1", "C2", "C3", "C4", "C5", "C6"].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-2 ml-1">Mode Target</label>
                                    <div className="flex gap-3">
                                        {["PVE", "PVP"].map(m => (
                                            <button
                                                key={m}
                                                onClick={() => {
                                                    const newModes = build.mode.includes(m)
                                                        ? build.mode.filter(x => x !== m)
                                                        : [...build.mode, m]
                                                    updateBuild(bIndex, "mode", newModes)
                                                }}
                                                className={clsx(
                                                    "px-6 py-3 rounded-xl text-sm font-black border-2 transition-all shadow-lg",
                                                    build.mode.includes(m)
                                                        ? "bg-gradient-to-br from-gray-800 to-gray-900 border-[#FFD700] text-[#FFD700] shadow-[#FFD700]/20"
                                                        : "bg-black border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"
                                                )}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8 relative z-10">
                                {/* Equipment */}
                                <div className="space-y-5">
                                    <h4 className="text-[#FFD700] text-xs font-black uppercase tracking-widest border-b border-gray-800 pb-3 mb-2 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FFD700]"></div>
                                        Core Equipment
                                    </h4>

                                    <div className="grid grid-cols-2 gap-3">
                                        <ItemCard
                                            item={build.weapons[0]}
                                            type="Weapon"
                                            stats={WEAPON_MAIN_STATS}
                                            onClick={() => openItemSelector(weapons, bIndex, "weapons", 0)}
                                            onStatChange={(val) => updateItem(bIndex, "weapons", 0, "stat", val)}
                                        />
                                        <ItemCard
                                            item={build.armors[0]}
                                            type="Armor"
                                            stats={ARMOR_MAIN_STATS}
                                            onClick={() => openItemSelector(armors, bIndex, "armors", 0)}
                                            onStatChange={(val) => updateItem(bIndex, "armors", 0, "stat", val)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <ItemCard
                                            item={build.weapons[1]}
                                            type="Weapon"
                                            stats={WEAPON_MAIN_STATS}
                                            onClick={() => openItemSelector(weapons, bIndex, "weapons", 1)}
                                            onStatChange={(val) => updateItem(bIndex, "weapons", 1, "stat", val)}
                                        />
                                        <ItemCard
                                            item={build.armors[1]}
                                            type="Armor"
                                            stats={ARMOR_MAIN_STATS}
                                            onClick={() => openItemSelector(armors, bIndex, "armors", 1)}
                                            onStatChange={(val) => updateItem(bIndex, "armors", 1, "stat", val)}
                                        />
                                    </div>
                                </div>

                                {/* Accessory */}
                                <div className="space-y-5">
                                    <h4 className="flex justify-between items-end border-b border-gray-800 pb-3 mb-2">
                                        <span className="text-[#FFD700] text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                            Accessory
                                        </span>
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-900 text-gray-400 border border-gray-800">{build.accessories?.length || 0}/5</span>
                                    </h4>

                                    <div
                                        onClick={() => openItemSelector(accessories, bIndex, "accessories")}
                                        className="grid grid-cols-5 gap-3 cursor-pointer group"
                                    >
                                        {Array.from({ length: 5 }).map((_, i) => {
                                            const acc = build.accessories?.[i]
                                            return (
                                                <div key={i} className={clsx(
                                                    "aspect-square rounded-xl border-2 flex items-center justify-center relative overflow-hidden transition-all duration-300 shadow-inner",
                                                    acc
                                                        ? "bg-gray-900 border-gray-700 group-hover:border-[#FFD700]"
                                                        : "bg-black border-gray-800 border-dashed group-hover:border-[#FFD700]/50 group-hover:bg-[#FFD700]/5"
                                                )}>
                                                    {acc ? (
                                                        <Image 
                                                            src={`/items/accessory/${acc.image}`} 
                                                            fill 
                                                            className="object-cover hover:scale-110 transition-transform duration-500" 
                                                            alt="acc" 
                                                            sizes="64px"
                                                        />
                                                    ) : (
                                                        <Plus className="w-5 h-5 text-gray-800 group-hover:text-[#FFD700] transition-colors" />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-600 mt-4 text-center group-hover:text-[#FFD700] transition-colors uppercase tracking-widest font-bold font-mono">Click to Select Accessory</p>
                                </div>

                                {/* Refining Row */}
                                <div className="space-y-5">
                                    <h4 className="flex justify-between items-end border-b border-gray-800 pb-3 mb-2">
                                        <span className="text-[#FFD700] text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400"></div>
                                            Refining
                                        </span>
                                    </h4>

                                    <div className="grid grid-cols-5 gap-3">
                                        {Array.from({ length: 5 }).map((_, i) => {
                                            const acc = build.accessories?.[i]
                                            const refinedImg = acc?.refined
                                            
                                            // Refining is only possible if a main accessory exists for this slot
                                            if (!acc) return (
                                                <div key={i} className="aspect-square rounded-xl border-2 border-gray-900/30 bg-black/20 flex items-center justify-center opacity-20">
                                                    <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
                                                </div>
                                            )

                                            return (
                                                <div 
                                                    key={i} 
                                                    onClick={() => openItemSelector(accessories, bIndex, "refining", i)}
                                                    className={clsx(
                                                        "aspect-square rounded-xl border-2 flex items-center justify-center relative overflow-hidden transition-all duration-300 shadow-inner cursor-pointer group/ref",
                                                        refinedImg
                                                            ? "bg-gray-900 border-gray-700 hover:border-cyan-400"
                                                            : "bg-black border-gray-800 border-dashed hover:border-cyan-400/50 hover:bg-cyan-400/5"
                                                    )}
                                                >
                                                    {refinedImg ? (
                                                        <Image 
                                                            src={`/items/accessory/${refinedImg}`} 
                                                            fill 
                                                            className="object-cover hover:scale-110 transition-transform duration-500" 
                                                            alt="refined" 
                                                            sizes="64px"
                                                        />
                                                    ) : (
                                                        <Plus className="w-4 h-4 text-gray-800 group-hover/ref:text-cyan-400 transition-colors" />
                                                    )}
                                                    
                                                    {/* Small Indicator of which accessory this refines */}
                                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400/30"></div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-600 mt-4 text-center uppercase tracking-widest font-bold font-mono">Select Refining for each Slot</p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-800 relative z-10">
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-4 ml-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                                    Minimum Stats
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {MIN_STATS_KEYS.map(({ key, label }) => (
                                        <div key={key} className="space-y-1.5">
                                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider ml-1">{label}</label>
                                            <input
                                                type="text"
                                                value={build.minStats?.[key] || ""}
                                                onChange={(e) => updateMinStat(bIndex, key, e.target.value)}
                                                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFD700] outline-none transition-colors"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-800 relative z-10">
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-4 ml-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                    Substats Priority
                                </label>
                                <div className="flex flex-wrap gap-2.5">
                                    {AVAILABLE_SUBSTATS.map(stat => {
                                        const isSelected = build.substats?.includes(stat)
                                        const order = isSelected ? build.substats.indexOf(stat) + 1 : null
                                        return (
                                            <button
                                                key={stat}
                                                onClick={() => toggleSubstat(bIndex, stat)}
                                                className={clsx(
                                                    "px-4 py-2 flex items-center gap-2 text-xs font-bold rounded-xl border-2 transition-all duration-200",
                                                    isSelected
                                                        ? "bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.15)] transform scale-105"
                                                        : "bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300 hover:bg-gray-900"
                                                )}
                                            >
                                                {isSelected && <span className="w-5 h-5 rounded-md bg-gradient-to-br from-[#FFD700] to-yellow-600 text-black flex items-center justify-center text-[10px] font-black shadow-sm">{order}</span>}
                                                {stat}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-800 relative z-10">
                                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest block mb-3 ml-1 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                    Build Note
                                </label>
                                <textarea
                                    value={build.note}
                                    onChange={(e) => updateBuild(bIndex, "note", e.target.value)}
                                    placeholder="Add specific instructions, synergy strategies, or alternative options here..."
                                    className="w-full bg-gray-900/50 border-2 border-gray-800 rounded-xl p-4 text-sm text-gray-200 min-h-[100px] focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none resize-y transition-all placeholder-gray-700"
                                />
                            </div>
                        </div>
                    ))}

                    {builds.length === 0 && (
                        <div className="text-center py-32 bg-gray-900/20 border-2 border-dashed border-gray-800 rounded-3xl">
                            <Grid className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                            <p className="text-gray-500 font-bold uppercase tracking-widest mb-4">No builds yet</p>
                            <button onClick={handleAddBuild} className="bg-[#FFD700] text-black px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-yellow-400 transition-colors">
                                Create Primary Build
                            </button>
                        </div>
                    )}
                </div>

                {selectorOpen && (
                    <div className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-[#0a0a0a] border border-gray-700 rounded-3xl w-full max-w-3xl h-[80vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gradient-to-b from-gray-900 to-[#0a0a0a]">
                                <h3 className="text-[#FFD700] font-black uppercase tracking-widest flex items-center gap-3 text-sm">
                                    <Grid className="w-5 h-5" />
                                    {selectorTarget.type === "accessories" 
                                        ? "Select Accessory (Max 5)" 
                                        : selectorTarget.type === "refining" 
                                            ? "Select Refining Accessory" 
                                            : "Select Equipment"}
                                </h3>
                                <div className="flex gap-3 items-center">
                                    {selectorTarget.type === "accessories" && (
                                        <button onClick={confirmMultiSelect} className="bg-gradient-to-r from-[#FFD700] to-yellow-500 text-black px-6 py-2 rounded-xl text-sm font-black shadow-lg shadow-[#FFD700]/20 hover:scale-105 active:scale-95 transition-all">
                                            Confirm ({multiSelection.length})
                                        </button>
                                    )}
                                    <button onClick={() => setSelectorOpen(false)} className="bg-gray-800 hover:bg-red-500 rounded-xl p-2 text-gray-400 hover:text-white transition-all">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 bg-[#050505] custom-scrollbar">
                                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-3">
                                    {selectorItems
                                        .filter(img => {
                                            // If refining, cannot select the same image as the main accessory for this slot
                                            if (selectorTarget.type === "refining") {
                                                const mainAcc = builds[selectorTarget.buildIndex].accessories[selectorTarget.itemIndex].image
                                                return img !== mainAcc
                                            }
                                            return true
                                        })
                                        .map((img) => {
                                            const isSelected = selectorTarget.type === "accessories" ? multiSelection.includes(img) : false
                                        return (
                                            <button
                                                key={img}
                                                onClick={() => handleSelectorClick(img)}
                                                className={clsx(
                                                    "relative aspect-square bg-[#111] border-2 rounded-xl overflow-hidden group transition-all shadow-md",
                                                    isSelected ? "border-[#FFD700] ring-4 ring-[#FFD700]/30 z-10 scale-105" : "border-gray-800 hover:border-gray-500 hover:z-10 hover:scale-105"
                                                )}
                                                title={img}
                                            >
                                                <Image
                                                    src={`/items/${(selectorTarget.type === 'weapons' ? 'weapon' : selectorTarget.type === 'armors' ? 'armor' : 'accessory')}/${img}`}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    alt="item"
                                                    sizes="64px"
                                                />
                                                {isSelected && (
                                                    <div className="absolute top-1.5 right-1.5 bg-gradient-to-br from-[#FFD700] to-yellow-600 text-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg z-10 border border-black transform scale-110">
                                                        <Check className="w-3 h-3 font-black" />
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}

function ItemCard({ item, type, stats, onClick, onStatChange }) {
    return (
        <div className="bg-gradient-to-r from-gray-900/80 to-black rounded-xl p-3 flex gap-3 items-center border border-gray-800 hover:border-[#FFD700]/50 hover:shadow-lg hover:shadow-[#FFD700]/5 transition-all group/item">
            <button
                onClick={onClick}
                className="relative w-14 h-14 bg-black rounded-lg border-2 border-gray-700 group-hover/item:border-[#FFD700] flex-shrink-0 transition-colors shadow-inner overflow-hidden"
                title={`Select ${type}`}
            >
                {item.image ? (
                    <Image 
                        src={`/items/${type.toLowerCase()}/${item.image}`} 
                        fill 
                        className="object-cover hover:scale-110 transition-transform" 
                        alt={type} 
                        sizes="64px"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-700 uppercase tracking-widest bg-gray-900/50 group-hover/item:text-[#FFD700] group-hover/item:bg-[#FFD700]/5 transition-colors">Select</div>
                )}
            </button>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-center mb-1.5">
                    <div className={clsx("text-[10px] font-black uppercase tracking-widest", type === "Weapon" ? "text-red-400" : "text-blue-400")}>{type}</div>
                </div>
                <div className="relative">
                    <select
                        value={item.stat}
                        onChange={(e) => onStatChange(e.target.value)}
                        className="w-full bg-black/60 border border-gray-700 text-xs text-gray-300 font-bold rounded-lg px-2 py-1.5 outline-none focus:border-[#FFD700] transition-colors appearance-none cursor-pointer"
                    >
                        {stats.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 text-[10px]">▼</div>
                </div>
            </div>
        </div>
    )
}
