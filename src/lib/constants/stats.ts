export interface StatKeyConfig {
    key: string
    label: string
    icon: string
}

export const MIN_STATS_KEYS: StatKeyConfig[] = [
    { key: "physAtk", label: "Attack", icon: "/about_website/icon_physical_attack.webp" },
    { key: "defense", label: "Defense", icon: "/about_website/icon_defense.webp" },
    { key: "hp", label: "HP", icon: "/about_website/icon_hp.webp" },
    { key: "speed", label: "Speed", icon: "/about_website/icon_speed.webp" },
    { key: "critRate", label: "Crit Rate (%)", icon: "/about_website/icon_crit_rate.webp" },
    { key: "critDamage", label: "Crit Damage (%)", icon: "/about_website/icon_crit_damage.webp" },
    { key: "weaknessHit", label: "Weakness Hit (%)", icon: "/about_website/icon_weakness_hit_chance.webp" },
    { key: "blockRate", label: "Block Rate (%)", icon: "/about_website/icon_block_rate.webp" },
    { key: "damageReduction", label: "Damage Reduction (%)", icon: "/about_website/icon_damage_taken_reduction.webp" },
    { key: "effectHit", label: "Effect Hit (%)", icon: "/about_website/icon_effect_hit_rate.webp" },
    { key: "effectResist", label: "Effect Resist (%)", icon: "/about_website/icon_effect_resistance.webp" },
    { key: "damageAmplification", label: "Damage Amp (%)", icon: "/about_website/icon_dedicated_damage_amplification.webp" },
    { key: "crush", label: "Crush", icon: "/about_website/icon_dedicated_crush.webp" },
    { key: "resilience", label: "Resilience", icon: "/about_website/icon_dedicated_resilience.webp" },
    { key: "rejuvenate", label: "Rejuvenate", icon: "/about_website/icon_dedicated_rejuvenate.webp" }
]

export const WEAPON_MAIN_STATS = [
    "Weakness Hit Chance",
    "Crit Rate",
    "Crit Damage",
    "All Attack (%)",
    "All Attack",
    "Defense (%)",
    "Defense",
    "HP (%)",
    "HP",
    "Effect Hit Rate"
] as const

export const ARMOR_MAIN_STATS = [
    "Damage Taken Reduction",
    "Block Rate",
    "All Attack (%)",
    "All Attack",
    "Defense (%)",
    "Defense",
    "HP (%)",
    "HP",
    "Effect Resistance"
] as const

export const ACCESSORY_MAIN_STATS = [
    "Speed",
    "Crit Damage",
    "Defense (%)",
    "Defense",
    "HP (%)",
    "HP",
    "All Attack (%)",
    "All Attack",
    "Effect Resistance"
] as const

export const AVAILABLE_SUBSTATS = [
    "Speed",
    "Crit Rate",
    "Crit Damage",
    "Weakness Hit Chance",
    "Block Rate",
    "Damage Taken Reduction",
    "Effect Hit Rate",
    "Effect Resistance",
    "All Attack (%)",
    "Defense (%)",
    "HP (%)"
] as const

export const DEDICATED_STATS_OPTIONS = [
    "All Attack (%)",
    "Defense (%)",
    "HP (%)",
    "Effect Hit Rate",
    "Effect Resistance",
    "Damage Amplification",
    "Crush",
    "Resilience",
    "Rejuvenate"
] as const

export type DedicatedStatOption = typeof DEDICATED_STATS_OPTIONS[number]

export function getDedicatedStatIcon(stat: string | null): string | null {
    switch (stat) {
        case "All Attack (%)": return "/about_website/icon_physical_attack.webp"
        case "Defense (%)": return "/about_website/icon_defense.webp"
        case "HP (%)": return "/about_website/icon_hp.webp"
        case "Effect Hit Rate": return "/about_website/icon_effect_hit_rate.webp"
        case "Effect Resistance": return "/about_website/icon_effect_resistance.webp"
        case "Damage Amplification": return "/about_website/icon_dedicated_damage_amplification.webp"
        case "Crush": return "/about_website/icon_dedicated_crush.webp"
        case "Resilience": return "/about_website/icon_dedicated_resilience.webp"
        case "Rejuvenate": return "/about_website/icon_dedicated_rejuvenate.webp"
        default: return null
    }
}

export type DedicatedStatsArray = [
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null
]

export const EMPTY_DEDICATED_STATS: DedicatedStatsArray = [
    null, null, null, null, null, null, null, null
]

export function inferWeaponGroup(filenameOrName: string, dbGroup?: string | null): 'Physical' | 'Magic' {
    if (dbGroup) {
        const normalized = dbGroup.trim().toLowerCase()
        if (normalized === 'magic') return 'Magic'
        if (normalized === 'physical') return 'Physical'
    }
    const lower = filenameOrName.toLowerCase()
    const isMagic = lower.includes('orb') || 
                    lower.includes('staff') || 
                    lower.includes('scripture') || 
                    lower.includes('magic') ||
                    lower.includes('wand') ||
                    lower.includes('grimoire') ||
                    lower.includes('book')
    return isMagic ? 'Magic' : 'Physical'
}
