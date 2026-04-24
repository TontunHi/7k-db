'use client'

import { useState, useEffect, useMemo } from "react"
import { ChevronLeft, RotateCcw } from "lucide-react"
import { clsx } from "clsx"
import SafeImage from "@/components/shared/SafeImage"

import HeroSelection from "./components/HeroSelection"
import StatsAnalysis from "./components/StatsAnalysis"
import EquipmentSection from "./components/EquipmentSection"
import ItemSelectorModal from "./components/ItemSelectorModal"
import { 
    STAT_FIELDS, WEAPON_MAIN_STATS, ARMOR_MAIN_STATS, 
    SUBSTAT_LIST, SET_BONUSES, getInitialItemState 
} from "./constants"

import styles from "./HeroStatsBuilder.module.css"

export default function HeroStatsBuilderView({ heroes = [], items = [] }) {
    const [isSelectionMode, setIsSelectionMode] = useState(true)
    const [selectedHero, setSelectedHero] = useState(null)
    const [search, setSearch] = useState("")
    const [heroStats, setHeroStats] = useState({})
    const [equippedItems, setEquippedItems] = useState({
        Weapon1: getInitialItemState('Weapon1'),
        Armor1: getInitialItemState('Armor1'),
        Weapon2: getInitialItemState('Weapon2'),
        Armor2: getInitialItemState('Armor2')
    })
    const [showItemSelector, setShowItemSelector] = useState(null)

    const formatValue = (val) => {
        if (val === "" || val === undefined) return "0"
        const num = parseFloat(val)
        if (isNaN(num)) return "0"
        return Number.isInteger(num) ? num.toString() : num.toFixed(2)
    }

    useEffect(() => {
        const saved = localStorage.getItem("hero-build-state-v5")
        if (!saved) return

        try {
            const parsed = JSON.parse(saved)
            if (parsed?.hero) {
                const hero = heroes.find(h => h.filename === parsed.hero.filename)
                if (hero) {
                    requestAnimationFrame(() => {
                        setSelectedHero(hero)
                        setHeroStats(parsed.stats || {})
                        setEquippedItems(parsed.equipped || {
                            Weapon1: getInitialItemState('Weapon1'),
                            Armor1: getInitialItemState('Armor1'),
                            Weapon2: getInitialItemState('Weapon2'),
                            Armor2: getInitialItemState('Armor2')
                        })
                        setIsSelectionMode(false)
                    })
                }
            }
        } catch (e) {
            console.error("Failed to load saved build", e)
        }
    }, [heroes])

    useEffect(() => {
        if (selectedHero) {
            const state = {
                hero: selectedHero,
                stats: heroStats,
                equipped: equippedItems
            }
            localStorage.setItem("hero-build-state-v5", JSON.stringify(state))
        }
    }, [selectedHero, heroStats, equippedItems])

    const handleSelectHero = (hero) => {
        setSelectedHero(hero)
        const baseStats = {}
        STAT_FIELDS.forEach(f => {
            baseStats[f.key] = hero[f.key] || ""
        })
        setHeroStats(baseStats)
        setIsSelectionMode(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const getAvailableItems = (slotKey) => {
        if (!selectedHero || !slotKey) return []
        if (slotKey.startsWith('Weapon')) {
            const isMagic = selectedHero.hero_group === "Magic"
            return items
                .filter(i => i.item_type === 'Weapon')
                .filter(i => {
                    const name = i.name.toLowerCase()
                    const magicTerms = ['staff', 'orb', 'scripture']
                    const isMagicItem = magicTerms.some(t => name.includes(t))
                    return isMagic ? isMagicItem : !isMagicItem
                })
                .map(i => ({
                    ...i,
                    image: `/items/weapon/${i.image}`
                }))
        } else {
            return items
                .filter(i => i.item_type === 'Armor')
                .map(i => ({
                    ...i,
                    image: `/items/armor/${i.image}`
                }))
        }
    }

    const handleStatChange = (key, val) => {
        setHeroStats(prev => ({ ...prev, [key]: val }))
    }

    const handleItemAction = (slotKey, action, payload) => {
        setEquippedItems(prev => {
            const newState = { ...prev }
            const currentSlot = newState[slotKey]
            
            if (action === 'EQUIP') {
                newState[slotKey] = { ...newState[slotKey], item: payload }
            } else if (action === 'SET_MAIN_STAT') {
                newState[slotKey] = { ...newState[slotKey], mainStatKey: payload.key }
            } else if (action === 'CLEAR') {
                newState[slotKey] = getInitialItemState(slotKey)
            } else if (action === 'SUBSTAT_KEY') {
                const { index, key } = payload
                const newSubstats = [...currentSlot.substats]
                newSubstats[index] = { ...newSubstats[index], key, level: 0 }
                newState[slotKey] = { ...currentSlot, substats: newSubstats }
            } else if (action === 'LEVEL_UP') {
                const { index } = payload
                const totalLevels = currentSlot.substats.reduce((sum, s) => sum + (s.level || 0), 0)
                const statInfo = SUBSTAT_LIST.find(s => s.key === currentSlot.substats[index].key)
                
                if (totalLevels < 5 && currentSlot.substats[index].level < (statInfo?.values.length - 1)) {
                    const newSubstats = [...currentSlot.substats]
                    newSubstats[index] = { ...newSubstats[index], level: (newSubstats[index].level || 0) + 1 }
                    newState[slotKey] = { ...currentSlot, substats: newSubstats }
                }
            } else if (action === 'LEVEL_DOWN') {
                const { index } = payload
                if (currentSlot.substats[index].level > 0) {
                    const newSubstats = [...currentSlot.substats]
                    newSubstats[index] = { ...newSubstats[index], level: (newSubstats[index].level || 0) - 1 }
                    newState[slotKey] = { ...currentSlot, substats: newSubstats }
                }
            }
            return newState
        })
    }

    const resetBuild = () => {
        if (confirm("Reset current build?")) {
            setSelectedHero(null)
            setHeroStats({})
            setEquippedItems({
                Weapon1: getInitialItemState('Weapon1'),
                Armor1: getInitialItemState('Armor1'),
                Weapon2: getInitialItemState('Weapon2'),
                Armor2: getInitialItemState('Armor2')
            })
            setIsSelectionMode(true)
            localStorage.removeItem("hero-build-state-v5")
        }
    }

    const finalStats = useMemo(() => {
        const base = { ...heroStats }
        Object.keys(base).forEach(key => base[key] = parseFloat(base[key]) || 0)
        
        const atkKey = (selectedHero?.hero_group === "Physical" || selectedHero?.hero_group === "Attack") ? "atk_phys" : "atk_mag"
        
        const extraFlat = { atk: 0, def: 0, hp: 0, speed: 0 }
        const extraPerc = { atk: 0, def: 0, hp: 0 }
        const otherStats = { 
            crit_rate: 0, crit_dmg: 0, weak_hit: 0, 
            block_rate: 0, eff_hit: 0, eff_res: 0,
            dmg_red: 0
        }
        
        const setCounts = {}
        
        Object.values(equippedItems).forEach(slot => {
            if (slot.item && slot.item.item_set) {
                const s = slot.item.item_set
                setCounts[s] = (setCounts[s] || 0) + 1
            }

            if (slot.item) {
                if (slot.item.item_type === 'Weapon') {
                    extraFlat.atk += 304
                } else if (slot.item.item_type === 'Armor') {
                    extraFlat.hp += 1079
                    extraFlat.def += 189
                }
            }

            if (slot.item && slot.mainStatKey) {
                const statOptions = slot.item.item_type === 'Weapon' ? WEAPON_MAIN_STATS : ARMOR_MAIN_STATS
                const mainStat = statOptions.find(s => s.key === slot.mainStatKey)
                if (mainStat) {
                    const val = mainStat.value
                    if (mainStat.key === 'atk_all') extraFlat.atk += val
                    else if (mainStat.key === 'atk_all_perc') extraPerc.atk += val
                    else if (mainStat.key === 'def') extraFlat.def += val
                    else if (mainStat.key === 'def_perc') extraPerc.def += val
                    else if (mainStat.key === 'hp') extraFlat.hp += val
                    else if (mainStat.key === 'hp_perc') extraPerc.hp += val
                    else if (otherStats[mainStat.key] !== undefined) {
                        otherStats[mainStat.key] += val
                    }
                }
            }

            slot.substats.forEach(sub => {
                if (sub.key) {
                    const statInfo = SUBSTAT_LIST.find(s => s.key === sub.key)
                    if (statInfo) {
                        const val = parseFloat(statInfo.values[sub.level || 0]) || 0
                        
                        if (sub.key === 'atk_all') extraFlat.atk += val
                        else if (sub.key === 'atk_all_perc') extraPerc.atk += val
                        else if (sub.key === 'def') extraFlat.def += val
                        else if (sub.key === 'def_perc') extraPerc.def += val
                        else if (sub.key === 'hp') extraFlat.hp += val
                        else if (sub.key === 'hp_perc') extraPerc.hp += val
                        else if (sub.key === 'speed') extraFlat.speed += val
                        else if (otherStats[sub.key] !== undefined) {
                            otherStats[sub.key] += val
                        }
                    }
                }
            })
        })

        Object.entries(setCounts).forEach(([setName, count]) => {
            if (count >= 2) {
                const bonusesConfig = SET_BONUSES[setName]
                if (!bonusesConfig) return
                
                const bonus = count >= 4 ? bonusesConfig[4] : bonusesConfig[2]
                if (!bonus) return

                Object.entries(bonus).forEach(([statKey, val]) => {
                    if (statKey === 'atk_all_perc') extraPerc.atk += val
                    else if (statKey === 'def_perc') extraPerc.def += val
                    else if (statKey === 'hp_perc') extraPerc.hp += val
                    else if (otherStats[statKey] !== undefined) {
                        otherStats[statKey] += val
                    }
                })
            }
        })

        const res = { ...base }
        const baseAtk = base[atkKey] || 0
        res[atkKey] = baseAtk + (baseAtk * (extraPerc.atk / 100)) + extraFlat.atk
        
        const baseDef = base.def || 0
        res.def = baseDef + (baseDef * (extraPerc.def / 100)) + extraFlat.def
        
        const baseHp = base.hp || 0
        res.hp = baseHp + (baseHp * (extraPerc.hp / 100)) + extraFlat.hp
        
        res.speed = (base.speed || 0) + extraFlat.speed
        
        Object.keys(otherStats).forEach(key => {
            res[key] = (base[key] || 0) + otherStats[key]
        })

        const activeSets = []
        Object.entries(setCounts).forEach(([setName, count]) => {
            if (count >= 2) {
                const bonusesConfig = SET_BONUSES[setName]
                if (bonusesConfig) {
                    const pieces = count >= 4 ? 4 : 2
                    activeSets.push({ name: setName, pieces, bonus: bonusesConfig[pieces] })
                }
            }
        })

        return { stats: res, activeSets }
    }, [heroStats, equippedItems, selectedHero])

    const visibleStatFields = useMemo(() => {
        if (!selectedHero) return STAT_FIELDS
        return STAT_FIELDS.filter(f => !f.group || f.group === selectedHero.hero_group)
    }, [selectedHero])

    if (isSelectionMode) {
        return (
            <HeroSelection 
                heroes={heroes} 
                search={search} 
                setSearch={setSearch} 
                onSelect={handleSelectHero} 
            />
        )
    }

    return (
        <div className={styles.builder}>
            <div className={styles.container}>
                
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <button 
                            onClick={() => setIsSelectionMode(true)}
                            className={styles.backButton}
                        >
                            <ChevronLeft className={styles.backIcon} />
                        </button>
                        <div className={styles.heroPortrait}>
                            <SafeImage src={`/heroes/${selectedHero.filename}.webp`} fill className="object-contain" alt="" />
                        </div>
                        <div className={styles.heroInfo}>
                            <div className={styles.heroBadgeRow}>
                                <span className={styles.gradeBadge}>{selectedHero.grade}</span>
                                <span className={styles.typeLabel}>{selectedHero.hero_group} Type</span>
                            </div>
                            <h2 className={styles.heroName}>{selectedHero.name}</h2>
                        </div>
                    </div>

                    <div className={styles.headerActions}>
                        <button 
                            onClick={resetBuild}
                            className={styles.btnReset}
                        >
                            <RotateCcw className={styles.resetIcon} />
                            Reset
                        </button>
                    </div>
                </div>

                <div className={styles.mainGrid}>
                    <div className={styles.leftCol}>
                        <StatsAnalysis 
                            visibleStatFields={visibleStatFields}
                            heroStats={heroStats}
                            onStatChange={handleStatChange}
                            finalStats={finalStats}
                            formatValue={formatValue}
                        />
                    </div>

                    <div className={styles.rightCol}>
                        <EquipmentSection 
                            equippedItems={equippedItems}
                            onAction={handleItemAction}
                            onShowSelector={setShowItemSelector}
                            formatValue={formatValue}
                        />
                    </div>
                </div>
            </div>

            {showItemSelector && (
                <ItemSelectorModal 
                    slotKey={showItemSelector}
                    items={getAvailableItems(showItemSelector)}
                    onSelect={(w) => {
                        handleItemAction(showItemSelector, 'EQUIP', w)
                        setShowItemSelector(null)
                    }}
                    onClose={() => setShowItemSelector(null)}
                />
            )}
        </div>
    )
}
