"use client"

import Link from "next/link"
import NextImage from "next/image"
import { Marker } from "../components/AdminEditorial"
import { ArrowRight, Sparkles } from "lucide-react"

/**
 * CastleRushManagerView - Premium Dashboard for Castle Rush Boss Strategy Management
 */
export default function CastleRushManagerView({ bosses = [] }) {
    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section with modern layout */}
            <header className="flex items-center gap-4 pb-6 border-b border-white/5">
                <Marker color="bg-amber-500" className="w-2.5 h-12 rounded-full" />
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
                        Castle Rush <span className="text-amber-500 font-extrabold not-italic">Manager</span>
                    </h1>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest font-semibold opacity-75">
                        Configure teams, speed order, and skill rotations for boss encounters.
                    </p>
                </div>
            </header>

            {/* Boss Grid - Landscape Card Layout (Image on top, Details below) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
                {bosses.map((boss) => (
                    <Link
                        key={boss.key}
                        href={`/admin/castle-rush/${boss.key}`}
                        className="group flex flex-col rounded-2xl overflow-hidden border border-white/5 bg-neutral-950/20 transition-all duration-500 hover:border-amber-500/40 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-950/30"
                    >
                        {/* Top: Image Section */}
                        <div className="relative aspect-video w-full overflow-hidden bg-neutral-950 border-b border-white/5">
                            {/* Status Badge */}
                            <div className="absolute top-4 left-4 z-20">
                                {boss.setCount > 0 ? (
                                    <span className="bg-amber-600 text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md shadow-amber-600/20 backdrop-blur-md">
                                        {boss.setCount} {boss.setCount === 1 ? 'Team' : 'Teams'}
                                    </span>
                                ) : (
                                    <span className="bg-neutral-800/80 text-muted-foreground/80 border border-white/5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md">
                                        No Teams
                                    </span>
                                )}
                            </div>

                            {/* Background Image with Zoom Effect */}
                            <NextImage
                                src={boss.image}
                                alt={boss.name}
                                fill
                                className="object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-750 ease-out"
                                priority
                            />
                            
                            {/* Inner soft dark gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                        </div>

                        {/* Bottom: Details Section (No longer overlaps the image) */}
                        <div className="relative p-5 bg-neutral-900/30 backdrop-blur-md flex flex-col justify-between flex-grow">
                            {/* Accent line on card bottom */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                            
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-1.5">
                                    <Sparkles size={10} /> Active Boss
                                </span>
                                
                                <h3 className="text-lg md:text-xl font-black text-white italic tracking-tight uppercase group-hover:text-amber-400 transition-colors duration-300">
                                    {boss.name}
                                </h3>
                            </div>

                            {/* View Action Button */}
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors duration-300 mt-4 pt-3 border-t border-white/5">
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
