"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard, LogOut, FileImage, Map, Crown,
    Landmark, Skull, Compass, Swords, Shield, Crosshair, TrendingUp, Settings,
    Menu, X, Users, CreditCard, MessageSquare
} from "lucide-react"
import { logout } from "@/lib/actions"
import { clsx } from "clsx"

const SidebarContent = ({ setIsOpen, pathname, filteredSections, user }) => (
    <>
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD700] opacity-[0.02] rounded-full blur-[50px] pointer-events-none" />

        <div className="p-6 border-b border-gray-800/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-amber-500 uppercase italic tracking-wider transform -skew-x-6 group-hover:from-white group-hover:to-[#FFD700] transition-all">
                    7K Admin
                </span>
            </Link>
            <button onClick={() => setIsOpen(false)} className="md:hidden text-gray-500 hover:text-white">
                <X size={20} />
            </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-6">
            <div className="space-y-1">
                <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                        "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium",
                        pathname === "/admin" 
                            ? "text-[#FFD700] bg-[#FFD700]/10" 
                            : "text-gray-300 hover:text-[#FFD700] hover:bg-[#FFD700]/10"
                    )}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                </Link>
            </div>

            {filteredSections.map((section) => (
                <div key={section.title} className="space-y-2">
                    <h3 className="px-4 text-[11px] font-black uppercase tracking-[0.15em] text-gray-600">{section.title}</h3>
                    <div className="space-y-1">
                        {section.items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={clsx(
                                    "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-sm",
                                    pathname === item.href
                                        ? "bg-white/10 text-white font-bold"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon className={clsx("w-4 h-4", item.color)} />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </nav>

        <div className="p-4 border-t border-gray-800/80 bg-black/20">
            <div className="mb-4 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] uppercase font-black text-gray-500 tracking-widest mb-1">Logged in as</p>
                <p className="text-xs font-bold text-[#FFD700] truncate">{user?.username || 'Admin'}</p>
                <p className="text-[9px] text-gray-600 uppercase font-bold">{user?.role?.replace('_', ' ')}</p>
            </div>
            <form action={logout}>
                <button className="flex items-center justify-center gap-2 w-full px-4 py-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold tracking-wide">
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </form>
        </div>
    </>
)

export default function Sidebar({ user }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const hasPermission = (perm) => {
        if (user?.role === 'super_admin') return true
        return user?.permissions?.includes(perm) || user?.permissions?.includes('*')
    }

    const navSections = [
        {
            title: "General",
            items: [
                { name: "Manage Builds", href: "/admin/builds", icon: FileImage, color: "text-blue-500", perm: "MANAGE_BUILDS" },
                { name: "Manage Tierlist", href: "/admin/tierlist", icon: TrendingUp, color: "text-pink-500", perm: "MANAGE_TIERLIST" },
            ]
        },
        {
            title: "PVE Content",
            items: [
                { name: "Manage Stages", href: "/admin/stages", icon: Map, color: "text-amber-500", perm: "MANAGE_STAGES" },
                { name: "Dungeons", href: "/admin/dungeon", icon: Landmark, color: "text-emerald-500", perm: "MANAGE_DUNGEONS" },
                { name: "Raids", href: "/admin/raid", icon: Skull, color: "text-red-500", perm: "MANAGE_RAIDS" },
                { name: "Castle Rush", href: "/admin/castle-rush", icon: Crown, color: "text-yellow-500", perm: "MANAGE_CASTLE_RUSH" },
                { name: "Advent Expedition", href: "/admin/advent", icon: Compass, color: "text-violet-500", perm: "MANAGE_ADVENT" },
            ]
        },
        {
            title: "PVP Content",
            items: [
                { name: "Arena Teams", href: "/admin/arena", icon: Crosshair, color: "text-orange-500", perm: "MANAGE_ARENA" },
                { name: "Total War", href: "/admin/total-war", icon: Swords, color: "text-rose-500", perm: "MANAGE_TOTAL_WAR" },
                { name: "Guild War Teams", href: "/admin/guild-war", icon: Shield, color: "text-indigo-500", perm: "MANAGE_GUILD_WAR" },
            ]
        },
        {
            title: "Analytics",
            items: [
                { name: "Internal Analytics", href: "/admin/analytics", icon: TrendingUp, color: "text-blue-400", perm: "*" },
            ]
        },
        {
            title: "System",
            items: [
                { name: "Asset Manager", href: "/admin/assets", icon: Settings, color: "text-gray-500", perm: "MANAGE_ASSETS" },
                { name: "Manage Credit", href: "/admin/credits", icon: CreditCard, color: "text-green-500", perm: "MANAGE_CREDITS" },
                { name: "User Messages", href: "/admin/messages", icon: MessageSquare, color: "text-blue-400", perm: "MANAGE_MESSAGES" },
                { name: "User Management", href: "/admin/users", icon: Users, color: "text-cyan-500", perm: "MANAGE_USERS", superOnly: true },
            ]
        }
    ]

    // Filter items based on permissions
    const filteredSections = navSections.map(section => ({
        ...section,
        items: section.items.filter(item => {
            if (item.superOnly && user?.role !== 'super_admin') return false
            return hasPermission(item.perm)
        })
    })).filter(section => section.items.length > 0)

    return (
        <>
            {/* Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-gray-800/50 sticky top-0 z-40">
                <Link href="/admin" className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-amber-500 uppercase italic">
                    7K Admin
                </Link>
                <button 
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-gray-400 hover:text-white bg-gray-900 rounded-lg border border-gray-800"
                >
                    <Menu size={20} />
                </button>
            </header>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={clsx(
                "fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-[#FFD700]/10 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 md:z-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent 
                    setIsOpen={setIsOpen} 
                    pathname={pathname} 
                    filteredSections={filteredSections} 
                    user={user} 
                />
            </aside>
        </>
    )
}
