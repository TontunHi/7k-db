"use client"

import { useState } from "react"
import Link from "next/link"
import NextImage from "next/image"
import { Marker } from "../components/AdminEditorial"
import { ArrowRight, Check, Flame, Sparkles, Loader2 } from "lucide-react"
import { setActiveRaidBossKeys } from "@/lib/raid-actions"
import { toast } from "sonner"
import styles from "./raid.module.css"

interface RaidBoss {
    key: string
    name: string
    image: string
    setCount: number
}

interface RaidManagerViewProps {
    raids: RaidBoss[]
    initialActiveKeys?: string[]
}

/**
 * RaidManagerView - Dashboard for Raid Boss Strategy Management
 */
export default function RaidManagerView({ raids = [], initialActiveKeys = [] }: RaidManagerViewProps) {
    const [activeKeys, setActiveKeys] = useState<string[]>(initialActiveKeys)
    const [isSaving, setIsSaving] = useState(false)

    const toggleBoss = async (bossKey: string) => {
        const newKeys = activeKeys.includes(bossKey)
            ? activeKeys.filter(k => k !== bossKey)
            : [...activeKeys, bossKey]

        setActiveKeys(newKeys)
        setIsSaving(true)
        try {
            const res = await setActiveRaidBossKeys(newKeys)
            if (res.success) {
                toast.success("Active raid bosses updated successfully")
            } else {
                toast.error(res.error || "Failed to update active raids")
                setActiveKeys(activeKeys) // rollback
            }
        } catch (err: any) {
            toast.error(err.message || "Save operation failed")
            setActiveKeys(activeKeys)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section with modern layout */}
            <header className="flex items-center gap-4 pb-6 border-b border-white/5">
                <Marker color="bg-red-500" className="w-2.5 h-12 rounded-full" />
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
                        Raid <span className="text-red-500 font-extrabold not-italic">Manager</span>
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-semibold opacity-75">
                        Configure teams, speed order, and skill rotations for boss encounters.
                    </p>
                </div>
            </header>

            {/* Active Raid Selector Panel */}
            <div className="p-5 rounded-2xl bg-neutral-900/70 border border-red-500/20 shadow-xl backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                            <Flame size={18} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                Active Raid Encounters
                            </h2>
                            <p className="text-[11px] text-muted-foreground">
                                Check the active raid bosses in the current rotation to highlight on Homepage and Raids page.
                            </p>
                        </div>
                    </div>
                    {isSaving && (
                        <span className="flex items-center gap-1.5 text-xs text-red-400 font-semibold">
                            <Loader2 size={14} className="animate-spin" /> Saving changes...
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    {raids.map((raid) => {
                        const isActive = activeKeys.includes(raid.key)
                        return (
                            <button
                                key={raid.key}
                                type="button"
                                onClick={() => toggleBoss(raid.key)}
                                disabled={isSaving}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                                    isActive
                                        ? "bg-red-500/15 border-red-500/60 shadow-lg shadow-red-950/40 text-white"
                                        : "bg-black/30 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                                    isActive ? "bg-red-500 border-red-400 text-white" : "border-neutral-700 bg-neutral-900"
                                }`}>
                                    {isActive && <Check size={12} strokeWidth={3} />}
                                </div>
                                <span className="text-xs font-bold truncate">{raid.name}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Boss Grid - Vertical Poster Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
                {raids.map((raid) => {
                    const isActive = activeKeys.includes(raid.key)
                    return (
                        <Link
                            key={raid.key}
                            href={`/admin/raid/${raid.key}`}
                            className={`group relative aspect-[2/3] rounded-2xl overflow-hidden border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col justify-end ${
                                isActive
                                    ? "border-red-500/50 bg-neutral-950 shadow-red-950/30"
                                    : "border-white/5 bg-neutral-950 hover:border-white/20"
                            }`}
                        >
                            {/* Badges */}
                            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    {raid.setCount > 0 ? (
                                        <span className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md shadow-red-600/20 backdrop-blur-md">
                                            {raid.setCount} {raid.setCount === 1 ? 'Team' : 'Teams'}
                                        </span>
                                    ) : (
                                        <span className="bg-neutral-800/80 text-muted-foreground/80 border border-white/5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                                            No Teams
                                        </span>
                                    )}
                                </div>

                                {isActive && (
                                    <span className="bg-amber-500/90 text-black px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-md backdrop-blur-md flex items-center gap-1">
                                        <Sparkles size={10} /> Active
                                    </span>
                                )}
                            </div>

                            {/* Background Image with Zoom Effect */}
                            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/30 to-transparent">
                                <NextImage
                                    src={raid.image}
                                    alt={raid.name}
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-85 group-hover:scale-105 transition-all duration-750 ease-out"
                                    priority
                                />
                            </div>

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90 z-10" />

                            {/* Bottom Information (Glass Card Concept) */}
                            <div className="relative z-20 p-5 m-3 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-300 group-hover:border-red-500/20 group-hover:bg-black/60">
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                
                                <span className="text-[9px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1.5 mb-1">
                                    <Sparkles size={10} /> Raid Encounter
                                </span>
                                
                                <h3 className="text-lg md:text-xl font-black text-white italic tracking-tight uppercase group-hover:text-red-400 transition-colors duration-300">
                                    {raid.name}
                                </h3>

                                {/* View Action Button */}
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors duration-300 mt-3 pt-3 border-t border-white/5">
                                    <span>Manage Strategy</span>
                                    <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
