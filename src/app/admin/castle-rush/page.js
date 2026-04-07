import Link from 'next/link'
import NextImage from 'next/image'
import { getBosses } from '@/lib/castle-rush-actions'
import { Crown } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Castle Rush' }

export default async function AdminCastleRushPage() {
    const bosses = await getBosses()

    return (
        <div className="space-y-12 pb-20">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <Crown className="w-10 h-10 text-amber-500" />
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Castle Rush</h1>
                </div>
                <p className="text-muted-foreground mt-2">Manage team recommendations for daily Castle Rush bosses.</p>
            </header>

            {/* Boss Grid - Horizontal cards, 2 columns */}
            <div className="grid grid-cols-1 gap-6">
                {bosses.map((boss) => (
                    <Link
                        key={boss.key}
                        href={`/admin/castle-rush/${boss.key}`}
                        className="group relative bg-gradient-to-br from-amber-950/30 to-black border border-amber-900/30 rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:border-amber-500/50 transition-all duration-300"
                    >
                        {/* Set Count Badge */}
                        {boss.setCount > 0 && (
                            <div className="absolute top-3 right-3 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                {boss.setCount} Sets
                            </div>
                        )}

                        {/* Boss Image - Horizontal */}
                        <div className="relative aspect-[3168/514] bg-gradient-to-br from-amber-900/10 to-transparent overflow-hidden">
                            <NextImage
                                src={boss.image}
                                alt={boss.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Bottom Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        </div>

                        {/* Name Bar */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight">
                                {boss.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
