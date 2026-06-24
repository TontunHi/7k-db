'use client'
import { Sword, Shield, Trash2, Plus } from 'lucide-react'
import { clsx } from 'clsx'
import SafeImage from '@/components/shared/SafeImage'
import { WEAPON_MAIN_STATS, ARMOR_MAIN_STATS, SUBSTATS, MIN_STATS_KEYS, getDedicatedStatIcon } from '../constants'
import styles from './SimulatorEditor.module.css'

export default function SimulatorEditor({ hero, build, setBuild, displaySkills, setActivePicker, showMobilePreview }) {
    const maxSkills = hero?.grade === 'a' ? 5 : 4

    return (
        <div className={clsx(
            styles.editor,
            showMobilePreview && styles.hiddenMobile
        )}>
            {/* Equipment Section */}
            <Section title="Equipment Slots">
                <div className={styles.equipmentGrid}>
                    <div className={styles.slotWrapper}>
                        <SlotBox label="Weapon 1" icon={<Sword size={12}/>} item={build.weapons[0]} onClick={() => setActivePicker({ type: 'weapon', index: 0 })} />
                        <select 
                            value={build.weapons[0].stat}
                            onChange={(e) => {
                                const newWp = build.weapons.map((w, i) => i === 0 ? { ...w, stat: e.target.value } : w);
                                setBuild(b => ({ ...b, weapons: newWp }));
                            }}
                            className={styles.select}
                        >
                            {WEAPON_MAIN_STATS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className={styles.slotWrapper}>
                        <SlotBox label="Armor 1" icon={<Shield size={12}/>} item={build.armors[0]} onClick={() => setActivePicker({ type: 'armor', index: 0 })} />
                        <select 
                            value={build.armors[0].stat}
                            onChange={(e) => {
                                const newAr = build.armors.map((a, i) => i === 0 ? { ...a, stat: e.target.value } : a);
                                setBuild(b => ({ ...b, armors: newAr }));
                            }}
                            className={styles.select}
                        >
                            {ARMOR_MAIN_STATS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className={styles.slotWrapper}>
                        <SlotBox label="Weapon 2" icon={<Sword size={12}/>} item={build.weapons[1]} onClick={() => setActivePicker({ type: 'weapon', index: 1 })} />
                        <select 
                            value={build.weapons[1].stat}
                            onChange={(e) => {
                                const newWp = build.weapons.map((w, i) => i === 1 ? { ...w, stat: e.target.value } : w);
                                setBuild(b => ({ ...b, weapons: newWp }));
                            }}
                            className={styles.select}
                        >
                            {WEAPON_MAIN_STATS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className={styles.slotWrapper}>
                        <SlotBox label="Armor 2" icon={<Shield size={12}/>} item={build.armors[1]} onClick={() => setActivePicker({ type: 'armor', index: 1 })} />
                        <select 
                            value={build.armors[1].stat}
                            onChange={(e) => {
                                const newAr = build.armors.map((a, i) => i === 1 ? { ...a, stat: e.target.value } : a);
                                setBuild(b => ({ ...b, armors: newAr }));
                            }}
                            className={styles.select}
                        >
                            {ARMOR_MAIN_STATS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </Section>
 
            {/* Accessory Section */}
            <Section title="Accessory Slots">
                <div className={styles.accessoryList}>
                    {build.accessories.map((acc, i) => (
                        <div key={i} className={styles.accessoryRow}>
                            <SlotBox 
                                label={`Slot ${i+1}`} 
                                item={acc.image ? { image: acc.image } : null} 
                                folder="accessory"
                                onClick={() => setActivePicker({ type: 'accessory', index: i, sub: 'image' })} 
                                className="w-16 h-16"
                            />
                            <div className={styles.refiningBox}>
                                <div className={styles.refiningContent}>
                                    {acc.refined ? (
                                         <div className={styles.refinedIcon}>
                                            <SafeImage src={`/items/accessory/${acc.refined}`} fill alt="" />
                                         </div>
                                    ) : (
                                        <div className={styles.emptyRefined}>No refining selected</div>
                                    )}
                                    <div className={styles.refiningActions}>
                                        <button 
                                            onClick={() => setActivePicker({ type: 'accessory', index: i, sub: 'refined' })} 
                                            className={styles.btnRefining}
                                        >
                                            {acc.refined ? 'Change' : 'Set Refining'}
                                        </button>
                                        {acc.refined && (
                                            <button 
                                                onClick={() => {
                                                    const newAcc = build.accessories.map((a, idx) => idx === i ? { ...a, refined: null } : a)
                                                    setBuild(b => ({ ...b, accessories: newAcc }))
                                                }}
                                                className={styles.btnRemove}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
 
            {/* Substats */}
            <Section title="Substats Priority">
                <div className={styles.substatsGrid}>
                    {SUBSTATS.map(stat => (
                        <button
                            key={stat}
                            onClick={() => {
                                setBuild(prev => {
                                    const active = prev.substats.includes(stat)
                                    if (active) return { ...prev, substats: prev.substats.filter(s => s !== stat) }
                                    if (prev.substats.length >= 6) return prev
                                    return { ...prev, substats: [...prev.substats, stat] }
                                })
                            }}
                            className={clsx(
                                styles.statButton,
                                build.substats.includes(stat) ? styles.statButtonActive : styles.statButtonInactive
                            )}
                        >
                            {build.substats.includes(stat) && (
                                <span className={styles.statOrder}>#{build.substats.indexOf(stat) + 1}</span>
                            )}
                            {stat}
                        </button>
                    ))}
                </div>
            </Section>
 
            {/* Skill Priority */}
            <Section title="Manual Skill Priority">
                <div className={styles.skillPriorityGrid}>
                    {displaySkills.map((s, i) => {
                        const isSelected = build.skillPriority.includes(s)
                        const order = isSelected ? build.skillPriority.indexOf(s) + 1 : null
                        return (
                            <div 
                                key={i} 
                                onClick={() => {
                                    setBuild(prev => {
                                        if (isSelected) {
                                            return { ...prev, skillPriority: prev.skillPriority.filter(x => x !== s) }
                                        } else {
                                            if (prev.skillPriority.length >= maxSkills) return prev
                                            return { ...prev, skillPriority: [...prev.skillPriority, s] }
                                        }
                                    })
                                }}
                                className={clsx(
                                    styles.skillSlot,
                                    isSelected ? styles.skillSlotActive : styles.skillSlotInactive
                                )}
                            >
                                <SafeImage src={`/skills/${s}`} fill className="object-cover" alt="" />
                                {isSelected && (
                                    <div className={styles.skillBadgeWrapper}>
                                        <div className={styles.skillBadge}>
                                            {order}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                <p className={styles.priorityNote}>Click skills to set priority (1-{maxSkills})</p>
            </Section>
 
            {/* Min Stats */}
            <Section title="Minimum Stats (Goals)">
                <div className={styles.minStatsList}>
                    {MIN_STATS_KEYS.map(s => (
                        <div key={s.key} className={styles.minStatRow}>
                            <div className={styles.statIconBox}>
                                <SafeImage src={s.icon} fill alt="" className="object-contain" />
                            </div>
                            <span className={styles.statLabel}>{s.label}</span>
                            <input 
                                type="text" 
                                value={build.minStats[s.key] || ""}
                                onChange={(e) => setBuild(b => ({ ...b, minStats: { ...b.minStats, [s.key]: e.target.value } }))}
                                className={styles.statInput}
                            />
                        </div>
                    ))}
                </div>
            </Section>

            {/* Dedicated Stats */}
            <Section title="Dedicated Stats">
                <div className="grid grid-cols-4 gap-3 mt-1">
                    {Array.from({ length: 4 }).map((_, i) => {
                        const stat = build.dedicatedStats?.[i]
                        const icon = stat ? getDedicatedStatIcon(stat) : null
                        return (
                            <div key={i} className="relative group/ded">
                                <button
                                    onClick={() => setActivePicker({ type: 'dedicated', index: i })}
                                    className={clsx(
                                        "w-full h-12 rounded-xl border flex flex-col items-center justify-center gap-1 relative overflow-hidden transition-all duration-300 cursor-pointer text-xs font-bold text-center px-1",
                                        stat
                                            ? "bg-black/50 border-white/20 hover:border-primary/50 hover:shadow-[0_0_10px_rgba(255,215,0,0.1)]"
                                            : "bg-black/20 border-white/10 border-dashed hover:border-primary/30 hover:bg-primary/5 text-gray-400"
                                    )}
                                >
                                    {stat ? (
                                        <>
                                            {icon && (
                                                <div className="w-4 h-4 relative flex-shrink-0 opacity-70 group-hover/ded:opacity-100 transition-opacity">
                                                    <SafeImage src={icon} fill alt="" className="object-contain" />
                                                </div>
                                            )}
                                            <span className="text-[8px] uppercase tracking-wider font-bold text-gray-300 group-hover/ded:text-primary transition-colors truncate max-w-full">{stat}</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-black text-gray-500 group-hover/ded:text-primary/60 transition-colors">+</span>
                                    )}
                                </button>
                                {stat && (
                                    <button
                                        onClick={() => {
                                            const newDeds = [...(build.dedicatedStats || [null, null, null, null])]
                                            newDeds[i] = null
                                            setBuild(b => ({ ...b, dedicatedStats: newDeds }))
                                        }}
                                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-950/80 border border-red-800 text-red-400 hover:bg-red-900 hover:text-white flex items-center justify-center text-[9px] font-black transition-all z-20"
                                        title="Clear stat"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>
            </Section>


            {/* Progression */}
            <Section title="Hero Progression">
                <div className={styles.progressionBox}>
                    <div className={styles.progressionRow}>
                        <span className={styles.progressionLabel}>C - Level</span>
                        <select 
                            value={build.cLevel}
                            onChange={(e) => setBuild(b => ({ ...b, cLevel: e.target.value }))}
                            className={styles.progressionSelect}
                        >
                            <option value="None">None</option>
                            {[...Array(6)].map((_, i) => (
                                <option key={i+1} value={`C${i+1}`}>C{i+1}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Section>
        </div>
    )
}

function Section({ title, children }) {
    return (
        <div className={styles.section}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionAccent} />
                <h3 className={styles.sectionTitle}>{title}</h3>
            </div>
            {children}
        </div>
    )
}

function SlotBox({ label, icon, item, folder = "weapon", onClick, className = "" }: any) {
    const isAcc = folder === 'accessory'
    const imgFolder = isAcc ? 'accessory' : (label.includes('Weapon') ? 'weapon' : 'armor')

    return (
        <div onClick={onClick} className={clsx(
            "group relative cursor-pointer border-2 border-dashed border-white/10 hover:border-primary/50 rounded-2xl transition-all aspect-square flex flex-col items-center justify-center overflow-hidden bg-black/20",
            item?.image && "border-solid border-white/20",
            className
        )}>
            {item?.image ? (
                <>
                    <SafeImage src={`/items/${imgFolder}/${item.image}`} fill className="object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <Plus className="w-6 h-6 text-white" />
                    </div>
                </>
            ) : (
                <>
                    <div className="p-3 bg-white/5 rounded-full mb-1 group-hover:scale-110 transition-transform">
                        {icon || <Plus size={16} className="text-gray-600" />}
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{label}</span>
                </>
            )}
        </div>
    )
}
