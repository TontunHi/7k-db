import Link from 'next/link'
import NextImage from 'next/image'
import { getRaids } from '@/lib/raid-actions'
import { Skull } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Raids - Admin' }

export default async function AdminRaidPage() {
    const raids = await getRaids()

    return (
        <div className="space-y-12 pb-20">
            <header>
                <div className="flex items-center gap-3 mb-2">
                    <Skull className="w-10 h-10 text-red-500" />
                    <h1 className="text-4xl font-black tracking-tight text-foreground uppercase italic transform -skew-x-3">Raids</h1>
                </div>
                <p className="text-muted-foreground mt-2 font-medium">Manage team recommendations and tactical rotations for Raid bosses.</p>
            </header>

            {/* Raid Grid - Optimized for vertical cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {raids.map((raid) => (
                    <Link
                        key={raid.key}
                        href={`/admin/raid/${raid.key}`}
                        className="group relative bg-gradient-to-br from-red-950/30 to-black border border-red-900/30 rounded-2xl overflow-hidden hover:shadow-[0_0_40px_rgba(220,38,38,0.25)] hover:border-red-500/50 transition-all duration-500 transform hover:-translate-y-1"
                    >
                        {/* Set Count Badge */}
                        {raid.setCount > 0 && (
                            <div className="absolute top-4 right-4 z-20 bg-red-600 text-white px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xl border border-red-400/30">
                                {raid.setCount} {raid.setCount === 1 ? 'Team' : 'Teams'}
                            </div>
                        )}

                        {/* Raid Image - Vertical (3/4 aspect) */}
                        <div className="relative aspect-[3/4] bg-gradient-to-br from-red-900/10 to-transparent overflow-hidden">
                            <NextImage
                                src={raid.image}
                                alt={raid.name}
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                priority
                            />
                            {/* Gradient Overlays */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                            <div className="absolute inset-0 bg-red-600/5 group-hover:bg-transparent transition-colors duration-500" />
                        </div>

                        {/* Content Overlay */}
                        <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end">
                            <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                <Skull className="w-4 h-4 text-red-500" />
                                <span className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em]">Manage Strategy</span>
                            </div>
                            <h3 className="text-2xl font-black text-white group-hover:text-red-400 transition-colors tracking-tight uppercase italic transform -skew-x-2">
                                {raid.name}
                            </h3>
                            <div className="h-1 w-12 bg-red-600 mt-3 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
