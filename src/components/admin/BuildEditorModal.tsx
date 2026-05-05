"use client"

import { useState } from "react"
import Image from "next/image"
import { clsx } from "clsx"
import { toast } from "sonner"
import SafeImage from "@/components/shared/SafeImage"
import { Marker, ActionLabel } from "@/app/admin/components/AdminEditorial"

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
    { key: "physAtk", label: "Physical Attack", icon: "/about_website/icon_physical_attack.webp" },
    { key: "defense", label: "Defense", icon: "/about_website/icon_defense.webp" },
    { key: "hp", label: "HP", icon: "/about_website/icon_hp.webp" },
    { key: "speed", label: "Speed", icon: "/about_website/icon_speed.webp" },
    { key: "critRate", label: "Crit Rate", icon: "/about_website/icon_crit_rate.webp" },
    { key: "critDamage", label: "Crit Damage", icon: "/about_website/icon_crit_damage.webp" },
    { key: "weaknessHit", label: "Weakness Hit Chance", icon: "/about_website/icon_weakness_hit_chance.webp" },
    { key: "blockRate", label: "Block Rate", icon: "/about_website/icon_block_rate.webp" },
    { key: "damageReduction", label: "Damage Taken Reduction", icon: "/about_website/icon_damage_taken_reduction.webp" },
    { key: "effectHit", label: "Effect Hit Rate", icon: "/about_website/icon_effect_hit_rate.webp" },
    { key: "effectResist", label: "Effect Resistance", icon: "/about_website/icon_effect_resistance.webp" }
]

// ─── Section Label ───────────────────────────────────────────
function SectionLabel({ children, color = "gold" }) {
    const dotColors = {
        gold: "bg-[#FFD700]",
        blue: "bg-blue-400",
        cyan: "bg-cyan-400",
        orange: "bg-orange-400",
        green: "bg-green-400",
        purple: "bg-purple-400"
    }
    return (
        <h4 className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 pb-3 mb-1 border-b border-gray-800/60">
            <div className={clsx("w-1.5 h-1.5 rounded-full", dotColors[color] || dotColors.gold)} />
            {children}
        </h4>
    )
}

