// Tier configuration — shared between user and admin pages
// No 'use server' here — plain JS module so objects can be exported freely.

export const TIER_CONFIG = [
    {
        key: 'normal',
        label: 'Normal',
        maxTeams: 2,
        logo: '/total_war/tw_normal.png',
        color: 'from-slate-400 to-slate-600',
        glow: 'rgba(148,163,184,0.35)',
        border: 'border-slate-400/50',
        accent: '#94a3b8',
        shadow: 'shadow-slate-500/20',
    },
    {
        key: 'elite',
        label: 'Elite',
        maxTeams: 3,
        logo: '/total_war/tw_elite.png',
        color: 'from-emerald-400 to-green-600',
        glow: 'rgba(52,211,153,0.4)',
        border: 'border-emerald-400/50',
        accent: '#34d399',
        shadow: 'shadow-emerald-500/25',
    },
    {
        key: 'superb',
        label: 'Superb',
        maxTeams: 4,
        logo: '/total_war/tw_superb.png',
        color: 'from-rose-400 to-red-600',
        glow: 'rgba(251,113,133,0.4)',
        border: 'border-rose-400/50',
        accent: '#fb7185',
        shadow: 'shadow-rose-500/25',
    },
    {
        key: 'legendary',
        label: 'Legendary',
        maxTeams: 5,
        logo: '/total_war/tw_legendary.png',
        color: 'from-[#FFD700] to-amber-500',
        glow: 'rgba(255,215,0,0.4)',
        border: 'border-[#FFD700]/50',
        accent: '#FFD700',
        shadow: 'shadow-yellow-500/25',
    },
]
