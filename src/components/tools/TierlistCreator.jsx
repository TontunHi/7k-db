"use client"

import { useState, useEffect, useRef } from "react"
import { getTierlistCreatorData } from "@/lib/tierlist-actions"
import SafeImage from "../shared/SafeImage"
import { 
    Download, Copy, Trash2, RotateCcw, 
    Search, LayoutGrid, Type, Rows, 
    Grid2X2, Check, Info, ChevronRight, X
} from "lucide-react"
import { clsx } from "clsx"
import { toast } from "sonner"
import { toPng, toBlob } from "html-to-image"

const RANKS = ["EX", "S", "A", "B", "C", "D", "E"]
const TYPES = ["Attack", "Magic", "Defense", "Support", "Universal"]

export default function TierlistCreator() {
    const [title, setTitle] = useState("Community Tier List")
    const [allHeroes, setAllHeroes] = useState([])
    const [typeMap, setTypeMap] = useState({})
    const [loading, setLoading] = useState(true)
    const [layoutMode, setLayoutMode] = useState("SIMPLE") // SIMPLE or MATRIX
    const [search, setSearch] = useState("")
    
    const [tiers, setTiers] = useState({})
    const [isInitialized, setIsInitialized] = useState(false)

    const exportRef = useRef(null)

    // Load Draft from LocalStorage
    useEffect(() => {
        if (!loading && allHeroes.length > 0 && !isInitialized) {
            const savedDraft = localStorage.getItem("7k-db-tierlist-draft")
            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft)
                    if (parsed.title) setTitle(parsed.title)
                    if (parsed.layoutMode) setLayoutMode(parsed.layoutMode)
                    
                    // Reconstruct tiers with full hero objects from the current allHeroes pool
                    // This ensures icons and names are always up to date even in old drafts
                    if (parsed.tiers) {
                        const reconstructedTiers = {}
                        Object.keys(parsed.tiers).forEach(key => {
                            const filenames = parsed.tiers[key] || []
                            reconstructedTiers[key] = filenames
                                .map(fname => allHeroes.find(h => h.filename === fname))
                                .filter(Boolean) // Filter out heroes that might have been deleted from DB
                        })
                        setTiers(reconstructedTiers)
                    }
                } catch (err) {
                    console.error("Failed to load tierlist draft:", err)
                }
            }
            setIsInitialized(true)
        }
    }, [loading, allHeroes, isInitialized])

    // Auto-save to LocalStorage
    useEffect(() => {
        if (isInitialized) {
            const draftToSave = {
                title,
                layoutMode,
                // Only save filenames to keep storage light and data fresh
                tiers: Object.keys(tiers).reduce((acc, key) => {
                    acc[key] = (tiers[key] || []).map(h => h.filename)
                    return acc
                }, {})
            }
            localStorage.setItem("7k-db-tierlist-draft", JSON.stringify(draftToSave))
        }
    }, [title, layoutMode, tiers, isInitialized])

    useEffect(() => {
        async function load() {
            try {
                const data = await getTierlistCreatorData()
                setAllHeroes(data.heroes)
                setTypeMap(data.typeMap)
            } catch (err) {
                console.error(err)
                toast.error("Failed to load heroes")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const handleExport = async (mode = 'download') => {
        if (!exportRef.current) return
        
        const loadToast = toast.loading(mode === 'download' ? "Generating high-quality image..." : "Copying to clipboard...")
        
        try {
            const options = {
                pixelRatio: 2,
                quality: 1,
                cacheBust: true,
                backgroundColor: '#050505',
                style: { 
                    transform: 'scale(1)',
                    margin: '0',
                    padding: '0'
                }
            }
            
            // Give assets time to settle
            await new Promise(r => setTimeout(r, 600))
            
            if (mode === 'download') {
                const dataUrl = await toPng(exportRef.current, options)
                const link = document.createElement('a')
                link.download = `tierlist-${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`
                link.href = dataUrl
                link.click()
                toast.success("Tier list downloaded!", { id: loadToast })
            } else {
                const blob = await toBlob(exportRef.current, options)
                
                // Critical: Browser requires focus for clipboard write
                try {
                    if (typeof ClipboardItem !== 'undefined') {
                        // Attempt to focus window if lost during generation
                        window.focus()
                        
                        const item = new ClipboardItem({ [blob.type]: blob })
                        await navigator.clipboard.write([item])
                        toast.success("Tier list copied to clipboard!", { id: loadToast })
                    } else {
                        throw new Error("ClipboardItem not supported")
                    }
                } catch (clipErr) {
                    console.error("Clipboard Error:", clipErr)
                    if (clipErr.name === 'NotAllowedError') {
                        toast.error("Clipboard access denied. Please keep the window focused.", { id: loadToast })
                    } else {
                        toast.error("Failed to copy. Please use Download instead.", { id: loadToast })
                    }
                }
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to generate image", { id: loadToast })
        }
    }

    const resetTierlist = () => {
        if (!confirm("Are you sure you want to reset your tier list?")) return
        setTiers({})
        localStorage.removeItem("7k-db-tierlist-draft")
        toast.success("Archive reset successfully")
    }

    const toggleLayout = () => {
        const newMode = layoutMode === "SIMPLE" ? "MATRIX" : "SIMPLE"
        
        const newTiers = {}
        if (newMode === "MATRIX") {
            Object.keys(tiers).forEach(rank => {
                const heroes = tiers[rank] || []
                heroes.forEach(h => {
                    const type = typeMap[h.slug] || "Universal"
                    const key = `${rank}-${type}`
                    newTiers[key] = [...(newTiers[key] || []), h]
                })
            })
        } else {
            Object.keys(tiers).forEach(key => {
                if (!key.includes("-")) return
                const [rank] = key.split("-")
                newTiers[rank] = [...(newTiers[rank] || []), ...(tiers[key] || [])]
            })
        }
        
        setTiers(newTiers)
        setLayoutMode(newMode)
        toast.info(`Switched to ${newMode === "MATRIX" ? "Rank / Table View" : "Rank Table"}`)
    }

    const addToCell = (hero, rank, type = null) => {
        const key = type ? `${rank}-${type}` : rank
        setTiers(prev => {
            const next = { ...prev }
            Object.keys(next).forEach(k => {
                next[k] = (next[k] || []).filter(h => h.filename !== hero.filename)
            })
            next[key] = [...(next[key] || []), hero]
            return next
        })
    }

    const removeFromCell = (hero, key) => {
        setTiers(prev => ({
            ...prev,
            [key]: (prev[key] || []).filter(h => h.filename !== hero.filename)
        }))
    }

    const usedHeroFilenames = new Set(Object.values(tiers).flat().map(h => h.filename))
    const filteredPool = allHeroes.filter(h => 
        !usedHeroFilenames.has(h.filename) && 
        h.name.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col h-[60vh] items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin shadow-[0_0_20px_rgba(255,215,0,0.2)]"></div>
                <p className="text-gray-500 font-black uppercase tracking-[0.3em] animate-pulse">Syncing Tactical Data...</p>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col animate-in fade-in duration-700 font-sans">
            
            {/* Top Bar Navigation */}
            <div className="flex-shrink-0 bg-[#0a0a0a] border-b border-white/5 px-6 py-4 flex items-center justify-between shadow-2xl z-[35]">
                <div className="flex items-center gap-6 flex-1">
                    <input 
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-lg font-black text-white outline-none focus:border-[#FFD700] transition-all uppercase tracking-tighter w-full max-w-md"
                        placeholder="Archive Identity..."
                    />
                    
                    <div className="h-8 w-px bg-white/10 hidden md:block"></div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={toggleLayout}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all font-black uppercase text-[10px] tracking-widest",
                                layoutMode === "MATRIX" ? "bg-[#FFD700]/10 border-[#FFD700]/30 text-[#FFD700]" : "bg-white/5 border-white/10 text-gray-400"
                            )}
                        >
                            {layoutMode === "MATRIX" ? <Grid2X2 size={14} /> : <Rows size={14} />}
                            {layoutMode === "MATRIX" ? "Rank / Table View" : "Rank Table"}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={resetTierlist}
                        className="p-2 bg-white/5 border border-white/10 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Reset Archive"
                    >
                        <RotateCcw size={18} />
                    </button>
                    <div className="h-8 w-px bg-white/10 mx-2"></div>
                    <button 
                        onClick={() => handleExport('copy')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-white transition-all uppercase tracking-widest"
                    >
                        <Copy size={16} className="text-[#FFD700]" /> 
                        Copy
                    </button>
                    <button 
                        onClick={() => handleExport('download')}
                        className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                    >
                        <Download size={16} /> 
                        Export
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                
                {/* Workspace (Left) */}
                <div className="flex-1 overflow-auto custom-scrollbar bg-[#050505] p-6 relative">
                    <div ref={exportRef} className="bg-[#050505] border border-white/5 rounded-2xl overflow-hidden shadow-2xl mx-auto w-fit min-w-full">
                        
                        {/* Header Branding */}
                        <div className="py-6 px-10 flex flex-col items-center justify-center bg-[#070707] border-b border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-30"></div>
                            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1">
                                {title}
                            </h2>
                        </div>

                        {layoutMode === "SIMPLE" ? (
                            <div className="flex flex-col bg-[#080808]">
                                {RANKS.map((rank) => (
                                    <div key={rank} className="min-h-[90px] flex border-b border-white/20 group/row">
                                        <div className="w-20 md:w-28 flex-shrink-0 flex items-center justify-center sticky left-0 z-20 border-r border-white/20 bg-[#050505] group-hover/row:bg-[#070707] transition-colors">
                                            <div className="flex items-center justify-center w-full h-full">
                                                <div className="relative h-12 w-12 transform group-hover:scale-110 transition-transform duration-500">
                                                    <SafeImage src={`/logo_tiers/rank_tier/${rank}.webp`} fill unoptimized className="object-contain" alt={rank} />
                                                </div>
                                            </div>
                                        </div>
                                        <div 
                                            className="flex-1 p-3 flex flex-wrap gap-2 content-start bg-[#0a0a0a]"
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => {
                                                const hero = JSON.parse(e.dataTransfer.getData("hero"))
                                                addToCell(hero, rank)
                                            }}
                                        >
                                            {(tiers[rank] || []).map((hero) => (
                                                <div 
                                                    key={hero.filename} 
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData("hero", JSON.stringify(hero))
                                                    }}
                                                    onClick={() => removeFromCell(hero, rank)} 
                                                    className="group/hero relative w-[50px] md:w-[54px] h-[60px] md:h-[64px] cursor-pointer"
                                                >
                                                    <div className="relative w-full h-full overflow-hidden rounded-sm border border-white/10 group-hover/hero:border-red-500 group-hover/hero:scale-110 transition-all duration-300 shadow-2xl">
                                                        <SafeImage src={`/heroes/${hero.filename}`} fill unoptimized className="object-cover" alt="" />
                                                        <div className="absolute inset-0 bg-red-600/60 opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center">
                                                            <Trash2 className="text-white w-5 h-5" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#080808] overflow-visible">
                                <table className="w-full border-separate border-spacing-0">
                                    <thead className="sticky top-0 z-20">
                                        <tr>
                                            <th className="p-3 w-20 border-b border-r border-white/20 bg-[#050505] sticky left-0 top-0 z-30">
                                                <div className="flex items-center justify-center h-12">
                                                    <span className="text-[7px] text-gray-600 font-black uppercase tracking-widest italic leading-none">R / T</span>
                                                </div>
                                            </th>
                                            {TYPES.map(type => (
                                                <th key={type} className="p-3 border-b border-white/20 bg-[#050505] min-w-[100px] sticky top-0 z-30">
                                                    <div className="flex items-center justify-center h-12">
                                                        <div className="relative h-8 w-16">
                                                            <SafeImage src={`/logo_tiers/type/${type.toLowerCase()}.webp`} fill unoptimized className="object-contain" alt={type} />
                                                        </div>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {RANKS.map((rank) => (
                                            <tr key={rank} className="group/row">
                                                <th className="p-2 border-r border-b border-white/20 bg-[#050505] w-20 h-20 sticky left-0 z-10">
                                                    <div className="flex items-center justify-center w-full h-full">
                                                        <div className="relative h-12 w-14 transform group-hover/row:scale-110 transition-transform duration-500">
                                                            <SafeImage src={`/logo_tiers/rank_tier/${rank}.webp`} fill unoptimized className="object-contain" alt={rank} />
                                                        </div>
                                                    </div>
                                                </th>
                                                {TYPES.map(type => {
                                                    const cellKey = `${rank}-${type}`
                                                    const cellHeroes = tiers[cellKey] || []
                                                    return (
                                                        <td 
                                                            key={type} 
                                                            className="p-1 border-r border-b border-white/20 align-top min-h-[80px] h-20 bg-[#0a0a0a] hover:bg-[#FFD700]/[0.02] transition-colors"
                                                            onDragOver={(e) => e.preventDefault()}
                                                            onDrop={(e) => {
                                                                const hero = JSON.parse(e.dataTransfer.getData("hero"))
                                                                addToCell(hero, rank, type)
                                                            }}
                                                        >
                                                            <div className="flex flex-wrap gap-1 justify-center content-start min-h-full">
                                                                {cellHeroes.map(hero => (
                                                                    <div 
                                                                        key={hero.filename} 
                                                                        draggable
                                                                        onDragStart={(e) => {
                                                                            e.dataTransfer.setData("hero", JSON.stringify(hero))
                                                                        }}
                                                                        onClick={() => removeFromCell(hero, cellKey)} 
                                                                        className="group/hero relative w-[36px] h-[43px] cursor-pointer"
                                                                    >
                                                                        <div className="relative w-full h-full overflow-hidden rounded border border-white/10 group-hover:border-red-500">
                                                                            <SafeImage src={`/heroes/${hero.filename}`} fill unoptimized className="object-cover" alt="" />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Heroes Pool (Right Sidebar) */}
                <div className="w-[350px] flex-shrink-0 bg-[#0a0a0a] border-l border-white/5 flex flex-col shadow-2xl overflow-hidden relative">
                    <div className="p-6 space-y-4 border-b border-white/5 relative z-10 bg-[#0a0a0a]/80 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] flex items-center gap-2">
                                <LayoutGrid size={14} className="text-[#FFD700]" />
                                Heroes Pool
                            </h3>
                            <span className="text-[9px] font-bold text-gray-700 uppercase bg-white/5 px-2 py-0.5 rounded-full">{filteredPool.length} Units</span>
                        </div>
                        
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-3.5 h-3.5" />
                            <input 
                                type="text" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Unit Identification..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-white outline-none focus:border-[#FFD700] placeholder:text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <div className="grid grid-cols-4 gap-3 pb-20">
                            {filteredPool.map(hero => (
                                <div 
                                    key={hero.filename}
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData("hero", JSON.stringify(hero))
                                    }}
                                    onClick={() => {
                                        if (layoutMode === "SIMPLE") {
                                            addToCell(hero, "EX")
                                        } else {
                                            const type = typeMap[hero.slug] || "Attack" 
                                            addToCell(hero, "EX", type)
                                        }
                                    }}
                                    className="group/pool relative aspect-[5/6] cursor-grab active:cursor-grabbing transform transition-all hover:scale-110 active:scale-95"
                                >
                                    <div className="relative w-full h-full rounded border border-white/5 group-hover/pool:border-[#FFD700] bg-black/40 overflow-hidden shadow-xl">
                                        <SafeImage src={`/heroes/${hero.filename}`} fill className="object-cover" alt="" sizes="64px" />
                                        <div className="absolute inset-0 bg-[#FFD700]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredPool.length === 0 && (
                            <div className="py-20 text-center opacity-20">
                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-800">No Heroes Found</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Tips */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent pointer-events-none">
                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest text-center italic">Drag units to classify • Click to auto-assign</p>
                    </div>
                </div>

            </div>

        </div>
    )
}
