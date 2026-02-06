import Link from 'next/link'
import Image from 'next/image'
import { getBosses } from '@/lib/castle-rush-actions'
import { Crown, ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Castle Rush - 7K Database",
    description: "Daily Castle Rush boss team recommendations and strategies."
}

export default async function CastleRushPage() {
    const bosses = await getBosses()

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="relative py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 via-transparent to-transparent" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <Crown className="w-12 h-12 text-[#FFD700]" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-center text-white tracking-tight">
                        Castle Rush
                    </h1>
                    <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto">
                        Daily boss rotation with recommended team compositions and strategies.
                    </p>
                </div>
            </div>

            {/* Boss Grid */}
            <div className="container mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {bosses.map((boss, index) => (
                        <Link
                            key={boss.key}
                            href={`/castle-rush/${boss.key}`}
                            className="group relative flex flex-col items-center transition-transform duration-500 hover:-translate-y-2"
                        >
                            {/* Boss Image - Frameless & Large */}
                            <div className="relative w-full aspect-[2/3] overflow-visible">
                                {/* Glow effect behind */}
                                <div className="absolute inset-4 bg-[#FFD700] blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                                
                                <Image
                                    src={boss.image}
                                    alt={boss.name}
                                    fill
                                    className="object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Name Bar */}
                            <div className="mt-4 text-center">
                                <h3 className="text-2xl font-black text-white group-hover:text-[#FFD700] transition-colors tracking-tight uppercase">
                                    {boss.name}
                                </h3>
                                <div className="h-0.5 w-0 group-hover:w-full bg-[#FFD700] transition-all duration-300 mx-auto mt-2" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
