'use client'

import { Swords, Users, Sparkles, Filter, Zap, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import GuildWarTeamCard from './GuildWarTeamCard'

export default function GuildWarView({ teams, heroImageMap, lastUpdated }) {
    return (
        <div className="relative min-h-screen w-full bg-[#020203] overflow-hidden pb-32">
            {/* Immersive Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-indigo-600/5 rounded-full blur-[160px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-900/5 rounded-full blur-[140px]" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020203]/50 to-[#020203]" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                
                {/* Compact Tactical Header */}
                <div className="relative group mb-8">
                    {/* Glow accent */}
                    <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-indigo-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm pointer-events-none" />
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0a0a0c]/80 backdrop-blur-3xl border border-white/8 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl">
                        
                        {/* Decorative top line */}
                        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
                        {/* Decorative bottom glow */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                        {/* Side accent orb */}
                        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

                        <div className="flex items-center gap-5">
                            {/* Icon badge */}
                            <div className="relative flex-shrink-0">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-md" />
                                <div className="relative p-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                                    <Swords className="w-6 h-6 text-indigo-400" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase leading-none">
                                    <span className="text-white">Guild War</span>
                                    <span className="ml-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent italic">Database</span>
                                </h1>
                            </div>
                        </div>

                        {/* Last Updated Badge */}
                        {lastUpdated && (
                            <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/[0.02] border border-white/8 backdrop-blur-xl shrink-0">
                                <div className="relative flex items-center justify-center w-2 h-2">
                                    <div className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-60" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Last Updated</span>
                                    <span className="text-xs font-black text-gray-300">{lastUpdated}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Teams Layout */}
                <div className="grid grid-cols-1 gap-10">
                    {teams.length === 0 ? (
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-b from-gray-800/20 to-transparent rounded-[3rem] blur-xl opacity-20" />
                            <div className="relative flex flex-col items-center justify-center py-40 border border-dashed border-white/10 rounded-[3rem] bg-[#0a0a0c]/50 backdrop-blur-sm overflow-hidden">
                                <div className="p-6 rounded-full bg-white/[0.02] border border-white/5 mb-8">
                                    <Users className="w-16 h-16 text-gray-700" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-400 mb-3 tracking-tight">Tactical Database Offline</h2>
                                <p className="text-gray-600 max-w-sm text-center text-sm font-medium">
                                    The strategic analysts are currently compiling new data. Please check back shortly for updated formations.
                                </p>
                            </div>
                        </div>
                    ) : (
                        teams.map((team, idx) => (
                            <GuildWarTeamCard 
                                key={team.id} 
                                team={team} 
                                index={idx} 
                                heroImageMap={heroImageMap} 
                            />
                        ))
                    )}
                </div>
            </div>
            
            {/* Interactive Footer Gradient */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020203] to-transparent pointer-events-none z-20" />
        </div>
    )
}
