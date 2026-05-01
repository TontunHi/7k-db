'use client'

import { useState, useEffect } from 'react'
import { getGlobalCredits } from '@/lib/credit-actions'
import { Youtube, Share2, Facebook, MessageSquare, Link as LinkIcon, Heart, Loader2 } from 'lucide-react'
import { TiktokIcon, DiscordIcon } from '@/components/shared/BrandIcons'
import { cn } from '@/lib/utils'

const PLATFORMS = {
    youtube: { icon: Youtube, color: 'text-[#FF0000]', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    tiktok: { icon: TiktokIcon, color: 'text-white', bg: 'bg-[#0a0a0a]', border: 'border-white/10' },
    facebook: { icon: Facebook, color: 'text-[#1877F2]', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    discord: { icon: DiscordIcon, color: 'text-[#5865F2]', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    other: { icon: LinkIcon, color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' },
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
                <Loader2 className="w-6 h-6 animate-spin text-foreground" />
            </div>
        )
    }

    if (credits.length === 0) return null

    return (
        <section className="relative overflow-hidden w-full h-full">
            
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.2em] mb-4">
                    <Heart className="w-3 h-3 fill-primary" />
                    Special Thanks
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-foreground italic uppercase tracking-tight transform -skew-x-6">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">Data Sources</span>
                </h2>

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
                                "bg-card hover:bg-accent/50",
                                P.border,
                                "hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] shadow-xl"
                            )}
                        >
                            <div className={cn("p-2.5 rounded-xl border border-foreground/5 transition-transform group-hover:scale-110", P.bg)}>
                                <P.icon className={cn("w-6 h-6", P.color)} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{credit.platform}</span>
                                <span className="text-lg font-black text-foreground italic transition-all group-hover:tracking-tight">{credit.name}</span>
                            </div>

                            {/* Small decorative corner arrow */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <LinkIcon className="w-3 h-3 text-primary" />
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
