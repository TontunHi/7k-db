import Link from "next/link"
import { LayoutDashboard, LogOut, FileImage, FileText, Map, Crown, Landmark, Skull, Compass, Swords, Shield } from "lucide-react"
import { logout } from "@/lib/actions"

import { Toaster } from 'sonner'

export const metadata = {
    title: {
        template: '%s | 7K Admin',
        default: 'Admin Dashboard | 7K Admin'
    }
}
export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-black flex">
            <Toaster theme="dark" position="top-center" richColors />
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-800 bg-gray-900/30 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <span className="text-xl font-bold text-[#FFD700]">7K Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#FFD700] hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>

                    <Link
                        href="/admin/builds"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#FFD700] hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        <FileImage className="w-5 h-5" />
                        Manage Builds
                    </Link>
                    <Link
                        href="/admin/assets"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#FFD700] hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        <FileImage className="w-5 h-5 text-indigo-400" />
                        Asset Manager
                    </Link>
                    <Link
                        href="/admin/stages"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#FFD700] hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        <Map className="w-5 h-5" />
                        Manage Stages
                    </Link>
                    <Link
                        href="/admin/castle-rush"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-amber-500 hover:bg-amber-900/20 rounded-lg transition-colors"
                    >
                        <Crown className="w-5 h-5" />
                        Castle Rush
                    </Link>
                    <Link
                        href="/admin/arena"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                        <Swords className="w-5 h-5" />
                        Arena Teams
                    </Link>
                    <Link
                        href="/admin/guild-war"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <Shield className="w-5 h-5" />
                        Guild War Teams
                    </Link>
                    <Link
                        href="/admin/advent"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-violet-400 hover:bg-violet-900/20 rounded-lg transition-colors"
                    >
                        <Compass className="w-5 h-5" />
                        Advent Expedition
                    </Link>
                    <Link
                        href="/admin/dungeon"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-amber-500 hover:bg-amber-900/20 rounded-lg transition-colors"
                    >
                        <Landmark className="w-5 h-5" />
                        Dungeons
                    </Link>
                    <Link
                        href="/admin/raid"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <Skull className="w-5 h-5" />
                        Raids
                    </Link>
                    <Link
                        href="/admin/tierlist"
                        className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-[#FFD700] hover:bg-gray-800/50 rounded-lg transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Manage Tierlist
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <form action={logout}>
                        <button className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:text-red-300 hover:bg-red-900/10 rounded-lg transition-colors">
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
