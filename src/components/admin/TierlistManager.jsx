"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { clsx } from "clsx"
import { Loader2, Plus, X, Trash2 } from "lucide-react"
import { getTierlistData, saveTierlistEntry, removeTierlistEntry } from "@/lib/tierlist-db"

const CATEGORIES = ["PVE", "PVP", "Raid", "GVG", "ART", "Tower"]
const RANKS = ["EX", "S", "A", "B", "C", "D", "E"]
const TYPES = ["Attack", "Magic", "Defense", "Support", "Universal"]

export default function TierlistManager({ heroes }) {
    const [category, setCategory] = useState("PVE")
    const [tierData, setTierData] = useState([]) // [{ heroFilename, rank, type }]
    const [loading, setLoading] = useState(false)

    // Selection Modal State
    const [selectedHero, setSelectedHero] = useState(null)
    const [selectionStep, setSelectionStep] = useState(0) // 0: None, 1: Rank, 2: Type
    const [tempRank, setTempRank] = useState(null)

    // Drag State
    const [draggedHero, setDraggedHero] = useState(null) // { heroFilename, source: 'pool'|'grid' }

    useEffect(() => {
        fetchData()
    }, [category])

    async function fetchData() {
        setLoading(true)
        try {
            const data = await getTierlistData(category)
            setTierData(data || [])
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Filter Pool: Show ALL heroes 
    const poolHeroes = heroes

    const handleHeroClick = (hero) => {
        setSelectedHero(hero)
        setSelectionStep(1) // Start Rank Selection
        setTempRank(null)
    }

    const selectRank = (rank) => {
        setTempRank(rank)
        setSelectionStep(2) // Move to Type Selection
    }

    const selectType = async (type) => {
        if (!selectedHero || !tempRank) return

        try {
            await saveTierlistEntry({
                heroFilename: selectedHero.filename,
                category: category,
                rank: tempRank,
                type: type
            })
            await fetchData()
            closeModal()
        } catch (err) {
            alert("Failed to save: " + err.message)
        }
    }

    const handleRemove = async (entry) => {
        // if (!confirm(`Remove ${entry.heroFilename} from tier list?`)) return // Removed confirm dialog for smoother click removal if desired, or keep it. User asked "Can remove".
        // Let's keep one-click remove or DnD remove. Drag to pool removes. Click to remove initiates confirm.
        if (!confirm(`Remove ${entry.heroFilename}?`)) return
        try {
            await removeTierlistEntry(entry.heroFilename, category)
            await fetchData()
        } catch (err) {
            alert("Failed to remove")
        }
    }

    const closeModal = () => {
        setSelectedHero(null)
        setSelectionStep(0)
        setTempRank(null)
    }

    // --- DnD Handlers ---
    const onDragStart = (e, heroFilename, source) => {
        setDraggedHero({ heroFilename, source })
        e.dataTransfer.effectAllowed = "move"
        // Optional: Set Drag Image
    }

    const onDragOver = (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    }

    const onDropCell = async (e, rank, type) => {
        e.preventDefault()
        if (!draggedHero) return

        // If dropping onto same cell, do nothing? (Optimization)

        try {
            await saveTierlistEntry({
                heroFilename: draggedHero.heroFilename,
                category: category,
                rank: rank,
                type: type
            })
            setDraggedHero(null)
            await fetchData()
        } catch (err) {
            alert("Failed to move hero")
        }
    }

    const onDropPool = async (e) => {
        e.preventDefault()
        if (!draggedHero) return

        // If dragging from grid -> pool, remove it
        if (draggedHero.source === 'grid') {
            try {
                await removeTierlistEntry(draggedHero.heroFilename, category)
                setDraggedHero(null)
                await fetchData()
            } catch (err) {
                alert("Failed to remove hero")
            }
        }
    }


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white mb-6">Tier List Manager</h1>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 pb-4 border-b border-gray-800">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={clsx(
                            "px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all",
                            category === cat
                                ? "bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20"
                                : "bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Matrix Grid */}
            <div className="bg-[#0f0f0f] border border-gray-800 rounded-xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                        <tr>
                            <th className="p-4 bg-gray-900 border-b border-r border-gray-800 w-32 font-bold text-gray-400 uppercase text-xs">Rank \ Type</th>
                            {TYPES.map(type => (
                                <th key={type} className="p-4 bg-gray-900 border-b border-gray-800 text-center border-l border-gray-800">
                                    <div className="relative h-8 w-24 mx-auto">
                                        <Image src={`/logo_tiers/type/${type.toLowerCase()}.png`} fill className="object-contain" alt={type} />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {RANKS.map(rank => (
                            <tr key={rank} className="border-b border-gray-800/50 hover:bg-gray-900/20">
                                <th className="p-4 bg-gray-900/50 border-r border-gray-800 font-bold text-gray-300 text-center">
                                    <div className="relative h-12 w-12 mx-auto">
                                        <Image src={`/logo_tiers/rank_tier/${rank}.png`} fill className="object-contain" alt={rank} />
                                    </div>
                                </th>
                                {TYPES.map(type => {
                                    const cellHeroes = tierData.filter(d => d.rank === rank && d.type === type)

                                    return (
                                        <td
                                            key={type}
                                            className="p-2 border-l border-gray-800/50 min-h-[100px] align-top w-[18%]"
                                            onDragOver={onDragOver}
                                            onDrop={(e) => onDropCell(e, rank, type)}
                                        >
                                            <div className="flex flex-wrap gap-2 justify-center min-h-[80px]">
                                                {cellHeroes.map(entry => (
                                                    <div
                                                        key={entry.heroFilename}
                                                        className="relative w-12 h-14 bg-black rounded border border-gray-700 overflow-hidden cursor-pointer group hover:scale-110 transition-transform shadow-sm"
                                                        onClick={() => handleRemove(entry)}
                                                        draggable
                                                        onDragStart={(e) => onDragStart(e, entry.heroFilename, 'grid')}
                                                        title="Drag or Click to Remove"
                                                    >
                                                        <Image src={`/heroes/${entry.heroFilename}`} fill className="object-cover" alt="hero" />
                                                        <div className="absolute inset-0 bg-red-900/80 items-center justify-center hidden group-hover:flex pointer-events-none">
                                                            <X className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                ))}
                                                {/* Drop Target Placeholder (Invisible but keeps height) */}
                                                {cellHeroes.length === 0 && <div className="w-full h-full opacity-0"></div>}
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Hero Pool - All heroes */}
            <div
                className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6 transition-colors"
                onDragOver={onDragOver}
                onDrop={onDropPool}
            >
                <h3 className="text-[#FFD700] text-sm font-bold uppercase tracking-widest mb-4 flex justify-between">
                    Hero Pool (Drag to Assign or Drag Here to Remove)
                    <span className="text-gray-500">{poolHeroes.length} Available</span>
                </h3>

                <div className="flex flex-wrap gap-3">
                    {poolHeroes.map(hero => {
                        const isAssigned = tierData.some(t => t.heroFilename === hero.filename)
                        return (
                            <div
                                key={hero.filename}
                                onClick={() => handleHeroClick(hero)}
                                draggable
                                onDragStart={(e) => onDragStart(e, hero.filename, 'pool')}
                                className={clsx(
                                    "relative w-14 h-16 bg-black rounded-lg border cursor-pointer hover:scale-105 transition-all group overflow-hidden",
                                    isAssigned ? "border-gray-800 opacity-50 grayscale hover:grayscale-0 hover:opacity-100" : "border-gray-600 hover:border-[#FFD700]"
                                )}
                                title={hero.name}
                            >
                                <Image src={`/heroes/${hero.filename}`} fill className="object-cover" alt={hero.name} />
                                <div className="absolute inset-0 bg-black/60 items-center justify-center hidden group-hover:flex pointer-events-none">
                                    <Plus className="w-6 h-6 text-[#FFD700]" />
                                </div>
                                {isAssigned && (
                                    <div className="absolute bottom-0 inset-x-0 bg-gray-900/80 text-[8px] text-center text-gray-400 py-0.5">
                                        Assigned
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Assignment Modal Logic */}
            {selectedHero && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    {/* ... (Modal content same as before) ... */}
                    <div className="bg-[#111] border border-gray-700 rounded-xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                Assign <span className="text-[#FFD700]">{selectedHero.name}</span>
                            </h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-white"><X /></button>
                        </div>

                        {/* Step 1: Rank */}
                        {selectionStep === 1 && (
                            <div className="space-y-4">
                                <p className="text-gray-400 text-sm uppercase tracking-wider font-bold">Select Rank</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {RANKS.map(r => (
                                        <button
                                            key={r}
                                            onClick={() => selectRank(r)}
                                            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-[#FFD700] p-3 rounded-lg flex items-center justify-center transition-all h-16 relative"
                                        >
                                            <Image src={`/logo_tiers/rank_tier/${r}.png`} fill className="object-contain p-2" alt={r} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Type */}
                        {selectionStep === 2 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <button onClick={() => setSelectionStep(1)} className="text-xs text-gray-500 hover:text-white">← Back</button>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 text-sm">Target Rank:</span>
                                        <div className="relative w-8 h-8">
                                            <Image src={`/logo_tiers/rank_tier/${tempRank}.png`} fill className="object-contain" alt={tempRank} />
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm uppercase tracking-wider font-bold">Select Type</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {TYPES.map(t => (
                                        <button
                                            key={t}
                                            onClick={() => selectType(t)}
                                            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-[#FFD700] p-3 rounded-lg flex items-center justify-center transition-all h-16 relative"
                                        >
                                            <Image src={`/logo_tiers/type/${t.toLowerCase()}.png`} fill className="object-contain p-2" alt={t} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
