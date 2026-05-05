"use client"

import { Terminal, Sparkles, Zap, Wrench } from "lucide-react"

const UPDATES = [
    {
        date: "Apr 22, 2026",
        items: [
            { category: "GUILD WAR", text: "Transformed Guild War into a high-performance Tactical Dashboard with professional command-center aesthetics.", icon: Zap },
            { category: "UI/UX", text: "Implemented 'Hero Banner' collapsed states for both primary and counter teams with full-height portraits.", icon: Sparkles },
            { category: "INTEL", text: "Expanded Counter Team Intelligence to include primary targets, skill rotations, and detailed hero item notes.", icon: Zap },
            { category: "ASSETS", text: "Optimized asset pathing and implemented 'Smart-Hide' logic for empty formation slots to ensure clean rendering.", icon: Wrench }
        ]
    },
    {
        date: "Apr 19, 2026",
        items: [
            { category: "ENGINE", text: "Implemented dynamic Skill Discovery logic that automatically scans the filesystem for all hero skill assets.", icon: Zap },
            { category: "ADMIN", text: "Migrated all administrative modules (Raid, Dungeon, Total War, Arena) to support the dynamic skill system.", icon: Wrench },
            { category: "UI/UX", text: "Refactored the Raid Skill Grid to maintain a uniform 2x5 layout while supporting custom rotations.", icon: Sparkles },
            { category: "FEATURE", text: "Standardized Skill Rotation pickers across all game modes with a unified modal-based interface.", icon: Zap },
            { category: "STABILITY", text: "Enhanced error handling for hero slots and skill identifiers to prevent runtime crashes.", icon: Wrench }
        ]
    }
]

export default function WebsiteUpdates() {
    return (
        <div className="w-full relative px-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-white/90">
                        Site Patch Notes
                    </h2>
                </div>
                <Terminal className="w-3.5 h-3.5 text-cyan-500/30" />
            </div>

            <div className="space-y-6">
                {UPDATES.map((group) => (
                    <div key={group.date} className="relative">
                        {/* Date Header */}
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-[9px] font-black text-cyan-500/80 uppercase tracking-widest">
                                {group.date}
                            </span>
                            <div className="h-px flex-1 bg-cyan-500/10" />
                        </div>

                        {/* Vertical Connector */}
                        <div className="absolute left-[19px] top-8 bottom-0 w-px bg-cyan-500/10" />

                        {/* Items */}
                        <div className="space-y-3">
                            {group.items.map((item, iIdx) => (
                                <div key={iIdx} className="group relative flex items-start gap-3">
                                    {/* Timeline Node */}
                                    <div className="relative z-10 shrink-0">
                                        <div className="w-6 h-6 rounded-lg bg-black/60 backdrop-blur-sm border border-white/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:border-cyan-500/30 shadow-sm">
                                            <item.icon className="w-3 h-3 text-cyan-400/80" />
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 min-w-0">
                                        <div className="mb-0.5">
                                            <span className="text-[8px] font-black uppercase tracking-wider text-cyan-500/60 py-px px-1.5 rounded-sm bg-cyan-500/5 border border-cyan-500/10">
                                                {item.category}
                                            </span>
                                        </div>
                                        
                                        <p className="text-[11px] font-medium text-gray-500 leading-snug group-hover:text-gray-300 transition-colors group-hover:translate-x-1 transition-transform duration-200">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
