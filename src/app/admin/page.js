import Link from "next/link"
import {
    FileImage, ArrowRight, LayoutGrid, Skull, Crown, Landmark,
    Compass, Zap, TrendingUp, Swords, Shield, Crosshair, Heart, MessageSquare, Users,
    Activity, Eye, UserCheck, ShieldCheck, History, ExternalLink,
    Database, Settings, BarChart3, Globe
} from "lucide-react"
import { getAdminUser, requireAdmin } from "@/lib/auth-guard"
import { getDashboardStats } from "@/lib/admin-dashboard-actions"
import { getRecentUpdates } from "@/lib/log-actions"

export const metadata = {
    title: "Admin Command Center | 7K Database",
    description: "Manage all aspects of the 7K Database."
}

export default async function AdminDashboard() {
    await requireAdmin()
    const user = await getAdminUser()
    const [stats, recentLogs] = await Promise.all([
        getDashboardStats(),
        getRecentUpdates(6)
    ])

    const hasPermission = (perm) => {
        if (user?.role === 'super_admin') return true
        return user?.permissions?.includes(perm) || user?.permissions?.includes('*')
    }

    const categories = [
        {
            title: "Core Logistics",
            items: [
                { title: "Hero Builds", desc: "Equipment & Stat recommendations.", icon: FileImage, href: "/admin/builds", gradient: "from-blue-600 to-cyan-500", shadow: "hover:shadow-blue-500/20", iconBg: "bg-blue-500/15", perm: "MANAGE_BUILDS" },
                { title: "Tier List", desc: "Hero rankings & meta data.", icon: TrendingUp, href: "/admin/tierlist", gradient: "from-pink-500 to-fuchsia-600", shadow: "hover:shadow-pink-500/20", iconBg: "bg-pink-500/15", perm: "MANAGE_TIERLIST" },
                { title: "Asset Registry", desc: "Hero/Pet/Item master data.", icon: Database, href: "/admin/registry", gradient: "from-emerald-500 to-teal-500", shadow: "hover:shadow-emerald-500/20", iconBg: "bg-emerald-500/15", perm: "MANAGE_STAGES" },
                { title: "Credits", desc: "Contributor attribution.", icon: Heart, href: "/admin/credits", gradient: "from-red-500 to-rose-500", shadow: "hover:shadow-red-500/20", iconBg: "bg-red-500/15", perm: "MANAGE_CREDITS" },
            ]
        },
        {
            title: "PVE Strategy Operations",
            items: [
                { title: "Raids", desc: "Boss strategy & rotations.", icon: Skull, href: "/admin/raid", gradient: "from-red-500 to-orange-600", shadow: "hover:shadow-red-500/20", iconBg: "bg-red-500/15", perm: "MANAGE_RAIDS" },
                { title: "Castle Rush", desc: "Daily boss team setups.", icon: Crown, href: "/admin/castle-rush", gradient: "from-yellow-400 to-amber-600", shadow: "hover:shadow-yellow-500/20", iconBg: "bg-yellow-500/15", perm: "MANAGE_CASTLE_RUSH" },
                { title: "Adventure", desc: "Stage & Nightmare guides.", icon: LayoutGrid, href: "/admin/stages", gradient: "from-amber-400 to-orange-500", shadow: "hover:shadow-amber-500/20", iconBg: "bg-amber-500/15", perm: "MANAGE_STAGES" },
                { title: "Dungeons", desc: "Dungeon team builds.", icon: Landmark, href: "/admin/dungeon", gradient: "from-teal-400 to-emerald-600", shadow: "hover:shadow-teal-500/20", iconBg: "bg-teal-500/15", perm: "MANAGE_DUNGEONS" },
                { title: "Advent", desc: "Expedition boss teams.", icon: Compass, href: "/admin/advent", gradient: "from-violet-500 to-purple-600", shadow: "hover:shadow-violet-500/20", iconBg: "bg-violet-500/15", perm: "MANAGE_ADVENT" },
            ]
        },
        {
            title: "Competitive & PVP Meta",
            items: [
                { title: "Arena", desc: "PVP team recommendations.", icon: Crosshair, href: "/admin/arena", gradient: "from-orange-500 to-red-600", shadow: "hover:shadow-orange-500/20", iconBg: "bg-orange-500/15", perm: "MANAGE_ARENA" },
                { title: "Total War", desc: "Triple team tier strategies.", icon: Swords, href: "/admin/total-war", gradient: "from-rose-500 to-pink-600", shadow: "hover:shadow-rose-500/20", iconBg: "bg-rose-500/15", perm: "MANAGE_TOTAL_WAR" },
                { title: "Guild War", desc: "Defense & Attack setups.", icon: Shield, href: "/admin/guild-war", gradient: "from-indigo-500 to-blue-600", shadow: "hover:shadow-indigo-500/20", iconBg: "bg-indigo-500/15", perm: "MANAGE_GUILD_WAR" },
            ]
        }
    ]

    const filteredCategories = categories.map(cat => ({
        ...cat,
        items: cat.items.filter(item => {
            if (item.superOnly && user?.role !== 'super_admin') return false
            return hasPermission(item.perm)
        })
    })).filter(cat => cat.items.length > 0)

    const statCards = [
        { label: "Total Reach", value: stats.views.toLocaleString(), icon: Eye, color: "text-blue-500" },
        { label: "Unique Users", value: stats.visitors.toLocaleString(), icon: UserCheck, color: "text-emerald-500" },
        { label: "Raid Assets", value: stats.raidSets, icon: Skull, color: "text-red-500" },
        { label: "PVE Guides", value: stats.stages, icon: Zap, color: "text-amber-500" },
    ]

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20">
            {/* Command Center Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0a] p-8 md:p-12 shadow-2xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.05),transparent)] pointer-events-none" />
                
                <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 text-amber-500 mb-2">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Secure Access &bull; v2.0</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tight transform -skew-x-6">
                            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-amber-500">Command</span>
                        </h1>
                        <p className="text-gray-500 font-medium max-w-md leading-relaxed">
                            Centralized logistics for <span className="text-white font-bold">{user?.username}</span>. Global changes to the 7K Database are deployed here.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {statCards.map((s, i) => (
                            <div key={i} className="p-4 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col gap-2 transition-all hover:bg-white/[0.05]">
                                <div className="flex items-center justify-between">
                                    <s.icon className={`w-5 h-5 ${s.color}`} />
                                    <Activity className="w-3 h-3 text-gray-700" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black text-white leading-none mb-1">{s.value}</div>
                                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest leading-none">{s.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Tools Grid */}
                <div className="xl:col-span-2 space-y-12">
                    {filteredCategories.map((category, idx) => (
                        <div key={idx} className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(255,215,0,0.3)]"></div>
                                <h2 className="text-xl font-black text-white uppercase italic tracking-wider">{category.title}</h2>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {category.items.map((tool) => (
                                    <Link
                                        key={tool.title}
                                        href={tool.href}
                                        className="group relative p-5 rounded-2xl bg-[#0d0d0d] border border-white/5 transition-all duration-300 hover:border-white/10 hover:bg-[#111] flex items-center gap-4"
                                    >
                                        <div className={`${tool.iconBg} p-3 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                                            <tool.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wide group-hover:text-amber-500 transition-colors leading-none mb-1">{tool.title}</h3>
                                            <p className="text-[9px] text-gray-500 font-medium leading-none">{tool.desc}</p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Quick Access System Tools */}
                    <div className="pt-8 border-t border-white/5 space-y-6">
                         <div className="flex items-center gap-3">
                            <Settings className="w-5 h-5 text-gray-600" />
                            <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">System Infrastructure</h2>
                         </div>
                         <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Link href="/admin/analytics" className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-center group">
                                <BarChart3 className="w-5 h-5 text-blue-500 mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[9px] font-black text-gray-500 group-hover:text-blue-400 uppercase tracking-widest">Analytics</span>
                            </Link>
                            <Link href="/admin/messages" className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-center group">
                                <MessageSquare className="w-5 h-5 text-emerald-500 mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[9px] font-black text-gray-500 group-hover:text-emerald-400 uppercase tracking-widest">Messages</span>
                            </Link>
                            <Link href="/admin/users" className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-center group">
                                <ShieldCheck className="w-5 h-5 text-purple-500 mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[9px] font-black text-gray-500 group-hover:text-purple-400 uppercase tracking-widest">Auth IAM</span>
                            </Link>
                            <Link href="/admin/logs" className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-center group">
                                <History className="w-5 h-5 text-red-500 mx-auto mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[9px] font-black text-gray-500 group-hover:text-red-400 uppercase tracking-widest">Audit Logs</span>
                            </Link>
                         </div>
                    </div>
                </div>

                {/* Activity Feed Sidebar */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <History className="w-5 h-5 text-red-500" />
                            <h2 className="text-lg font-black text-white uppercase italic tracking-wider">Recency</h2>
                        </div>
                        <Link href="/admin/logs" className="text-[9px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1">
                            Entire Log <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 space-y-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-3xl rounded-full" />
                        
                        <div className="space-y-6 relative z-10">
                            {recentLogs.map((log) => (
                                <div key={log.id} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-2 h-2 rounded-full ${
                                            log.action_type === 'CREATE' ? 'bg-emerald-500' : 
                                            log.action_type === 'DELETE' ? 'bg-red-500' : 'bg-blue-500'
                                        }`} />
                                        <div className="w-[1px] h-full bg-white/5 mt-2" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1.5 leading-none">
                                            {log.admin_name} &bull; {log.display_time}
                                        </div>
                                        <p className="text-xs text-white leading-relaxed">
                                            <span className="font-black text-amber-500">{log.action_type}</span> {log.content_type}: <span className="font-medium text-gray-400">{log.target_name}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {recentLogs.length === 0 && (
                                <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest text-center py-10">No recent activity recorded</p>
                            )}
                        </div>
                    </div>

                    <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-lg shadow-red-900/20 relative overflow-hidden group">
                        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <h4 className="text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Globe className="w-3 h-3" /> Global Deployment
                        </h4>
                        <p className="text-[10px] opacity-90 font-medium leading-relaxed italic">
                            All modifications made in this Command Center are pushed instantly to the production database.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
