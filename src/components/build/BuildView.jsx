"use client"

import { useState } from "react"
import Image from "next/image"
import { clsx } from "clsx"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import BuildViewerModal from "./BuildViewerModal"
import { fetchHeroBuildData } from "@/lib/viewer-actions"

export default function BuildView({ heroes }) {
    const [activeTab, setActiveTab] = useState("legendary") // 'legendary' | 'rare'
    const [searchQuery, setSearchQuery] = useState("")

    // Popup State
    const [selectedHero, setSelectedHero] = useState(null)
    const [viewerData, setViewerData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // Filter heroes based on active tab and search query
    const filteredHeroes = heroes.filter((hero) => {
        const matchesTab = activeTab === "legendary" ? hero.grade.startsWith("l") : hero.grade === "r"
        const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesTab && matchesSearch
    })

    const getRankPower = (g) => {
        if (g === "l++") return 3
        if (g === "l+") return 2
        if (g === "l") return 1
        return 0
    }

    const sortedHeroes = [...filteredHeroes].sort((a, b) => {
        const rankA = getRankPower(a.grade)
        const rankB = getRankPower(b.grade)
        if (rankA !== rankB) return rankB - rankA
        return a.filename.localeCompare(b.filename)
    })

    const handleHeroClick = async (hero) => {
        setIsLoading(true)
        try {
            const data = await fetchHeroBuildData(hero.filename)
            setViewerData(data)
            setSelectedHero(hero)
        } catch (err) {
            console.error("Failed to fetch build data", err)
        } finally {
            setIsLoading(false)
        }
    }

    const closeViewer = () => {
        setSelectedHero(null)
        setViewerData(null)
    }

    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full bg-[#050505] overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#FFD700] opacity-20 blur-[100px]"></div>
                <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-blue-900/20 blur-[120px]"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 pb-32">
                {/* Page Header */}
                <div className="flex flex-col items-center justify-center space-y-8 mb-16">
                    <div className="text-center space-y-4">
                        <div className="inline-block relative group">
                            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight uppercase italic transform -skew-x-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                                HERO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFA500]">BUILDS</span>
                            </h1>
                            <div className="absolute -bottom-2 w-full h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] transform -skew-x-12 shadow-[0_0_15px_#FFD700] transition-all group-hover:w-[120%] group-hover:-left-[10%]"></div>
                        </div>
                        <p className="text-slate-400 text-lg font-light tracking-wide max-w-xl mx-auto mt-6">
                            Explore optimal equipment and stats for every hero.
                        </p>
                    </div>

                    {/* Search Input (Stage Style) */}
                    <div className="w-full max-w-md relative group">
                        <div className="absolute inset-0 blur-lg opacity-20 transition-opacity group-hover:opacity-40 bg-[#FFD700]"></div>
                        <input
                            type="text"
                            placeholder="Search heroes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={cn(
                                "w-full bg-[#080808]/80 backdrop-blur-md border rounded-xl px-6 py-4 text-center text-lg font-bold text-white uppercase tracking-wider outline-none transition-all placeholder:text-gray-700",
                                "border-gray-800 focus:border-[#FFD700] focus:shadow-[0_0_30px_rgba(255,215,0,0.2)]"
                            )}
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-[#0a0a0a]/80 backdrop-blur-md border border-gray-800 p-1.5 rounded-2xl shadow-2xl">
                        {['legendary', 'rare'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={clsx(
                                    "px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all relative overflow-hidden",
                                    activeTab === tab
                                        ? "text-black shadow-[0_0_20px_rgba(255,215,0,0.2)]"
                                        : "text-gray-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {activeTab === tab && (
                                    <div className="absolute inset-0 bg-[#FFD700] animate-in fade-in zoom-in duration-300"></div>
                                )}
                                <span className="relative z-10">{tab}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Content */}
                {sortedHeroes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-500 border border-dashed border-gray-800 rounded-3xl bg-[#0a0a0a]/50">
                        <p className="text-xl font-light">No heroes found in this category.</p>
                        <p className="text-sm mt-2 opacity-60 font-mono">Add images to /public/heroes</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {sortedHeroes.map((hero) => (
                            <div
                                key={hero.filename}
                                onClick={() => handleHeroClick(hero)}
                                className="group relative flex flex-col items-center cursor-pointer"
                            >
                                {/* Card Container */}
                                <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-[#1a1a1a] to-black rounded-lg border border-gray-800 overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:border-[#FFD700] group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] group-hover:-translate-y-1">

                                    {/* Image */}
                                    <Image
                                        src={`/heroes/${hero.filename}`}
                                        alt={hero.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                    />

                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>



                                    {/* Shine Effect */}
                                    <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-20 rounded-full"></div>
                            <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin relative z-10" />
                        </div>
                    </div>
                )}

                {/* Modal */}
                {selectedHero && viewerData && (
                    <BuildViewerModal
                        hero={selectedHero}
                        data={viewerData}
                        onClose={closeViewer}
                    />
                )}
            </div>
        </div>
    )
}
