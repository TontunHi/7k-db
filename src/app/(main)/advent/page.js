import Link from 'next/link'
import Image from 'next/image'
import { getBosses } from '@/lib/advent-actions'
import { Compass } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Advent Expedition",
    description: "Advent Expedition boss team recommendations and strategies."
}

export default async function AdventExpeditionPage() {
    const bosses = await getBosses()

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden">
             {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-violet-500 opacity-20 blur-[100px]"></div>
                <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[120px]"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 container mx-auto px-4 py-12 pb-16">
                 {/* Page Header */}
                 <div className="flex flex-col items-center justify-center space-y-8 mb-16">
                    <div className="text-center space-y-4">
                        <div className="inline-block relative group">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <Compass className="w-12 h-12 text-violet-400" />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase italic transform -skew-x-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">ADVENT</span>
                            </h1>
                            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic transform -skew-x-6 mt-1">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-300">EXPEDITION</span>
                            </h2>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-violet-500 to-purple-500 transform -skew-x-12 shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all group-hover:w-64"></div>
                        </div>
                        <p className="text-slate-400 text-lg font-light tracking-wide max-w-xl mx-auto mt-6">
                            Boss team recommendations with dual-team compositions.
                        </p>
                    </div>
                </div>

                {/* Boss Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {bosses.map((boss) => (
                        <Link
                            key={boss.key}
                            href={`/advent/${boss.key}`}
                            className="group relative flex flex-col items-center transition-transform duration-500 hover:-translate-y-2"
                        >
                            {/* Boss Image Card */}
                            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-black">
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-violet-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10" />
                                
                                {boss.image && !boss.image.includes('undefined') ? (
                                    <Image
                                        src={boss.image}
                                        alt={boss.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Compass className="w-20 h-20 text-gray-700 group-hover:text-violet-500/50 transition-colors" />
                                    </div>
                                )}
                            </div>

                            {/* Name Bar */}
                            <div className="mt-4 text-center">
                                <h3 className="text-xl font-black text-white group-hover:text-violet-400 transition-colors tracking-tight uppercase">
                                    {boss.name}
                                </h3>
                                <div className="h-0.5 w-0 group-hover:w-full bg-violet-400 transition-all duration-300 mx-auto mt-2" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
