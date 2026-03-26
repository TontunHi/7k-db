import Link from "next/link"
import { FileImage, ArrowRight, LayoutGrid, Skull, Crown, Landmark, Compass, Zap, TrendingUp } from "lucide-react"

export const metadata = {
    title: "Admin Dashboard | 7K Database",
    description: "Manage all aspects of the 7K Database."
}

export default function AdminDashboard() {
    const adminTools = [
        {
            title: "Manage Stages",
            desc: "Setup Stages, Nightmares, Teams, and Formations.",
            icon: LayoutGrid,
            href: "/admin/stages",
            gradient: "from-blue-600 to-cyan-500",
            shadow: "hover:shadow-blue-500/20",
            iconBg: "bg-blue-500/15"
        },
        {
            title: "Hero Builds",
            desc: "Upload and manage hero equipment build images.",
            icon: FileImage,
            href: "/admin/builds",
            gradient: "from-[#FFD700] to-amber-600",
            shadow: "hover:shadow-amber-500/20",
            iconBg: "bg-amber-500/15"
        },
        {
            title: "Castle Rush",
            desc: "Manage daily boss team recommendations.",
            icon: Crown,
            href: "/admin/castle-rush",
            gradient: "from-amber-500 to-orange-600",
            shadow: "hover:shadow-orange-500/20",
            iconBg: "bg-orange-500/15"
        },
        {
            title: "Advent Expedition",
            desc: "Manage Advent Expedition boss teams.",
            icon: Compass,
            href: "/admin/advent",
            gradient: "from-violet-500 to-purple-600",
            shadow: "hover:shadow-violet-500/20",
            iconBg: "bg-violet-500/15"
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
            title: "Tier List",
            desc: "Update hero rankings and meta analysis.",
            icon: TrendingUp,
            href: "/admin/tierlist",
            gradient: "from-pink-500 to-fuchsia-600",
            shadow: "hover:shadow-pink-500/20",
            iconBg: "bg-pink-500/15"
        }
    ]

    return (
        <div className="space-y-12 max-w-6xl mx-auto">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 md:p-12">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD700] opacity-[0.03] rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500 opacity-[0.04] rounded-full blur-[80px]" />
                
                <div className="relative space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center">
                            <Zap className="w-6 h-6 text-[#FFD700]" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-amber-400">Dashboard</span>
                            </h1>
                        </div>
                    </div>
                    <p className="text-gray-400 text-base md:text-lg max-w-xl leading-relaxed">
                        Manage all content of the 7K Database — stages, heroes, teams, and more.
                    </p>
                </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {adminTools.map((tool) => (
                    <Link
                        key={tool.title}
                        href={tool.href}
                        className={`group relative p-6 rounded-2xl bg-[#0a0a0a] border border-gray-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${tool.shadow} overflow-hidden`}
                    >
                        {/* Top gradient line */}
                        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        {/* Background glow */}
                        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-[0.06] rounded-full blur-3xl transition-opacity duration-500`} />

                        <div className="relative">
                            <div className="flex items-start justify-between mb-5">
                                <div className={`${tool.iconBg} p-3.5 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                                    <tool.icon className="w-7 h-7 text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-[#FFD700] transition-colors duration-200">{tool.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
