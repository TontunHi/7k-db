import Image from 'next/image'
import { getArenaTeams } from '@/lib/arena-actions'
import { Swords, Video, ExternalLink, Users, Zap, Hash, ArrowRight, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Arena Teams - 7Knights DB',
    description: 'Check out the best Arena teams, formations, and skill rotations.'
}

// Helper functions for formation display
function getSlotType(formation, index) {
    if (!formation) return 'neutral'
    
    if (formation === '1-4') {
        if (index === 2) return 'front'
        return 'back'
    }
    if (formation === '4-1') {
        if (index === 2) return 'back'
        return 'front'
    }
    if (formation === '2-3') {
        if (index === 1 || index === 3) return 'front'
        return 'back'
    }
    if (formation === '3-2') {
        if (index === 1 || index === 3) return 'back'
        return 'front'
    }
    
    const [front] = formation.split('-').map(Number)
    if (index < front) return 'front'
    return 'back'
}

function getStaggerClass(formation, index) {
    if (!formation) return ''
    
    if (formation === '1-4') {
        if ([0, 1, 3, 4].includes(index)) return 'translate-y-6'
    }
    if (formation === '2-3') {
        if ([0, 2, 4].includes(index)) return 'translate-y-6'
    }
    if (formation === '3-2') {
        if ([1, 3].includes(index)) return 'translate-y-6'
    }
    if (formation === '4-1') {
        if (index === 2) return 'translate-y-6'
    }
    return ''
}

// Helper to get hero skill image path
function getSkillImagePath(heroFilename, skillNumber) {
    if (!heroFilename) return null
    const folderName = heroFilename.replace('.png', '')
    return `/skills/${folderName}/${skillNumber}.png`
}

export default async function ArenaPage() {
    const sets = await getArenaTeams()
    
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
                    <div className="space-y-10">
                        {parsedSets.map((set, idx) => (
                            <div 
                                key={set.id} 
                                className="bg-gradient-to-br from-gray-900/80 to-black border border-gray-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm relative group"
                            >
                                {/* Team Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between px-8 py-6 border-b border-gray-800 bg-gray-900/40 relative overflow-hidden gap-4">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    
                                    <div className="flex items-center gap-5 relative z-10">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 font-black text-2xl border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
                                            <Hash className="w-5 h-5 absolute opacity-30 -translate-x-3 -translate-y-3" />
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-white tracking-wide">
                                                {set.team_name || `Arena Team ${idx + 1}`}
                                            </h3>
                                            {/* Formation implicitly shown in the layout below */}
                                        </div>
                                    </div>
                                    
                                    {set.video_url && (
                                        <a 
                                            href={set.video_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="relative z-10 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-red-500/25 active:scale-95 border border-red-500/50"
                                        >
                                            <Video className="w-4 h-4" />
                                            Watch Guide
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </div>

                                <div className="p-8">
                                    <div className="flex flex-col xl:flex-row items-center justify-center gap-10 xl:gap-16 w-full relative">
                                        
                                        {/* Heroes Grid */}
                                        <div className="w-full max-w-[420px] md:max-w-[550px] grid grid-cols-5 gap-3 md:gap-4 pb-8">
                                            {[0, 1, 2, 3, 4].map(i => {
                                                const heroFile = set.heroes?.[i]
                                                const type = getSlotType(set.formation, i)
                                                const stagger = getStaggerClass(set.formation, i)
                                                const isFront = type === 'front'

                                                return (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "relative aspect-[3/4] rounded-xl overflow-hidden border-[3px] flex items-center justify-center bg-gray-950 transition-all duration-300 shadow-xl",
                                                            stagger,
                                                            isFront
                                                                ? "border-sky-500/60 shadow-[0_0_15px_rgba(14,165,233,0.15)] group-hover:border-sky-400"
                                                                : "border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.15)] group-hover:border-rose-400"
                                                        )}
                                                    >
                                                        {heroFile ? (
                                                            <Image
                                                                src={`/heroes/${heroFile}`}
                                                                alt="Hero"
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="text-gray-700 text-xs font-bold uppercase tracking-widest opacity-50">Empty</div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Divider (Desktop) */}
                                        <div className="hidden xl:block w-px h-40 bg-gradient-to-b from-transparent via-gray-700 to-transparent"></div>

                                        {/* Pet */}
                                        <div className="w-full xl:w-40 flex flex-col items-center justify-center p-6 border border-gray-800 rounded-2xl bg-gradient-to-b from-gray-900/50 to-black shadow-inner">
                                            <div className="flex items-center gap-2 mb-4 w-full justify-center pb-2 border-b border-gray-800">
                                                <span className="text-sm font-black uppercase tracking-widest text-[#FFD700]">Pet</span>
                                            </div>
                                            <div className="relative w-24 h-24 filter drop-shadow-[0_0_15px_rgba(255,215,0,0.15)] group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300">
                                                {set.pet_file ? (
                                                    <Image src={set.pet_file} alt="Pet" fill className="object-contain hover:scale-110 transition-transform duration-300" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold uppercase tracking-widest text-xs">-</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skill Rotation Slots */}
                                    {set.skill_rotation?.length > 0 && (
                                        <div className="mt-12 space-y-6 relative w-full flex flex-col items-center">
                                            <div className="inline-flex items-center gap-3 mb-2 px-8 py-2.5 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent border-t border-b border-indigo-500/5">
                                                <Zap className="w-5 h-5 text-indigo-400" />
                                                <span className="text-sm font-black text-white uppercase tracking-widest">Skill Rotation Play</span>
                                            </div>
                                            
                                            <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-4 w-full px-4">
                                                {set.skill_rotation.map((slot, sIdx) => {
                                                    const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                                                    const hFile = set.heroes?.[hIdx]
                                                    const sPath = slot.skill ? getSkillImagePath(hFile, sNum) : null
                                                    const isLast = sIdx === set.skill_rotation.length - 1;

                                                    // Use label if provided, or fallback to auto-increment ID
                                                    const displayLabel = slot.label || String(sIdx + 1);

                                                    return (
                                                        <div key={sIdx} className="flex items-center gap-3 lg:gap-4">
                                                            <div className="flex flex-col items-center group/skill p-2 bg-gray-900/50 rounded-2xl border border-gray-800 shadow-xl hover:bg-gray-800 transition-all duration-300 relative">
                                                                
                                                                {/* Circular Rank/Order badge at top-left corner */}
                                                                <div className="absolute -top-3 -left-3 min-w-[28px] h-7 px-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-[12px] font-black border-2 border-black z-10 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                                                    {displayLabel}
                                                                </div>
                                                                
                                                                {/* Skill Image */}
                                                                <div className="relative w-16 h-16 rounded-xl overflow-hidden border-[2px] border-gray-700/50 bg-gray-950 shadow-inner group-hover/skill:border-indigo-400 group-hover/skill:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300 transform group-hover/skill:-translate-y-1">
                                                                    {hFile && sPath ? (
                                                                        <Image src={sPath} alt="" fill className="object-cover group-hover/skill:scale-110 transition-transform duration-300" />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs font-bold opacity-50">-</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Arrow connecting to the next skill */}
                                                            {!isLast && (
                                                                <ArrowRight className="w-6 h-6 text-gray-700 group-hover/skill:text-indigo-500/50 transition-colors shrink-0" />
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Note */}
                                    {set.note && (
                                        <div className="mt-8 p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl relative">
                                            <div className="absolute top-0 left-6 -translate-y-1/2 bg-black px-2 text-[10px] font-black uppercase tracking-widest text-indigo-400/70">
                                                Strategy Note
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">{set.note}</p>
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
