import Link from 'next/link'
import Image from 'next/image'
import { getBosses } from '@/lib/advent-actions'
import { Compass } from 'lucide-react'
import { cn } from '@/lib/utils'

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
                        {/* Removed the redundant subtitle as requested */}
                    </div>
                </div>

                {/* Boss Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {bosses
                        .filter(boss => boss.image && !boss.image.includes('undefined'))
                        .map((boss) => {
                            const isSpecial = boss.key === 'ae_god_of_destruction';
                            return (
                                <Link
                                    key={boss.key}
                                    href={`/advent/${boss.key}`}
                                    className={cn(
                                        "group relative flex flex-col items-center transition-all duration-500 hover:-translate-y-3",
                                        isSpecial && "sm:col-span-2 lg:col-span-2 lg:col-start-2"
                                    )}
                                >
                                    {/* Boss Image Card - Enhanced Tech Style */}
                                    <div className={cn(
                                        "relative w-full rounded-2xl overflow-hidden border border-violet-500/10 bg-black shadow-2xl",
                                        isSpecial ? "aspect-[21/9]" : "aspect-[4/5]"
                                    )}>
                                        {/* Dynamic Glow Background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        
                                        {/* Background Hex Pattern (Subtle) */}
                                        <div className="absolute inset-0 opacity-[0.03] bg-[url('/patterns/hex.svg')] bg-repeat pointer-events-none" />

                                        {/* Image with Skewed Clip Path */}
                                        <div className="absolute inset-0 p-1">
                                            <div className="relative w-full h-full clip-path-skew overflow-hidden bg-gray-900 border border-white/5">
                                                <Image
                                                    src={boss.image}
                                                    alt={boss.name}
                                                    fill
                                                    className={cn(
                                                        "object-cover group-hover:scale-110 transition-transform duration-700",
                                                        isSpecial ? "object-top" : "object-cover"
                                                    )}
                                                />
                                                {/* Overlay Gradient */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                                            </div>
                                        </div>

                                        {/* Floating Tech Details (Corner accents) */}
                                        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-violet-500/40 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-violet-500/40 opacity-0 group-hover:opacity-100 transition-all duration-500" />

                                        {/* Boss Name Glassmorphism Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-md bg-black/60 border-t border-white/10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                            <h3 className="text-xl font-black text-white group-hover:text-violet-400 transition-colors tracking-tight uppercase flex items-center justify-between">
                                                {boss.name}
                                                <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Compass className="w-4 h-4 text-violet-400" />
                                                </div>
                                            </h3>
                                            <div className="h-0.5 w-full bg-gradient-to-r from-violet-500 to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 mt-2" />
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                </div>
            </div>
        </div>
    )
}
