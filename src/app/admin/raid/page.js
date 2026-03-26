import Link from 'next/link'
import Image from 'next/image'
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

            {/* Raid Grid - 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {raids.map((raid) => (
                    <Link
                        key={raid.key}
                        href={`/admin/raid/${raid.key}`}
                        className="group relative block bg-gradient-to-br from-red-950/50 to-black border border-red-900/30 rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] hover:border-red-500/50 transition-all duration-300"
                    >
                        {/* Set Count Badge */}
                        {raid.setCount > 0 && (
                            <div className="absolute top-3 right-3 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                {raid.setCount} Sets
                            </div>
                        )}

                        {/* Raid Image - Scaled */}
                        <div className="relative w-full">
                            <Image
                                src={raid.image}
                                alt={raid.name}
                                width={800}
                                height={450}
                                className="w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        </div>

                        {/* Raid Name */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                            <h3 className="text-xl font-black text-white group-hover:text-red-400 transition-colors">
                                {raid.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
