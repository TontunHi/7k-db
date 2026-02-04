import Link from "next/link"
import { FileImage, ArrowRight, LayoutGrid, Skull, FileText, Trophy, Settings } from "lucide-react"

export default function AdminDashboard() {
    const adminTools = [
        {
            title: "Manage Stages",
            desc: "Setup Stages, Nightmares, Teams, and Formations.",
            icon: LayoutGrid,
            href: "/admin/stages",
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            border: "hover:border-blue-400"
        },
        {
            title: "Hero Builds",
            desc: "Upload and manage hero equipment build images.",
            icon: FileImage,
            href: "/admin/builds",
            color: "text-[#FFD700]",
            bg: "bg-[#FFD700]/10",
            border: "hover:border-[#FFD700]"
        },
        {
            title: "Blog Posts",
            desc: "Write updates, news, and guides for the community.",
            icon: FileText,
            href: "/admin/blog",
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            border: "hover:border-emerald-400"
        },
        {
            title: "Tier List",
            desc: "Update hero rankings and meta analysis.",
            icon: Trophy,
            href: "/admin/tierlist",
            color: "text-rose-400",
            bg: "bg-rose-400/10",
            border: "hover:border-rose-400"
        }
    ]

    return (
        <div className="space-y-10">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-white tracking-tight uppercase italic transform -skew-x-6">
                    Admin <span className="text-[#FFD700]">Dashboard</span>
                </h1>
                <p className="text-gray-400 max-w-2xl">
                    Welcome back, Gamer. Manage all aspects of the 7K Database from here.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminTools.map((tool) => (
                    <Link
                        key={tool.title}
                        href={tool.href}
                        className={`group p-6 rounded-2xl bg-[#0a0a0a] border border-gray-800 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${tool.border}`}
                    >
                        <div className="flex items-start justify-between mb-6">
                            <div className={`p-3 rounded-xl ${tool.bg} ${tool.color} transition-transform group-hover:scale-110`}>
                                <tool.icon className="w-8 h-8" />
                            </div>
                            <ArrowRight className={`w-5 h-5 text-gray-600 transition-colors ${tool.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FFD700] transition-colors">{tool.title}</h3>
                        <p className="text-sm text-gray-400 leading-relaxed font-light">{tool.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
