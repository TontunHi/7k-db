import Link from 'next/link'
import Image from 'next/image'
import { getDungeons } from '@/lib/dungeon-actions'
import { Landmark } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Dungeons",
    description: "Dungeon guides and team recommendations for Seven Knights 2 Rebirth."
}

export default async function DungeonPage() {
    const dungeons = await getDungeons()

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden">
            {/* Background Effects */}
             <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#FFD700] opacity-20 blur-[100px]"></div>
                <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-yellow-900/20 blur-[120px]"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 container mx-auto px-4 py-12 pb-16">
                 {/* Page Header */}
                 <div className="flex flex-col items-center justify-center space-y-8 mb-16">
                    <div className="text-center space-y-4">
                        <div className="inline-block relative group">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <Landmark className="w-12 h-12 text-[#FFD700]" />
                            </div>
                            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight uppercase italic transform -skew-x-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFA500]">DUNGEONS</span>
                            </h1>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] transform -skew-x-12 shadow-[0_0_15px_#FFD700] transition-all group-hover:w-64"></div>
                        </div>
                        <p className="text-slate-400 text-lg font-light tracking-wide max-w-xl mx-auto mt-6">
                            Guides and team compositions for resource dungeons.
                        </p>
                    </div>
                </div>

                {/* Dungeon Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {dungeons.map((dungeon) => (
                        <Link
                            key={dungeon.key}
                            href={`/dungeon/${dungeon.key}`}
                            className="group relative flex flex-col items-center cursor-pointer"
                        >
                            {/* Card Container - Frameless Style with Horizontal Aspect */}
                            <div className="relative w-full aspect-[2/1] overflow-visible">
                                {/* Glow Effect */}
                                <div className="absolute inset-4 bg-[#FFD700] blur-[40px] opacity-10 group-hover:opacity-30 transition-opacity duration-500" />
                                
                                {/* Image */}
                                <Image
                                    src={dungeon.image}
                                    alt={dungeon.name}
                                    fill
                                    className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            
                            {/* Name Bar */}
                            <div className="mt-4 text-center">
                                <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-[#FFD700] transition-colors tracking-tight uppercase drop-shadow-lg italic transform -skew-x-6">
                                    {dungeon.name}
                                </h3>
                                <div className="h-0.5 w-0 group-hover:w-full bg-[#FFD700] transition-all duration-300 mx-auto mt-2 transform -skew-x-12"></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
