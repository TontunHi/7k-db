"use client"

import { useState } from "react"
import Image from "next/image"
import { Loader2, Plus, Trash, X, Save, Check, Grid } from "lucide-react"
import { clsx } from "clsx"

// Predefined Options
const MAIN_STATS = [
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


export default function BuildEditorModal({ hero, skills, weapons, armors, accessories, initialBuilds, initialSkillPriority, onSave, onClose }) {
    const [builds, setBuilds] = useState(initialBuilds || [])
    const [skillPriority, setSkillPriority] = useState(initialSkillPriority || [])
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
        weapons: [{ image: "", stat: MAIN_STATS[0] }, { image: "", stat: MAIN_STATS[0] }],
        armors: [{ image: "", stat: MAIN_STATS[0] }, { image: "", stat: MAIN_STATS[0] }],
        accessories: [],
        substats: [],
    }

    const handleAddBuild = () => {
        setBuilds([...builds, { ...emptyBuild, id: Date.now() }])
    }

    const handleRemoveBuild = (index) => {
        if (!confirm("Are you sure you want to delete this build?")) return
        const newBuilds = [...builds]
        newBuilds.splice(index, 1)
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
            if (current.length >= 5) return alert("Max 5 Substats")
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

        setSelectorOpen(true)
    }

    const handleSelectorClick = (image) => {
        if (!selectorTarget) return
        const { buildIndex, type, itemIndex } = selectorTarget

        if (type === "accessories") {
            if (multiSelection.includes(image)) {
                setMultiSelection(multiSelection.filter(i => i !== image))
            } else {
                if (multiSelection.length >= 5) return alert("Max 5 Accessories")
                setMultiSelection([...multiSelection, image])
            }
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

        // Sort selection based on the order in selectorItems (l > r > un > c)
        const sortedSelection = selectorItems.filter(item => multiSelection.includes(item));

        newBuilds[buildIndex].accessories = sortedSelection.map(img => ({ image: img }))
        setBuilds(newBuilds)
        setSelectorOpen(false)
    }

    const handleSave = async () => {
        setIsSaving(true)
        await onSave(builds, skillPriority)
        setIsSaving(false)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col relative shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900/50">
                    <h2 className="text-xl font-bold text-[#FFD700] flex items-center gap-2">
                        Edit Builds
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={handleAddBuild} className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Build
                        </button>
                        <button onClick={handleSave} disabled={isSaving} className="bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold px-4 py-1.5 rounded-lg text-sm flex items-center gap-2">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                        </button>
                        <button onClick={onClose} className="p-1.5 hover:bg-gray-800 rounded-full text-gray-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Global Skill Priority Section */}
                    <div className="flex items-start gap-4 p-4 bg-gray-900 rounded-xl border border-gray-800 mb-6">
                        <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-gray-700 flex-shrink-0">
                            <Image src={`/heroes/${hero.filename}`} fill className="object-cover" alt={hero.name} />
                        </div>

                        <div className="flex-1">
                            <p className="text-[#FFD700] font-bold uppercase text-xs mb-3">Global Skill Priority</p>
                            <div className="flex flex-wrap gap-3">
                                {skills.length > 0 ? skills.map((s, i) => {
                                    const isSelected = skillPriority.includes(s)
                                    const order = isSelected ? skillPriority.indexOf(s) + 1 : null
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => toggleSkillPriority(s)}
                                            className={clsx(
                                                "relative w-14 h-14 bg-black rounded-lg cursor-pointer transition-all border-2 group",
                                                isSelected ? "border-[#FFD700] ring-2 ring-[#FFD700]/20" : "border-gray-800 hover:border-gray-600"
                                            )}
                                        >
                                            <Image src={`/skills/${s}`} fill className="object-cover rounded-md" alt="skill" />
                                            {isSelected && (
                                                <div className="absolute -top-2 -right-2 bg-[#FFD700] text-black w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-lg z-10 border-2 border-black">
                                                    {order}
                                                </div>
                                            )}
                                        </div>
                                    )
                                }) : (
                                    <div className="text-sm text-gray-500">No skills found. Check public/skills/[hero_name]</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Build List */}
                    {builds.map((build, bIndex) => (
                        <div key={build.id} className="relative bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 shadow-lg mb-6">
                            <button
                                onClick={() => handleRemoveBuild(bIndex)}
                                className="absolute top-4 right-4 text-red-900 hover:text-red-500 hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                                title="Delete Build"
                            >
                                <Trash className="w-4 h-4" />
                            </button>

                            <div className="flex flex-wrap gap-4 items-center mb-6 pr-12">
                                <div className="w-32">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">C Level</label>
                                    <select
                                        value={build.cLevel}
                                        onChange={(e) => updateBuild(bIndex, "cLevel", e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-[#FFD700] font-bold outline-none focus:border-[#FFD700]"
                                    >
                                        {["C0", "C1", "C2", "C3", "C4", "C5", "C6"].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Mode</label>
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
                                                    "px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors",
                                                    build.mode.includes(m)
                                                        ? "bg-gray-800 border-[#FFD700] text-[#FFD700]"
                                                        : "bg-black border-gray-700 text-gray-500 hover:border-gray-600"
                                                )}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

                                {/* Equipment */}
                                <div className="space-y-4">
                                    <h4 className="text-[#FFD700] text-xs font-bold uppercase border-b border-gray-800 pb-2 mb-2">Equipment</h4>

                                    <div className="grid grid-cols-2 gap-2">
                                        <ItemCard
                                            item={build.weapons[0]}
                                            type="Weapon"
                                            stats={MAIN_STATS}
                                            onClick={() => openItemSelector(weapons, bIndex, "weapons", 0)}
                                            onStatChange={(val) => updateItem(bIndex, "weapons", 0, "stat", val)}
                                        />
                                        <ItemCard
                                            item={build.armors[0]}
                                            type="Armor"
                                            stats={MAIN_STATS}
                                            onClick={() => openItemSelector(armors, bIndex, "armors", 0)}
                                            onStatChange={(val) => updateItem(bIndex, "armors", 0, "stat", val)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <ItemCard
                                            item={build.weapons[1]}
                                            type="Weapon"
                                            stats={MAIN_STATS}
                                            onClick={() => openItemSelector(weapons, bIndex, "weapons", 1)}
                                            onStatChange={(val) => updateItem(bIndex, "weapons", 1, "stat", val)}
                                        />
                                        <ItemCard
                                            item={build.armors[1]}
                                            type="Armor"
                                            stats={MAIN_STATS}
                                            onClick={() => openItemSelector(armors, bIndex, "armors", 1)}
                                            onStatChange={(val) => updateItem(bIndex, "armors", 1, "stat", val)}
                                        />
                                    </div>
                                </div>

                                {/* Accessories */}
                                <div>
                                    <h4 className="flex justify-between items-end border-b border-gray-800 pb-2 mb-2">
                                        <span className="text-[#FFD700] text-xs font-bold uppercase">Accessories</span>
                                        <span className="text-[10px] text-gray-500">{build.accessories?.length || 0}/5 Selected</span>
                                    </h4>

                                    <div
                                        onClick={() => openItemSelector(accessories, bIndex, "accessories")}
                                        className="grid grid-cols-5 gap-1.5 cursor-pointer group"
                                    >
                                        {Array.from({ length: 5 }).map((_, i) => {
                                            const acc = build.accessories?.[i]
                                            return (
                                                <div key={i} className={clsx(
                                                    "aspect-square rounded border flex items-center justify-center relative overflow-hidden transition-all",
                                                    acc
                                                        ? "bg-black border-gray-700 group-hover:border-[#FFD700]"
                                                        : "bg-gray-900 border-gray-800 border-dashed group-hover:border-gray-600"
                                                )}>
                                                    {acc ? (
                                                        <Image src={`/items/accessory/${acc.image}`} fill className="object-cover" alt="acc" />
                                                    ) : (
                                                        <Plus className="w-3 h-3 text-gray-700" />
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2 text-center group-hover:text-[#FFD700]">Click to Select</p>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-800">
                                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-2">Substats Priority</label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_SUBSTATS.map(stat => {
                                        const isSelected = build.substats?.includes(stat)
                                        const order = isSelected ? build.substats.indexOf(stat) + 1 : null
                                        return (
                                            <button
                                                key={stat}
                                                onClick={() => toggleSubstat(bIndex, stat)}
                                                className={clsx(
                                                    "px-3 py-1 flex items-center gap-2 text-xs rounded-full border transition-all",
                                                    isSelected
                                                        ? "bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]"
                                                        : "bg-black border-gray-800 text-gray-500 hover:border-gray-600"
                                                )}
                                            >
                                                {isSelected && <span className="w-4 h-4 rounded-full bg-[#FFD700] text-black flex items-center justify-center text-[9px] font-bold">{order}</span>}
                                                {stat}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-800">
                                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Note</label>
                                <textarea
                                    value={build.note}
                                    onChange={(e) => updateBuild(bIndex, "note", e.target.value)}
                                    placeholder="Additional notes..."
                                    className="w-full bg-black border border-gray-800 rounded-lg p-3 text-sm text-gray-300 h-20 focus:border-[#FFD700] outline-none resize-none"
                                />
                            </div>
                        </div>
                    ))}

                    {builds.length === 0 && (
                        <div className="text-center py-20 text-gray-600">
                            No builds yet. Click "Build" button.
                        </div>
                    )}
                </div>

                {selectorOpen && (
                    <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-[#0f0f0f] border border-gray-700 rounded-xl w-full max-w-2xl h-[70vh] flex flex-col shadow-2xl overflow-hidden">
                            <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#161616]">
                                <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                                    {selectorTarget.type === "accessories" ? "Select Accessories (Max 5)" : "Select Item"}
                                </h3>
                                <div className="flex gap-2">
                                    {selectorTarget.type === "accessories" && (
                                        <button onClick={confirmMultiSelect} className="bg-[#FFD700] text-black px-4 py-1 rounded-md text-xs font-bold hover:bg-[#E5C100]">
                                            Confirm ({multiSelection.length})
                                        </button>
                                    )}
                                    <button onClick={() => setSelectorOpen(false)} className="text-gray-400 hover:text-white px-2"><X className="w-5 h-5" /></button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 bg-[#0a0a0a]">
                                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1">
                                    {selectorItems.map((img) => {
                                        const isSelected = selectorTarget.type === "accessories" ? multiSelection.includes(img) : false
                                        return (
                                            <button
                                                key={img}
                                                onClick={() => handleSelectorClick(img)}
                                                className={clsx(
                                                    "relative aspect-square bg-[#1a1a1a] border rounded overflow-hidden group transition-all",
                                                    isSelected ? "border-[#FFD700] ring-1 ring-[#FFD700] z-10" : "border-gray-800 hover:border-[#FFD700] hover:z-10"
                                                )}
                                                title={img}
                                            >
                                                <Image
                                                    src={`/items/${(selectorTarget.type === 'weapons' ? 'weapon' : selectorTarget.type === 'armors' ? 'armor' : 'accessory')}/${img}`}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform"
                                                    alt="item"
                                                />
                                                {isSelected && (
                                                    <div className="absolute top-0.5 right-0.5 bg-[#FFD700] text-black w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold shadow-sm z-10">
                                                        <Check className="w-2 h-2" />
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
        <div className="bg-[#0f0f0f] rounded-lg p-2 flex gap-2 items-center border border-gray-800 hover:border-gray-700 transition-colors">
            <button
                onClick={onClick}
                className="relative w-12 h-12 bg-black rounded border border-gray-700 hover:border-[#FFD700] flex-shrink-0 transition-colors"
                title={`Select ${type}`}
            >
                {item.image ? (
                    <Image src={`/items/${type.toLowerCase()}/${item.image}`} fill className="object-cover rounded-[3px]" alt={type} />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[8px] text-gray-700 uppercase tracking-wider">Select</div>
                )}
            </button>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <div className={clsx("text-[9px] font-bold uppercase tracking-wider", type === "Weapon" ? "text-red-400" : "text-blue-400")}>{type}</div>
                </div>
                <select
                    value={item.stat}
                    onChange={(e) => onStatChange(e.target.value)}
                    className="w-full bg-black border border-gray-700 text-[10px] text-gray-300 rounded px-1.5 py-1 outline-none focus:border-gray-600"
                >
                    {stats.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </div>
    )
}
