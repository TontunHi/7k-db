'use client'
import { LayoutGrid, Search, ChevronUp } from 'lucide-react'
import { clsx } from 'clsx'
import SafeImage from '@/components/shared/SafeImage'
import styles from './HeroPool.module.css'

export default function HeroPool({ 
    heroes, search, setSearch, onAutoAssign, 
    poolOpen, setPoolOpen 
}) {
    return (
        <div className={styles.pool}>
            <div 
                className={styles.poolHeader}
                onClick={() => setPoolOpen(!poolOpen)}
            >
                <div className={styles.headerTop}>
                    <h3 className={styles.headerTitle}>
                        <LayoutGrid size={14} className={styles.headerIcon} />
                        Heroes Pool
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className={styles.countBadge}>
                            {heroes.length} Units
                        </span>
                        <ChevronUp 
                            size={16} 
                            className={clsx(
                                styles.chevron,
                                poolOpen && styles.chevronOpen
                            )} 
                        />
                    </div>
                </div>
                
                <div className={clsx(
                    styles.searchBox,
                    poolOpen ? styles.searchBoxMobileOpen : styles.searchBoxMobileClosed
                )}>
                    <Search className={styles.searchIcon} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Unit Identification..."
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={clsx(
                styles.heroGridWrapper,
                poolOpen ? styles.gridOpen : styles.gridClosed
            )}>
                <div className={styles.grid}>
                    {heroes.map(hero => (
                        <button 
                            key={hero.filename}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData("hero", JSON.stringify(hero))
                            }}
                            onClick={() => onAutoAssign(hero)}
                            className={styles.heroButton}
                        >
                            <div className={styles.portraitWrapper}>
                                <SafeImage src={`/heroes/${hero.filename}`} fill className="object-cover" alt="" sizes="64px" />
                                <div className={styles.portraitOverlay}></div>
                            </div>
                        </button>
                    ))}
                </div>

                {heroes.length === 0 && (
                    <div className={styles.emptyBox}>
                        <p className={styles.emptyText}>No Heroes Found</p>
                    </div>
                )}
            </div>

            <div className={styles.footer}>
                <p className={styles.footerText}>
                    Drag units to classify • Click to auto-assign
                </p>
            </div>
        </div>
    )
}
