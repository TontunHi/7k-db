import {
    LayoutDashboard, FileImage, Map, Crown,
    Landmark, Skull, Compass, Swords, Shield, Crosshair, TrendingUp, Settings,
    Users, CreditCard, MessageSquare, Database, BarChart3, History, Zap, Eye, UserCheck
} from "lucide-react"

export const NAV_SECTIONS = [
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
        title: "Database",
        items: [
            { name: "Registry", href: "/admin/registry", icon: Database, color: "text-[#FFD700]", perm: "*" },
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

export const DASHBOARD_CATEGORIES = [
    {
        title: "Core Logistics",
        items: [
            { title: "Hero Builds", desc: "Equipment & Stat recommendations.", icon: FileImage, href: "/admin/builds", iconBg: "bg-blue-500/15", perm: "MANAGE_BUILDS" },
            { title: "Tier List", desc: "Hero rankings & meta data.", icon: TrendingUp, href: "/admin/tierlist", iconBg: "bg-pink-500/15", perm: "MANAGE_TIERLIST" },
            { title: "Asset Registry", desc: "Hero/Pet/Item master data.", icon: Database, href: "/admin/registry", iconBg: "bg-emerald-500/15", perm: "MANAGE_STAGES" },
            { title: "Credits", desc: "Contributor attribution.", icon: CreditCard, href: "/admin/credits", iconBg: "bg-red-500/15", perm: "MANAGE_CREDITS" },
        ]
    },
    {
        title: "PVE Strategy Operations",
        items: [
            { title: "Raids", desc: "Boss strategy & rotations.", icon: Skull, href: "/admin/raid", iconBg: "bg-red-500/15", perm: "MANAGE_RAIDS" },
            { title: "Castle Rush", desc: "Daily boss team setups.", icon: Crown, href: "/admin/castle-rush", iconBg: "bg-yellow-500/15", perm: "MANAGE_CASTLE_RUSH" },
            { title: "Adventure", desc: "Stage & Nightmare guides.", icon: Map, href: "/admin/stages", iconBg: "bg-amber-500/15", perm: "MANAGE_STAGES" },
            { title: "Dungeons", desc: "Dungeon team builds.", icon: Landmark, href: "/admin/dungeon", iconBg: "bg-teal-500/15", perm: "MANAGE_DUNGEONS" },
            { title: "Advent", desc: "Expedition boss teams.", icon: Compass, href: "/admin/advent", iconBg: "bg-violet-500/15", perm: "MANAGE_ADVENT" },
        ]
    },
    {
        title: "Competitive & PVP Meta",
        items: [
            { title: "Arena", desc: "PVP team recommendations.", icon: Crosshair, href: "/admin/arena", iconBg: "bg-orange-500/15", perm: "MANAGE_ARENA" },
            { title: "Total War", desc: "Triple team tier strategies.", icon: Swords, href: "/admin/total-war", iconBg: "bg-rose-500/15", perm: "MANAGE_TOTAL_WAR" },
            { title: "Guild War", desc: "Defense & Attack setups.", icon: Shield, href: "/admin/guild-war", iconBg: "bg-indigo-500/15", perm: "MANAGE_GUILD_WAR" },
        ]
    }
]

export const SYSTEM_TOOLS = [
    { title: "Analytics", href: "/admin/analytics", icon: BarChart3, color: "text-blue-500" },
    { title: "Messages", href: "/admin/messages", icon: MessageSquare, color: "text-emerald-500" },
    { title: "Auth IAM", href: "/admin/users", icon: Users, color: "text-purple-500" },
    { title: "Audit Logs", href: "/admin/logs", icon: History, color: "text-red-500" },
]
