import Link from 'next/link'
import { Suspense } from 'react'
import { Sword, Map, Skull, Landmark, Trophy, ArrowRight, Crown, Compass, Swords } from 'lucide-react'
import RecentUpdates from '@/components/shared/RecentUpdates'
import SponsorBanner from '@/components/ads/SponsorBanner'
import GlobalCredits from '@/components/shared/GlobalCredits'

export const revalidate = 60; // Revalidate every minute

export const metadata = {
    title: 'Home',
    description: 'Welcome to the ultimate Seven Knights Rebirth database. Find hero builds, tier lists, and complete stage guides.',
};

export default async function HomePage() {

    const FEATURES = [
        {
            title: "Hero Builds",
            desc: "Optimal gear & stats",
            icon: Sword,
            href: "/build",
            color: "from-blue-500 to-cyan-500",
            glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
        },
        {
            title: "Tier List",
            desc: "Meta rankings",
            icon: Trophy,
            href: "/tierlist",
            color: "from-purple-500 to-indigo-500",
            glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
        },
        {
            title: "Stage Guide",
            desc: "Clear main story",
            icon: Map,
            href: "/stages",
            color: "from-[#FFD700] to-orange-500",
            glow: "group-hover:shadow-[0_0_30px_rgba(255,215,0,0.3)]"
        },
        {
            title: "Dungeons",
            desc: "Resource farming",
            icon: Landmark,
            href: "/dungeon",
            color: "from-emerald-500 to-green-600",
            glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
        },
        {
            title: "Raid Strategy",
            desc: "Boss mechanics",
            icon: Skull,
            href: "/raid",
            color: "from-red-500 to-rose-600",
            glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
        },
        {
            title: "Castle Rush",
            desc: "Daily boss guide",
            icon: Crown,
            href: "/castle-rush",
            color: "from-amber-500 to-yellow-600",
            glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        },
        {
            title: "Advent Expedition",
            desc: "Expedition bosses",
            icon: Compass,
            href: "/advent",
            color: "from-violet-500 to-purple-600",
            glow: "group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
        },
        {
            title: "Arena PVP",
            desc: "Team compositions",
            icon: Swords,
            href: "/arena",
            color: "from-rose-500 to-red-600",
            glow: "group-hover:shadow-[0_0_30px_rgba(225,29,72,0.3)]"
        },
        {
            title: "Total War",
            desc: "Weekly boss teams",
            icon: Trophy,
            href: "/total-war",
            color: "from-orange-500 to-pink-500",
            glow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"
        },
        {
            title: "Guild War",
            desc: "GvG battle guides",
            icon: Skull,
            href: "/guild-war",
            color: "from-blue-600 to-indigo-700",
            glow: "group-hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]"
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

                {/* Wide Sponsor Banner */}
                <div className="max-w-7xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <SponsorBanner variant="wide" />
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
                                        <div>
                                            <h3 className="text-xl font-black italic uppercase text-white tracking-wide">{feature.title}</h3>
                                            <p className="text-sm text-gray-500 font-mono mt-1">{feature.desc}</p>
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
