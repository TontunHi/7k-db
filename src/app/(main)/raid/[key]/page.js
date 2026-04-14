import Image from 'next/image'
import Link from 'next/link'
import { getRaidInfo, getSetsByRaid } from '@/lib/raid-actions'
import { Skull, ArrowLeft, Video, ExternalLink, Users, Star, Zap, ScrollText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { getHeroImageMap } from '@/lib/hero-utils-server'
import FormationGrid from '@/components/shared/FormationGrid'
import PetDisplay from '@/components/shared/PetDisplay'
import RaidSkillRotation from '@/components/shared/RaidSkillRotation'

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

export default async function RaidDetailPage({ params }) {
    const { key: raidKey } = await params
    const raid = await getRaidInfo(raidKey)
    
    if (!raid) {
        notFound()
    }
    
    const sets = await getSetsByRaid(raidKey)
    const heroImageMap = await getHeroImageMap()
    
    // Parse JSON data
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
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[120px]"></div>
            </div>

            {/* Navigation & Header */}
            <div className="relative z-10">
                <div className="container mx-auto px-4 py-8">
                    <Link 
                        href="/raid" 
                        className="group inline-flex items-center gap-2 text-gray-400 hover:text-red-500 transition-all mb-8 backdrop-blur-sm bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-red-500/30"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-wider text-xs">Return to Raids</span>
                    </Link>
                    
                    <div className="flex flex-col lg:flex-row gap-8 items-center">
                        {/* Raid Boss Banner - Compact & Full Visibility */}
                        <div className="relative w-full lg:w-72 aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group bg-black/40">
                            {/* Ambient Blurred Background */}
                            <Image 
                                src={raid.image} 
                                alt="" 
                                fill 
                                className="object-cover opacity-20 blur-xl scale-110" 
                            />
                            {/* Main Contain Image */}
                            <Image 
                                src={raid.image} 
                                alt={raid.name} 
                                fill 
                                className="object-contain relative z-10 transition-transform duration-700 group-hover:scale-[1.02]" 
                                priority
                                sizes="(max-width: 1024px) 100vw, 288px"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/40 to-transparent z-20" />
                        </div>
                        
                        {/* Raid Info Section */}
                        <div className="flex-1 text-center lg:text-left space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 mb-1">
                                <Skull className="w-4 h-4 text-red-500" />
                                <span className="text-red-500 text-[9px] font-black uppercase tracking-[0.2em]">Raid Intel</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic transform -skew-x-3">
                                {raid.name}
                            </h1>
                            <p className="text-gray-400 text-base max-w-lg mx-auto lg:mx-0 font-medium">
                                Optimized team configurations and strategic rotation sequences.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teams Section */}
            <div className="container mx-auto px-4 mt-16 relative z-10">
                {parsedSets.length === 0 ? (
                    <div className="text-center py-32 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] backdrop-blur-md">
                        <Users className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                        <p className="text-gray-500 text-lg font-bold uppercase tracking-widest italic">Awaiting tactical data deployment...</p>
                    </div>
                ) : (
                    <div className="space-y-12 max-w-4xl mx-auto">
                        {parsedSets.map((set, idx) => (
                            <div 
                                key={set.id} 
                                className="group/set relative"
                            >
                                {/* Team Card */}
                                <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-xl transition-all duration-500 group-hover/set:border-red-500/30">
                                    {/* Team Header */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                                            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-white group-hover/set:text-red-400 transition-colors uppercase italic tracking-tight">
                                                    {set.team_name || `Team ${idx + 1}`}
                                                </h3>
                                            </div>
                                        </div>
                                        
                                        {set.video_url && (
                                            <a 
                                                href={set.video_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-900/40 hover:scale-105 active:scale-95"
                                            >
                                                <Video className="w-4 h-4" />
                                                Field Recording
                                                <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                                            </a>
                                        )}
                                    </div>

                                    <div className="p-6 lg:p-10">
                                        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-end">
                                            {/* Heroes Grid */}
                                            <div className="w-full lg:w-[60%]">
                                                <div className="flex items-center gap-2 mb-4 ml-1">
                                                    <Users className="w-4 h-4 text-red-500" />
                                                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Formation: {set.formation?.replace('-', ' - ')}</span>
                                                </div>
                                                <FormationGrid 
                                                    formation={set.formation} 
                                                    heroes={set.heroes} 
                                                    heroImageMap={heroImageMap}
                                                    customClasses={{
                                                        container: "grid grid-cols-5 gap-3 max-w-full",
                                                        emptyRender: () => null,
                                                        cardString: "bg-black/40 border-[1px] border-white/5 aspect-[3/4] rounded-xl overflow-hidden transition-all duration-500 hover:border-red-500/50"
                                                    }}
                                                />
                                            </div>

                                            {/* Pet */}
                                            <div className="w-full lg:w-[40%] flex flex-col items-center lg:items-end justify-end pb-4">
                                                <PetDisplay 
                                                    petFile={set.pet_file} 
                                                    hideLabel={true}
                                                    customClasses={{
                                                        wrapper: "w-24 h-24 md:w-28 md:h-28 border-none bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-3 shadow-xl"
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Premium Skill Rotation Grid */}
                                        <RaidSkillRotation 
                                            skillRotation={set.skill_rotation} 
                                            heroes={set.heroes} 
                                        />
                                        
                                        {/* Strategy Note */}
                                        {set.note && set.note.trim() !== "" && (
                                            <div className="mt-8 relative group/note">
                                                <div className="relative p-6 bg-white/[0.02] border border-white/5 rounded-[1.5rem] backdrop-blur-xl">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <ScrollText className="w-4 h-4 text-red-500" />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80">Strategy Note</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                                                        {set.note}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

