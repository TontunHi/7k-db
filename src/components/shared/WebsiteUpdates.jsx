"use client"

import { Terminal, Sparkles, Zap, Wrench } from "lucide-react"

const UPDATES = [
    {
        date: "Apr 19, 2026",
        items: [
            { category: "GUILD WAR", text: "Modernized Guild War interface with a high-fidelity 'Command Center' aesthetic.", icon: Sparkles },
            { category: "UI/UX", text: "Implemented asset-centric tactical summaries (Heroes + Pets) in minimized card states.", icon: Zap },
            { category: "FEATURE", text: "Added support for tactical labels and step indicators in Skill Rotations.", icon: Wrench },
            { category: "UI/UX", text: "Standardized tactical terminology (Build, Build Counter, Skill Rotation) across the platform.", icon: Zap },
            { category: "UI/UX", text: "Optimized squad previews with larger hero portraits and discrete tactical icons.", icon: Sparkles }
        ]
    }
]

export default function WebsiteUpdates() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-300">
                        Update Website
                    </h2>
                </div>
                <Terminal className="w-4 h-4 text-cyan-500/50" />
            </div>

            <div className="space-y-8">
                {UPDATES.map((group) => (
                    <div key={group.date} className="relative">
                        {/* Date Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{group.date}</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>

                        {/* Items */}
                        <div className="space-y-5">
                            {group.items.map((item, iIdx) => (
                                <div key={iIdx} className="group flex items-start gap-4">
                                    <div className="mt-0.5 w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-cyan-500/50 transition-colors">
                                        <item.icon className="w-3.5 h-3.5 text-cyan-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black uppercase tracking-wider text-cyan-500/70">{item.category}</span>
                                        </div>
                                        <p className="text-[11px] font-medium text-gray-400 leading-snug group-hover:text-gray-200 transition-colors">
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
