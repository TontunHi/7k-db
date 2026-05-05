import React, { Suspense } from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import RecentUpdates from '@/components/shared/RecentUpdates'
import WebsiteUpdates from '@/components/shared/WebsiteUpdates'
import styles from './UpdateSidebar.module.css'

function UpdateSkeleton() {
    return (
        <div className={styles.skeleton}>
            {[...Array(5)].map((_, i) => (
                <div key={i} className={styles.skeletonItem} />
            ))}
        </div>
    )
}

export default function UpdateSidebar() {
    return (
        <aside className={styles.sidebar}>
            {/* Recent Updates */}
            <div className={styles.section} style={{ '--glow-color': 'var(--primary)' } as React.CSSProperties}>
                <div className={styles.topBorderGlow} />
                <div className={styles.header}>
                    <h3 className={styles.title}>
                        <Zap className={styles.titleIcon} />
                        Recent Updates
                    </h3>
                    <div className={styles.statusLabel}>Live Intel</div>
                </div>

                <Suspense fallback={<UpdateSkeleton />}>
                    <RecentUpdates />
                </Suspense>
            </div>

            {/* Website Updates */}
            <div className={styles.section} style={{ '--glow-color': 'rgb(34 211 238)' } as React.CSSProperties}> {/* cyan-400 equivalent */}
                <div className={styles.topBorderGlow} />
                <WebsiteUpdates />
            </div>

            {/* Partner Section */}
            <div className={styles.partnerSection}>
                <h3 className={styles.partnerTitle}>Partner with us</h3>
                <p className={styles.partnerDesc}>
                    Interested in reaching thousands of Seven Knights Rebirth players? 
                    We&apos;re looking for high-quality partners to grow with our community.
                </p>
                <Link href="/contact" className={styles.partnerButton}>
                    Contact for Partnership
                </Link>
            </div>
        </aside>
    )
}
