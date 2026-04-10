"use client"

import { useState } from "react"
import { clsx } from "clsx"
import { Shield, Sparkles, Sword, Database } from "lucide-react"
import HeroRegistry from "./HeroRegistry"
import PetRegistry from "./PetRegistry"
import ItemRegistry from "./ItemRegistry"

export default function RegistryDashboard({ initialData }) {
    const [activeTab, setActiveTab] = useState("heroes")

    const tabs = [
        { id: "heroes", name: "Heroes", icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10" },
        { id: "pets", name: "Pets", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/10" },
        { id: "items", name: "Items", icon: Sword, color: "text-emerald-500", bg: "bg-emerald-500/10" }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                        <div className="p-2 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                            <Database className="w-5 h-5 text-[#FFD700]" />
                        </div>
                        Database Registry
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 uppercase font-bold tracking-widest text-[10px]">
                        Centralized Metadata management for Heroes, Pets, and Items
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1.5 bg-black/40 border border-white/5 rounded-2xl w-fit">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "flex items-center gap-2.5 px-6 py-2.5 rounded-xl transition-all duration-300 font-black uppercase text-[11px] tracking-widest",
                                isActive 
                                    ? clsx("bg-white border border-white text-black shadow-lg shadow-white/5 scale-105")
                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent"
                            )}
                        >
                            <tab.icon className={clsx("w-4 h-4", isActive ? "text-black" : tab.color)} />
                            {tab.name}
                        </button>
                    )
                })}
            </div>

            {/* Content Section */}
            <div className="relative min-h-[600px]">
                {activeTab === "heroes" && <HeroRegistry initialData={initialData.heroes} />}
                {activeTab === "pets" && <PetRegistry initialData={initialData.pets} assets={initialData.assets?.pets} />}
                {activeTab === "items" && <ItemRegistry initialData={initialData.items} assets={initialData.assets?.items} />}
            </div>
        </div>
    )
}
