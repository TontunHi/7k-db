'use client'
import { Plus, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import SafeImage from '@/components/shared/SafeImage'
import { WEAPON_MAIN_STATS, ARMOR_MAIN_STATS, SUBSTAT_LIST } from '../constants'
import styles from './EquipmentSection.module.css'

export default function EquipmentSection({ equippedItems, onAction, onShowSelector, formatValue }) {
    const slots = ['Weapon1', 'Armor1', 'Weapon2', 'Armor2']

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slots.map((slotKey) => (
                <div key={slotKey} className={styles.slotCard}>
                    <div className={styles.slotHeader}>
                        <span className={styles.slotTypeBadge}>
                            {slotKey.replace(/\d+$/, '')}
                        </span>
                        {equippedItems[slotKey].item && (
                            <button 
                                onClick={() => onAction(slotKey, 'CLEAR')}
                                className={styles.btnClear}
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    <div 
                        onClick={() => onShowSelector(slotKey)}
                        className={clsx(
                            styles.dropZone,
                            equippedItems[slotKey].item && styles.dropZoneFilled
                        )}
                    >
                        {equippedItems[slotKey].item ? (
                            <div className={styles.filledContent}>
                                <div className={styles.itemInfoRow}>
                                    <div className={styles.itemPortrait}>
                                        <SafeImage src={equippedItems[slotKey].item.image} fill className="object-cover" alt="" />
                                    </div>
                                    
                                    <div className={styles.itemNameGroup}>
                                        <h4 className={styles.itemName}>
                                            {equippedItems[slotKey].item.name}
                                        </h4>
                                        
                                        <div className={styles.baseStatBadges}>
                                            {equippedItems[slotKey].item.item_type === 'Weapon' ? (
                                                <div className={styles.baseStatBadgeWeapon}>
                                                    <div className={styles.statIconMini}>
                                                        <SafeImage src="/about_website/icon_physical_attack.webp" fill className="object-contain" alt="" />
                                                    </div>
                                                    <span className={clsx(styles.statTextMini, styles.statTextAtk)}>ATTACK +304</span>
                                                </div>
                                            ) : (
                                                <div className={styles.baseStatBadgeArmor}>
                                                    <div className={styles.armorStatPart}>
                                                        <div className={styles.statIconMini}>
                                                            <SafeImage src="/about_website/icon_hp.webp" fill className="object-contain" alt="" />
                                                        </div>
                                                        <span className={clsx(styles.statTextMini, styles.statTextHp)}>HP +1079</span>
                                                    </div>
                                                    <div className={styles.armorStatPart}>
                                                        <div className={styles.statIconMini}>
                                                            <SafeImage src="/about_website/icon_defense.webp" fill className="object-contain" alt="" />
                                                        </div>
                                                        <span className={clsx(styles.statTextMini, styles.statTextDef)}>DEF +189</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.mainStatSection}>
                                    <div className={styles.mainStatHeader}>
                                        <p className={styles.mainStatLabel}>Additional Main Stat</p>
                                        {(() => {
                                            const statOptions = slotKey.startsWith('Weapon') ? WEAPON_MAIN_STATS : ARMOR_MAIN_STATS
                                            const currentStat = statOptions.find(s => s.key === equippedItems[slotKey].mainStatKey)
                                            return currentStat && (
                                                <div className={styles.mainStatIconSmall}>
                                                    <SafeImage src={currentStat.icon} fill className="object-contain" alt="" />
                                                </div>
                                            )
                                        })()}
                                    </div>
                                    <div className={styles.selectWrapper}>
                                        <select 
                                            value={equippedItems[slotKey].mainStatKey || ""}
                                            onChange={(e) => onAction(slotKey, 'SET_MAIN_STAT', { key: e.target.value })}
                                            onClick={(e) => e.stopPropagation()}
                                            className={styles.selectMainStat}
                                        >
                                            {(slotKey.startsWith('Weapon') ? WEAPON_MAIN_STATS : ARMOR_MAIN_STATS).map(s => (
                                                <option key={s.key} value={s.key} className="bg-[#0a0a0a] text-white">
                                                    {s.label} (+{formatValue(s.value)}{s.unit})
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronRight size={14} className={styles.chevronDown} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.emptyContent}>
                                <div className={styles.plusIconWrapper}>
                                    <Plus className={styles.plusIcon} />
                                </div>
                                <span className={styles.equipLabel}>Equip Item</span>
                            </div>
                        )}
                    </div>

                    {equippedItems[slotKey].item && (
                        <div className={styles.substatsSection}>
                            {equippedItems[slotKey].substats.map((sub, idx) => {
                                const currentStat = SUBSTAT_LIST.find(s => s.key === sub.key)
                                const totalLevels = equippedItems[slotKey].substats.reduce((sum, s) => sum + (s.level || 0), 0)
                                const isAllSelected = equippedItems[slotKey].substats.every(s => s.key !== null)
                                
                                return (
                                    <div key={idx} className={styles.substatRow}>
                                        <div className={styles.substatSelectWrapper}>
                                            <select
                                                value={sub.key || ''}
                                                onChange={(e) => onAction(slotKey, 'SUBSTAT_KEY', { index: idx, key: e.target.value })}
                                                className={styles.selectSubstat}
                                            >
                                                <option value="">Choose Stat...</option>
                                                {SUBSTAT_LIST.map(f => {
                                                    const isUsed = equippedItems[slotKey].substats.some((s, sIdx) => sIdx !== idx && s.key === f.key)
                                                    return <option key={f.key} value={f.key} disabled={isUsed}>{f.label}</option>
                                                })}
                                            </select>
                                            <ChevronRight size={10} className={styles.chevronDown} />
                                        </div>
                                        
                                        {sub.key && (
                                            <div className={styles.levelControl}>
                                                <div className={styles.statValue}>
                                                    {currentStat ? currentStat.values[sub.level || 0] : 0}
                                                    {sub.key.includes('_perc') || sub.key.includes('rate') || sub.key.includes('dmg') || sub.key.includes('hit') || sub.key.includes('res') ? '%' : ''}
                                                </div>
                                                
                                                <div className={styles.levelButtons}>
                                                    <button 
                                                        onClick={() => onAction(slotKey, 'LEVEL_DOWN', { index: idx })}
                                                        disabled={!isAllSelected || sub.level <= 0}
                                                        className={styles.btnLevel}
                                                    >
                                                        -
                                                    </button>
                                                    <span className={styles.levelNumber}>
                                                        {sub.level || 0}
                                                    </span>
                                                    <button 
                                                        onClick={() => onAction(slotKey, 'LEVEL_UP', { index: idx })}
                                                        disabled={!isAllSelected || totalLevels >= 5 || sub.level >= (currentStat?.values.length - 1)}
                                                        className={styles.btnLevel}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                            {!equippedItems[slotKey].substats.every(s => s.key !== null) && (
                                <div className={styles.unlockNote}>
                                    Select all 4 stats to unlock levels
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
