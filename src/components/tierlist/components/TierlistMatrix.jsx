import Image from 'next/image'
import styles from './TierlistMatrix.module.css'

const RANKS = ["EX", "S", "A", "B", "C"]

export default function TierlistMatrix({ tierData, visibleTypes }) {
    return (
        <div className={styles.matrixContainer}>
            <div className={styles.topGlow} />

            <div className={styles.scrollArea}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.thEmpty}></th>
                            {visibleTypes.map(type => (
                                <th key={type} className={styles.thType}>
                                    <div className={styles.typeHeader}>
                                        <div className={styles.typeIconWrapper}>
                                            <Image 
                                                src={`/logo_tiers/type/${type.toLowerCase()}.webp`} 
                                                fill 
                                                className={styles.typeIcon} 
                                                alt={type} 
                                                sizes="96px" 
                                            />
                                        </div>
                                        <div className={styles.typeDivider}></div>
                                    </div>
                                    <div className={styles.typeSeparator}></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {RANKS.map((rank) => (
                            <tr key={rank} className={styles.row}>
                                <th className={styles.thRank}>
                                    <div className={styles.rankIconWrapper}>
                                        <Image 
                                            src={`/logo_tiers/rank_tier/${rank}.webp`} 
                                            fill 
                                            className={styles.rankIcon} 
                                            alt={rank} 
                                            sizes="80px" 
                                        />
                                    </div>
                                    <div className={styles.rankIndicator}></div>
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
