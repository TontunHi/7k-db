"use client"

import Link from "next/link"
import NextImage from "next/image"
import { Marker } from "../components/AdminEditorial"
import { ArrowRight, Skull, Sparkles } from "lucide-react"
import styles from "./raid.module.css"

/**
 * RaidManagerView - Dashboard for Raid Boss Strategy Management
 */
export default function RaidManagerView({ raids = [] }) {
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

            {/* Boss Grid - Vertical Poster Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-2">
                {raids.map((raid) => (
                    <Link
                        key={raid.key}
                        href={`/admin/raid/${raid.key}`}
                        className="group relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 bg-neutral-950 transition-all duration-500 hover:border-red-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-950/30 flex flex-col justify-end"
                    >
                        {/* Status Badge */}
                        <div className="absolute top-4 left-4 z-20">
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

                        {/* Background Image with Zoom Effect - Fits Vertical Layout */}
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
                            {/* Accent line on card bottom */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            
                            <span className="text-[9px] font-black uppercase tracking-widest text-red-400 flex items-center gap-1.5 mb-1">
                                <Sparkles size={10} /> Active Boss
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
                ))}
            </div>
        </div>
    )
}
