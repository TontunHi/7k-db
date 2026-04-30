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
    ADVENT:      { icon: Compass,   color: '#8b5cf6', label: 'Advent',        href: '/advent/ae_god_of_destruction' },
}


export default async function RecentUpdates() {
    const updates = await getRecentUpdates(10)

    return (
        <div className="w-full relative px-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-[#FFD700] to-orange-500 rounded-full shadow-[0_0_8px_rgba(255,215,0,0.4)]" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-foreground/90">
                        Live Intel
                    </h2>
                </div>
                <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-green-500/5 border border-green-500/10">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-widest text-green-500/80">Live</span>
                </div>
            </div>

            {/* Vertical Line Connector */}
            <div className="absolute left-[19px] top-10 bottom-2 w-px bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />

            {/* Update list */}
            {updates.length === 0 ? (
                <div className="py-6 text-center text-muted-foreground border border-dashed border-border/20 rounded-xl">
                    <p className="text-[10px] font-mono uppercase tracking-widest">No updates</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {updates
                        .filter(update => update.content_type !== 'STAGE')
                        .map((update) => {
                        const cfg = CONTENT_CONFIG[update.content_type] || CONTENT_CONFIG.HERO
                        const Icon = cfg.icon

                        return (
                            <Link
                                key={update.id}
                                href={cfg.href}
                                className="group relative flex items-start gap-3 transition-all duration-200"
                            >
                                {/* Timeline Node */}
                                <div className="relative z-10 shrink-0 mt-0.5">
                                    <div 
                                        className="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 shadow-sm border border-white/5 group-hover:scale-110 bg-black/60 backdrop-blur-sm"
                                        style={{ 
                                            boxShadow: `0 0 10px ${cfg.color}22`,
                                            borderColor: `${cfg.color}33`
                                        }}
                                    >
                                        <Icon className="w-3 h-3" style={{ color: cfg.color }} />
                                    </div>
                                </div>

                                {/* Content Area */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-0.5">
                                        <span
                                            className="text-[8px] font-black uppercase tracking-wider py-px px-1.5 rounded-sm bg-white/5"
                                            style={{ color: cfg.color, border: `1px solid ${cfg.color}22` }}
                                        >
                                            {cfg.label}
                                        </span>
                                        <div className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                                            {update.display_time}
                                        </div>
                                    </div>
                                    
                                    <div className="relative group-hover:translate-x-1 transition-transform duration-200">
                                        <p className="text-[11px] text-muted-foreground leading-snug font-medium group-hover:text-foreground transition-colors truncate">
                                            {update.message}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
