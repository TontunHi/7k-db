import NextImage from 'next/image'
import Link from 'next/link'
import { getBossInfo, getSetsByBoss } from '@/lib/advent-actions'
import { Compass, ArrowLeft, Video, ExternalLink, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { getHeroImageMap } from '@/lib/hero-utils-server'

export const dynamic = 'force-dynamic'

import BossClient from './BossClient'

export async function generateMetadata({ params }) {
    const { boss: bossKey } = await params
    const boss = await getBossInfo(bossKey)
    if (!boss) return { title: 'Boss Not Found' }
    
    return {
        title: `${boss.name} - Advent Expedition`,
        description: `Team recommendations for Advent Expedition boss ${boss.name}.`
    }
}

export default async function AdventBossPage({ params }) {
    const { boss: bossKey } = await params
    const boss = await getBossInfo(bossKey)
    
    if (!boss) {
        notFound()
    }
    
    const sets = await getSetsByBoss(bossKey)
    const heroImageMap = await getHeroImageMap()

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
                                <NextImage src={boss.image} alt={boss.name} fill className="object-contain" priority sizes="(max-width: 768px) 100vw, 50vw" />
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

            {/* Boss Client (Teams, Phases) */}
            <BossClient sets={sets} heroImageMap={heroImageMap} />
        </div>
    )
}
