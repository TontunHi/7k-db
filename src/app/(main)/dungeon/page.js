import Link from 'next/link'
import Image from 'next/image'
import { getDungeons } from '@/lib/dungeon-actions'
import { Landmark } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Dungeons - 7K Database",
    description: "Dungeon guides and team recommendations for Seven Knights 2 Rebirth."
}

export default async function DungeonPage() {
    const dungeons = await getDungeons()

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 via-transparent to-transparent" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <Landmark className="w-12 h-12 text-[#FFD700]" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-center text-white tracking-tight">
                        Dungeons
                    </h1>
                    <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto">
                        Guides and team compositions for resource dungeons.
                    </p>
                </div>
            </div>

            {/* Dungeon Grid */}
            <div className="container mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {dungeons.map((dungeon, index) => (
                        <Link
                            key={dungeon.key}
                            href={`/dungeon/${dungeon.key}`}
                            className="group relative flex flex-col transition-transform duration-500 hover:-translate-y-2 rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-[#FFD700]/50 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)]"
                        >
                            {/* Dungeon Image - Horizontal Banner */}
                            <div className="relative w-full aspect-[2/1] overflow-hidden">
                                <Image
                                    src={dungeon.image}
                                    alt={dungeon.name}
                                    fill
                                    className="object-contain group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-[#FFD700] transition-colors tracking-tight uppercase drop-shadow-lg">
                                        {dungeon.name}
                                    </h3>
                                </div>
                            </div>
                            
                            {/* Set Count */}
                             {dungeon.setCount > 0 && (
                                <div className="absolute top-4 right-4 bg-[#FFD700] text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    {dungeon.setCount} Sets
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
