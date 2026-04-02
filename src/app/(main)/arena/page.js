import Image from 'next/image'
import { getArenaTeams } from '@/lib/arena-actions'
import { Swords, Video, ExternalLink, Users, Zap, Hash, ArrowRight, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getHeroImageMap } from '@/lib/hero-utils-server'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Arena Teams - 7Knights DB',
    description: 'Check out the best Arena teams, formations, and skill rotations.'
}

import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import SkillSequence from '@/components/shared/SkillSequence'

export default async function ArenaPage() {
    const sets = await getArenaTeams()
    const heroImageMap = await getHeroImageMap()
    
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
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden pb-20">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[500px] rounded-full bg-indigo-500 opacity-20 blur-[120px]"></div>
                <div className="absolute right-0 top-40 -z-10 m-auto h-[300px] w-[300px] rounded-full bg-purple-500 opacity-20 blur-[100px]"></div>
            </div>

            {/* Banner Section */}
            <div className="relative z-10">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Banner */}
                    <div className="relative w-full rounded-3xl overflow-hidden border border-gray-800 bg-gradient-to-br from-indigo-950 via-gray-900 to-black shadow-2xl mb-8 p-10 md:p-14">
                        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15)_0%,transparent_50%)] pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30 backdrop-blur-md">
                                    <Swords className="w-8 h-8 text-indigo-400" />
                                </div>
                                <span className="text-indigo-400 text-sm font-black uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                                    PVP Rankings
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-400 tracking-tight italic transform -skew-x-2 drop-shadow-2xl">
                                ARENA TEAMS
                            </h1>
                            <p className="mt-4 text-gray-400 max-w-2xl text-lg">
                                Discover the strongest formations, optimal hero setups, and precise skill rotations to dominate your opponents in the Arena.
                            </p>
                            <div className="h-1.5 w-32 bg-gradient-to-r from-indigo-500 to-purple-500 transform -skew-x-12 mt-6 shadow-[0_0_20px_rgba(99,102,241,0.5)] rounded-full"></div>
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
                        <p className="text-gray-500 max-w-md mx-auto">The administrator hasn't configured any team recommendations yet. Check back soon for the latest meta setups.</p>
                    </div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                        {parsedSets.map((set, idx) => (
                            <div 
                                key={set.id} 
                                className="bg-gradient-to-br from-gray-950 to-black border border-gray-800 rounded-2xl overflow-hidden shadow-xl relative group transition-all duration-500 flex flex-col"
                            >
                                {/* Team Header */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-gray-800 bg-black/40 relative gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-black text-sm border border-indigo-500/30 shadow-md">
                                                {idx + 1}
                                            </div>
                                            <h3 className="text-base md:text-lg font-black text-white tracking-wide">
                                                {set.team_name || `Arena Team ${idx + 1}`}
                                            </h3>
                                        </div>
                                    
                                        {set.video_url && (
                                            <a 
                                                href={set.video_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-800 text-white rounded-lg text-xs font-bold transition-all border border-gray-700"
                                            >
                                                <Video className="w-3.5 h-3.5 text-red-500" />
                                                Guide
                                                <ExternalLink className="w-3 h-3 ml-0.5 text-gray-400" />
                                            </a>
                                        )}
                                    </div>

                                    <div className="p-4 flex-1 flex flex-col gap-4">
                                        {/* Core Setup Row: Formation Grid + Pet */}
                                        <div className="flex items-center gap-4 bg-gray-950/40 p-4 rounded-xl border border-gray-800/40">
                                            
                                            {/* 5-Slot Formation Grid */}
                                            <FormationGrid formation={set.formation} heroes={set.heroes} heroImageMap={heroImageMap} />

                                            {/* Divider */}
                                            <div className="w-px h-12 bg-gray-800/50 mx-2" />

                                            {/* Pet Badge - Moved to Right */}
                                            <PetDisplay petFile={set.pet_file} />
                                        </div>

                                        {/* Skill Rotation - Extra Compact */}
                                        <SkillSequence skillRotation={set.skill_rotation} heroes={set.heroes} heroImageMap={heroImageMap} />

                                        {/* Strategy Note - Extra Compact */}
                                        {set.note && (
                                            <div className="mt-auto p-3 bg-white/[0.02] border border-gray-800/30 rounded-lg relative">
                                                <p className="text-gray-500 leading-snug text-[11px] italic line-clamp-3">
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
