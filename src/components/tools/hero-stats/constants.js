export const STAT_FIELDS = [
    { key: "atk_phys", label: "Physical Attack", icon: "/about_website/icon_physical_attack.webp", group: "Physical" },
    { key: "atk_mag", label: "Magic Attack", icon: "/about_website/icon_physical_attack.webp", group: "Magic" },
    { key: "def", label: "Defense", icon: "/about_website/icon_defense.webp" },
    { key: "hp", label: "HP", icon: "/about_website/icon_hp.webp" },
    { key: "speed", label: "Speed", icon: "/about_website/icon_speed.webp" },
    { key: "crit_rate", label: "Crit Rate %", icon: "/about_website/icon_crit_rate.webp" },
    { key: "crit_dmg", label: "Crit Damage %", icon: "/about_website/icon_crit_damage.webp" },
    { key: "weak_hit", label: "Weakness %", icon: "/about_website/icon_weakness_hit_chance.webp" },
    { key: "block_rate", label: "Block Rate %", icon: "/about_website/icon_block_rate.webp" },
    { key: "dmg_red", label: "Dmg Reduction %", icon: "/about_website/icon_damage_taken_reduction.webp" },
    { key: "eff_hit", label: "Effect Hit %", icon: "/about_website/icon_effect_hit_rate.webp" },
    { key: "eff_res", label: "Effect Res %", icon: "/about_website/icon_effect_resistance.webp" }
]

export const WEAPON_MAIN_STATS = [
    { label: "Weakness Hit Chance", value: 28, unit: "%", key: "weak_hit", icon: "/about_website/icon_weakness_hit_chance.webp" },
    { label: "Crit Rate", value: 24, unit: "%", key: "crit_rate", icon: "/about_website/icon_crit_rate.webp" },
    { label: "Crit Damage", value: 36, unit: "%", key: "crit_dmg", icon: "/about_website/icon_crit_damage.webp" },
    { label: "All Attack (%)", value: 28, unit: "%", key: "atk_all_perc", icon: "/about_website/icon_physical_attack.webp" },
    { label: "All Attack", value: 240, unit: "", key: "atk_all", icon: "/about_website/icon_physical_attack.webp" },
    { label: "Defense (%)", value: 28, unit: "%", key: "def_perc", icon: "/about_website/icon_defense.webp" },
    { label: "Defense", value: 160, unit: "", key: "def", icon: "/about_website/icon_defense.webp" },
    { label: "HP (%)", value: 28, unit: "%", key: "hp_perc", icon: "/about_website/icon_hp.webp" },
    { label: "HP", value: 850, unit: "", key: "hp", icon: "/about_website/icon_hp.webp" },
    { label: "Effect Hit Rate", value: 30, unit: "%", key: "eff_hit", icon: "/about_website/icon_effect_hit_rate.webp" },
]

export const ARMOR_MAIN_STATS = [
    { label: "Damage Taken Reduction", value: 10, unit: "%", key: "dmg_red", icon: "/about_website/icon_damage_taken_reduction.webp" },
    { label: "Block Rate", value: 24, unit: "%", key: "block_rate", icon: "/about_website/icon_block_rate.webp" },
    { label: "All Attack (%)", value: 28, unit: "%", key: "atk_all_perc", icon: "/about_website/icon_physical_attack.webp" },
    { label: "All Attack", value: 240, unit: "", key: "atk_all", icon: "/about_website/icon_physical_attack.webp" },
    { label: "Defense (%)", value: 28, unit: "%", key: "def_perc", icon: "/about_website/icon_defense.webp" },
    { label: "Defense", value: 160, unit: "", key: "def", icon: "/about_website/icon_defense.webp" },
    { label: "HP (%)", value: 28, unit: "%", key: "hp_perc", icon: "/about_website/icon_hp.webp" },
    { label: "HP", value: 850, unit: "", key: "hp", icon: "/about_website/icon_hp.webp" },
    { label: "Effect Resistance", value: 30, unit: "%", key: "eff_res", icon: "/about_website/icon_effect_resistance.webp" },
]

export const SUBSTAT_LIST = [
    { label: "All Attack", key: "atk_all", values: [50, 100, 150, 200, 250, 300] },
    { label: "All Attack (%)", key: "atk_all_perc", values: [5, 10, 15, 20, 25, 30] },
    { label: "Defense", key: "def", values: [30, 60, 90, 120, 150, 180] },
    { label: "Defense (%)", key: "def_perc", values: [5, 10, 15, 20, 25, 30] },
    { label: "HP", key: "hp", values: [180, 360, 540, 720, 900, 1080] },
    { label: "HP (%)", key: "hp_perc", values: [5, 10, 15, 20, 25, 30] },
    { label: "Speed", key: "speed", values: [4, 8, 12, 16, 20, 24] },
    { label: "Crit Rate", key: "crit_rate", values: [4, 8, 12, 16, 20, 24] },
    { label: "Crit Damage", key: "crit_dmg", values: [6, 12, 18, 24, 30, 36] },
    { label: "Weakness Hit Chance", key: "weak_hit", values: [4, 8, 12, 16, 20, 24] },
    { label: "Block Rate", key: "block_rate", values: [4, 8, 12, 16, 20, 24] },
    { label: "Effect Hit Rate", key: "eff_hit", values: [5, 10, 15, 20, 25, 30] },
    { label: "Effect Resistance", key: "eff_res", values: [5, 10, 15, 20, 25, 30] }
]

export const SET_BONUSES = {
    "Vanguard": {
        2: { atk_all_perc: 20 },
        4: { atk_all_perc: 45, eff_hit: 20 }
    },
    "Bounty Tracker": {
        2: { weak_hit: 15 },
        4: { weak_hit: 35 }
    },
    "Paladin": {
        2: { hp_perc: 17 },
        4: { hp_perc: 40 }
    },
    "Orchestrator": {
        2: { eff_res: 17 },
        4: { eff_res: 35 }
    },
    "Spellweaver": {
        2: { eff_hit: 17 },
        4: { eff_hit: 35 }
    },
    "Assassin": {
        2: { crit_rate: 15 },
        4: { crit_rate: 30 }
    },
    "Gatekeeper": {
        2: { block_rate: 15 },
        4: { block_rate: 40 }
    },
    "Guardian": {
        2: { def_perc: 20 },
        4: { def_perc: 45, eff_res: 20 }
    },
    "Avenger": {
        2: {},
        4: {}
    }
}

export const getInitialItemState = (slotKey = "") => ({
    item: null,
    mainStatKey: slotKey.startsWith('Weapon') ? WEAPON_MAIN_STATS[3].key : ARMOR_MAIN_STATS[2].key, // Default to All Attack (%)
    substats: Array(4).fill(null).map(() => ({ key: null, level: 0 }))
})
