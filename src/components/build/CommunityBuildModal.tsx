'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
    X, 
    Sparkles, 
    Plus, 
    Send, 
    Shield, 
    Sword, 
    Gem, 
    User, 
    MessageSquare, 
    Check, 
    Search,
    RefreshCw,
    Flame,
    Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { type HeroListItem } from '@/lib/hero-actions'
import { getBuildSubmissionFormAssets, submitCommunityBuild } from '@/lib/community-build-actions'
import SafeImage from '@/components/shared/SafeImage'
import { 
    MIN_STATS_KEYS, 
    AVAILABLE_SUBSTATS, 
    DEDICATED_STATS_OPTIONS, 
    WEAPON_MAIN_STATS, 
    ARMOR_MAIN_STATS, 
    ACCESSORY_MAIN_STATS, 
    getDedicatedStatIcon, 
    EMPTY_DEDICATED_STATS,
    DedicatedStatsArray
} from '@/lib/constants/stats'
import styles from './CommunityBuildModal.module.css'

interface CommunityBuildModalProps {
    preselectedHero?: HeroListItem | null
    onClose: () => void
}

const TRANSCENDENCE_LEVELS = ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6']

const MODES = [
    'PVP / Arena', 'Guild War', 'Castle Rush', 'Advent Expedition', 'Raid', 'Total War', 'General PvE'
]

function isPhysicalItem(filename: string): boolean {
    const lower = filename.toLowerCase()
    return (
        lower.includes('slayer') || 
        lower.includes('sword') || 
        lower.includes('flail') || 
        lower.includes('scale') ||
        lower.includes('ox_king') ||
        lower.includes('assassin') ||
        lower.includes('paladin') ||
        lower.includes('vanguard') ||
        lower.includes('gatekeeper') ||
        lower.includes('guardian') ||
        lower.includes('bounty_tracker') ||
        lower.includes('phys')
    )
}

function isMagicItem(filename: string): boolean {
    const lower = filename.toLowerCase()
    return (
        lower.includes('orb') || 
        lower.includes('staff') || 
        lower.includes('scripture') || 
        lower.includes('hydra') ||
        lower.includes('avenger') ||
        lower.includes('orchestrator') ||
        lower.includes('spellweaver') ||
        lower.includes('magic')
    )
}

