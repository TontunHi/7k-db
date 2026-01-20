"use client"

import Image from "next/image"
import { X } from "lucide-react"
import { clsx } from "clsx"

export default function BuildViewerModal({ hero, data, onClose }) {
    if (!data) return null

    const { builds, heroData, skills: allSkills } = data
    const { skillPriority } = heroData

    // Sort All Skills: 4 -> 3 -> 2 -> 1 based on filename
    const sortedSkills = [...allSkills].sort((a, b) => {
        const getNum = (s) => parseInt(s.split('/').pop()) || 0
        return getNum(b) - getNum(a) // Descending
    })

    // Helper to get priority rank
    const getPriorityRank = (skillPath) => {
        if (!skillPriority) return null
        const index = skillPriority.indexOf(skillPath)
        return index !== -1 ? index + 1 : null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">

            {/* Main Container */}
            <div className="bg-[#0b0b0b] border border-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col relative shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Decorative Top Line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50"></div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-6 p-8 border-b border-gray-800/50 bg-[#080808]">

                    {/* Hero Image */}
                    <div className="relative w-20 h-24 md:w-28 md:h-32 rounded-xl overflow-hidden border border-gray-700 shadow-2xl flex-shrink-0 group">
                        <Image src={`/heroes/${hero.filename}`} fill className="object-cover transition-transform duration-500 group-hover:scale-110" alt={hero.name} />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl"></div>
                        {/* Shine */}
                        <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                    </div>

                    {/* Hero Info & Skills */}
                    <div className="flex-1 flex flex-col justify-center space-y-4">
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase italic transform -skew-x-6 drop-shadow-md">
                                {hero.name}
                            </h2>
                            <p className="text-[#FFD700] text-xs font-bold tracking-[0.3em] uppercase opacity-80 mt-1">
                                {hero.grade.toUpperCase()} HERO
                            </p>
                        </div>

                        {/* Skills Row (4 3 2 1) */}
                        <div className="flex flex-wrap items-center gap-4">
                            {sortedSkills.map((s, i) => {
                                const rank = getPriorityRank(s)
                                return (
                                    <div key={i} className={clsx(
                                        "relative w-12 h-12 md:w-14 md:h-14 bg-black rounded-lg border overflow-visible transition-all duration-300 group/skill",
                                        rank ? "border-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)] scale-105" : "border-gray-800 opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
                                    )}>
                                        <div className="relative w-full h-full overflow-hidden rounded-lg">
                                            <Image src={`/skills/${s}`} fill className="object-cover" alt="skill" />
                                        </div>

                                        {/* Priority Badge - Top Right */}
                                        {rank && (
                                            <div className="absolute -top-2 -right-2 z-10">
                                                <div className="w-5 h-5 bg-[#FFD700] text-black rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#090909] shadow-lg">
                                                    {rank}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tooltip for skill priority */}
                                        {rank && (
                                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-[#FFD700] text-black text-[9px] font-bold px-1.5 rounded opacity-0 group-hover/skill:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                Priority {rank}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        {(!sortedSkills || sortedSkills.length === 0) && (
                            <p className="text-gray-600 text-xs italic">No skills found (Add to public/skills folder)</p>
                        )}
                    </div>

                    <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all border border-transparent hover:border-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#0b0b0b] custom-scrollbar">

                    {builds.length > 0 ? builds.map((build, i) => (
                        <div key={i} className="group bg-[#111] border border-gray-800 rounded-2xl p-6 relative hover:border-gray-600 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-800/20 to-transparent rounded-tr-2xl pointer-events-none"></div>

                            {/* Build Tags */}
                            <div className="flex items-center gap-4 mb-8">
                                <span className="bg-gradient-to-r from-[#FFD700] to-[#E5C100] text-black px-4 py-1.5 rounded-lg text-sm font-black uppercase tracking-wider shadow-[0_0_15px_rgba(255,215,0,0.15)]">
                                    LVL {build.cLevel}
                                </span>
                                <div className="h-6 w-px bg-gray-700"></div>
                                <div className="flex gap-2">
                                    {build.mode.map(m => (
                                        <span key={m} className="text-gray-300 text-[10px] font-bold uppercase tracking-[0.15em] bg-gray-800/80 px-3 py-1.5 rounded-md border border-gray-700">
                                            {m}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                                {/* Left Column: Equipment */}
                                <div className="space-y-5">
                                    <h4 className="flex items-center gap-3 text-white/90 text-xs font-bold uppercase tracking-[0.25em]">
                                        <span className="w-1.5 h-1.5 bg-[#FFD700] rotate-45"></span> Equipment
                                    </h4>

                                    <div className="grid grid-cols-2 gap-4">
                                        <ViewerItemCard item={build.weapons[0]} type="Weapon" />
                                        <ViewerItemCard item={build.armors[0]} type="Armor" />
                                        <ViewerItemCard item={build.weapons[1]} type="Weapon" />
                                        <ViewerItemCard item={build.armors[1]} type="Armor" />
                                    </div>
                                </div>

                                {/* Right Column: Accessories & Substats */}
                                <div className="flex flex-col gap-8">

                                    {/* Accessories */}
                                    <div>
                                        <h4 className="flex items-center gap-3 text-white/90 text-xs font-bold uppercase tracking-[0.25em] mb-4">
                                            <span className="w-1.5 h-1.5 bg-[#FFD700] rotate-45"></span> Accessories
                                        </h4>
                                        <div className="flex flex-wrap gap-3">
                                            {build.accessories && build.accessories.length > 0 ? build.accessories.map((acc, idx) => (
                                                <div key={idx} className="relative w-14 h-14 bg-[#151515] border border-gray-700 rounded-xl overflow-hidden group-hover:border-gray-500 transition-colors shadow-md">
                                                    <Image src={`/items/accessory/${acc.image}`} fill className="object-cover" alt="acc" />
                                                </div>
                                            )) : (
                                                <span className="text-gray-600 text-xs italic">None selected</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Substats */}
                                    <div>
                                        <h4 className="flex items-center gap-3 text-white/90 text-xs font-bold uppercase tracking-[0.25em] mb-4">
                                            <span className="w-1.5 h-1.5 bg-[#FFD700] rotate-45"></span> Substats Priority
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {build.substats && build.substats.length > 0 ? build.substats.map((sub, idx) => (
                                                <span key={idx} className="group/sub relative bg-[#151515] text-gray-300 border border-gray-700 hover:border-[#FFD700] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-3 shadow-md transition-colors cursor-default">
                                                    <span className="w-5 h-5 rounded bg-gray-800 text-[#FFD700] flex items-center justify-center text-[10px] shadow-inner font-black">{idx + 1}</span>
                                                    {sub}
                                                </span>
                                            )) : (
                                                <span className="text-gray-600 text-xs italic">None</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Note */}
                            {build.note && (
                                <div className="mt-8 pt-6 border-t border-gray-800/50">
                                    <div className="relative text-gray-400 text-sm leading-relaxed bg-[#0a0a0a] p-5 rounded-xl border border-gray-800/50">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gray-800 rounded-l-xl"></div>
                                        <span className="text-[#FFD700] font-bold mr-2 text-xs uppercase tracking-wider">Note:</span>
                                        {build.note}
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
                            <p>No builds available for this hero yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ViewerItemCard({ item, type }) {
    if (!item?.image) return (
        <div className="bg-[#151515] border border-gray-800 rounded-xl h-20 flex items-center justify-center text-gray-700 text-[9px] uppercase tracking-widest font-bold">
            Empty Slot
        </div>
    )

    return (
        <div className="bg-[#151515] border border-gray-800 rounded-xl p-3 flex gap-4 items-center shadow-sm hover:border-gray-600 transition-colors group/card">
            <div className="relative w-14 h-14 bg-black rounded-lg flex-shrink-0 overflow-hidden border border-gray-700/50 shadow-inner group-hover/card:border-[#FFD700]/30 transition-colors">
                <Image src={`/items/${type.toLowerCase()}/${item.image}`} fill className="object-cover" alt={type} />
            </div>
            <div className="min-w-0 flex-1">
                <div className={clsx("text-[10px] font-black uppercase leading-none mb-1.5 tracking-wider", type === "Weapon" ? "text-red-400/80" : "text-blue-400/80")}>
                    {type}
                </div>
                <div className="text-xs text-gray-200 truncate font-bold tracking-tight group-hover/card:text-white transition-colors">
                    {item.stat}
                </div>
            </div>
        </div>
    )
}
