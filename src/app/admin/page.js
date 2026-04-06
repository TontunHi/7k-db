import Link from "next/link"
import {
    FileImage, ArrowRight, LayoutGrid, Skull, Crown, Landmark,
    Compass, Zap, TrendingUp, Swords, Shield, Crosshair, Heart
} from "lucide-react"

export const metadata = {
    title: "Admin Dashboard | 7K Database",
    description: "Manage all aspects of the 7K Database."
}

export default function AdminDashboard() {
    const categories = [
        {
            title: "General Management",
            items: [
                {
                    title: "Hero Builds",
                    desc: "Upload and manage hero equipment build images.",
                    icon: FileImage,
                    href: "/admin/builds",
                    gradient: "from-blue-600 to-cyan-500",
                    shadow: "hover:shadow-blue-500/20",
                    iconBg: "bg-blue-500/15"
                },
                {
                    title: "Tier List",
                    desc: "Update hero rankings and meta analysis.",
                    icon: TrendingUp,
                    href: "/admin/tierlist",
                    gradient: "from-pink-500 to-fuchsia-600",
                    shadow: "hover:shadow-pink-500/20",
                    iconBg: "bg-pink-500/15"
                },
                {
                    title: "Manage Credits",
                    desc: "Global attribution/thank you for data sources.",
                    icon: Heart,
                    href: "/admin/credits",
                    gradient: "from-red-500 to-pink-500",
                    shadow: "hover:shadow-red-500/20",
                    iconBg: "bg-red-500/15"
                }
            ]
        },
        {
            title: "PVE Content",
            items: [
                {
                    title: "Manage Stages",
                    desc: "Setup Stages, Nightmares, Teams, and Formations.",
                    icon: LayoutGrid,
                    href: "/admin/stages",
                    gradient: "from-[#FFD700] to-amber-600",
                    shadow: "hover:shadow-amber-500/20",
                    iconBg: "bg-amber-500/15"
                },
                {
                    title: "Dungeons",
                    desc: "Manage dungeon team compositions.",
                    icon: Landmark,
                    href: "/admin/dungeon",
                    gradient: "from-emerald-500 to-teal-600",
                    shadow: "hover:shadow-emerald-500/20",
                    iconBg: "bg-emerald-500/15"
                },
                {
                    title: "Raids",
                    desc: "Manage raid teams and skill rotations.",
                    icon: Skull,
                    href: "/admin/raid",
                    gradient: "from-red-500 to-rose-600",
                    shadow: "hover:shadow-red-500/20",
                    iconBg: "bg-red-500/15"
                },
                {
                    title: "Castle Rush",
                    desc: "Manage daily boss team recommendations.",
                    icon: Crown,
                    href: "/admin/castle-rush",
                    gradient: "from-amber-500 to-yellow-600",
                    shadow: "hover:shadow-yellow-500/20",
                    iconBg: "bg-yellow-500/15"
                },
                {
                    title: "Advent Expedition",
                    desc: "Manage Advent Expedition boss teams.",
                    icon: Compass,
                    href: "/admin/advent",
                    gradient: "from-violet-500 to-purple-600",
                    shadow: "hover:shadow-violet-500/20",
                    iconBg: "bg-violet-500/15"
                }
            ]
        },
        {
            title: "PVP Content",
            items: [
                {
                    title: "Arena",
                    desc: "Manage Arena and Celestial PVP team recommendations.",
                    icon: Crosshair,
                    href: "/admin/arena",
                    gradient: "from-orange-500 to-red-600",
                    shadow: "hover:shadow-orange-500/20",
                    iconBg: "bg-orange-500/15"
                },
                {
                    title: "Total War",
                    desc: "Manage Total War tier sets and teams.",
                    icon: Swords,
                    href: "/admin/total-war",
                    gradient: "from-rose-500 to-pink-600",
                    shadow: "hover:shadow-rose-500/20",
                    iconBg: "bg-rose-500/15"
                },
                {
                    title: "Guild War",
                    desc: "Manage Guild War attacker and defender teams.",
                    icon: Shield,
                    href: "/admin/guild-war",
                    gradient: "from-indigo-500 to-blue-600",
                    shadow: "hover:shadow-indigo-500/20",
                    iconBg: "bg-indigo-500/15"
                }
            ]
        }
    ]

    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-12">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-[#FFD700]/20 bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-black p-8 md:p-12 shadow-[0_0_30px_rgba(255,215,0,0.05)]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#FFD70008_1px,transparent_1px),linear-gradient(to_bottom,#FFD70008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#FFD700] opacity-[0.05] rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-amber-600 opacity-[0.05] rounded-full blur-[100px]" />
                
                <div className="relative space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-amber-600/10 border border-[#FFD700]/30 flex items-center justify-center shadow-lg shadow-[#FFD700]/10">
                            <Zap className="w-7 h-7 text-[#FFD700]" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight italic uppercase transform -skew-x-6">
                                Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-amber-500">Dashboard</span>
                            </h1>
                        </div>
                    </div>
                    <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed pl-1 font-light">
                        Select a module below to manage content across the database. Categories are structured to mirror the public site's navigation.
                    </p>
                </div>
            </div>

            {/* Tools Sections */}
            <div className="space-y-12">
                {categories.map((category, idx) => (
                    <div key={idx} className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-6 bg-gradient-to-b from-[#FFD700] to-amber-600 rounded-full shadow-[0_0_10px_rgba(255,215,0,0.5)]"></div>
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-wide">{category.title}</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {category.items.map((tool) => (
                                <Link
                                    key={tool.title}
                                    href={tool.href}
                                    className={`group relative p-6 rounded-2xl bg-[#0a0a0a] border border-gray-800 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-gray-600 ${tool.shadow} overflow-hidden flex flex-col h-full`}
                                >
                                    {/* Top gradient line */}
                                    <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${tool.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />
                                    
                                    {/* Hover gradient overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
                                    
                                    {/* Background glow top right */}
                                    <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-500 pointer-events-none`} />

                                    <div className="relative flex flex-col h-full z-10">
                                        <div className="flex items-start justify-between mb-5">
                                            <div className={`${tool.iconBg} p-3.5 rounded-xl transition-transform duration-300 group-hover:scale-110 border border-white/5`}>
                                                <tool.icon className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                                            </div>
                                        </div>
                                        
                                        <div className="mt-auto">
                                            <h3 className="text-lg font-bold text-white mb-2 tracking-wide group-hover:text-[#FFD700] transition-colors duration-200 uppercase">{tool.title}</h3>
                                            <p className="text-sm text-gray-500 leading-relaxed font-light">{tool.desc}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
