export const NAV_SECTIONS = [
    {
        title: "General",
        items: [
            { name: "Manage Builds", href: "/admin/builds", color: "bg-blue-500", perm: "MANAGE_BUILDS" },
            { name: "Manage Tierlist", href: "/admin/tierlist", color: "bg-pink-500", perm: "MANAGE_TIERLIST" },
        ]
    },
    {
        title: "PVE Content",
        items: [
            { name: "Manage Stages", href: "/admin/stages", color: "bg-amber-500", perm: "MANAGE_STAGES" },
            { name: "Dungeons", href: "/admin/dungeon", color: "bg-emerald-500", perm: "MANAGE_DUNGEONS" },
            { name: "Raids", href: "/admin/raid", color: "bg-red-500", perm: "MANAGE_RAIDS" },
            { name: "Castle Rush", href: "/admin/castle-rush", color: "bg-yellow-500", perm: "MANAGE_CASTLE_RUSH" },
            { name: "Advent Expedition", href: "/admin/advent", color: "bg-violet-500", perm: "MANAGE_ADVENT" },
        ]
    },
    {
        title: "PVP Content",
        items: [
            { name: "Arena Teams", href: "/admin/arena", color: "bg-orange-500", perm: "MANAGE_ARENA" },
            { name: "Total War", href: "/admin/total-war", color: "bg-rose-500", perm: "MANAGE_TOTAL_WAR" },
            { name: "Guild War Teams", href: "/admin/guild-war", color: "bg-indigo-500", perm: "MANAGE_GUILD_WAR" },
        ]
    },
    {
        title: "Database",
        items: [
            { name: "Registry", href: "/admin/registry", color: "bg-[#FFD700]", perm: "*" },
        ]
    },
    {
        title: "Analytics",
        items: [
            { name: "Internal Analytics", href: "/admin/analytics", color: "bg-blue-400", perm: "*" },
        ]
    },
    {
        title: "System",
        items: [
            { name: "Asset Manager", href: "/admin/assets", color: "bg-gray-500", perm: "MANAGE_ASSETS" },
            { name: "Manage Credit", href: "/admin/credits", color: "bg-green-500", perm: "MANAGE_CREDITS" },
            { name: "User Messages", href: "/admin/messages", color: "bg-blue-400", perm: "MANAGE_MESSAGES" },
            { name: "User Management", href: "/admin/users", color: "bg-cyan-500", perm: "MANAGE_USERS", superOnly: true },
        ]
    }
]

export const DASHBOARD_CATEGORIES = [
    {
        title: "Core Logistics",
        items: [
            { title: "Hero Builds", desc: "Equipment & Stat recommendations.", href: "/admin/builds", marker: "bg-blue-500", perm: "MANAGE_BUILDS" },
            { title: "Tier List", desc: "Hero rankings & meta data.", href: "/admin/tierlist", marker: "bg-pink-500", perm: "MANAGE_TIERLIST" },
            { title: "Asset Registry", desc: "Hero/Pet/Item master data.", href: "/admin/registry", marker: "bg-emerald-500", perm: "MANAGE_STAGES" },
            { title: "Credits", desc: "Contributor attribution.", href: "/admin/credits", marker: "bg-red-500", perm: "MANAGE_CREDITS" },
        ]
    },
    {
        title: "PVE Strategy Operations",
        items: [
            { title: "Raids", desc: "Boss strategy & rotations.", href: "/admin/raid", marker: "bg-red-500", perm: "MANAGE_RAIDS" },
            { title: "Castle Rush", desc: "Daily boss team setups.", href: "/admin/castle-rush", marker: "bg-yellow-500", perm: "MANAGE_CASTLE_RUSH" },
            { title: "Adventure", desc: "Stage & Nightmare guides.", href: "/admin/stages", marker: "bg-amber-500", perm: "MANAGE_STAGES" },
            { title: "Dungeons", desc: "Dungeon team builds.", href: "/admin/dungeon", marker: "bg-teal-500", perm: "MANAGE_DUNGEONS" },
            { title: "Advent", desc: "Expedition boss teams.", href: "/admin/advent", marker: "bg-violet-500", perm: "MANAGE_ADVENT" },
        ]
    },
    {
        title: "Competitive & PVP Meta",
        items: [
            { title: "Arena", desc: "PVP team recommendations.", href: "/admin/arena", marker: "bg-orange-500", perm: "MANAGE_ARENA" },
            { title: "Total War", desc: "Triple team tier strategies.", href: "/admin/total-war", marker: "bg-rose-500", perm: "MANAGE_TOTAL_WAR" },
            { title: "Guild War", desc: "Defense & Attack setups.", href: "/admin/guild-war", marker: "bg-indigo-500", perm: "MANAGE_GUILD_WAR" },
        ]
    }
]

export const SYSTEM_TOOLS = [
    { title: "Analytics", href: "/admin/analytics", color: "bg-blue-500" },
    { title: "Messages", href: "/admin/messages", color: "bg-emerald-500" },
    { title: "Auth IAM", href: "/admin/users", color: "bg-purple-500" },
    { title: "Audit Logs", href: "/admin/logs", color: "bg-red-500" },
]
