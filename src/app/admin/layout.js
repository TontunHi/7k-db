import Link from "next/link"
import {
    LayoutDashboard, LogOut, FileImage, Map, Crown,
    Landmark, Skull, Compass, Swords, Shield, Crosshair, TrendingUp, Settings
} from "lucide-react"
import { logout } from "@/lib/actions"

export const metadata = {
    title: {
        template: '%s | 7K Admin',
        default: 'Admin Dashboard | 7K Admin'
    }
}

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-[#FFD700]/10 bg-[#0a0a0a] hidden md:flex flex-col relative overflow-hidden">
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] opacity-[0.02] rounded-full blur-[50px] pointer-events-none" />

                <div className="p-6 border-b border-gray-800/80">
                    <Link href="/admin" className="flex items-center gap-3 group">
                        <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-amber-500 uppercase italic tracking-wider transform -skew-x-6 group-hover:from-white group-hover:to-[#FFD700] transition-all">
                            7K Admin
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-6">
                    {/* Main Dashboard Link */}
                    <div className="space-y-1">
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-[#FFD700] hover:bg-[#FFD700]/10 rounded-xl transition-all font-medium"
                        >
                            <LayoutDashboard className="w-5 h-5 text-gray-400 group-hover:text-[#FFD700]" />
                            Dashboard
                        </Link>
                    </div>

                    {/* GENERAL */}
                    <div className="space-y-2">
                        <h3 className="px-4 text-[11px] font-black uppercase tracking-[0.15em] text-gray-600">General</h3>
                        <div className="space-y-1">
                            <Link
                                href="/admin/builds"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                            >
                                <FileImage className="w-4 h-4 text-blue-500" />
                                Manage Builds
                            </Link>
                            <Link
                                href="/admin/tierlist"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                            >
                                <TrendingUp className="w-4 h-4 text-pink-500" />
                                Manage Tierlist
                            </Link>
                        </div>
                    </div>

                    {/* PVE CONTENT */}
                    <div className="space-y-2">
                        <h3 className="px-4 text-[11px] font-black uppercase tracking-[0.15em] text-gray-600">PVE Content</h3>
                        <div className="space-y-1">
                            <Link
                                href="/admin/stages"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                            >
                                <Map className="w-4 h-4 text-amber-500" />
                                Manage Stages
                            </Link>
                            <Link
                                href="/admin/dungeon"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                            >
                                <Landmark className="w-4 h-4 text-emerald-500" />
                                Dungeons
                            </Link>
                            <Link
                                href="/admin/raid"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                            >
                                <Skull className="w-4 h-4 text-red-500" />
                                Raids
                            </Link>
                            <Link
                                href="/admin/castle-rush"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                            >
                                <Crown className="w-4 h-4 text-yellow-500" />
                                Castle Rush
                            </Link>
                            <Link
                                href="/admin/advent"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                            >
                                <Compass className="w-4 h-4 text-violet-500" />
                                Advent Expedition
                            </Link>
                        </div>
                    </div>

                    {/* PVP CONTENT */}
                    <div className="space-y-2">
                        <h3 className="px-4 text-[11px] font-black uppercase tracking-[0.15em] text-gray-600">PVP Content</h3>
                        <div className="space-y-1">
                            <Link
                                href="/admin/arena"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                            >
                                <Crosshair className="w-4 h-4 text-orange-500" />
                                Arena Teams
                            </Link>
                            <Link
                                href="/admin/total-war"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                            >
                                <Swords className="w-4 h-4 text-rose-500" />
                                Total War
                            </Link>
                            <Link
                                href="/admin/guild-war"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                            >
                                <Shield className="w-4 h-4 text-indigo-500" />
                                Guild War Teams
                            </Link>
                        </div>
                    </div>

                    {/* OTHERS */}
                    <div className="space-y-2 pt-2">
                        <h3 className="px-4 text-[11px] font-black uppercase tracking-[0.15em] text-gray-600">Others</h3>
                        <div className="space-y-1">
                            <Link
                                href="/admin/assets"
                                className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm"
                            >
                                <Settings className="w-4 h-4 text-gray-500" />
                                Asset Manager
                            </Link>
                        </div>
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-800/80 bg-black/20">
                    <form action={logout}>
                        <button className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold tracking-wide">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                {children}
            </main>
        </div>
    )
}
