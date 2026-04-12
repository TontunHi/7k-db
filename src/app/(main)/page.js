import Link from 'next/link'
import { Suspense } from 'react'
import { Sword, Map, Skull, Landmark, Trophy, Crown, Compass, Swords, Wand2, Sparkles, Zap } from 'lucide-react'
import RecentUpdates from '@/components/shared/RecentUpdates'
import GlobalCredits from '@/components/shared/GlobalCredits'
import FeatureCard from '@/components/shared/FeatureCard'
import WebsiteUpdates from '@/components/shared/WebsiteUpdates'

export const revalidate = 60;

export const metadata = {
    title: 'Home',
    description: 'Welcome to the ultimate Seven Knights Rebirth database. Find hero builds, tier lists, and complete stage guides.',
};

export default async function HomePage() {
    const FEATURES = [
        { title: "Hero Builds", iconName: "Sword", href: "/build", color: "from-blue-500 to-cyan-500", glow: "hover:shadow-blue-500/20" },
        { title: "Tier List", iconName: "Trophy", href: "/tierlist", color: "from-purple-500 to-indigo-500", glow: "hover:shadow-purple-500/20" },
        { title: "Stage Guide", iconName: "Map", href: "/stages", color: "from-[#FFD700] to-orange-500", glow: "hover:shadow-[#FFD700]/20" },
        { title: "Dungeons", iconName: "Landmark", href: "/dungeon", color: "from-emerald-500 to-green-600", glow: "hover:shadow-emerald-500/20" },
        { title: "Raid Strategy", iconName: "Skull", href: "/raid", color: "from-red-500 to-rose-600", glow: "hover:shadow-red-500/20" },
        { title: "Castle Rush", iconName: "Crown", href: "/castle-rush", color: "from-amber-500 to-yellow-600", glow: "hover:shadow-amber-500/20" },
        { title: "Advent Expedition", iconName: "Compass", href: "/advent", color: "from-violet-500 to-purple-600", glow: "hover:shadow-violet-500/20" },
        { title: "Arena PVP", iconName: "Swords", href: "/arena", color: "from-rose-500 to-red-600", glow: "hover:shadow-rose-500/20" },
        { title: "Total War", iconName: "Trophy", href: "/total-war", color: "from-orange-500 to-pink-500", glow: "hover:shadow-orange-500/20" },
        { title: "Guild War", iconName: "Skull", href: "/guild-war", color: "from-blue-600 to-indigo-700", glow: "hover:shadow-blue-600/20" },
        { title: "Build Heroes", iconName: "Wand2", href: "/tools/build-simulator", color: "from-[#FFD700] via-amber-500 to-orange-600", glow: "hover:shadow-[#FFD700]/40" }
    ]

    return (
        <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden pb-20 selection:bg-[#FFD700] selection:text-black">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-full rounded-full bg-[#FFD700] opacity-[0.03] blur-[120px]" />
                <div className="absolute right-[-10%] bottom-[-10%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[150px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 pt-12 md:pt-24 pb-20">
                {/* Hero Header */}
                <div className="text-center space-y-4 md:space-y-8 mb-16 md:mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="relative inline-block group">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter uppercase italic transform -skew-x-6 leading-none drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
                            SEVEN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFA500]">KNIGHTS</span>
                        </h1>
                        <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-gray-500 tracking-tight uppercase italic transform -skew-x-6 mt-1 md:mt-4">
                            REBIRTH <span className="text-white/20 uppercase tracking-widest ml-2">DB</span>
                        </h2>
                        <div className="absolute -bottom-2 md:-bottom-6 w-full h-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] transform -skew-x-12 shadow-[0_0_15px_#FFD700] transition-all group-hover:w-[120%] group-hover:-left-[10%]" />
                    </div>

                    <p className="text-gray-400 text-sm md:text-2xl font-light tracking-wide max-w-2xl mx-auto leading-relaxed mt-6 md:mt-12 px-4">
                        The ultimate database for heroes, builds, and strategies.
                        <br />
                        <span className="text-white font-medium">Built by fans, for fans.</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-7xl mx-auto items-start">
                    {/* Left Column: Recent Updates (Moves to top on Mobile) */}
                    <div className="order-1 xl:order-2 xl:col-span-4 space-y-6">
                        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700]/40 to-transparent" />
                            
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-sm font-black italic uppercase text-white tracking-widest flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-[#FFD700]" />
                                    Recent Updates
                                </h3>
                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Live Intel</div>
                            </div>

                            <Suspense fallback={
                                <div className="space-y-4 animate-pulse">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="h-10 bg-white/5 rounded-xl w-full" />
                                    ))}
                                </div>
                            }>
                                <RecentUpdates />
                            </Suspense>
                        </div>

                        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400/40 to-transparent" />
                            <WebsiteUpdates />
                        </div>

                        {/* Integrated Partner Section */}
                        <div className="glass-card p-8 rounded-3xl border border-white/5 overflow-hidden relative shadow-2xl text-center">
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-xl font-black italic uppercase tracking-widest text-[#FFD700]">Partner with us</h3>
                                <p className="text-gray-400 text-xs leading-relaxed max-w-xs mx-auto">
                                    Interested in reaching thousands of Seven Knights Rebirth players? 
                                    We&apos;re looking for high-quality partners to grow with our community.
                                </p>
                                <Link 
                                    href="/contact" 
                                    className="inline-flex mt-2 px-8 py-3 rounded-xl bg-gray-900 border border-gray-700 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all shadow-lg active:scale-95"
                                >
                                    Contact for Partnership
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Features Grid */}
                    <div className="order-2 xl:order-1 xl:col-span-8 flex flex-col gap-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                            {FEATURES.map((feature) => (
                                <FeatureCard key={feature.title} {...feature} />
                            ))}
                        </div>

                        {/* Credits Section */}
                        <div className="w-full mt-4">
                            <GlobalCredits />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
