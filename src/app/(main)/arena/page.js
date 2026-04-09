import Image from 'next/image'
import { getArenaTeams } from '@/lib/arena-actions'
import { Swords, Video, ExternalLink, Users, Zap, Hash, ArrowRight, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getHeroImageMap } from '@/lib/hero-utils-server'
import { getLastUpdate } from '@/lib/log-actions'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Arena Teams - 7Knights DB',
    description: 'Check out the best Arena teams, formations, and skill rotations.'
}

import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'

export default async function ArenaPage() {
    const [sets, heroImageMap, lastUpdated] = await Promise.all([
        getArenaTeams(),
        getHeroImageMap(),
        getLastUpdate('ARENA')
    ])
    
    // Parse heroes JSON
    const parsedSets = sets.map(set => ({
        ...set,
        heroes: typeof set.heroes_json === 'string' 
            ? JSON.parse(set.heroes_json) 
            : (set.heroes_json || set.heroes || []),
        skill_rotation: typeof set.skill_rotation === 'string'
            ? JSON.parse(set.skill_rotation)
            : (set.skill_rotation || [])
    }))

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden pb-32">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[600px] rounded-full bg-indigo-500 opacity-10 blur-[140px]"></div>
                <div className="absolute right-0 top-40 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-purple-600 opacity-10 blur-[120px]"></div>
                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            {/* Banner Section */}
            <div className="relative z-10 pt-4">
                <div className="container mx-auto px-4">
                    {/* Header Banner */}
                    <div className="relative w-full rounded-[2rem] overflow-hidden border border-white/5 bg-gradient-to-br from-indigo-950/40 via-gray-950 to-black shadow-2xl mb-8 p-8 md:p-12"
                        style={{ boxShadow: "0 15px 35px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)" }}
                    >
                        {/* Animated background highlights */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1)_0%,transparent_60%)] pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
                            <div className="flex flex-col items-center md:items-start text-center md:text-left">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/30 backdrop-blur-xl shadow-lg">
                                        <Swords className="w-6 h-6 text-indigo-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.3em] ml-0.5">Competitive Meta</span>
                                        <div className="h-[1.5px] w-12 bg-indigo-500/50 rounded-full" />
                                    </div>
                                </div>
                                
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter italic transform -skew-x-1">
                                    <span className="inline text-white drop-shadow-2xl">ARENA</span>
                                    <span className="inline text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-white/80 ml-3">TEAMS</span>
                                </h1>
                                
                                <p className="mt-3 text-gray-400 max-w-xl text-sm md:text-base font-medium leading-relaxed opacity-80">
                                    Optimal formations and rotations for Arena dominance.
                                </p>
                            </div>
                            
                            <div className="flex gap-3 shrink-0">
                                {lastUpdated && (
                                    <div className="px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md">
                                        <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest tabular-nums">Updated {lastUpdated}</span>
                                    </div>
                                )}
                                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
                                    <span className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Season Update</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teams Section */}
            <div className="container mx-auto px-4 relative z-10">
                {parsedSets.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-700/50 rounded-3xl bg-gray-900/20 backdrop-blur-sm">
                        <Users className="w-16 h-16 text-indigo-500/50 mx-auto mb-6" />
                        <h2 className="text-2xl font-black text-gray-300 mb-2">No Arena Teams Available</h2>
                        <p className="text-gray-500 max-w-md mx-auto">The administrator hasn&apos;t configured any team recommendations yet. Check back soon for the latest meta setups.</p>
                    </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                        {parsedSets.map((set, idx) => (
                            <div 
                                key={set.id} 
                                className="bg-gradient-to-br from-gray-900/80 to-black/90 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative group transition-all duration-500 flex flex-col hover:-translate-y-1 hover:shadow-indigo-500/10 hover:border-indigo-500/30"
                                style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)" }}
                            >
                                {/* Team Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between px-7 py-5 border-b border-white/5 bg-white/5 relative gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/30 flex items-center justify-center text-indigo-400 font-black text-sm border border-indigo-500/30 shadow-lg">
                                            {idx + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-indigo-500/80 uppercase tracking-[0.2em] mb-0.5">Arena Formation</span>
                                            <h3 className="text-lg md:text-xl font-black text-white tracking-wide">
                                                {set.team_name || `Arena Team ${idx + 1}`}
                                            </h3>
                                        </div>
                                    </div>
                                
                                    {set.video_url && (
                                        <a 
                                            href={set.video_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2.5 px-5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-100 rounded-xl text-xs font-black transition-all border border-indigo-500/30 shadow-lg uppercase tracking-wider group/guide"
                                        >
                                            <Video className="w-4 h-4 text-red-500 transition-transform group-hover/guide:scale-110" />
                                            Video Guide
                                            <ExternalLink className="w-3.5 h-3.5 ml-0.5 text-indigo-400/60" />
                                        </a>
                                    )}
                                </div>

                                <div className="p-6 flex-1 flex flex-col gap-6">
                                    {/* Core Setup Row: Formation Grid + Pet */}
                                    <div className="flex items-center gap-6 bg-black/40 p-6 rounded-2xl border border-white/5 shadow-inner relative overflow-hidden group/setup">
                                        {/* Subtle internal glow */}
                                        <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover/setup:opacity-100 transition-opacity duration-700" />
                                        
                                        {/* 5-Slot Formation Grid - Added horizontal padding */}
                                        <div className="flex-1 px-4">
                                            <FormationGrid formation={set.formation} heroes={set.heroes} heroImageMap={heroImageMap} />
                                        </div>

                                        {/* Divider */}
                                        <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-800 to-transparent mx-2 flex-shrink-0" />

                                        {/* Pet Badge - Moved to Right */}
                                        <PetDisplay petFile={set.pet_file} hideLabel={true} />
                                    </div>

                                    {/* Skill Rotation */}
                                    <SkillSequence skillRotation={set.skill_rotation} heroes={set.heroes} heroImageMap={heroImageMap} />

                                    {/* Strategy Note */}
                                    {set.note && set.note.trim() !== "" && (
                                        <div className="mt-auto p-4 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden group/note">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/40" />
                                            <p className="text-gray-400 leading-relaxed text-xs font-medium italic">
                                                &quot;{set.note}&quot;
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
