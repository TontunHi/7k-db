"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { clsx } from "clsx"
import { Plus, X, Edit2 } from "lucide-react"
import { getTierlistData, saveTierlistEntry, removeTierlistEntry } from "@/lib/tierlist-db"

const CATEGORIES = ["PVE", "PVP", "Raid", "GVG", "ART", "Tower"]
const RANKS = ["EX", "S", "A", "B", "C", "D", "E"]
const TYPES = ["Attack", "Magic", "Defense", "Support", "Universal"]

function getNameFromFilename(filename) {
    return filename
        .replace(/^(l\+\+|l\+|l|r)_/, "")
        .replace(/\.[^/.]+$/, "")
        .replace(/_/g, " ")
}

export default function TierlistManager({ heroes }) {
    const [category, setCategory] = useState("PVE")
    const [tierData, setTierData] = useState([])
    const [loading, setLoading] = useState(false)

    // Modal State
    const [selectedHero, setSelectedHero] = useState(null)
    const [selectionStep, setSelectionStep] = useState(0)
    const [tempRank, setTempRank] = useState(null)

    // Custom drag state (just for cursor style)
    const [isDragging, setIsDragging] = useState(false)

    // Refs so event handlers always see latest values without re-registering
    const dragRef = useRef(null)       // current drag data + ghost element
    const categoryRef = useRef(category)
    const fetchRef = useRef(null)

    useEffect(() => { categoryRef.current = category }, [category])

    useEffect(() => { fetchData() }, [category])

    async function fetchData() {
        setLoading(true)
        try {
            const data = await getTierlistData(category)
            setTierData(data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    fetchRef.current = fetchData

    // Only show heroes NOT yet assigned in this category
    const poolHeroes = heroes.filter(h => !tierData.some(t => t.heroFilename === h.filename))

    // ── Custom Drag System ────────────────────────────────────────────
    // We avoid native HTML5 DnD because it blocks mouse wheel events.
    // Instead: mousedown → track movement → ghost follows cursor → mouseup drops.

    const startDrag = useCallback((e, heroFilename, source, imgSrc) => {
        if (e.button !== 0) return
        e.preventDefault()

        dragRef.current = {
            heroFilename,
            source,
            imgSrc,
            startX: e.clientX,
            startY: e.clientY,
            moved: false,
            ghost: null,
        }

        function createGhost(x, y) {
            const g = document.createElement("div")
            g.style.cssText = `
                position:fixed; width:48px; height:56px; border-radius:6px;
                overflow:hidden; pointer-events:none; z-index:9999;
                opacity:0.9; box-shadow:0 8px 24px rgba(0,0,0,0.8);
                border:2px solid #FFD700;
                left:${x - 24}px; top:${y - 28}px;
                transform:scale(1.15) rotate(3deg);
                transition:transform 0.1s;
            `
            const img = document.createElement("img")
            img.src = imgSrc
            img.style.cssText = "width:100%;height:100%;object-fit:cover;"
            g.appendChild(img)
            document.body.appendChild(g)
            return g
        }

        function onMouseMove(e) {
            const d = dragRef.current
            if (!d) return

            if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 6) {
                d.moved = true
                d.ghost = createGhost(e.clientX, e.clientY)
                setIsDragging(true)
            }
            if (d.ghost) {
                d.ghost.style.left = `${e.clientX - 24}px`
                d.ghost.style.top = `${e.clientY - 28}px`
            }
        }

        async function onMouseUp(e) {
            document.removeEventListener("mousemove", onMouseMove)
            document.removeEventListener("mouseup", onMouseUp)

            const d = dragRef.current
            if (!d) return

            if (d.ghost) {
                document.body.removeChild(d.ghost)
                d.ghost = null
            }
            dragRef.current = null
            setIsDragging(false)

            if (!d.moved) return   // was just a click — onClick handles it

            // Find drop target using element at cursor position
            const el = document.elementFromPoint(e.clientX, e.clientY)
            const cell = el?.closest("[data-rank][data-type]")
            const pool = el?.closest("[data-pool]")

            if (cell) {
                try {
                    await saveTierlistEntry({
                        heroFilename: d.heroFilename,
                        category: categoryRef.current,
                        rank: cell.dataset.rank,
                        type: cell.dataset.type,
                    })
                    await fetchRef.current()
                } catch (err) {
                    alert("Failed to move hero: " + err.message)
                }
            } else if (pool && d.source === "grid") {
                try {
                    await removeTierlistEntry(d.heroFilename, categoryRef.current)
                    await fetchRef.current()
                } catch (err) {
                    alert("Failed to remove hero: " + err.message)
                }
            }
        }

        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp)
    }, [])

    // ── Modal Handlers ────────────────────────────────────────────────

    const openAssignModal = (heroObj) => {
        setSelectedHero(heroObj)
        setSelectionStep(1)
        setTempRank(null)
    }

    const handlePoolClick = (hero) => {
        if (dragRef.current?.moved) return
        openAssignModal({ filename: hero.filename, name: hero.name })
    }

    const handleGridClick = (e, entry) => {
        e.stopPropagation()
        if (dragRef.current?.moved) return
        openAssignModal({ filename: entry.heroFilename, name: getNameFromFilename(entry.heroFilename) })
    }

    const handleRemove = async (e, entry) => {
        e.stopPropagation()
        if (!confirm(`Remove ${getNameFromFilename(entry.heroFilename)}?`)) return
        try {
            await removeTierlistEntry(entry.heroFilename, categoryRef.current)
            await fetchRef.current()
        } catch (err) {
            alert("Failed to remove")
        }
    }

    const selectRank = (rank) => {
        setTempRank(rank)
        setSelectionStep(2)
    }

    const selectType = async (type) => {
        if (!selectedHero || !tempRank) return
        try {
            await saveTierlistEntry({
                heroFilename: selectedHero.filename,
                category,
                rank: tempRank,
                type,
            })
            await fetchRef.current()
            closeModal()
        } catch (err) {
            alert("Failed to save: " + err.message)
        }
    }

    const closeModal = () => {
        setSelectedHero(null)
        setSelectionStep(0)
        setTempRank(null)
    }

    // ── Render ────────────────────────────────────────────────────────

    return (
        <div
            className="space-y-6"
            style={{ userSelect: isDragging ? "none" : "auto", cursor: isDragging ? "grabbing" : "auto" }}
        >
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
                            <th className="p-4 bg-gray-900 border-b border-r border-gray-800 w-32 font-bold text-gray-400 uppercase text-xs">
                                Rank \ Type
                            </th>
                            {TYPES.map(type => (
                                <th key={type} className="p-4 bg-gray-900 border-b border-gray-800 text-center border-l border-gray-800">
                                    <div className="relative h-8 w-24 mx-auto">
                                        <Image src={`/logo_tiers/type/${type.toLowerCase()}.png`} fill className="object-contain" alt={type} sizes="96px" />
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
                                        <Image src={`/logo_tiers/rank_tier/${rank}.png`} fill className="object-contain" alt={rank} sizes="48px" />
                                    </div>
                                </th>
                                {TYPES.map(type => {
                                    const cellHeroes = tierData.filter(d => d.rank === rank && d.type === type)
                                    return (
                                        <td
                                            key={type}
                                            data-rank={rank}
                                            data-type={type}
                                            className="p-2 border-l border-gray-800/50 min-h-[100px] align-top w-[18%]"
                                        >
                                            <div
                                                data-rank={rank}
                                                data-type={type}
                                                className="flex flex-wrap gap-2 justify-center min-h-[80px]"
                                            >
                                                {cellHeroes.map(entry => (
                                                    <div
                                                        key={entry.heroFilename}
                                                        data-rank={rank}
                                                        data-type={type}
                                                        className="relative w-12 h-14 bg-black rounded border border-gray-700 overflow-visible cursor-grab group hover:scale-110 transition-transform shadow-sm hover:border-[#FFD700]"
                                                        onMouseDown={(e) => startDrag(e, entry.heroFilename, "grid", `/heroes/${entry.heroFilename}`)}
                                                        onClick={(e) => handleGridClick(e, entry)}
                                                        title={`${getNameFromFilename(entry.heroFilename)} — Click to reassign, drag to move`}
                                                    >
                                                        <div className="w-full h-full rounded overflow-hidden">
                                                            <Image src={`/heroes/${entry.heroFilename}`} fill className="object-cover" alt="hero" sizes="48px" />
                                                        </div>
                                                        {/* Edit overlay on hover */}
                                                        <div className="absolute inset-0 rounded bg-black/60 items-center justify-center hidden group-hover:flex pointer-events-none">
                                                            <Edit2 className="w-4 h-4 text-[#FFD700]" />
                                                        </div>
                                                        {/* Remove button */}
                                                        <button
                                                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 rounded-full items-center justify-center hidden group-hover:flex hover:bg-red-400 transition-colors z-20 pointer-events-auto"
                                                            onClick={(e) => handleRemove(e, entry)}
                                                            title="Remove"
                                                        >
                                                            <X className="w-2.5 h-2.5 text-white" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {cellHeroes.length === 0 && <div className="w-full h-full opacity-0" />}
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Hero Pool — only unassigned heroes shown */}
            <div
                data-pool="true"
                className="bg-[#0f0f0f] border border-gray-800 rounded-xl p-6"
            >
                <h3 className="text-[#FFD700] text-sm font-bold uppercase tracking-widest mb-4 flex justify-between">
                    Hero Pool
                    <span className="text-gray-500">{poolHeroes.length} Available</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                    {poolHeroes.map(hero => (
                        <div
                            key={hero.filename}
                            onMouseDown={(e) => startDrag(e, hero.filename, "pool", `/heroes/${hero.filename}`)}
                            onClick={() => handlePoolClick(hero)}
                            className="relative w-14 h-16 bg-black rounded-lg border border-gray-600 cursor-grab hover:scale-105 transition-all group overflow-hidden hover:border-[#FFD700]"
                            title={hero.name}
                        >
                            <Image src={`/heroes/${hero.filename}`} fill className="object-cover" alt={hero.name} sizes="56px" />
                            <div className="absolute inset-0 bg-black/60 items-center justify-center hidden group-hover:flex pointer-events-none">
                                <Plus className="w-6 h-6 text-[#FFD700]" />
                            </div>
                        </div>
                    ))}
                    {poolHeroes.length === 0 && (
                        <p className="text-gray-600 text-sm italic">All heroes have been assigned.</p>
                    )}
                </div>
            </div>

            {/* Assignment Modal */}
            {selectedHero && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={closeModal}
                >
                    <div
                        className="bg-[#111] border border-gray-700 rounded-xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                Assign <span className="text-[#FFD700]">{selectedHero.name}</span>
                            </h3>
                            <button onClick={closeModal} className="text-gray-500 hover:text-white"><X /></button>
                        </div>

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
                                            <Image src={`/logo_tiers/rank_tier/${r}.png`} fill className="object-contain p-2" alt={r} sizes="64px" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectionStep === 2 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <button onClick={() => setSelectionStep(1)} className="text-xs text-gray-500 hover:text-white">← Back</button>
                                    <div className="flex items-center gap-2 ml-2">
                                        <span className="text-gray-400 text-sm">Target Rank:</span>
                                        <div className="relative w-8 h-8">
                                            <Image src={`/logo_tiers/rank_tier/${tempRank}.png`} fill className="object-contain" alt={tempRank} sizes="32px" />
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
                                            <Image src={`/logo_tiers/type/${t.toLowerCase()}.png`} fill className="object-contain p-2" alt={t} sizes="64px" />
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
