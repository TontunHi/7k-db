import Link from 'next/link'
import Image from 'next/image'
import { getBosses } from '@/lib/castle-rush-actions'
import { Crown } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Castle Rush - 7K Database",
    description: "Daily Castle Rush boss team recommendations and strategies."
}

export default async function CastleRushPage() {
    const bosses = await getBosses()

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
                                <Crown className="w-12 h-12 text-[#FFD700]" />
                            </div>
                            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight uppercase italic transform -skew-x-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFA500]">CASTLE RUSH</span>
                            </h1>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] transform -skew-x-12 shadow-[0_0_15px_#FFD700] transition-all group-hover:w-64"></div>
                        </div>
                        <p className="text-slate-400 text-lg font-light tracking-wide max-w-xl mx-auto mt-6">
                            Daily boss rotation with recommended team compositions.
                        </p>
                    </div>
                </div>

                {/* Boss Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {bosses.map((boss) => (
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
