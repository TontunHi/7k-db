'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ArrowRight, Shield, Zap, Sparkles, Sword, Loader2, Gem, Layers, Check } from 'lucide-react'
import styles from './HeroQuickPeekModal.module.css'

export interface HeroBuildItem {
    id?: number
    buildIndex?: number
    title?: string
    mode?: string[]
    cLevel?: number
    author_name?: string | null
    author_contact?: string | null
    weapons?: Array<{ image?: string; name?: string; stat?: string }>
    armors?: Array<{ image?: string; name?: string; stat?: string }>
    accessories?: Array<{ image?: string; name?: string; stat?: string; refined?: string }>
    substats?: string[]
}

export interface HeroQuickPeekData {
    slug: string
    filename: string
    name: string
    grade: string
    type: string | null
    skillPriority: string[]
    builds: HeroBuildItem[]
}

interface HeroQuickPeekModalProps {
    heroIdentifier: string
    onClose: () => void
}

export default function HeroQuickPeekModal({
    heroIdentifier,
    onClose
}: HeroQuickPeekModalProps) {
    const [data, setData] = useState<HeroQuickPeekData | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeBuildIndex, setActiveBuildIndex] = useState(0)

    useEffect(() => {
        let mounted = true
        setLoading(true)
        setActiveBuildIndex(0)

        fetch(`/api/hero-quick-peek?hero=${encodeURIComponent(heroIdentifier)}`)
            .then(res => res.ok ? res.json() : null)
            .then(res => {
                if (mounted) {
                    setData(res)
                    setLoading(false)
                }
            })
            .catch(() => {
                if (mounted) setLoading(false)
            })

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            mounted = false
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [heroIdentifier, onClose])

    const builds = data?.builds || []
    const currentBuild = builds[activeBuildIndex] || builds[0]
    const weapons = currentBuild?.weapons || []
    const armors = currentBuild?.armors || []
    const accessories = (currentBuild?.accessories || []).filter(a => a?.image)
    const substats = currentBuild?.substats || []

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    className={styles.closeButton}
                    aria-label="Close"
                >
                    <X size={16} />
                </button>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-14 gap-3 text-amber-400">
                        <Loader2 className="animate-spin" size={32} />
                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                            Loading Hero Profile...
                        </span>
                    </div>
                ) : data ? (
                    <>
                        {/* Header Profile */}
                        <div className={styles.headerSection}>
                            <div className={styles.avatarFrame}>
                                <Image
                                    src={`/heroes/${data.filename}`}
                                    alt={data.name}
                                    fill
                                    className={styles.avatarImage}
                                    sizes="80px"
                                />
                            </div>

                            <div className={styles.heroMeta}>
                                <div className={styles.badgeRow}>
                                    <span className={styles.gradeBadge}>
                                        {data.grade}
                                    </span>
                                    {data.type && (
                                        <span className={styles.typeBadge}>
                                            {data.type}
                                        </span>
                                    )}
                                </div>
                                <h3 className={styles.heroTitle}>{data.name}</h3>
                                <p className={styles.heroSubtitle}>
                                    Seven Knights Re:Birth Hero Quick Profile
                                </p>
                            </div>
                        </div>

                        {/* Body Information */}
                        <div className={styles.modalBody}>
                            {/* Multi-Build Selector Strip (if multiple builds exist) */}
                            {builds.length > 1 && (
                                <div className={styles.buildNavStrip}>
                                    {builds.map((b, bIdx) => {
                                        const isBuildActive = bIdx === activeBuildIndex
                                        return (
                                            <button
                                                key={b.id || bIdx}
                                                type="button"
                                                onClick={() => setActiveBuildIndex(bIdx)}
                                                className={`${styles.buildPill} ${isBuildActive ? styles.buildPillActive : ''}`}
                                            >
                                                {isBuildActive ? (
                                                    <Check size={13} className="text-amber-400" />
                                                ) : (
                                                    <Layers size={13} className="text-zinc-500" />
                                                )}
                                                <span>{b.title || `Build #${bIdx + 1}`}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            )}

                            {/* Author Credit Badge */}
                            {currentBuild?.author_name && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-xl text-xs text-amber-300 font-bold w-fit">
                                    <Sparkles size={13} className="text-amber-400" />
                                    <span>Build by: <strong className="text-white">{currentBuild.author_name}</strong></span>
                                    {currentBuild.author_contact && (
                                        <span className="text-zinc-400 text-[11px] font-normal">({currentBuild.author_contact})</span>
                                    )}
                                </div>
                            )}

                            {/* Skill Priority */}
                            {data.skillPriority && data.skillPriority.length > 0 && (
                                <div className={styles.sectionBlock}>
                                    <span className={styles.sectionLabel}>
                                        <Zap size={13} /> Skill Order Priority
                                    </span>
                                    <div className={styles.skillRow}>
                                        {data.skillPriority.map((skill, idx) => {
                                            const isSkillImg = skill.includes('.webp') || skill.includes('.png')
                                            return (
                                                <div key={idx} className={styles.skillPill}>
                                                    <span className={styles.skillIndex}>{idx + 1}</span>
                                                    {isSkillImg ? (
                                                        <div className={styles.skillIconFrame}>
                                                            <Image
                                                                src={`/skills/${skill}`}
                                                                alt={`Skill ${idx + 1}`}
                                                                fill
                                                                className="object-cover"
                                                                sizes="28px"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <span>{skill}</span>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Equipment: Weapons & Armor */}
                            {(weapons.length > 0 || armors.length > 0) && (
                                <div className={styles.sectionBlock}>
                                    <span className={styles.sectionLabel}>
                                        <Sword size={13} /> Recommended Weapons &amp; Armor
                                    </span>
                                    <div className={styles.equipGrid}>
                                        {/* Weapon 1 */}
                                        {weapons[0]?.image && (
                                            <div className={styles.equipSlotCard}>
                                                <div className={styles.equipItemIcon}>
                                                    <Image
                                                        src={`/items/weapon/${weapons[0].image}`}
                                                        alt="Weapon 1"
                                                        fill
                                                        className="object-contain p-1"
                                                        sizes="44px"
                                                    />
                                                </div>
                                                <div className={styles.equipItemInfo}>
                                                    <span className={styles.equipItemType}>Weapon #1</span>
                                                    <span className={styles.equipItemStat}>{weapons[0].stat || 'Standard'}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Armor 1 */}
                                        {armors[0]?.image && (
                                            <div className={styles.equipSlotCard}>
                                                <div className={styles.equipItemIcon}>
                                                    <Image
                                                        src={`/items/armor/${armors[0].image}`}
                                                        alt="Armor 1"
                                                        fill
                                                        className="object-contain p-1"
                                                        sizes="44px"
                                                    />
                                                </div>
                                                <div className={styles.equipItemInfo}>
                                                    <span className={styles.equipItemType}>Armor #1</span>
                                                    <span className={styles.equipItemStat}>{armors[0].stat || 'Standard'}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Weapon 2 */}
                                        {weapons[1]?.image && (
                                            <div className={styles.equipSlotCard}>
                                                <div className={styles.equipItemIcon}>
                                                    <Image
                                                        src={`/items/weapon/${weapons[1].image}`}
                                                        alt="Weapon 2"
                                                        fill
                                                        className="object-contain p-1"
                                                        sizes="44px"
                                                    />
                                                </div>
                                                <div className={styles.equipItemInfo}>
                                                    <span className={styles.equipItemType}>Weapon #2</span>
                                                    <span className={styles.equipItemStat}>{weapons[1].stat || 'Standard'}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Armor 2 */}
                                        {armors[1]?.image && (
                                            <div className={styles.equipSlotCard}>
                                                <div className={styles.equipItemIcon}>
                                                    <Image
                                                        src={`/items/armor/${armors[1].image}`}
                                                        alt="Armor 2"
                                                        fill
                                                        className="object-contain p-1"
                                                        sizes="44px"
                                                    />
                                                </div>
                                                <div className={styles.equipItemInfo}>
                                                    <span className={styles.equipItemType}>Armor #2</span>
                                                    <span className={styles.equipItemStat}>{armors[1].stat || 'Standard'}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Accessories */}
                            {accessories.length > 0 && (
                                <div className={styles.sectionBlock}>
                                    <span className={styles.sectionLabel}>
                                        <Gem size={13} /> Recommended Accessories
                                    </span>
                                    <div className={styles.accRow}>
                                        {accessories.map((acc, aIdx) => (
                                            <div key={aIdx} className={styles.accItemBox}>
                                                <Image
                                                    src={`/items/accessory/${acc.image}`}
                                                    alt={`Accessory ${aIdx + 1}`}
                                                    fill
                                                    className="object-contain p-1"
                                                    sizes="52px"
                                                />
                                                {acc.refined && (
                                                    <div className={styles.accRefinedBadge}>
                                                        <Image
                                                            src={`/items/accessory/${acc.refined}`}
                                                            alt="Refined"
                                                            fill
                                                            className="object-contain p-0.5"
                                                            sizes="20px"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Substats Priority */}
                            {substats.length > 0 && (
                                <div className={styles.sectionBlock}>
                                    <span className={styles.sectionLabel}>
                                        <Sparkles size={13} /> Substat Priority
                                    </span>
                                    <div>
                                        {substats.map((sub, sIdx) => (
                                            <span key={sIdx} className={styles.substatBadge}>
                                                {sIdx + 1}. {sub}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className={styles.footerSection}>
                            <Link
                                href={`/build?hero=${encodeURIComponent(data.slug)}`}
                                onClick={onClose}
                                className={styles.fullGuideLink}
                            >
                                <span>View {data.name} Full Build &amp; Stats</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="p-8 text-center text-sm text-zinc-400">
                        Hero information not found.
                    </div>
                )}
            </div>
        </div>
    )
}