export default function CommunityBuildModal({ preselectedHero, onClose }: CommunityBuildModalProps) {
    const [loadingAssets, setLoadingAssets] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [assets, setAssets] = useState<{
        heroes: HeroListItem[]
        weapons: Array<{ image: string; name: string; weapon_group: string }>
        armors: string[]
        accessories: string[]
    }>({ heroes: [], weapons: [], armors: [], accessories: [] })

    // Form State
    const [selectedHeroFilename, setSelectedHeroFilename] = useState<string>(
        preselectedHero ? preselectedHero.filename : ''
    )
    const [authorName, setAuthorName] = useState('')
    const [authorContact, setAuthorContact] = useState('')
    const [cLevel, setCLevel] = useState('C0')
    const [selectedModes, setSelectedModes] = useState<string[]>(['PVP / Arena'])
    
    const [weapons, setWeapons] = useState<Array<{ image: string; stat: string }>>([
        { image: '', stat: WEAPON_MAIN_STATS[0] },
        { image: '', stat: WEAPON_MAIN_STATS[0] }
    ])
    const [armors, setArmors] = useState<Array<{ image: string; stat: string }>>([
        { image: '', stat: ARMOR_MAIN_STATS[0] },
        { image: '', stat: ARMOR_MAIN_STATS[0] }
    ])
    const [accessories, setAccessories] = useState<Array<{ image: string; refined: string }>>([
        { image: '', refined: '' },
        { image: '', refined: '' },
        { image: '', refined: '' }
    ])
    const [substats, setSubstats] = useState<string[]>([])
    const [minStats, setMinStats] = useState<Record<string, string>>({})
    const [dedicatedStats, setDedicatedStats] = useState<DedicatedStatsArray>(EMPTY_DEDICATED_STATS)
    const [notes, setNotes] = useState('')

    const updateMinStat = (key: string, value: string) => {
        setMinStats(prev => ({ ...prev, [key]: value }))
    }

    // Dedicated Stat Picker Sub-Modal State
    const [dedicatedPickerSlot, setDedicatedPickerSlot] = useState<number | null>(null)

    // Hero Visual Picker Sub-Modal State
    const [heroPickerOpen, setHeroPickerOpen] = useState(false)
    const [heroSearch, setHeroSearch] = useState('')
    const [heroGradeFilter, setHeroGradeFilter] = useState('ALL')

    // Item Picker Sub-Modal State
    const [pickerTarget, setPickerTarget] = useState<{
        type: 'weapon' | 'armor' | 'accessory' | 'refining'
        index: number
    } | null>(null)
    const [itemSearch, setItemSearch] = useState('')
    const [itemTypeFilter, setItemTypeFilter] = useState<'ALL' | 'PHYSICAL' | 'MAGIC'>('ALL')

    useEffect(() => {
        async function load() {
            try {
                const data = await getBuildSubmissionFormAssets()
                setAssets(data)
                if (!selectedHeroFilename && data.heroes.length > 0) {
                    setSelectedHeroFilename(data.heroes[0].filename)
                }
            } catch (err) {
                console.error('Failed to load assets:', err)
            } finally {
                setLoadingAssets(false)
            }
        }
        load()
    }, [selectedHeroFilename])

    const selectedHeroObj = assets.heroes.find(
        h => h.filename === selectedHeroFilename || h.slug === selectedHeroFilename
    )

    const heroGroupRaw = (selectedHeroObj?.hero_group || selectedHeroObj?.type || '').toLowerCase()
    const isHeroMagic = heroGroupRaw.includes('magic')
    const heroDisplayGroup = isHeroMagic ? 'Magic' : 'Physical'

    const filteredHeroes = assets.heroes.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(heroSearch.toLowerCase())
        const heroGradeLower = (h.grade || '').toLowerCase()
        const filterGradeLower = heroGradeFilter.toLowerCase()

        let matchesGrade = false
        if (heroGradeFilter === 'ALL') {
            matchesGrade = true
        } else if (heroGradeFilter === 'AWAKE') {
            matchesGrade = heroGradeLower === 'a' || heroGradeLower === 'awake' || heroGradeLower.startsWith('a')
        } else {
            matchesGrade = heroGradeLower === filterGradeLower
        }

        return matchesSearch && matchesGrade
    })

    const handleSelectGear = (imageFile: string) => {
        if (!pickerTarget) return
        const { type, index } = pickerTarget

        if (type === 'weapon') {
            const next = [...weapons]
            next[index] = { ...next[index], image: imageFile }
            setWeapons(next)
        } else if (type === 'armor') {
            const next = [...armors]
            next[index] = { ...next[index], image: imageFile }
            setArmors(next)
        } else if (type === 'accessory') {
            const next = [...accessories]
            next[index] = { ...next[index], image: imageFile }
            setAccessories(next)
        } else if (type === 'refining') {
            const next = [...accessories]
            next[index] = { ...next[index], refined: imageFile }
            setAccessories(next)
        }
        setPickerTarget(null)
        setItemSearch('')
    }

    const updateDedicatedStat = (slotIndex: number, value: string | null) => {
        const next = [...dedicatedStats] as DedicatedStatsArray
        next[slotIndex] = value
        setDedicatedStats(next)
    }

    const toggleSubstat = (stat: string) => {
        if (substats.includes(stat)) {
            setSubstats(substats.filter(s => s !== stat))
        } else {
            setSubstats([...substats, stat])
        }
    }

    const toggleMode = (mode: string) => {
        if (selectedModes.includes(mode)) {
            if (selectedModes.length > 1) {
                setSelectedModes(selectedModes.filter(m => m !== mode))
            }
        } else {
            setSelectedModes([...selectedModes, mode])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedHeroFilename) {
            toast.error('Please select a hero')
            return
        }
        if (!authorName.trim()) {
            toast.error('Please enter your name or In-Game Name for Author Credit')
            return
        }

        setSubmitting(true)
        toast.loading('Submitting your hero build to moderation queue...')

        try {
            const validWeapons = weapons.filter(w => w.image)
            const validArmors = armors.filter(a => a.image)
            const validAccessories = accessories.filter(a => a.image)

            const res = await submitCommunityBuild({
                hero_filename: selectedHeroFilename,
                author_name: authorName.trim(),
                author_contact: authorContact.trim() || null,
                c_level: cLevel,
                modes: selectedModes,
                weapons: validWeapons,
                armors: validArmors,
                accessories: validAccessories,
                substats: substats,
                min_stats: minStats,
                dedicated_stats: dedicatedStats,
                note: notes.trim() || null
            })

            toast.dismiss()
            if (res.success) {
                toast.success('Thank you! Your build has been submitted for review. 🎉')
                onClose()
            } else {
                toast.error(res.error || 'Failed to submit build')
            }
        } catch (err: any) {
            toast.dismiss()
            console.error('Submission error:', err)
            toast.error(err.message || 'An error occurred during submission')
        } finally {
            setSubmitting(false)
        }
    }

    const weaponImages = assets.weapons
        .filter(w => {
            const wGroup = (w.weapon_group || '').toLowerCase()
            if (isHeroMagic) {
                return wGroup.includes('magic')
            } else {
                return wGroup.includes('physical') || !wGroup.includes('magic')
            }
        })
        .map(w => w.image)

    const currentPickerItems = pickerTarget
        ? (pickerTarget.type === 'weapon'
            ? weaponImages
            : pickerTarget.type === 'armor'
            ? assets.armors
            : assets.accessories)
        : []

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* Top Gold Accent Line */}
                <div className={styles.topAccentLine} />

                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.titleMarker} />
                        <div>
                            <h2 className={styles.title}>
                                Suggest a <span className={styles.goldText}>Community Build</span>
                            </h2>
                            <p className={styles.subtitle}>
                                Share your hero gear setup. Approved builds will proudly display your author credit!
                            </p>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className={styles.closeButton}>
                        <X size={16} />
                    </button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className={styles.body}>
                    {/* 1. Hero Identity & Author Credit Card */}
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>
                                <div className={styles.sectionTitleDot} />
                                Hero Profile &amp; Author Attribution
                            </span>
                        </div>

                        <div className={styles.heroProfileBlock}>
                            {/* Clickable Hero Portrait Card (Visual Image Selector) */}
                            <div 
                                onClick={() => !preselectedHero && setHeroPickerOpen(true)}
                                className={`flex items-center gap-3.5 p-3 rounded-2xl bg-black/60 border border-amber-400/30 hover:border-amber-400/80 transition-all ${
                                    !preselectedHero ? 'cursor-pointer hover:bg-amber-400/5 group' : ''
                                }`}
                                title={!preselectedHero ? "Click to change hero from visual list" : undefined}
                            >
                                <div className={styles.heroPortraitFrame}>
                                    {selectedHeroObj ? (
                                        <SafeImage
                                            src={`/heroes/${selectedHeroObj.filename}`}
                                            alt={selectedHeroObj.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                            sizes="80px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                                            Hero
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col pr-2">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                                        Selected Hero
                                    </span>
                                    <span className="text-sm font-black text-white group-hover:text-amber-300 transition-colors">
                                        {selectedHeroObj?.name || "Choose Hero"}
                                    </span>
                                    {!preselectedHero && (
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-[10px] font-bold text-amber-300 underline flex items-center gap-1">
                                                <RefreshCw size={10} className="group-hover:rotate-180 transition-transform duration-500" />
                                                Change Hero
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Author Credit & Level Inputs */}
                            <div className={styles.heroSelectGroup}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Author Credit (IGN / Discord) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={authorName}
                                        onChange={(e) => setAuthorName(e.target.value)}
                                        placeholder="Your Name or In-Game Name"
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Discord / Contact (Optional)</label>
                                    <input
                                        type="text"
                                        value={authorContact}
                                        onChange={(e) => setAuthorContact(e.target.value)}
                                        placeholder="@discord_tag or Guild Name"
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={styles.inputLabel}>Transcendence Level</label>
                                    <select
                                        value={cLevel}
                                        onChange={(e) => setCLevel(e.target.value)}
                                        className={styles.select}
                                    >
                                        {TRANSCENDENCE_LEVELS.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Modes */}
                        <div className="flex flex-col gap-1.5 pt-2 border-t border-white/5">
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                                Target Game Modes
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                                {MODES.map(m => {
                                    const isSelected = selectedModes.includes(m)
                                    return (
                                        <button
                                            key={m}
                                            type="button"
                                            onClick={() => toggleMode(m)}
                                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                                                isSelected 
                                                    ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-sm' 
                                                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                                            }`}
                                        >
                                            {m}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* 2. Combat Equipment (Weapons & Armors) */}
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>
                                <div className={styles.sectionTitleDot} />
                                Combat Equipment (Weapons &amp; Armor)
                            </span>
                        </div>

                        <div className={styles.combatGrid}>
                            {/* Weapon 1 */}
                            <div className={styles.itemSlotCard}>
                                <span className="text-[10px] font-black text-amber-400 uppercase">Weapon 1</span>
                                <div
                                    onClick={() => setPickerTarget({ type: 'weapon', index: 0 })}
                                    className={`${styles.itemPreviewBox} ${weapons[0].image ? styles.itemPreviewBoxFilled : ''}`}
                                >
                                    {weapons[0].image ? (
                                        <>
                                            <SafeImage src={`/items/weapon/${weapons[0].image}`} alt="W1" fill className="object-contain p-2" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); const w = [...weapons]; w[0].image = ''; setWeapons(w); }}
                                                className={styles.removeItemBtn}
                                            >
                                                <X size={10} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-zinc-500">
                                            <Plus size={16} />
                                            <span className="text-[10px]">Select Weapon</span>
                                        </div>
                                    )}
                                </div>
                                <select
                                    value={weapons[0].stat}
                                    onChange={(e) => {
                                        const w = [...weapons]
                                        w[0].stat = e.target.value
                                        setWeapons(w)
                                    }}
                                    className={styles.select}
                                >
                                    {WEAPON_MAIN_STATS.map(st => (
                                        <option key={st} value={st}>{st}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Weapon 2 */}
                            <div className={styles.itemSlotCard}>
                                <span className="text-[10px] font-black text-amber-400 uppercase">Weapon 2</span>
                                <div
                                    onClick={() => setPickerTarget({ type: 'weapon', index: 1 })}
                                    className={`${styles.itemPreviewBox} ${weapons[1].image ? styles.itemPreviewBoxFilled : ''}`}
                                >
                                    {weapons[1].image ? (
                                        <>
                                            <SafeImage src={`/items/weapon/${weapons[1].image}`} alt="W2" fill className="object-contain p-2" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); const w = [...weapons]; w[1].image = ''; setWeapons(w); }}
                                                className={styles.removeItemBtn}
                                            >
                                                <X size={10} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-zinc-500">
                                            <Plus size={16} />
                                            <span className="text-[10px]">Select Weapon</span>
                                        </div>
                                    )}
                                </div>
                                <select
                                    value={weapons[1].stat}
                                    onChange={(e) => {
                                        const w = [...weapons]
                                        w[1].stat = e.target.value
                                        setWeapons(w)
                                    }}
                                    className={styles.select}
                                >
                                    {WEAPON_MAIN_STATS.map(st => (
                                        <option key={st} value={st}>{st}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Armor 1 */}
                            <div className={styles.itemSlotCard}>
                                <span className="text-[10px] font-black text-sky-400 uppercase">Armor 1</span>
                                <div
                                    onClick={() => setPickerTarget({ type: 'armor', index: 0 })}
                                    className={`${styles.itemPreviewBox} ${armors[0].image ? styles.itemPreviewBoxFilled : ''}`}
                                >
                                    {armors[0].image ? (
                                        <>
                                            <SafeImage src={`/items/armor/${armors[0].image}`} alt="A1" fill className="object-contain p-2" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); const a = [...armors]; a[0].image = ''; setArmors(a); }}
                                                className={styles.removeItemBtn}
                                            >
                                                <X size={10} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-zinc-500">
                                            <Plus size={16} />
                                            <span className="text-[10px]">Select Armor</span>
                                        </div>
                                    )}
                                </div>
                                <select
                                    value={armors[0].stat}
                                    onChange={(e) => {
                                        const a = [...armors]
                                        a[0].stat = e.target.value
                                        setArmors(a)
                                    }}
                                    className={styles.select}
                                >
                                    {ARMOR_MAIN_STATS.map(st => (
                                        <option key={st} value={st}>{st}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Armor 2 */}
                            <div className={styles.itemSlotCard}>
                                <span className="text-[10px] font-black text-sky-400 uppercase">Armor 2</span>
                                <div
                                    onClick={() => setPickerTarget({ type: 'armor', index: 1 })}
                                    className={`${styles.itemPreviewBox} ${armors[1].image ? styles.itemPreviewBoxFilled : ''}`}
                                >
                                    {armors[1].image ? (
                                        <>
                                            <SafeImage src={`/items/armor/${armors[1].image}`} alt="A2" fill className="object-contain p-2" />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); const a = [...armors]; a[1].image = ''; setArmors(a); }}
                                                className={styles.removeItemBtn}
                                            >
                                                <X size={10} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1 text-zinc-500">
                                            <Plus size={16} />
                                            <span className="text-[10px]">Select Armor</span>
                                        </div>
                                    )}
                                </div>
                                <select
                                    value={armors[1].stat}
                                    onChange={(e) => {
                                        const a = [...armors]
                                        a[1].stat = e.target.value
                                        setArmors(a)
                                    }}
                                    className={styles.select}
                                >
                                    {ARMOR_MAIN_STATS.map(st => (
                                        <option key={st} value={st}>{st}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 3. Accessories & Refining */}
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>
                                <div className={styles.sectionTitleDot} />
                                Accessories &amp; Dual Refining
                            </span>
                        </div>

                        <div className={styles.accessoriesRow}>
                            {accessories.map((acc, idx) => (
                                <div key={idx} className={styles.accSlotCard}>
                                    {/* Main Accessory */}
                                    <div
                                        onClick={() => setPickerTarget({ type: 'accessory', index: idx })}
                                        className={`${styles.accMainBox} ${acc.image ? styles.itemPreviewBoxFilled : ''}`}
                                    >
                                        {acc.image ? (
                                            <>
                                                <SafeImage src={`/items/accessory/${acc.image}`} alt="Acc" fill className="object-contain p-2" />
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); const a = [...accessories]; a[idx].image = ''; setAccessories(a); }}
                                                    className={styles.removeItemBtn}
                                                >
                                                    <X size={10} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-zinc-500">
                                                <Plus size={14} />
                                                <span className="text-[9px]">Acc {idx + 1}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Refining Slot */}
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-black text-amber-400 uppercase">Refining</span>
                                        <div
                                            onClick={() => setPickerTarget({ type: 'refining', index: idx })}
                                            className={`${styles.refineBox} ${acc.refined ? styles.itemPreviewBoxFilled : ''}`}
                                        >
                                            {acc.refined ? (
                                                <>
                                                    <SafeImage src={`/items/accessory/${acc.refined}`} alt="Ref" fill className="object-contain p-1" />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); const a = [...accessories]; a[idx].refined = ''; setAccessories(a); }}
                                                        className={styles.removeItemBtn}
                                                    >
                                                        <X size={8} />
                                                    </button>
                                                </>
                                            ) : (
                                                <Plus size={12} className="text-amber-400/60" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 4. Minimum Target Stats */}
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>
                                <div className={styles.sectionTitleDot} />
                                Minimum Target Stats (Recommended Thresholds)
                            </span>
                        </div>

                        <div className={styles.minStatGrid}>
                            {MIN_STATS_KEYS.map(({ key, label, icon }) => (
                                <div key={key} className={styles.minStatCard}>
                                    <div className={styles.minStatHeader}>
                                        <div className={styles.minStatIcon}>
                                            <SafeImage src={icon} fill alt="" className="object-contain" />
                                        </div>
                                        <label className={styles.minStatLabel}>
                                            {key === 'physAtk' ? (isHeroMagic ? 'Magic Attack' : 'Physical Attack') : label}
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={minStats[key] || ''}
                                        onChange={(e) => updateMinStat(key, e.target.value)}
                                        className={styles.minStatInput}
                                        placeholder="—"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5. Priority Substats */}
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>
                                <div className={styles.sectionTitleDot} />
                                Priority Substats
                            </span>
                        </div>

                        <div className={styles.substatGrid}>
                            {AVAILABLE_SUBSTATS.map(stat => {
                                const isSelected = substats.includes(stat)
                                return (
                                    <button
                                        key={stat}
                                        type="button"
                                        onClick={() => toggleSubstat(stat)}
                                        className={`${styles.substatPill} ${isSelected ? styles.substatPillActive : ''}`}
                                    >
                                        {stat}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* 5. Dedicated Stats (Primary 4 slots + Secondary 4 slots) */}
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>
                                <div className={styles.sectionTitleDot} />
                                Dedicated Stats (Primary &amp; Secondary)
                            </span>
                        </div>

                        {/* Primary Dedicated Stats (Slots 0-3) */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">
                                Primary Dedicated Stats
                            </span>
                            <div className={styles.dedicatedStatsGrid}>
                                {Array.from({ length: 4 }).map((_, i) => {
                                    const stat = dedicatedStats[i]
                                    const icon = getDedicatedStatIcon(stat)

                                    return (
                                        <div key={i} className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setDedicatedPickerSlot(i)}
                                                className={`${styles.dedicatedSlotBtn} ${stat ? styles.dedicatedSlotBtnFilled : ''}`}
                                            >
                                                {stat ? (
                                                    <>
                                                        {icon && (
                                                            <div className="relative w-4 h-4 flex-shrink-0">
                                                                <SafeImage src={icon} alt="" fill className="object-contain" />
                                                            </div>
                                                        )}
                                                        <span className={styles.dedicatedSlotText}>{stat}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-zinc-500 text-xs font-bold">+ Dedicated #{i + 1}</span>
                                                )}
                                            </button>
                                            {stat && (
                                                <button
                                                    type="button"
                                                    onClick={() => updateDedicatedStat(i, null)}
                                                    className={styles.clearDedBtn}
                                                    title="Clear stat"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Secondary Dedicated Stats (Slots 4-7) */}
                        <div className="space-y-2 pt-3 border-t border-white/5">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">
                                Secondary Dedicated Stats
                            </span>
                            <div className={styles.dedicatedStatsGrid}>
                                {Array.from({ length: 4 }).map((_, i) => {
                                    const slotIndex = i + 4
                                    const stat = dedicatedStats[slotIndex]
                                    const icon = getDedicatedStatIcon(stat)

                                    return (
                                        <div key={slotIndex} className="relative">
                                            <button
                                                type="button"
                                                onClick={() => setDedicatedPickerSlot(slotIndex)}
                                                className={`${styles.dedicatedSlotBtn} ${stat ? styles.dedicatedSlotBtnFilled : ''}`}
                                            >
                                                {stat ? (
                                                    <>
                                                        {icon && (
                                                            <div className="relative w-4 h-4 flex-shrink-0">
                                                                <SafeImage src={icon} alt="" fill className="object-contain" />
                                                            </div>
                                                        )}
                                                        <span className={styles.dedicatedSlotText}>{stat}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-zinc-500 text-xs font-bold">+ Dedicated #{i + 5}</span>
                                                )}
                                            </button>
                                            {stat && (
                                                <button
                                                    type="button"
                                                    onClick={() => updateDedicatedStat(slotIndex, null)}
                                                    className={styles.clearDedBtn}
                                                    title="Clear stat"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* 6. Tactical Notes */}
                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>
                                <div className={styles.sectionTitleDot} />
                                Tactical Notes &amp; Strategy Guide
                            </span>
                        </div>

                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Explain key stat thresholds (e.g. Aim for 80% Crit Rate, Speed +300), turn order synergies, or weapon/armor rationales..."
                            className={styles.textarea}
                        />
                    </div>

                    {/* Footer */}
                    <div className={styles.footer}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting} className={styles.submitBtn}>
                            <Send size={14} />
                            <span>{submitting ? 'Submitting...' : 'Submit Build'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Dedicated Stat Picker Modal */}
            {dedicatedPickerSlot !== null && (
                <div className="fixed inset-0 z-[10001] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#0f1422] border border-amber-400/40 rounded-2xl w-full max-w-md flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                            <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                                Select Dedicated Stat
                            </h4>
                            <button
                                type="button"
                                onClick={() => setDedicatedPickerSlot(null)}
                                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-zinc-400 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                        </div>
                        <div className="p-4 grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
                            {DEDICATED_STATS_OPTIONS.map(opt => {
                                const icon = getDedicatedStatIcon(opt)
                                return (
                                    <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                            updateDedicatedStat(dedicatedPickerSlot, opt)
                                            setDedicatedPickerSlot(null)
                                        }}
                                        className="p-3 rounded-xl bg-white/5 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/60 flex items-center gap-3 text-left transition-all group"
                                    >
                                        {icon && (
                                            <div className="relative w-6 h-6 flex-shrink-0">
                                                <SafeImage src={icon} alt="" fill className="object-contain" />
                                            </div>
                                        )}
                                        <span className="text-xs font-bold text-white group-hover:text-amber-300">
                                            {opt}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Visual Hero Picker Modal (Exact Admin HeroCard Style - Clean No Grade & No Overlap) */}
            {heroPickerOpen && (
                <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
                    <div className="bg-[#0f1422] border border-amber-400/40 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40 flex-shrink-0">
                            <h4 className="text-sm sm:text-base font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                                <Shield size={18} className="text-amber-400" />
                                Select Hero
                            </h4>
                            <button
                                type="button"
                                onClick={() => { setHeroPickerOpen(false); setHeroSearch(''); }}
                                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 flex items-center justify-center text-zinc-400 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Search & Grade Filter Controls (Admin Layout) */}
                        <div className="p-4 bg-black/60 border-b border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between flex-shrink-0">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                                <input
                                    type="text"
                                    value={heroSearch}
                                    onChange={(e) => setHeroSearch(e.target.value)}
                                    placeholder="Search hero by name..."
                                    className="w-full bg-black/90 border border-white/15 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
                                />
                            </div>

                            {/* Grade Filter Pills */}
                            <div className="flex items-center gap-1 bg-black/80 p-1 rounded-xl border border-white/10 overflow-x-auto">
                                {['ALL', 'AWAKE', 'L++', 'L+', 'L', 'R'].map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setHeroGradeFilter(g)}
                                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase transition-all ${
                                            heroGradeFilter === g 
                                                ? 'bg-amber-400 text-black shadow-sm' 
                                                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hero Image Grid */}
                        <div className={styles.pickerHeroGrid}>
                            {filteredHeroes.map(h => {
                                const isSelected = selectedHeroFilename === h.filename

                                return (
                                    <div
                                        key={h.filename}
                                        onClick={() => {
                                            setSelectedHeroFilename(h.filename);
                                            setHeroPickerOpen(false);
                                            setHeroSearch('');
                                        }}
                                        className={`${styles.pickerHeroCard} ${isSelected ? styles.pickerHeroCardActive : ''}`}
                                        title={h.name}
                                    >
                                        {/* Hero Full Portrait */}
                                        <div className={styles.pickerHeroImageWrapper}>
                                            <SafeImage
                                                src={`/heroes/${h.filename}`}
                                                alt={h.name}
                                                fill
                                                className={styles.pickerHeroImage}
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                                            />
                                        </div>

                                        {/* Hover Overlay with Select Action */}
                                        <div className={styles.pickerHeroHoverOverlay}>
                                            <div className={styles.pickerHeroSelectPill}>
                                                <Check size={13} className="text-amber-400" />
                                                <span>SELECT</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Item Selector Modal */}
            {pickerTarget && (
                <div className="fixed inset-0 z-[10000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#0f1422] border border-amber-400/40 rounded-2xl w-full max-w-xl max-h-[82vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40 flex-shrink-0">
                            <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                                Select {pickerTarget.type}
                            </h4>
                            <button
                                type="button"
                                onClick={() => setPickerTarget(null)}
                                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-zinc-400 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Grid */}
                        <div className="p-4 sm:p-5 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {currentPickerItems.map(item => (
                                <button
                                    key={item}
                                    type="button"
                                    onClick={() => handleSelectGear(item)}
                                    className="p-2.5 rounded-xl bg-white/5 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/60 flex flex-col items-center gap-2 transition-all group"
                                >
                                    <div className="relative w-14 h-14">
                                        <SafeImage
                                            src={`/items/${pickerTarget.type === 'refining' ? 'accessory' : pickerTarget.type}/${item}`}
                                            alt={item}
                                            fill
                                            className="object-contain group-hover:scale-105 transition-transform"
                                            sizes="56px"
                                        />
                                    </div>
                                    <span className="text-[10px] text-zinc-400 group-hover:text-amber-300 font-bold truncate w-full text-center">
                                        {item.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
