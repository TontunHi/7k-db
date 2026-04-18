'use client'

import { Swords, Users, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import GuildWarTeamCard from './GuildWarTeamCard'

export default function GuildWarView({ teams, heroImageMap, lastUpdated }) {
    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden pb-32">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-purple-700/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="container mx-auto px-4 py-12 relative z-10">
                
                {/* Header Section */}
                <div className="relative w-full rounded-[2rem] overflow-hidden border border-indigo-500/20 bg-gradient-to-br from-gray-950 via-indigo-950/10 to-black shadow-2xl mb-8 p-6 md:p-10">
                    {/* Animated Glow */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/10 blur-[100px] animate-pulse" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-xl shadow-lg">
                                    <Swords className="w-8 h-8 text-indigo-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 ml-1 mb-1">Combat Archive</span>
                                    <div className="h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-transparent" />
                                </div>
                                {lastUpdated && (
                                    <div className="ml-4 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-md">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 tabular-nums">Last Update : {lastUpdated}</span>
                                    </div>
                                )}
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter drop-shadow-2xl italic leading-none">
                                GUILD WAR <span className="text-gray-500/50">TACTICS</span>
                            </h1>
                            <p className="mt-6 text-gray-400 max-w-xl text-lg font-medium leading-relaxed opacity-80">
                                Specialized team compositions, optimized equipment sets, and adaptive counter strategies for the competitive meta.
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center gap-2">
                             <div className="w-16 h-16 rounded-full border-2 border-indigo-500/30 flex items-center justify-center bg-indigo-500/5 animate-bounce duration-[3000ms]">
                                <Sparkles className="text-indigo-400 w-8 h-8" />
                             </div>
                        </div>
                    </div>
                </div>

                {/* Teams List */}
                <div className="space-y-8">
                    {teams.length === 0 ? (
                        <div className="text-center py-32 border border-dashed border-gray-800 rounded-[3rem] bg-gray-950/50 backdrop-blur-sm">
                            <Users className="w-20 h-20 text-gray-800 mx-auto mb-8" />
                            <h2 className="text-3xl font-black text-gray-500 mb-4">Tactical Database Empty</h2>
                            <p className="text-gray-600 max-w-md mx-auto">The meta analysts haven&apos;t filed any team reports yet. Check back soon for the latest strategies.</p>
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
        </div>
    )
}
