"use client"

import Image from 'next/image'
import { useRef, useEffect } from 'react'
import styles from './TierlistMatrix.module.css'

const RANKS = ["EX", "S", "A", "B", "C"]

export default function TierlistMatrix({ tierData, visibleTypes }) {
    const scrollRef = useRef(null)
    const headerScrollRef = useRef(null)

    useEffect(() => {
        const scrollEl = scrollRef.current
        const headerEl = headerScrollRef.current
        if (!scrollEl || !headerEl) return

        const handleScroll = () => {
            headerEl.scrollLeft = scrollEl.scrollLeft
        }

        scrollEl.addEventListener('scroll', handleScroll)
        return () => scrollEl.removeEventListener('scroll', handleScroll)
    }, [visibleTypes])

    return (
        <div className={styles.matrixContainer}>
            {/* Sticky Type Header — inside matrixContainer, sticky works here */}
            <div className={styles.stickyHeader}>
                <div className={styles.headerRankCell} />
                <div className={styles.headerScroll} ref={headerScrollRef}>
                    {visibleTypes.map(type => (
                        <div key={type} className={styles.headerTypeCell}>
                            <div className={styles.typeIconWrapper}>
                                <Image
                                    src={`/logo_tiers/type/${type.toLowerCase()}.webp`}
                                    fill
                                    className={styles.typeIcon}
                                    alt={type}
                                    sizes="48px"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Content scroll area */}
            <div className={styles.scrollArea} ref={scrollRef}>
                <table className={styles.table}>
                    <colgroup>
                        <col style={{ width: '8rem', minWidth: '8rem' }} />
                        {visibleTypes.map(type => (
                            <col key={type} style={{ minWidth: '140px' }} />
                        ))}
                    </colgroup>
                    <tbody>
                        {RANKS.map((rank) => (
                            <tr key={rank} className={styles.row} data-rank={rank}>
                                <th className={styles.thRank}>
                                    <div className={styles.rankIconWrapper}>
                                        <Image
                                            src={`/logo_tiers/rank_tier/${rank}.webp`}
                                            fill
                                            className={styles.rankIcon}
                                            alt={rank}
                                            sizes="72px"
                                        />
                                    </div>
                                </th>

                                {visibleTypes.map(type => {
                                    const cellHeroes = tierData.filter(d => d.rank === rank && d.type === type)
                                    return (
                                        <td key={type} className={styles.td}>
                                            <div className={styles.heroList}>
                                                {cellHeroes.map(hero => (
                                                    <div
                                                        key={hero.heroFilename}
                                                        className={styles.heroItem}
                                                    >
                                                        <Image
                                                            src={`/heroes/${hero.heroFilename}`}
                                                            fill
                                                            className={styles.heroImage}
                                                            alt="hero"
                                                            sizes="60px"
                                                        />
                                                        <div className={styles.shine} />
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
