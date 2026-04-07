'use client'

import { useState, useEffect } from 'react'
import { getGlobalCredits } from '@/lib/credit-actions'
import { Youtube, Share2, Facebook, MessageSquare, Link as LinkIcon, Heart, Loader2 } from 'lucide-react'
import { TiktokIcon, DiscordIcon } from '@/components/shared/BrandIcons'
import { cn } from '@/lib/utils'

const PLATFORMS = {
    youtube: { icon: Youtube, color: 'text-[#FF0000]', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    tiktok: { icon: TiktokIcon, color: 'text-white', bg: 'bg-white/5', border: 'border-white/10' },
    facebook: { icon: Facebook, color: 'text-[#1877F2]', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    discord: { icon: DiscordIcon, color: 'text-[#5865F2]', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    other: { icon: LinkIcon, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' },
}

export default function GlobalCredits() {
    const [credits, setCredits] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getGlobalCredits()
                setCredits(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center py-10 opacity-30">
                <Loader2 className="w-6 h-6 animate-spin text-white" />
            </div>
        )
    }

    if (credits.length === 0) return null

    return (
        <section className="relative mt-20 pt-20 border-t border-gray-800/50 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
            
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 text-[#FFD700] text-xs font-black uppercase tracking-[0.2em] mb-4">
                    <Heart className="w-3 h-3 fill-[#FFD700]" />
                    Special Thanks
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white italic uppercase tracking-tight transform -skew-x-6">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-amber-500">Data Sources</span>
                </h2>
                <p className="text-gray-500 text-sm mt-3 font-light max-w-xl mx-auto">
                    This database is built upon the collective knowledge of the Seven Knights community. Huge thanks to these amazing creators and contributors.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 px-4">
                {credits.map((credit) => {
                    const P = PLATFORMS[credit.platform] || PLATFORMS.other
                    return (
                        <a 
                            key={credit.id}
                            href={credit.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "group relative flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1",
                                "bg-[#0a0a0a] hover:bg-[#111]",
                                P.border,
                                "hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] shadow-xl"
                            )}
                        >
                            <div className={cn("p-2.5 rounded-xl border border-white/5 transition-transform group-hover:scale-110", P.bg)}>
                                <P.icon className={cn("w-6 h-6", P.color)} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-[#FFD700] transition-colors">{credit.platform}</span>
                                <span className="text-lg font-black text-white italic transition-all group-hover:tracking-tight">{credit.name}</span>
                            </div>

                            {/* Small decorative corner arrow */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <LinkIcon className="w-3 h-3 text-[#FFD700]" />
                            </div>

                            {/* Glow effect */}
                            <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity blur-2xl rounded-full", P.bg)} />
                        </a>
                    )
                })}
            </div>
        </section>
    )
}
