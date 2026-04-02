import Link from 'next/link'
import Image from 'next/image'
import { TIER_CONFIG } from '@/lib/total-war-config'
import { getAllSetCounts } from '@/lib/total-war-actions'
import { Swords } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Total War' }

export default async function AdminTotalWarPage() {
    const setCounts = await getAllSetCounts()

    return (
        <div className="space-y-10 pb-20">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <Swords className="w-9 h-9 text-red-500" />
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Total War</h1>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                    จัดการทีมสำหรับแต่ละระดับ — แต่ละระดับมีได้หลาย Set และแต่ละ Set มีจำนวนทีมตามที่กำหนด
                </p>
            </header>

            {/* Tier Grid — normal → elite → superb → legendary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {TIER_CONFIG.map((tier) => {
                    const count = setCounts[tier.key] || 0

                    return (
                        <Link
                            key={tier.key}
                            href={`/admin/total-war/${tier.key}`}
                            className="group relative flex flex-col items-center rounded-xl border border-gray-800 bg-gray-900/20 overflow-hidden hover:border-gray-600 transition-all duration-300 p-6 hover:-translate-y-0.5"
                        >
                            {/* Set count badge */}
                            <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                count > 0 ? 'bg-gray-700/80 text-gray-200' : 'bg-gray-800/60 text-gray-600'
                            }`}>
                                {count} Set{count !== 1 ? 's' : ''}
                            </div>

                            {/* Logo */}
                            <div className="relative w-full aspect-square mb-4 group-hover:scale-105 transition-transform duration-500">
                                <Image
                                    src={tier.logo}
                                    alt={tier.label}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 640px) 80vw, 20vw"
                                />
                            </div>

                            <h2 className="text-xl font-black uppercase tracking-wider" style={{ color: tier.accent }}>
                                {tier.label}
                            </h2>
                            <p className="text-gray-600 text-xs mt-1 font-mono">
                                {tier.maxTeams} teams per set
                            </p>

                            {/* Bottom hover line */}
                            <div className={`absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${tier.color}`} />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
