import Link from 'next/link'
import Image from 'next/image'
import { getRaids } from '@/lib/raid-actions'
import { Skull } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Raids",
    description: "Raid guides, team recommendations and skill rotations for Seven Knights 2 Rebirth."
}

export default async function RaidPage() {
    const raids = await getRaids()

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-red-500 opacity-20 blur-[100px]"></div>
                <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-red-900/20 blur-[120px]"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 pb-32">
                {/* Page Header */}
                <div className="flex flex-col items-center justify-center space-y-8 mb-16">
                    <div className="text-center space-y-4">
                        <div className="inline-block relative group">
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <Skull className="w-12 h-12 text-red-500" />
                            </div>
                            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight uppercase italic transform -skew-x-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-orange-500">RAIDS</span>
                            </h1>
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-red-500 to-orange-500 transform -skew-x-12 shadow-[0_0_15px_#ef4444] transition-all group-hover:w-48"></div>
                        </div>
                        <p className="text-slate-400 text-lg font-light tracking-wide max-w-xl mx-auto mt-6">
                            Team compositions and skill rotations for raid bosses.
                        </p>
                    </div>
                </div>

                {/* Raid Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {raids.map((raid) => (
                        <Link
                            key={raid.key}
                            href={`/raid/${raid.key}`}
                            className="group relative flex flex-col items-center cursor-pointer"
                        >
                            {/* Card Container - Frameless Style */}
                            <div className="relative w-full aspect-[16/9] overflow-visible">
                                {/* Glow Effect */}
                                <div className="absolute inset-4 bg-red-500 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

                                {/* Image */}
                                <Image
                                    src={raid.image}
                                    alt={raid.name}
                                    fill
                                    className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Name Bar */}
                            <div className="mt-4 text-center">
                                <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-red-400 transition-colors tracking-tight uppercase drop-shadow-lg italic transform -skew-x-6">
                                    {raid.name}
                                </h3>
                                <div className="h-0.5 w-0 group-hover:w-full bg-red-500 transition-all duration-300 mx-auto mt-2 transform -skew-x-12"></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
