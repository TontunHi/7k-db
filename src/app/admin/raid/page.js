import Link from 'next/link'
import NextImage from 'next/image'
import { getRaids } from '@/lib/raid-actions'
import { Skull } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Raids' }

export default async function AdminRaidPage() {
    const raids = await getRaids()

    return (
        <div className="space-y-12 pb-20">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <Skull className="w-10 h-10 text-red-500" />
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Raids</h1>
                </div>
                <p className="text-muted-foreground mt-2">Manage team recommendations and skill rotations for Raids.</p>
            </header>

            {/* Raid Grid - Optimized for density and aesthetics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {raids.map((raid) => (
                    <Link
                        key={raid.key}
                        href={`/admin/raid/${raid.key}`}
                        className="group relative block aspect-[16/10] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all duration-500"
                    >
                        {/* Set Count Badge */}
                        {raid.setCount > 0 && (
                            <div className="absolute top-3 right-3 z-20 bg-red-600 text-white px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider shadow-xl border border-red-400/30">
                                {raid.setCount} {raid.setCount === 1 ? 'Team' : 'Teams'}
                            </div>
                        )}

                        {/* Raid Image */}
                        <div className="absolute inset-0 z-0">
                            <NextImage
                                src={raid.image}
                                alt={raid.name}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        </div>

                        {/* Raid Name Content */}
                        <div className="absolute inset-0 z-10 p-4 flex flex-col justify-end">
                            <div className="flex items-center gap-1.5 mb-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                < Skull className="w-3 h-3 text-red-500" />
                                <span className="text-[10px] text-red-500 font-black uppercase tracking-widest">Manage Boss</span>
                            </div>
                            <h3 className="text-lg font-black text-white group-hover:text-red-400 transition-colors leading-tight">
                                {raid.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
