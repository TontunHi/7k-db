"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, X, Save, Check, Grid, ChevronDown, Trash } from "lucide-react"
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

function SectionLabel({ children, color = "gold" }) {
    const dotColors = {
        gold: "bg-[#FFD700]",
        blue: "bg-blue-400",
        cyan: "bg-cyan-400",
        green: "bg-green-400"
    }
    return (
        <h4 className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 pb-3 mb-1 border-b border-gray-800/60">
            <div className={clsx("w-1.5 h-1.5 rounded-full", dotColors[color] || dotColors.gold)} />
            {children}
        </h4>
    )
}

export default function AdventHeroBuildPicker({ isOpen, onClose, heroFile, initialBuild, items, onSave }) {
    const [build, setBuild] = useState(initialBuild || {
        weapons: [{ image: "", stat: WEAPON_MAIN_STATS[0] }, { image: "", stat: WEAPON_MAIN_STATS[0] }],
        armors: [{ image: "", stat: ARMOR_MAIN_STATS[0] }, { image: "", stat: ARMOR_MAIN_STATS[0] }],
        accessories: [],
        substats: []
    })

    const { weapons, armors, accessories } = items

    const [selectorOpen, setSelectorOpen] = useState(false)
    const [selectorTarget, setSelectorTarget] = useState(null)
    const [selectorItems, setSelectorItems] = useState([])
    const [multiSelection, setMultiSelection] = useState([])

    if (!isOpen) return null

    const updateItem = (type, itemIndex, field, value) => {
        const newBuild = { ...build }
        newBuild[type][itemIndex][field] = value
        setBuild(newBuild)
    }

    const toggleSubstat = (stat) => {
        const current = build.substats || []
        if (current.includes(stat)) {
            setBuild({ ...build, substats: current.filter(s => s !== stat) })
        } else {
            if (current.length >= 5) return toast.error("Max 5 Substats")
            setBuild({ ...build, substats: [...current, stat] })
        }
    }

    const openItemSelector = (itemList, type, itemIndex = null) => {
        setSelectorItems(itemList)
        setSelectorTarget({ type, itemIndex })

        if (type === "accessories") {
            const currentAccs = build.accessories?.map(a => a.image) || []
            setMultiSelection(currentAccs)
        }
        if (type === "refining") {
            setMultiSelection([])
        }
        setSelectorOpen(true)
    }

    const handleSelectorClick = (image) => {
        if (!selectorTarget) return
        const { type, itemIndex } = selectorTarget

        if (type === "accessories") {
            if (multiSelection.includes(image)) {
                setMultiSelection(multiSelection.filter(i => i !== image))
            } else {
                if (multiSelection.length >= 5) return toast.error("Max 5 Accessory")
                setMultiSelection([...multiSelection, image])
            }
        } else if (type === "refining") {
            const newBuild = { ...build }
            newBuild.accessories[itemIndex].refined = image
            setBuild(newBuild)
            setSelectorOpen(false)
        } else {
            const newBuild = { ...build }
            newBuild[type][itemIndex].image = image
            setBuild(newBuild)
            setSelectorOpen(false)
        }
    }

    const confirmMultiSelect = () => {
        if (!selectorTarget || selectorTarget.type !== "accessories") return
        const newBuild = { ...build }
        newBuild.accessories = multiSelection.map(img => ({ image: img }))
        setBuild(newBuild)
        setSelectorOpen(false)
    }

    const handleClear = () => {
        if (confirm("Clear this hero's build?")) {
            onSave(null)
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
        >
            <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden animate-in zoom-in-95"
                style={{
                    background: "linear-gradient(180deg, rgba(14,14,14,1) 0%, rgba(5,5,5,1) 100%)",
                    border: "1px solid rgba(50,50,50,0.7)",
                    boxShadow: "0 0 60px rgba(0,0,0,0.8)"
                }}
            >
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent z-10" />

                <div className="flex justify-between items-center p-5 border-b border-gray-800/50">
                    <h3 className="text-[#FFD700] font-black uppercase tracking-widest flex items-center gap-3">
                        <SafeImage src={`/heroes/${heroFile}`} alt="" width={32} height={32} className="rounded object-cover" />
                        Hero Specific Build
                    </h3>
                    <div className="flex gap-2">
                        {initialBuild && (
                            <button onClick={handleClear} className="px-4 py-2 bg-red-950/30 text-red-500 hover:bg-red-600 hover:text-white rounded-xl text-xs font-black transition-all uppercase flex items-center gap-2">
                                <Trash size={14} /> Clear
                            </button>
                        )}
                        <button onClick={() => onSave(build)} className="px-6 py-2 bg-gradient-to-r from-[#FFD700] to-yellow-500 text-black rounded-xl text-xs font-black shadow-lg shadow-[#FFD700]/15 hover:scale-105 active:scale-95 transition-all uppercase flex items-center gap-2">
                            <Save size={14} /> Apply Build
                        </button>
                        <button onClick={onClose} className="p-2 bg-gray-800/60 hover:bg-red-500/80 rounded-xl text-gray-500 hover:text-white transition-all">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <SectionLabel color="gold">Equipment</SectionLabel>
                            <div className="grid grid-cols-2 gap-3">
                                <ItemCard item={build.weapons[0]} type="Weapon" stats={WEAPON_MAIN_STATS} onClick={() => openItemSelector(weapons, "weapons", 0)} onStatChange={(val) => updateItem("weapons", 0, "stat", val)} />
                                <ItemCard item={build.armors[0]} type="Armor" stats={ARMOR_MAIN_STATS} onClick={() => openItemSelector(armors, "armors", 0)} onStatChange={(val) => updateItem("armors", 0, "stat", val)} />
                                <ItemCard item={build.weapons[1]} type="Weapon" stats={WEAPON_MAIN_STATS} onClick={() => openItemSelector(weapons, "weapons", 1)} onStatChange={(val) => updateItem("weapons", 1, "stat", val)} />
                                <ItemCard item={build.armors[1]} type="Armor" stats={ARMOR_MAIN_STATS} onClick={() => openItemSelector(armors, "armors", 1)} onStatChange={(val) => updateItem("armors", 1, "stat", val)} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-800/60">
                                <span className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                    Accessory
                                </span>
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-black/50 text-gray-500 border border-gray-800/50">{build.accessories?.length || 0}/5</span>
                            </div>

                            <div onClick={() => openItemSelector(accessories, "accessories")} className="grid grid-cols-5 gap-3 cursor-pointer group/acc">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const acc = build.accessories?.[i]
                                    return (
                                        <div key={i} className={clsx(
                                            "aspect-square rounded-xl border flex items-center justify-center relative overflow-hidden transition-all",
                                            acc ? "bg-black/50 border-gray-700/80 group-hover/acc:border-[#FFD700]/50" : "bg-black/20 border-gray-800/40 border-dashed"
                                        )}>
                                            {acc ? <SafeImage src={`/items/accessory/${acc.image}`} fill className="object-cover" /> : <Plus className="w-4 h-4 text-gray-800" />}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="flex justify-between items-center pb-3 border-b border-gray-800/60 mt-4">
                                <span className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                    Refining
                                </span>
                            </div>

                            <div className="grid grid-cols-5 gap-3 mt-2">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const acc = build.accessories?.[i]
                                    const refinedImg = acc?.refined
                                    if (!acc) return <div key={i} className="aspect-square rounded-xl border border-gray-900/20 bg-black/10 flex items-center justify-center opacity-15"><div className="w-1 h-1 bg-gray-800 rounded-full" /></div>
                                    return (
                                        <div key={i} onClick={() => openItemSelector(accessories, "refining", i)} className={clsx(
                                            "aspect-square rounded-xl border flex items-center justify-center relative overflow-hidden cursor-pointer",
                                            refinedImg ? "bg-black/50 border-gray-700/80 hover:border-cyan-400/60" : "bg-black/20 border-gray-800/40 border-dashed hover:border-cyan-400/40"
                                        )}>
                                            {refinedImg ? <SafeImage src={`/items/accessory/${refinedImg}`} fill className="object-cover" /> : <Plus className="w-3.5 h-3.5 text-gray-800" />}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-800/40">
                        <SectionLabel color="green">Substats Priority</SectionLabel>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {AVAILABLE_SUBSTATS.map(stat => {
                                const isSelected = build.substats?.includes(stat)
                                const order = isSelected ? build.substats.indexOf(stat) + 1 : null
                                return (
                                    <button key={stat} onClick={() => toggleSubstat(stat)} className={clsx(
                                        "px-3 py-2 flex items-center gap-2 text-[10px] font-bold rounded-xl border transition-all",
                                        isSelected ? "bg-[#FFD700]/10 border-[#FFD700]/50 text-[#FFD700]" : "bg-black/40 border-gray-800/60 text-gray-600 hover:text-gray-400"
                                    )}>
                                        {isSelected && <span className="w-4 h-4 rounded-md bg-gradient-to-br from-[#FFD700] to-yellow-600 text-black flex items-center justify-center text-[9px] font-black">{order}</span>}
                                        {stat}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Item Selector Modal */}
                {selectorOpen && (
                    <div className="absolute inset-0 z-[70] flex items-center justify-center p-4 animate-in fade-in" style={{ background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)" }}>
                        <div className="w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl overflow-hidden bg-black border border-gray-800">
                            <div className="flex justify-between items-center p-4 border-b border-gray-800">
                                <h3 className="text-[#FFD700] font-black uppercase text-xs">
                                    {selectorTarget.type === "accessories" ? "Select Accessory (Max 5)" : "Select Equipment"}
                                </h3>
                                <div className="flex gap-2">
                                    {selectorTarget.type === "accessories" && (
                                        <button onClick={confirmMultiSelect} className="bg-[#FFD700] text-black px-4 py-2 rounded-xl text-[10px] font-black">
                                            Confirm ({multiSelection.length})
                                        </button>
                                    )}
                                    <button onClick={() => setSelectorOpen(false)} className="p-2 text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                                    {selectorItems.map(img => {
                                        const isSelected = selectorTarget.type === "accessories" ? multiSelection.includes(img) : false
                                        return (
                                            <button key={img} onClick={() => handleSelectorClick(img)} className={clsx(
                                                "relative aspect-square rounded-xl overflow-hidden border",
                                                isSelected ? "border-[#FFD700] ring-2 ring-[#FFD700]/30" : "border-gray-800 hover:border-gray-600"
                                            )}>
                                                <SafeImage src={`/items/${(selectorTarget.type === 'weapons' ? 'weapon' : selectorTarget.type === 'armors' ? 'armor' : 'accessory')}/${img}`} fill className="object-cover" />
                                                {isSelected && <div className="absolute top-1 right-1 bg-[#FFD700] w-4 h-4 rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-black" /></div>}
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
    const isWeapon = type === "Weapon"
    return (
        <div className={clsx("relative rounded-xl p-2.5 flex gap-2.5 items-center border", isWeapon ? "border-red-500/10" : "border-blue-500/10")} style={{ background: "rgba(20,20,20,0.5)" }}>
            <button onClick={onClick} className={clsx("relative w-12 h-12 bg-black rounded-lg border flex-shrink-0 overflow-hidden", isWeapon ? "border-red-500/20" : "border-blue-500/20")}>
                {item.image ? (
                    <SafeImage src={`/items/${type.toLowerCase()}/${item.image}`} fill className="object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-gray-700 uppercase">Select</div>
                )}
            </button>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className={clsx("text-[9px] font-black uppercase tracking-widest mb-1", isWeapon ? "text-red-400/80" : "text-blue-400/80")}>{type}</div>
                <div className="relative">
                    <select value={item.stat} onChange={(e) => onStatChange(e.target.value)} className="w-full bg-black/60 border border-gray-800/60 text-[10px] text-gray-400 rounded-lg px-2 py-1 outline-none">
                        {stats.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>
        </div>
    )
}
