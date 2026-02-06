import Image from 'next/image'
import Link from 'next/link'
import { getDungeonInfo, getSetsByDungeon } from '@/lib/dungeon-actions'
import { Landmark, ArrowLeft, Video, ExternalLink, Users, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
    const { key: dungeonKey } = await params
    const dungeon = await getDungeonInfo(dungeonKey)
    if (!dungeon) return { title: 'Dungeon Not Found' }
    
    return {
        title: `${dungeon.name} - Dungeon Guides | 7K Database`,
        description: `Team recommendations for ${dungeon.name}.`
    }
}

// Helper functions for formation display (Reused)
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

export default async function DungeonDetailPage({ params }) {
    const { key: dungeonKey } = await params
    const dungeon = await getDungeonInfo(dungeonKey)
    
    if (!dungeon) {
        notFound()
    }
    
    const sets = await getSetsByDungeon(dungeonKey)
    
    // Parse heroes JSON
    const parsedSets = sets.map(set => ({
        ...set,
        heroes: typeof set.heroes_json === 'string' 
            ? JSON.parse(set.heroes_json) 
            : (set.heroes_json || set.heroes || [])
    }))

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden pb-20">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#FFD700] opacity-20 blur-[100px]"></div>
            </div>

            {/* Hero Banner */}
            <div className="relative z-10">
                <div className="container mx-auto px-4 py-8">
                    <Link 
                        href="/dungeon" 
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FFD700] transition-colors mb-6 backdrop-blur-sm bg-black/30 px-4 py-2 rounded-lg border border-gray-700/50"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Dungeons</span>
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Dungeon Image */}
                        <div className="relative w-full lg:w-1/2 aspect-[2/1] rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-[#1a1a1a] to-black shadow-2xl">
                            <Image 
                                src={dungeon.image} 
                                alt={dungeon.name} 
                                fill 
                                className="object-contain" 
                                priority
                            />
                        </div>
                        
                        {/* Dungeon Info */}
                        <div className="flex-1 lg:pt-8">
                            <div className="flex items-center gap-3 mb-4">
                                <Landmark className="w-10 h-10 text-[#FFD700]" />
                                <span className="text-[#FFD700] text-sm font-bold uppercase tracking-wider">Dungeon Guide</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase italic transform -skew-x-3 drop-shadow-2xl">
                                {dungeon.name}
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-[#FFD700] to-[#FFA500] transform -skew-x-12 mt-4 shadow-[0_0_15px_#FFD700]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teams Section */}
            <div className="container mx-auto px-4 mt-8 relative z-10">
                {parsedSets.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-700 rounded-2xl bg-gray-900/30">
                        <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">No team recommendations available yet.</p>
                    </div>
                ) : (
                    <div className="space-y-8 max-w-5xl mx-auto">
                        {parsedSets.map((set, idx) => (
                            <div 
                                key={set.id} 
                                className="bg-gradient-to-b from-gray-900/80 to-black border border-gray-800 rounded-2xl overflow-hidden"
                            >
                                {/* Team Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] font-black text-lg">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Team {idx + 1}</h3>
                                            <p className="text-sm text-gray-400">Formation: {set.formation?.replace('-', ' - ')}</p>
                                        </div>
                                    </div>
                                    
                                    {set.video_url && (
                                        <a 
                                            href={set.video_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-colors shadow-lg shadow-red-900/20"
                                        >
                                            <Video className="w-4 h-4" />
                                            Watch Video
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row gap-8">
                                        {/* Heroes Grid */}
                                        <div className="flex-1 grid grid-cols-5 gap-3 pb-6">
                                            {[0, 1, 2, 3, 4].map(i => {
                                                const heroFile = set.heroes?.[i]
                                                const type = getSlotType(set.formation, i)
                                                const stagger = getStaggerClass(set.formation, i)
                                                const isFront = type === 'front'

                                                return (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "relative aspect-[3/4] rounded-lg overflow-hidden border-2 flex items-center justify-center bg-black transition-all duration-300",
                                                            stagger,
                                                            isFront
                                                                ? "border-sky-500/50"
                                                                : "border-rose-500/50"
                                                        )}
                                                    >
                                                        {heroFile ? (
                                                            <Image
                                                                src={`/heroes/${heroFile}`}
                                                                alt="Hero"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="text-gray-700 text-xs">Empty</div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* Pet */}
                                        <div className="w-full md:w-32 flex flex-col items-center justify-center p-4 border border-gray-800 rounded-xl bg-gray-900/30">
                                            <span className="text-xs font-bold uppercase text-gray-500 mb-2 flex items-center gap-1">
                                                <Star className="w-3 h-3 text-[#FFD700]" /> Pet
                                            </span>
                                            <div className="relative w-20 h-20">
                                                {set.pet_file ? (
                                                    <Image src={set.pet_file} alt="Pet" fill className="object-contain" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-700 font-mono text-2xl">-</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Mobile Video Button */}
                                    {set.video_url && (
                                        <a 
                                            href={set.video_url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex sm:hidden w-full items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-colors mt-6"
                                        >
                                            <Video className="w-4 h-4" />
                                            Watch Video Guide
                                        </a>
                                    )}

                                    {/* Note */}
                                    {set.note && (
                                        <div className="mt-6 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                                            <p className="text-gray-400 text-sm italic">&quot;{set.note}&quot;</p>
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
