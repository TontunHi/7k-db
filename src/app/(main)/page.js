import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import { Sword, Map, Skull, Landmark, Trophy, ArrowRight, Crown, Compass, Swords, Wand2 } from 'lucide-react'
import RecentUpdates from '@/components/shared/RecentUpdates'
import GlobalCredits from '@/components/shared/GlobalCredits'
import GuildCta from '@/components/home/GuildCta'

export const revalidate = 60; // Revalidate every minute

export const metadata = {
    title: 'Home',
    description: 'Welcome to the ultimate Seven Knights Rebirth database. Find hero builds, tier lists, and complete stage guides.',
};

export default async function HomePage() {

    const FEATURES = [
        {
            title: "Hero Builds",
            icon: Sword,
            href: "/build",
            color: "from-blue-500 to-cyan-500",
            glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
        },
        {
            title: "Tier List",
            icon: Trophy,
            href: "/tierlist",
            color: "from-purple-500 to-indigo-500",
            glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
        },
        {
            title: "Stage Guide",
            icon: Map,
            href: "/stages",
            color: "from-[#FFD700] to-orange-500",
            glow: "group-hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]"
        },
        {
            title: "Dungeons",
            icon: Landmark,
            href: "/dungeon",
            color: "from-emerald-500 to-green-600",
            glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        },
        {
            title: "Raid Strategy",
            icon: Skull,
            href: "/raid",
            color: "from-red-500 to-rose-600",
            glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
        },
        {
            title: "Castle Rush",
            icon: Crown,
            href: "/castle-rush",
            color: "from-amber-500 to-yellow-600",
            glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        },
        {
            title: "Advent Expedition",
            icon: Compass,
            href: "/advent",
            color: "from-violet-500 to-purple-600",
            glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
        },
        {
            title: "Arena PVP",
            icon: Swords,
            href: "/arena",
            color: "from-rose-500 to-red-600",
            glow: "group-hover:shadow-[0_0_30px_rgba(225,29,72,0.3)]"
        },
        {
            title: "Total War",
            icon: Trophy,
            href: "/total-war",
            color: "from-orange-500 to-pink-500",
            glow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"
        },
        {
            title: "Guild War",
            icon: Skull,
            href: "/guild-war",
            color: "from-blue-600 to-indigo-700",
            glow: "group-hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]"
        },
        {
            title: "Build Heroes",
            icon: Wand2,
            href: "/tools/build-simulator",
            color: "from-[#FFD700] via-amber-500 to-orange-600",
            glow: "group-hover:shadow-[0_0_40px_rgba(255,215,0,0.4)]"
        },
    ]

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden font-sans pb-20">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#FFD700] opacity-20 blur-[100px]" />
                <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-blue-900/20 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-20">
                {/* Hero Header */}
                <div className="text-center space-y-8 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-block relative group">
                        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight uppercase italic transform -skew-x-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                            SEVEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFA500]">KNIGHTS</span>
                        </h1>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-500 tracking-tight uppercase italic transform -skew-x-6 mt-2">
                            REBIRTH <span className="text-white/20">DB</span>
                        </h2>
                        <div className="absolute -bottom-6 w-full h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] transform -skew-x-12 shadow-[0_0_15px_#FFD700] transition-all group-hover:w-[120%] group-hover:-left-[10%]" />
                    </div>

                    <p className="text-gray-400 text-lg md:text-2xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed mt-8">
                        The ultimate database for heroes, builds, and strategies.
                        <br />
                        <span className="text-white font-medium">Built by fans, for fans.</span>
                    </p>
                </div>

                {/* Partner Section */}
                <div className="max-w-7xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <div className="relative group p-8 rounded-3xl bg-gradient-to-br from-gray-900/50 to-black border border-gray-800 overflow-hidden text-center shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <h3 className="text-2xl font-black italic uppercase tracking-widest text-[#FFD700]">Partner with us</h3>
                            <p className="text-gray-400 text-sm max-w-xl">
                                Interested in reaching thousands of Seven Knights Rebirth players? 
                                We&apos;re looking for high-quality partners to grow with our community.
                            </p>
                            <Link 
                                href="/contact" 
                                className="mt-2 px-8 py-3 rounded-xl bg-gray-900 border border-gray-700 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all shadow-lg active:scale-95"
                            >
                                Contact for Partnership
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Promote Guild Section */}
                <div className="max-w-7xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                    <div className="group relative rounded-3xl overflow-hidden border border-gray-800 bg-[#0a0a0a] shadow-2xl transition-all duration-500 hover:border-[#FFD700]/30">
                        {/* Content Overlay for mobile/text if needed */}
                        <div className="relative aspect-[21/9] md:aspect-[32/9] w-full h-full">
                            <Image 
                                src="/about_website/guild_banner.webp" 
                                alt="Promote Guild"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 md:opacity-40" />
                            
                            {/* Client CTA Overlay */}
                            <GuildCta />
                        </div>

                        {/* Top corner highlight */}
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-2 h-2 rounded-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]" />
                        </div>
                    </div>
                </div>

                {/* Main content — Features grid + Recent Updates sidebar */}
                <div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto items-start">

                    {/* Features Grid */}
                    <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {FEATURES.map((feature) => (
                                <Link
                                    key={feature.title}
                                    href={feature.href}
                                    className={`group relative p-6 bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 hover:bg-[#111] ${feature.glow}`}
                                >
                                    {/* Gradient Line Top */}
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} opacity-50 group-hover:opacity-100 transition-opacity`} />

                                    <div className="flex flex-col items-center text-center space-y-4 relative z-10">
                                        <div className={`p-4 rounded-full bg-black/50 border border-gray-800 ${feature.glow}`}>
                                            <feature.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="pt-2">
                                            <h3 className="text-xl font-black italic uppercase text-white tracking-wide">{feature.title}</h3>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2">
                                            <ArrowRight className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>

                                    {/* Hover Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Recent Updates Widget */}
                    <div className="w-full xl:w-80 xl:shrink-0">
                        <div className="sticky top-8 bg-[#0a0a0a] border border-gray-800 rounded-2xl p-5 overflow-hidden relative">
                            {/* Subtle gold top line */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/40 to-transparent" />

                            <Suspense fallback={
                                <div className="space-y-1 animate-pulse">
                                    <div className="flex items-center gap-2 mb-5">
                                        <div className="w-1 h-5 bg-gray-800 rounded-full" />
                                        <div className="h-3 w-32 bg-gray-800 rounded" />
                                    </div>
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="flex items-start gap-3 px-3 py-2.5">
                                            <div className="w-6 h-6 rounded-md bg-gray-800 shrink-0 mt-0.5" />
                                            <div className="flex-1 space-y-1.5">
                                                <div className="h-2.5 bg-gray-800 rounded w-full" />
                                                <div className="h-2 bg-gray-800/60 rounded w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }>
                                <RecentUpdates key="recent-updates-widget" />
                            </Suspense>
                        </div>
                    </div>
                </div>

                {/* Global Credits Section */}
                <div className="max-w-7xl mx-auto w-full">
                    <GlobalCredits />
                </div>
            </div>
        </div>
    )
}
