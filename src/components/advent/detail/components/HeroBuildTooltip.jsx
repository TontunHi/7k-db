import { clsx } from 'clsx'
import SafeImage from '@/components/shared/SafeImage'
import styles from './HeroBuildTooltip.module.css'

export default function HeroBuildTooltip({ children, buildData, heroName, align }) {
    if (!buildData || Object.keys(buildData).length === 0) return children;

    const hasCore = (buildData.weapons?.length > 0) || (buildData.armors?.length > 0);
    const hasAccs = buildData.accessories?.length > 0;
    const hasSubs = buildData.substats?.length > 0;

    if (!hasCore && !hasAccs && !hasSubs) return children;

    return (
        <div className={clsx(styles.wrapper, align === 'left' ? styles.left : align === 'right' ? styles.right : '')}>
            {children}
            <div className={styles.tooltip}>
                <div className={styles.header}>
                    <span className={styles.title}>{heroName ? `${heroName} Build` : 'Build'}</span>
                </div>
                
                <div className={styles.content}>
                    {hasCore && (
                        <div className={styles.section}>
                            <h4 className={styles.sectionTitle}>
                                <div className={clsx(styles.dot, styles.gold)} /> Equipment
                            </h4>
                            <div className={styles.coreGrid}>
                                {/* Slot 1: Weapon & Armor */}
                                {buildData.weapons?.[0]?.image && (
                                    <div className={styles.itemRow}>
                                        <div className={styles.itemIcon}>
                                            <SafeImage src={`/items/weapon/${buildData.weapons[0].image}`} fill className="object-cover" alt="weapon" sizes="32px" />
                                        </div>
                                        <span className={styles.itemStat}>{buildData.weapons[0].stat}</span>
                                    </div>
                                )}
                                {buildData.armors?.[0]?.image && (
                                    <div className={styles.itemRow}>
                                        <div className={styles.itemIcon}>
                                            <SafeImage src={`/items/armor/${buildData.armors[0].image}`} fill className="object-cover" alt="armor" sizes="32px" />
                                        </div>
                                        <span className={styles.itemStat}>{buildData.armors[0].stat}</span>
                                    </div>
                                )}
                                {/* Slot 2: Weapon & Armor */}
                                {buildData.weapons?.[1]?.image && (
                                    <div className={styles.itemRow}>
                                        <div className={styles.itemIcon}>
                                            <SafeImage src={`/items/weapon/${buildData.weapons[1].image}`} fill className="object-cover" alt="weapon" sizes="32px" />
                                        </div>
                                        <span className={styles.itemStat}>{buildData.weapons[1].stat}</span>
                                    </div>
                                )}
                                {buildData.armors?.[1]?.image && (
                                    <div className={styles.itemRow}>
                                        <div className={styles.itemIcon}>
                                            <SafeImage src={`/items/armor/${buildData.armors[1].image}`} fill className="object-cover" alt="armor" sizes="32px" />
                                        </div>
                                        <span className={styles.itemStat}>{buildData.armors[1].stat}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {hasAccs && (
                        <div className={styles.section}>
                            <h4 className={styles.sectionTitle}>
                                <div className={clsx(styles.dot, styles.blue)} /> Accessories
                            </h4>
                            <div className={styles.accGrid}>
                                {buildData.accessories.map((acc, idx) => acc.image && (
                                    <div key={`acc-${idx}`} className={styles.accItem}>
                                        <SafeImage src={`/items/accessory/${acc.image}`} fill className="object-cover" alt="acc" sizes="40px" />
                                        {acc.refined && (
                                            <div className={styles.refinedOverlay}>
                                                <SafeImage src={`/items/accessory/${acc.refined}`} fill className="object-cover" alt="refined" sizes="24px" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasSubs && (
                        <div className={styles.section}>
                            <h4 className={styles.sectionTitle}>
                                <div className={clsx(styles.dot, styles.green)} /> Substats Priority
                            </h4>
                            <div className={styles.subsList}>
                                {buildData.substats.map((sub, idx) => (
                                    <span key={idx} className={styles.subBadge}>{idx + 1}. {sub}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
