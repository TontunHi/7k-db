import Link from 'next/link'
import Image from 'next/image'
import { getDungeons } from '@/lib/dungeon-actions'
import { Landmark } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDungeonPage() {
    const dungeons = await getDungeons()

    return (
        <div className="space-y-12 pb-20">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <Landmark className="w-10 h-10 text-amber-500" />
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Dungeons</h1>
                </div>
                <p className="text-muted-foreground mt-2">Manage team recommendations for Dungeons.</p>
            </header>

            {/* Dungeon Grid - Horizontal cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dungeons.map((dungeon) => (
                    <Link
                        key={dungeon.key}
                        href={`/admin/dungeon/${dungeon.key}`}
                        className="group relative bg-gradient-to-r from-amber-950/50 to-black border border-amber-900/30 rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:border-amber-500/50 transition-all duration-300 h-48 flex items-center"
                    >
                        {/* Set Count Badge */}
                        {dungeon.setCount > 0 && (
                            <div className="absolute top-3 right-3 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                {dungeon.setCount} Sets
                            </div>
                        )}

                        {/* Dungeon Image - Horizontal */}
                        <div className="absolute inset-0 w-full h-full">
                            <Image
                                src={dungeon.image}
                                alt={dungeon.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/50 to-black/90" />
                        </div>

                        {/* Name Bar */}
                        <div className="relative z-10 p-8 w-full">
                            <h3 className="text-2xl font-black text-white group-hover:text-amber-400 transition-colors max-w-xs leading-tight">
                                {dungeon.name}
                            </h3>
                            <div className="h-1 w-12 bg-amber-500 mt-4 rounded-full group-hover:w-20 transition-all duration-300" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