export default function BuildEditorModal({ hero, skills, weapons, armors, accessories, initialBuilds, initialSkillPriority, initialIsNewHero, onSave, onClose }) {
    const [builds, setBuilds] = useState(initialBuilds || [])
    const [skillPriority, setSkillPriority] = useState(initialSkillPriority || [])
    const [isNewHero, setIsNewHero] = useState(initialIsNewHero ?? hero.is_new_hero ?? false)
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

    const moveBuild = (index, direction) => {
        const newIndex = index + direction
        if (newIndex < 0 || newIndex >= builds.length) return
        const newBuilds = [...builds]
        const temp = newBuilds[index]
        newBuilds[index] = newBuilds[newIndex]
        newBuilds[newIndex] = temp
        setBuilds(newBuilds)
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4"
            style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.97) 100%)" }}
        >
            <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-3xl overflow-hidden animate-in zoom-in-95 fade-in duration-300"
                style={{
                    background: "linear-gradient(180deg, rgba(18,18,18,1) 0%, rgba(8,8,8,1) 100%)",
                    border: "1px solid rgba(50,50,50,0.7)",
                    boxShadow: "0 0 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.03)"
                }}
            >
                {/* Top accent line */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-60 z-10" />

                {/* Noise texture */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "repeat",
                        backgroundSize: "128px",
                    }}
                />

                {/* Header */}
                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-5 border-b border-gray-800/60 bg-gradient-to-b from-[rgba(20,20,20,0.8)] to-transparent flex-shrink-0 gap-3">
                    <h2 className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-200 flex items-center gap-3 tracking-tight">
                        <Marker color="bg-[#FFD700]" className="w-1.5 h-6" />
                        EDIT_BUILDS
                        <span className="text-gray-500 font-medium text-sm ml-1">{hero.name}</span>
                    </h2>
                    <div className="flex gap-2 flex-wrap items-center">
                        {/* New Hero toggle */}
                        <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-800/80 bg-black/40 cursor-pointer hover:border-[#FFD700]/30 transition-colors group/new">
                            <input
                                type="checkbox"
                                checked={isNewHero}
                                onChange={(e) => setIsNewHero(e.target.checked)}
                                className="w-3.5 h-3.5 rounded border-gray-700 text-[#FFD700] focus:ring-[#FFD700] bg-black cursor-pointer accent-[#FFD700]"
                            />
                            <span className="text-[10px] font-bold text-gray-400 group-hover/new:text-gray-300 uppercase tracking-wider transition-colors select-none">New Hero</span>
                        </label>

                        <button onClick={handleAddBuild} className="bg-gray-800/80 hover:bg-gray-700 text-white px-3 py-2 rounded-xl text-[10px] font-black flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 border border-gray-700/50 hover:border-gray-600 uppercase tracking-wider">
                            <ActionLabel label="ADD_BUILD" color="text-white" />
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-400 hover:to-yellow-400 text-black font-black px-5 py-2 rounded-xl text-[10px] flex items-center gap-1.5 shadow-lg shadow-[#FFD700]/15 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-wider">
                            <ActionLabel label={isSaving ? "SAVING..." : "SAVE_ALL"} color="text-black" />
                        </button>
                        <button onClick={onClose} className="px-3 py-2 hover:bg-red-500/20 hover:text-red-400 rounded-xl text-gray-500 transition-all hover:scale-110 active:scale-95">
                            <ActionLabel label="CLOSE" color="text-red-500" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 custom-scrollbar">

                    {/* Global Skill Priority Section */}
                    <div className="flex items-start gap-5 p-5 rounded-2xl overflow-hidden relative"
                        style={{
                            background: "linear-gradient(135deg, rgba(25,25,25,0.9) 0%, rgba(10,10,10,0.9) 100%)",
                            border: "1px solid rgba(50,50,50,0.5)",
                        }}
                    >
                        {/* BG glow */}
                        <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-10 bg-[#FFD700] pointer-events-none -mr-16 -mt-16" />

                        <div className="relative w-20 h-28 md:w-24 md:h-32 rounded-xl overflow-hidden border border-gray-700/80 flex-shrink-0 shadow-xl group/hero"
                            style={{ boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}
                        >
                            <Image
                                src={`/heroes/${hero.filename}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover/hero:scale-110"
                                alt={hero.name}
                                sizes="(max-width: 768px) 96px, 120px"
                            />
                        </div>

                        <div className="flex-1 relative z-10">
                            <SectionLabel color="gold">Global Skill Priority</SectionLabel>
                            <div className="flex flex-wrap gap-3 mt-3">
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
                                                    "relative w-14 h-14 md:w-16 md:h-16 bg-black rounded-xl cursor-pointer transition-all duration-200 border-2 group/s",
                                                    isSelected
                                                        ? "border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.25)] scale-105 hover:scale-110"
                                                        : "border-gray-800 hover:border-gray-600 hover:scale-105 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                                                )}
                                            >
                                                <div className="relative w-full h-full overflow-hidden rounded-[10px]">
                                                    <SafeImage
                                                        src={`/skills/${s}`}
                                                        fill
                                                        className="object-cover"
                                                        alt="skill"
                                                        sizes="64px"
                                                    />
                                                </div>
                                                {isSelected && (
                                                    <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-[#FFD700] to-yellow-600 text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg border-2 border-black z-10">
                                                        {order}
                                                    </div>
                                                )}
                                                {/* Glow ring on selected */}
                                                {isSelected && (
                                                    <div className="absolute inset-0 rounded-lg border border-[#FFD700]/40 animate-ping pointer-events-none" style={{ animationDuration: "2.5s" }} />
                                                )}
                                            </div>
                                        )
                                    }) : (
                                    <div className="text-xs text-gray-600 bg-black/40 px-4 py-2 rounded-lg border border-gray-800/50">No skills found. Check public/skills/[hero_name]</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Build List */}
                    {builds.map((build, bIndex) => (
                        <div key={build.id} className="relative rounded-2xl p-5 md:p-6 overflow-hidden group/build"
                            style={{
                                background: "linear-gradient(145deg, rgba(15,15,15,1) 0%, rgba(5,5,5,1) 100%)",
                                border: "1px solid rgba(50,50,50,0.5)",
                                boxShadow: "0 4px 30px rgba(0,0,0,0.3)"
                            }}
                        >
                            {/* Corner glow */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD700]/[0.03] rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none group-hover/build:bg-[#FFD700]/[0.06] transition-colors duration-500" />

                            {/* Build number badge */}
                            <div className="absolute top-4 left-5 text-[10px] font-black text-gray-700 uppercase tracking-widest">
                                Build #{bIndex + 1}
                            </div>

                            {/* Action buttons (Move/Delete) */}
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                <div className="flex bg-gray-900/60 rounded-xl border border-gray-800/80 overflow-hidden">
                                    <button
                                        onClick={() => moveBuild(bIndex, -1)}
                                        disabled={bIndex === 0}
                                        className="px-3 py-1.5 hover:bg-white/5 text-gray-400 disabled:opacity-20 transition-colors border-r border-gray-800"
                                        title="Move Up"
                                    >
                                        <ActionLabel label="↑" color="text-inherit" />
                                    </button>
                                    <button
                                        onClick={() => moveBuild(bIndex, 1)}
                                        disabled={bIndex === builds.length - 1}
                                        className="px-3 py-1.5 hover:bg-white/5 text-gray-400 disabled:opacity-20 transition-colors"
                                        title="Move Down"
                                    >
                                        <ActionLabel label="↓" color="text-inherit" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => handleRemoveBuild(bIndex)}
                                    className="text-red-500/60 hover:text-white bg-red-950/20 hover:bg-red-600 px-3 py-2 rounded-xl transition-all duration-200 border border-red-900/30 hover:border-red-500 hover:scale-110 active:scale-95 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                                    title="Delete Build"
                                >
                                    <ActionLabel label="REMOVE" color="text-red-500" className="group-hover:text-white" />
                                </button>
                            </div>

                            {/* Top controls */}
                            <div className="flex flex-wrap gap-4 items-end mb-6 mt-6 pr-14 relative z-10">
                                <div className="w-32">
                                    <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block mb-2 ml-1">C Level</label>
                                    <div className="relative">
                                        <select
                                            value={build.cLevel}
                                            onChange={(e) => updateBuild(bIndex, "cLevel", e.target.value)}
                                            className="w-full bg-black/80 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-[#FFD700] font-black outline-none focus:border-[#FFD700] transition-all appearance-none cursor-pointer"
                                            style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)" }}
                                        >
                                            {["C0", "C1", "C2", "C3", "C4", "C5", "C6"].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <label className="text-[9px] text-gray-500 font-bold uppercase tracking-widest block mb-2 ml-1">Mode Target</label>
                                    <div className="flex gap-2">
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
                                                    "px-5 py-2.5 rounded-xl text-xs font-black border transition-all duration-200 uppercase tracking-wider",
                                                    build.mode.includes(m)
                                                        ? "bg-[#FFD700]/10 border-[#FFD700]/50 text-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.15)] hover:scale-105"
                                                        : "bg-black/60 border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400"
                                                )}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Equipment + Accessory Grid */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6 relative z-10">
                                {/* Equipment */}
                                <div className="space-y-3">
                                    <SectionLabel color="gold">Core Equipment</SectionLabel>
                                    <div className="grid grid-cols-2 gap-2.5">
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
                                    <div className="grid grid-cols-2 gap-2.5">
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
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center pb-3 mb-1 border-b border-gray-800/60">
                                        <span className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                            Accessory
                                        </span>
                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-black/50 text-gray-500 border border-gray-800/50 tabular-nums">{build.accessories?.length || 0}/5</span>
                                    </div>

                                    <div
                                        onClick={() => openItemSelector(accessories, bIndex, "accessories")}
                                        className="grid grid-cols-5 gap-2.5 cursor-pointer group/acc"
                                    >
                                        {Array.from({ length: 5 }).map((_, i) => {
                                            const acc = build.accessories?.[i]
                                            return (
                                                <div key={i} className={clsx(
                                                    "aspect-square rounded-xl border flex items-center justify-center relative overflow-hidden transition-all duration-300",
                                                    acc
                                                        ? "bg-black/50 border-gray-700/80 group-hover/acc:border-[#FFD700]/50 group-hover/acc:shadow-[0_0_10px_rgba(255,215,0,0.1)]"
                                                        : "bg-black/20 border-gray-800/40 border-dashed group-hover/acc:border-[#FFD700]/30 group-hover/acc:bg-[#FFD700]/5"
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
                                                        <ActionLabel label="+" size="text-sm" color="text-gray-800" className="group-hover/acc:text-[#FFD700]/60 transition-colors" />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <p className="text-[9px] text-gray-700 text-center uppercase tracking-widest font-bold">Click to Select</p>

                                    {/* Refining Row */}
                                    <div className="mt-3">
                                        <div className="flex justify-between items-center pb-3 mb-1 border-b border-gray-800/60">
                                            <span className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                                Refining
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-5 gap-2.5 mt-2">
                                            {Array.from({ length: 5 }).map((_, i) => {
                                                const acc = build.accessories?.[i]
                                                const refinedImg = acc?.refined

                                                if (!acc) return (
                                                    <div key={i} className="aspect-square rounded-xl border border-gray-900/20 bg-black/10 flex items-center justify-center opacity-15">
                                                        <div className="w-1 h-1 bg-gray-800 rounded-full" />
                                                    </div>
                                                )

                                                return (
                                                    <div
                                                        key={i}
                                                        onClick={() => openItemSelector(accessories, bIndex, "refining", i)}
                                                        className={clsx(
                                                            "aspect-square rounded-xl border flex items-center justify-center relative overflow-hidden transition-all duration-300 cursor-pointer group/ref",
                                                            refinedImg
                                                                ? "bg-black/50 border-gray-700/80 hover:border-cyan-400/60 hover:shadow-[0_0_10px_rgba(34,211,238,0.15)]"
                                                                : "bg-black/20 border-gray-800/40 border-dashed hover:border-cyan-400/40 hover:bg-cyan-400/5"
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
                                                            <ActionLabel label="+" size="text-xs" color="text-gray-800" className="group-hover/ref:text-cyan-400/60 transition-colors" />
                                                        )}
                                                        {/* Bottom indicator */}
                                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400/30" />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <p className="text-[9px] text-gray-700 mt-2 text-center uppercase tracking-widest font-bold">Select Refining</p>
                                    </div>
                                </div>
                            </div>

                            {/* Minimum Stats */}
                            <div className="pt-5 border-t border-gray-800/40 relative z-10">
                                <SectionLabel color="orange">Minimum Stats</SectionLabel>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                                    {MIN_STATS_KEYS.map(({ key, label, icon }) => (
                                        <div key={key} className="group/stat">
                                            <div className="flex items-center gap-1.5 mb-1.5 ml-0.5">
                                                <div className="w-3.5 h-3.5 relative flex-shrink-0 opacity-50 group-hover/stat:opacity-90 transition-opacity">
                                                    <SafeImage src={icon} fill alt="" className="object-contain" />
                                                </div>
                                                <label className="text-[9px] text-gray-600 font-bold uppercase tracking-wider group-hover/stat:text-gray-400 transition-colors">{label}</label>
                                            </div>
                                            <input
                                                type="text"
                                                value={build.minStats?.[key] || ""}
                                                onChange={(e) => updateMinStat(bIndex, key, e.target.value)}
                                                className="w-full bg-black/60 border border-gray-800/60 rounded-lg px-3 py-2 text-xs text-white focus:border-[#FFD700] focus:shadow-[0_0_8px_rgba(255,215,0,0.15)] outline-none transition-all placeholder-gray-800"
                                                placeholder="—"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Substats */}
                            <div className="mt-6 pt-5 border-t border-gray-800/40 relative z-10">
                                <SectionLabel color="green">Substats Priority</SectionLabel>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {AVAILABLE_SUBSTATS.map(stat => {
                                        const isSelected = build.substats?.includes(stat)
                                        const order = isSelected ? build.substats.indexOf(stat) + 1 : null
                                        return (
                                            <button
                                                key={stat}
                                                onClick={() => toggleSubstat(bIndex, stat)}
                                                className={clsx(
                                                    "px-3 py-2 flex items-center gap-2 text-[10px] font-bold rounded-xl border transition-all duration-200",
                                                    isSelected
                                                        ? "bg-[#FFD700]/10 border-[#FFD700]/50 text-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.1)] scale-105 hover:scale-110"
                                                        : "bg-black/40 border-gray-800/60 text-gray-600 hover:border-gray-600 hover:text-gray-400 hover:bg-black/60"
                                                )}
                                            >
                                                {isSelected && <span className="w-4 h-4 rounded-md bg-gradient-to-br from-[#FFD700] to-yellow-600 text-black flex items-center justify-center text-[9px] font-black shadow-sm flex-shrink-0">{order}</span>}
                                                {stat}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Note */}
                            <div className="mt-6 pt-5 border-t border-gray-800/40 relative z-10">
                                <SectionLabel color="purple">Build Note</SectionLabel>
                                <textarea
                                    value={build.note || ""}
                                    onChange={(e) => updateBuild(bIndex, "note", e.target.value)}
                                    placeholder="Add specific instructions, synergy strategies, or alternative options here..."
                                    className="mt-3 w-full bg-black/50 border border-gray-800/60 rounded-xl p-4 text-sm text-gray-300 min-h-[90px] focus:border-[#FFD700] focus:shadow-[0_0_8px_rgba(255,215,0,0.1)] outline-none resize-y transition-all placeholder-gray-800"
                                />
                            </div>
                        </div>
                    ))}

                    {builds.length === 0 && (
                        <div className="text-center py-24 rounded-2xl"
                            style={{
                                background: "linear-gradient(145deg, rgba(15,15,15,0.5) 0%, rgba(5,5,5,0.5) 100%)",
                                border: "2px dashed rgba(50,50,50,0.4)",
                            }}
                        >
                            <div className="text-[4rem] font-black opacity-5 italic mb-4">NO_DATA</div>
                            <p className="text-gray-600 font-bold uppercase tracking-widest text-xs mb-5">No builds yet</p>
                            <button onClick={handleAddBuild} className="bg-gradient-to-r from-[#FFD700] to-yellow-500 text-black px-6 py-2.5 rounded-xl font-black text-xs shadow-lg shadow-[#FFD700]/15 hover:scale-105 active:scale-95 transition-all uppercase tracking-wider">
                                <ActionLabel label="INITIALIZE PRIMARY BUILD" color="text-black" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Item Selector Modal */}
                {selectorOpen && (
                    <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200"
                        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
                    >
                        <div className="w-full max-w-3xl h-[80vh] flex flex-col rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                            style={{
                                background: "linear-gradient(180deg, rgba(14,14,14,1) 0%, rgba(5,5,5,1) 100%)",
                                border: "1px solid rgba(50,50,50,0.7)",
                                boxShadow: "0 0 60px rgba(0,0,0,0.8)"
                            }}
                        >
                            {/* Selector top accent */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent z-10" />

                            <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-800/50 flex-shrink-0">
                                <h3 className="text-[#FFD700] font-black uppercase tracking-widest flex items-center gap-2.5 text-xs">
                                    <Marker color="bg-[#FFD700]" />
                                    {selectorTarget.type === "accessories"
                                        ? "Select Accessory (Max 5)"
                                        : selectorTarget.type === "refining"
                                            ? "Select Refining Accessory"
                                            : "Select Equipment"}
                                </h3>
                                <div className="flex gap-2 items-center">
                                    {selectorTarget.type === "accessories" && (
                                        <button onClick={confirmMultiSelect} className="bg-gradient-to-r from-[#FFD700] to-yellow-500 text-black px-4 py-2 rounded-xl text-[10px] font-black shadow-lg shadow-[#FFD700]/15 hover:scale-105 active:scale-95 transition-all uppercase tracking-wider">
                                            Confirm ({multiSelection.length})
                                        </button>
                                    )}
                                    <button onClick={() => setSelectorOpen(false)} className="px-3 py-2 bg-gray-800/60 hover:bg-red-500/80 rounded-xl text-gray-500 hover:text-white transition-all hover:scale-110 active:scale-95">
                                        <ActionLabel label="CANCEL" color="text-red-500" className="hover:text-white" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar">
                                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-2.5">
                                    {selectorItems
                                        .filter(img => {
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
                                                        "relative aspect-square rounded-xl overflow-hidden group/item transition-all duration-200",
                                                        isSelected
                                                            ? "border-2 border-[#FFD700] ring-2 ring-[#FFD700]/30 z-10 scale-105 shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                                                            : "border border-gray-800/60 hover:border-gray-600 hover:scale-105 hover:z-10 bg-black/50"
                                                    )}
                                                    title={img}
                                                >
                                                    <Image
                                                        src={`/items/${(selectorTarget.type === 'weapons' ? 'weapon' : selectorTarget.type === 'armors' ? 'armor' : 'accessory')}/${img}`}
                                                        fill
                                                        className="object-cover group-hover/item:scale-110 transition-transform duration-300"
                                                        alt="item"
                                                        sizes="64px"
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute top-1 right-1 bg-gradient-to-br from-[#FFD700] to-yellow-600 text-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg z-10 border border-black text-[10px] font-black">
                                                            OK
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

// ─── Equipment Item Card (Editor) ────────────────────────────
function ItemCard({ item, type, stats, onClick, onStatChange }) {
    const isWeapon = type === "Weapon"
    return (
        <div className={clsx(
            "relative rounded-xl p-2.5 flex gap-2.5 items-center transition-all duration-200 group/item",
            "hover:shadow-lg",
            isWeapon ? "hover:shadow-red-500/10" : "hover:shadow-blue-500/10"
        )}
            style={{
                background: "linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(0,0,0,0.9) 100%)",
                border: `1px solid ${isWeapon ? 'rgba(248,113,113,0.15)' : 'rgba(96,165,250,0.15)'}`,
            }}
        >
            <button
                onClick={onClick}
                className={clsx(
                    "relative w-12 h-12 bg-black rounded-lg border flex-shrink-0 transition-all duration-200 overflow-hidden",
                    isWeapon
                        ? "border-red-500/20 group-hover/item:border-red-400/60 group-hover/item:shadow-[0_0_10px_rgba(248,113,113,0.2)]"
                        : "border-blue-500/20 group-hover/item:border-blue-400/60 group-hover/item:shadow-[0_0_10px_rgba(96,165,250,0.2)]"
                )}
                title={`Select ${type}`}
            >
                {item.image ? (
                    <Image
                        src={`/items/${type.toLowerCase()}/${item.image}`}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                        alt={type}
                        sizes="64px"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-700 uppercase tracking-widest group-hover/item:text-[#FFD700]/50 transition-colors">
                        Select
                    </div>
                )}
            </button>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className={clsx("text-[9px] font-black uppercase tracking-widest mb-1.5", isWeapon ? "text-red-400/80" : "text-blue-400/80")}>{type}</div>
                <div className="relative">
                    <select
                        value={item.stat}
                        onChange={(e) => onStatChange(e.target.value)}
                        className="w-full bg-black/60 border border-gray-800/60 text-[10px] text-gray-400 font-semibold rounded-lg px-2 py-1.5 outline-none focus:border-[#FFD700] transition-all appearance-none cursor-pointer hover:text-gray-300"
                    >
                        {stats.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
        </div>
    )
}
