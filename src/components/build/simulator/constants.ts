export const WEAPON_MAIN_STATS = [
    "Weakness Hit Chance", "Crit Rate", "Crit Damage", "All Attack (%)", 
    "All Attack", "Defense (%)", "Defense", "HP (%)", "HP", "Effect Hit Rate"
]

export const ARMOR_MAIN_STATS = [
    "Damage Taken Reduction", "Block Rate", "All Attack (%)", "All Attack", 
    "Defense (%)", "Defense", "HP (%)", "HP", "Effect Resistance"
]

export const SUBSTATS = [
    "All Attack (%)", "Defense (%)", "HP (%)", "Crit Rate", 
    "Weakness Hit Chance", "Effect Hit Rate", "All Attack", 
    "Defense", "HP", "Speed", "Crit Damage", "Block Rate", "Effect Resistance"
]

export const MIN_STATS_KEYS = [
  { key: "physAtk", label: "Physical Attack", icon: "/about_website/icon_physical_attack.webp" },
  { key: "defense", label: "Defense", icon: "/about_website/icon_defense.webp" },
  { key: "hp", label: "HP", icon: "/about_website/icon_hp.webp" },
  { key: "speed", label: "Speed", icon: "/about_website/icon_speed.webp" },
  { key: "critRate", label: "Crit Rate", icon: "/about_website/icon_crit_rate.webp", unit: "%" },
  { key: "critDamage", label: "Crit Damage", icon: "/about_website/icon_crit_damage.webp", unit: "%" },
  { key: "weaknessHit", label: "Weakness Hit Chance", icon: "/about_website/icon_weakness_hit_chance.webp", unit: "%" },
  { key: "blockRate", label: "Block Rate", icon: "/about_website/icon_block_rate.webp", unit: "%" },
  { key: "damageReduction", label: "Damage Taken Reduction", icon: "/about_website/icon_damage_taken_reduction.webp", unit: "%" },
  { key: "effectHit", label: "Effect Hit Rate", icon: "/about_website/icon_effect_hit_rate.webp", unit: "%" },
  { key: "effectResist", label: "Effect Resistance", icon: "/about_website/icon_effect_resistance.webp", unit: "%" },
  { key: "damageAmplification", label: "Damage Amplification", icon: "/about_website/icon_dedicated_damage_amplification.webp", unit: "%" },
  { key: "crush", label: "Crush", icon: "/about_website/icon_dedicated_crush.webp", unit: "%" },
  { key: "resilience", label: "Resilience", icon: "/about_website/icon_dedicated_resilience.webp", unit: "%" },
  { key: "rejuvenate", label: "Rejuvenate", icon: "/about_website/icon_dedicated_rejuvenate.webp", unit: "%" }
]
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
]

export function getDedicatedStatIcon(stat: string) {
    switch (stat) {
        case "All Attack (%)": return "/about_website/icon_physical_attack.webp";
        case "Defense (%)": return "/about_website/icon_defense.webp";
        case "HP (%)": return "/about_website/icon_hp.webp";
        case "Effect Hit Rate": return "/about_website/icon_effect_hit_rate.webp";
        case "Effect Resistance": return "/about_website/icon_effect_resistance.webp";
        case "Damage Amplification": return "/about_website/icon_dedicated_damage_amplification.webp";
        case "Crush": return "/about_website/icon_dedicated_crush.webp";
        case "Resilience": return "/about_website/icon_dedicated_resilience.webp";
        case "Rejuvenate": return "/about_website/icon_dedicated_rejuvenate.webp";
        default: return null;
    }
}

