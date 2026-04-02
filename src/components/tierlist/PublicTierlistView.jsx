"use client"

import { useState, useEffect } from "react"
import { getTierlistData } from "@/lib/tierlist-db"
import Image from "next/image"
import { clsx } from "clsx"
import { Loader2 } from "lucide-react"

const CATEGORIES = ["PVE", "PVP", "Raid", "GVG", "ART", "Tower"]
const RANKS = ["EX", "S", "A", "B", "C", "D", "E"]
const TYPES = ["Attack", "Magic", "Defense", "Support", "Universal"]

export default function PublicTierlistView() {
    const [category, setCategory] = useState("PVE")
    const [tierData, setTierData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTiers = async () => {
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
        fetchTiers()
    }, [category])

    return (
        <div className="relative min-h-[calc(100vh-64px)] w-full bg-[#050505] overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#FFD700] opacity-20 blur-[100px]"></div>
                <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-blue-900/20 blur-[120px]"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 pb-32">

                {/* Header Highlight */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-block relative group">
                        <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight uppercase italic transform -skew-x-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                            TIER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFA500]">LIST</span>
                        </h1>
                        <div className="absolute -bottom-2 w-full h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] transform -skew-x-12 shadow-[0_0_15px_#FFD700] transition-all group-hover:w-[120%] group-hover:-left-[10%]"></div>
                    </div>

                    <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-light tracking-wide leading-relaxed mt-6">
                        The definitive <strong className="text-white">Seven Knights Rebirth</strong> strategy guide.
                        Dominate <span className="text-[#FFD700]">PVE</span>, <span className="text-[#FFD700]">PVP</span>, and <span className="text-[#FFD700]">Raids</span> with our daily updated meta rankings.
                    </p>
                </div>

                {/* Category Buttons - RECTANGULAR & TECH STYLE */}
                <div className="flex justify-center mb-16">
                    <div className="flex flex-wrap justify-center gap-4 p-1">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={clsx(
                                    "group relative px-6 md:px-10 py-3 uppercase font-black tracking-[0.2em] text-sm transition-all duration-300 transform",
                                    "border clip-path-polygon hover:scale-105 active:scale-95",
                                    category === cat
                                        ? "border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.15)]"
                                        : "border-gray-800 bg-black/60 text-gray-500 hover:border-gray-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                {/* Corner Accents */}
                                <span className={clsx("absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-colors duration-300", category === cat ? "border-[#FFD700]" : "border-gray-600 group-hover:border-white")}></span>
                                <span className={clsx("absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-colors duration-300", category === cat ? "border-[#FFD700]" : "border-gray-600 group-hover:border-white")}></span>

                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                {loading ? (
                    <div className="flex h-96 items-center justify-center">
                        <Loader2 className="w-16 h-16 text-[#FFD700] animate-spin drop-shadow-[0_0_10px_#FFD700]" />
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                        {/* The Tier Matrix Container */}
                        <div className="relative bg-[#080808] border border-gray-800 shadow-2xl backdrop-blur-sm group/matrix">
                            {/* Top Gradient Line */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50 group-hover/matrix:opacity-100 transition-opacity duration-500"></div>

                            <div className="overflow-x-auto custom-scrollbar p-1">
                                <table className="w-full min-w-[1000px] border-collapse bg-[#080808]">
                                    <thead>
                                        <tr>
                                            <th className="p-6 w-32 border-b border-gray-800 bg-[#050505]"></th>
                                            {TYPES.map(type => (
                                                <th key={type} className="p-4 border-b border-gray-800 bg-[#050505] min-w-[140px] relative">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="relative h-10 w-full transition-transform hover:-translate-y-1 duration-300">
                                                            <Image src={`/logo_tiers/type/${type.toLowerCase()}.png`} fill className="object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]" alt={type} sizes="96px" />
                                                        </div>
                                                        {/* Underline for columns */}
                                                        <div className="w-8 h-[1px] bg-gray-700"></div>
                                                    </div>
                                                    {/* Vertical Divider */}
                                                    <div className="absolute right-0 top-4 bottom-4 w-[1px] bg-gray-800/50"></div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {RANKS.map((rank, idx) => (
                                            <tr key={rank} className="group border-b border-gray-800/40 hover:bg-white/[0.02] transition-colors duration-200">
                                                {/* Rank Row Header */}
                                                <th className="p-4 border-r border-gray-800/50 bg-[#050505] relative w-32">
                                                    <div className="relative h-20 w-full mx-auto transition-transform group-hover:scale-110 duration-300">
                                                        <Image src={`/logo_tiers/rank_tier/${rank}.png`} fill className="object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]" alt={rank} sizes="80px" />
                                                    </div>
                                                    {/* Side accent */}
                                                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-gray-800 to-transparent group-hover:via-[#FFD700] transition-colors duration-500"></div>
                                                </th>

                                                {/* Tier Cells */}
                                                {TYPES.map(type => {
                                                    const cellHeroes = tierData.filter(d => d.rank === rank && d.type === type)

                                                    return (
                                                        <td key={type} className="p-2 border-l border-gray-800/20 align-top h-40 relative group/cell hover:bg-[#FFD700]/[0.02] transition-colors">

                                                            <div className="flex flex-wrap gap-4 justify-center content-start h-full relative z-10 p-3">
                                                                {cellHeroes.map(hero => (
                                                                    <div
                                                                        key={hero.heroFilename}
                                                                        className="relative w-[60px] h-[72px] bg-black bg-gradient-to-b from-[#1a1a1a] to-black rounded-sm border border-gray-700 overflow-hidden shadow-lg hover:z-20 hover:scale-[1.2] hover:border-[#FFD700] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] transition-all duration-200 cursor-pointer group/hero"
                                                                    >
                                                                        <Image src={`/heroes/${hero.heroFilename}`} fill className="object-cover" alt="hero" sizes="60px" />

                                                                        {/* Shine effect */}
                                                                        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover/hero:animate-shine" />
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
                        </div>

                        {/* Footer Note */}
                        <div className="text-center pt-12 border-t border-gray-800/50 mt-16">
                            <p className="text-gray-500 text-xs tracking-[0.2em] uppercase font-bold opacity-60">
                                Seven Knights 2 Rebirth Database • Community Driven Project
                            </p>
                        </div>

                    </div>
                )}
            </div>

        </div>
    )
}
