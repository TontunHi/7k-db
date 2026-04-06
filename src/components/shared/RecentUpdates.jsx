import Link from 'next/link'
import { Clock, Sword, Crown, Shield, Swords, Star, RefreshCw, Trophy, Crosshair, Compass, Skull, Landmark, Map } from 'lucide-react'
import { getRecentUpdates } from '@/lib/log-actions'

const CONTENT_CONFIG = {
    HERO:        { icon: Sword,     color: '#3b82f6', label: 'Hero Build',    href: '/build' },
    CASTLE_RUSH: { icon: Crown,     color: '#f59e0b', label: 'Castle Rush',   href: '/castle-rush' },
    GUILD_WAR:   { icon: Shield,    color: '#ef4444', label: 'Guild War',     href: '/guild-war' },
    TOTAL_WAR:   { icon: Swords,    color: '#fb7185', label: 'Total War',     href: '/total-war' },
    RAID:        { icon: Skull,     color: '#8b5cf6', label: 'Raid',          href: '/raid' },
    DUNGEON:     { icon: Landmark,  color: '#10b981', label: 'Dungeon',       href: '/dungeon' },
    STAGE:       { icon: Map,       color: '#FFD700', label: 'Stage Guide',   href: '/stages' },
    TIERLIST:    { icon: Trophy,    color: '#a855f7', label: 'Tier List',     href: '/tierlist' },
    ARENA:       { icon: Crosshair, color: '#eab308', label: 'Arena',         href: '/arena' },
    ADVENT:      { icon: Compass,   color: '#8b5cf6', label: 'Advent',        href: '/advent' },
}

function parseDbDate(dateStr) {
    // created_at is now an ISO string (e.g. '2026-04-02T12:40:00.000Z')
    // new Date() handles this correctly in all environments
    return new Date(dateStr)
}

function formatDate(dateStr) {
    const d = parseDbDate(dateStr)
    return d.toLocaleDateString('en-US', {
        timeZone: 'Asia/Bangkok',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

function timeAgo(dateStr) {
    const now = new Date()
    const then = parseDbDate(dateStr)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHrs = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHrs < 24) return `${diffHrs}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return formatDate(dateStr)
}

export default async function RecentUpdates() {
    const updates = await getRecentUpdates(10)

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#FFD700] to-orange-500 rounded-full" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-300">
                        Recent Updates
                    </h2>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                    <RefreshCw className="w-3 h-3" />
                    <span className="text-[10px] font-mono uppercase tracking-wider">Live</span>
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                </div>
            </div>

            {/* Update list */}
            {updates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-700 gap-2">
                    <Clock className="w-6 h-6" />
                    <p className="text-xs font-mono">No updates yet</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {updates.map((update, idx) => {
                        const cfg = CONTENT_CONFIG[update.content_type] || CONTENT_CONFIG.HERO
                        const Icon = cfg.icon

                        return (
                            <Link
                                key={update.id}
                                href={cfg.href}
                                className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors duration-200"
                            >
                                {/* Icon dot */}
                                <div
                                    className="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: cfg.color + '22', border: `1px solid ${cfg.color}44` }}
                                >
                                    <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                                </div>

                                {/* Message */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-300 leading-snug truncate group-hover:text-white transition-colors">
                                        {update.message}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span
                                            className="text-[9px] font-bold uppercase tracking-wider"
                                            style={{ color: cfg.color + 'aa' }}
                                        >
                                            {cfg.label}
                                        </span>
                                        <span className="text-[9px] text-gray-700 font-mono">
                                            {timeAgo(update.created_at)}
                                        </span>
                                    </div>
                                </div>

                                {/* Date badge */}
                                <span className="shrink-0 text-[9px] font-mono text-gray-700 mt-1 group-hover:text-gray-500 transition-colors">
                                    {formatDate(update.created_at)}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
