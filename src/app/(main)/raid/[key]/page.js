import Image from 'next/image'
import Link from 'next/link'
import { getRaidInfo, getSetsByRaid } from '@/lib/raid-actions'
import { Skull, ArrowLeft, Video, ExternalLink, Users, Star, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { getHeroImageMap } from '@/lib/hero-utils'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
    const { key: raidKey } = await params
    const raid = await getRaidInfo(raidKey)
    if (!raid) return { title: 'Raid Not Found' }
    
    return {
        title: `${raid.name} - Raid Guide`,
        description: `Team recommendations and skill rotations for ${raid.name}.`
    }
}

import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import { getSkillImagePath } from '@/lib/formation-utils'

export default async function RaidDetailPage({ params }) {
    const { key: raidKey } = await params
    const raid = await getRaidInfo(raidKey)
    
    if (!raid) {
        notFound()
    }
    
    const sets = await getSetsByRaid(raidKey)
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
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-red-500 opacity-20 blur-[100px]"></div>
            </div>

            {/* Hero Banner */}
            <div className="relative z-10">
                <div className="container mx-auto px-4 py-8">
                    <Link 
                        href="/raid" 
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors mb-6 backdrop-blur-sm bg-black/30 px-4 py-2 rounded-lg border border-gray-700/50"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Raids</span>
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row gap-8 items-start">
                        {/* Raid Image */}
                        <div className="relative w-full lg:w-1/2 aspect-[16/9] rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-br from-[#1a1a1a] to-black shadow-2xl">
                            <Image 
                                src={raid.image} 
                                alt={raid.name} 
                                fill 
                                className="object-contain" 
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                        
                        {/* Raid Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <Skull className="w-10 h-10 text-red-500" />
                                <span className="text-red-500 text-sm font-bold uppercase tracking-wider">Raid Guide</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase italic transform -skew-x-3 drop-shadow-2xl">
                                {raid.name}
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-red-500 to-orange-500 transform -skew-x-12 mt-4 shadow-[0_0_15px_#ef4444]"></div>
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
                                        <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 font-black text-lg">
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
                                        <FormationGrid 
                                            formation={set.formation} 
                                            heroes={set.heroes} 
                                            heroImageMap={heroImageMap}
                                            customClasses={{
                                                container: "grid grid-cols-5 gap-3 pb-6 max-w-full",
                                                emptyRender: ({isFront}) => (
                                                    <div className="absolute inset-0 flex items-center justify-center text-gray-700 text-xs">Empty</div>
                                                ),
                                                cardString: "bg-black border-2 aspect-[3/4] rounded-lg overflow-hidden transition-all duration-300"
                                            }}
                                        />

                                        {/* Pet */}
                                        <PetDisplay 
                                            petFile={set.pet_file} 
                                            hideLabel={true}
                                            customClasses={{
                                                wrapper: "w-20 h-20 border-none bg-transparent shadow-none"
                                            }}
                                        />
                                    </div>

                                    {/* Skill Rotation Grid */}
                                    <div className="mt-6 p-4 bg-black/50 border border-gray-800 rounded-xl">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Zap className="w-4 h-4 text-yellow-500" />
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Skill Rotation</span>
                                        </div>
                                        
                                        <div className="flex gap-4">
                                            {[0, 1, 2, 3, 4].map(heroIdx => {
                                                const heroFile = set.heroes?.[heroIdx]
                                                
                                                return (
                                                    <div key={heroIdx} className="space-y-2">
                                                        {/* Skill 2 */}
                                                        {(() => {
                                                            const skillKey = `${heroIdx}-2`
                                                            const skillPath = getSkillImagePath(heroFile, 2)
                                                            const orderIndex = (set.skill_rotation || []).indexOf(skillKey)
                                                            const order = orderIndex >= 0 ? orderIndex + 1 : null
                                                            
                                                            return (
                                                                <div className={cn(
                                                                    "relative w-14 h-14 rounded-lg overflow-hidden border-2 flex items-center justify-center",
                                                                    order ? "border-yellow-500/70 shadow-lg shadow-yellow-500/20" : "border-gray-700",
                                                                    heroFile && skillPath ? "bg-gray-900" : "bg-gray-900/30"
                                                                )}>
                                                                    {heroFile && skillPath ? (
                                                                        <Image
                                                                            src={skillPath}
                                                                            alt="Skill 2"
                                                                            fill
                                                                            className="object-contain p-1"
                                                                            sizes="56px"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-gray-700 text-xs">-</span>
                                                                    )}
                                                                    {order && (
                                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-xs font-black rounded-full flex items-center justify-center shadow-lg">
                                                                            {order}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        })()}
                                                        
                                                        {/* Skill 3 */}
                                                        {(() => {
                                                            const skillKey = `${heroIdx}-3`
                                                            const skillPath = getSkillImagePath(heroFile, 3)
                                                            const orderIndex = (set.skill_rotation || []).indexOf(skillKey)
                                                            const order = orderIndex >= 0 ? orderIndex + 1 : null
                                                            
                                                            return (
                                                                <div className={cn(
                                                                    "relative w-14 h-14 rounded-lg overflow-hidden border-2 flex items-center justify-center",
                                                                    order ? "border-yellow-500/70 shadow-lg shadow-yellow-500/20" : "border-gray-700",
                                                                    heroFile && skillPath ? "bg-gray-900" : "bg-gray-900/30"
                                                                )}>
                                                                    {heroFile && skillPath ? (
                                                                        <Image
                                                                            src={skillPath}
                                                                            alt="Skill 3"
                                                                            fill
                                                                            className="object-contain p-1"
                                                                            sizes="56px"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-gray-700 text-xs">-</span>
                                                                    )}
                                                                    {order && (
                                                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-black text-xs font-black rounded-full flex items-center justify-center shadow-lg">
                                                                            {order}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )
                                                        })()}
                                                    </div>
                                                )
                                            })}
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
