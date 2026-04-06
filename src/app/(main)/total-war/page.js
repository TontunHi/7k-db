import Link from 'next/link'
import Image from 'next/image'
import { TIER_CONFIG } from '@/lib/total-war-config'
import { getAllSetCounts } from '@/lib/total-war-actions'
import { Swords } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Total War',
    description: 'Total War tier team recommendations — Legendary, Superb, Elite, and Normal tier team compositions with skill rotations.',
}

export default async function TotalWarPage() {
    const setCounts = await getAllSetCounts()

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden pb-20">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-red-900 opacity-15 blur-[120px]" />
                <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-orange-900/15 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="flex flex-col items-center justify-center space-y-6 mb-16">
                    <div className="text-center space-y-4">
                        <div className="inline-block relative group">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Swords className="w-10 h-10 text-red-500" />
                            </div>
                            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight uppercase italic transform -skew-x-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400">
                                    TOTAL WAR
                                </span>
                            </h1>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-red-500 to-yellow-400 transform -skew-x-12 shadow-[0_0_15px_rgba(239,68,68,0.8)] transition-all group-hover:w-64" />
                        </div>
                        <p className="text-slate-400 text-lg font-light tracking-wide max-w-xl mx-auto mt-6">
                            Select a tier to view recommended teams and skill rotations
                        </p>
                    </div>
                </div>

                {/* Tier Selection — normal → elite → superb → legendary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
                    {TIER_CONFIG.map((tier) => {
                        const count = setCounts[tier.key] || 0
                        return (
                            <Link
                                key={tier.key}
                                href={`/total-war/${tier.key}`}
                                className="group relative flex flex-col items-center rounded-2xl border border-gray-800/60 bg-[#0a0a0a] overflow-hidden transition-all duration-500 hover:-translate-y-1 p-6"
                            >
                                {/* Hover glow bg */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                                    style={{ background: `radial-gradient(ellipse at center, ${tier.glow} 0%, transparent 70%)` }}
                                />
                                {/* Hover border glow */}
                                <div
                                    className={`absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${tier.border}`}
                                />

                                {/* Tier Logo */}
                                <div className="relative w-full aspect-square mb-4 group-hover:scale-105 transition-transform duration-500 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
                                    <Image
                                        src={tier.logo}
                                        alt={tier.label}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 45vw, 20vw"
                                    />
                                </div>

                                {/* Label */}
                                <div className="relative text-center space-y-1 z-10">
                                    <h2
                                        className="text-2xl font-black uppercase tracking-wider"
                                        style={{ color: tier.accent }}
                                    >
                                        {tier.label}
                                    </h2>
                                    <p className="text-gray-600 text-xs font-mono uppercase tracking-widest">
                                        {tier.maxTeams} Teams / Set
                                    </p>
                                    {count > 0 && (
                                        <div
                                            className="mt-2 inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-black"
                                            style={{ backgroundColor: tier.accent }}
                                        >
                                            {count} Set{count > 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>

                                {/* Bottom animated line */}
                                <div
                                    className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${tier.color}`}
                                />
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
