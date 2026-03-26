import Image from 'next/image'
import Link from 'next/link'
import { getBossInfo, getSetsByBoss } from '@/lib/advent-actions'
import { Compass, ArrowLeft, Video, ExternalLink, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
    const { boss: bossKey } = await params
    const boss = await getBossInfo(bossKey)
    if (!boss) return { title: 'Boss Not Found' }
    
    return {
        title: `${boss.name} - Advent Expedition`,
        description: `Team recommendations for Advent Expedition boss ${boss.name}.`
    }
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

function getSkillImagePath(heroFilename, skillNumber) {
    if (!heroFilename) return null
    const folderName = heroFilename.replace('.png', '')
    return `/skills/${folderName}/${skillNumber}.png`
}

// Reusable team display component
function TeamDisplay({ heroes, formation, petFile, skillRotation, teamLabel, teamColor }) {
    return (
        <div className="space-y-4">
            {/* Team label */}
            <div className="flex items-center gap-2">
                <div className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center text-xs font-black",
                    teamColor === 'sky' ? "bg-sky-500/20 text-sky-400" : "bg-rose-500/20 text-rose-400"
                )}>
                    {teamLabel}
                </div>
                <span className={cn(
                    "text-sm font-bold uppercase tracking-wider",
                    teamColor === 'sky' ? "text-sky-400" : "text-rose-400"
                )}>
                    Team {teamLabel}
                </span>
                <span className="text-xs text-gray-500">Formation: {formation?.replace('-', ' - ')}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Heroes Grid */}
                <div className="flex-1 grid grid-cols-5 gap-3 pb-6">
                    {[0, 1, 2, 3, 4].map(i => {
                        const heroFile = heroes?.[i]
                        const type = getSlotType(formation, i)
                        const stagger = getStaggerClass(formation, i)
                        const isFront = type === 'front'

                        return (
                            <div
                                key={i}
                                className={cn(
                                    "relative aspect-[3/4] rounded-lg overflow-hidden border-2 flex items-center justify-center bg-black transition-all duration-300",
                                    stagger,
                                    isFront ? "border-sky-500/50" : "border-rose-500/50"
                                )}
                            >
                                {heroFile ? (
                                    <Image src={`/heroes/${heroFile}`} alt="Hero" fill className="object-cover" />
                                ) : (
                                    <div className="text-gray-700 text-xs">Empty</div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Pet */}
                <div className="w-full md:w-32 flex flex-col items-center justify-center p-4 border border-gray-800 rounded-xl bg-gray-900/30">
                    <span className="text-xs font-bold uppercase text-gray-500 mb-2">Pet</span>
                    <div className="relative w-20 h-20">
                        {petFile ? (
                            <Image src={petFile} alt="Pet" fill className="object-contain" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-700">-</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Skill Rotation Slots */}
            {skillRotation?.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Skill Rotation</span>
                    </div>
                    <div className="flex flex-wrap items-end gap-1 bg-black/40 rounded-xl border border-gray-800 p-3">
                        {skillRotation.map((slot, sIdx) => {
                            const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                            const hFile = heroes?.[hIdx]
                            const sPath = slot.skill ? getSkillImagePath(hFile, sNum) : null

                            return (
                                <div key={sIdx} className="flex flex-col items-center">
                                    {slot.label && (
                                        <span className="text-[10px] font-bold text-violet-400/70 mb-0.5 truncate max-w-[40px]">
                                            {slot.label}
                                        </span>
                                    )}
                                    {!slot.label && <div className="h-[14px]" />}
                                    <div className="relative w-10 h-10 rounded-md overflow-hidden border border-violet-500/20 bg-gray-900">
                                        {hFile && sPath ? (
                                            <Image src={sPath} alt="" fill className="object-contain p-0.5" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs">-</div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default async function AdventBossPage({ params }) {
    const { boss: bossKey } = await params
    const boss = await getBossInfo(bossKey)
    
    if (!boss) {
        notFound()
    }
    
    const sets = await getSetsByBoss(bossKey)

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden pb-20">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-violet-500 opacity-20 blur-[100px]"></div>
            </div>

            {/* Hero Banner */}
            <div className="relative z-10">
                <div className="container mx-auto px-4 py-8">
                    <Link 
                        href="/advent" 
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors mb-6 backdrop-blur-sm bg-black/30 px-4 py-2 rounded-lg border border-gray-700/50"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Advent Expedition</span>
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Boss Image */}
                        <div className="relative w-full lg:w-1/2 aspect-[2/3] md:aspect-[3/4] lg:aspect-[1/1] rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-[#1a1a1a] to-black shadow-2xl">
                            {boss.image && !boss.image.includes('undefined') ? (
                                <Image src={boss.image} alt={boss.name} fill className="object-contain" priority />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Compass className="w-24 h-24 text-gray-700" />
                                </div>
                            )}
                        </div>
                        
                        {/* Boss Info */}
                        <div className="flex-1 lg:pt-12">
                            <div className="flex items-center gap-3 mb-4">
                                <Compass className="w-10 h-10 text-violet-400" />
                                <span className="text-violet-400 text-sm font-bold uppercase tracking-wider">Advent Expedition Boss</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight uppercase italic transform -skew-x-3 drop-shadow-2xl">
                                {boss.name}
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-violet-500 to-purple-500 transform -skew-x-12 mt-4 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teams Section */}
            <div className="container mx-auto px-4 mt-8 relative z-10">
                {sets.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-700 rounded-2xl bg-gray-900/30">
                        <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">No team recommendations available yet.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {sets.map((set, idx) => (
                            <div 
                                key={set.id} 
                                className="bg-gradient-to-b from-gray-900/80 to-black border border-gray-800 rounded-2xl overflow-hidden"
                            >
                                {/* Set Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 font-black text-lg">
                                            {idx + 1}
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Set {idx + 1}</h3>
                                    </div>
                                    
                                    {set.video_url && (
                                        <a 
                                            href={set.video_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-colors"
                                        >
                                            <Video className="w-4 h-4" />
                                            Watch Video
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Team 1 */}
                                    <TeamDisplay
                                        heroes={set.team1_heroes}
                                        formation={set.team1_formation}
                                        petFile={set.team1_pet_file}
                                        skillRotation={set.team1_skill_rotation}
                                        teamLabel={1}
                                        teamColor="sky"
                                    />

                                    <div className="border-t border-gray-800" />

                                    {/* Team 2 */}
                                    <TeamDisplay
                                        heroes={set.team2_heroes}
                                        formation={set.team2_formation}
                                        petFile={set.team2_pet_file}
                                        skillRotation={set.team2_skill_rotation}
                                        teamLabel={2}
                                        teamColor="rose"
                                    />

                                    {/* Note */}
                                    {set.note && (
                                        <div className="mt-6 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                                            <p className="text-gray-400 text-sm italic">{set.note}</p>
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
