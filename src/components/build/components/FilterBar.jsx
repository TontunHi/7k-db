import { clsx } from 'clsx'
import RoleFilters from '@/components/shared/RoleFilters'
import styles from './FilterBar.module.css'

export default function FilterBar({ 
    searchQuery, setSearchQuery, 
    activeTab, setActiveTab, 
    activeRole, setActiveRole 
}) {
    return (
        <div className={styles.container}>
            {/* Search Input */}
            <div className={styles.searchWrapper}>
                <div className={styles.searchGlow} />
                <input
                    type="text"
                    placeholder="Search heroes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {/* Legendary / Rare Tabs */}
            <div className={styles.tabs}>
                {['legendary', 'rare'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={clsx(styles.tabButton, activeTab === tab && styles.tabButtonActive)}
                    >
                        {activeTab === tab && <div className={styles.tabIndicator} />}
                        <span className={styles.tabLabel}>{tab}</span>
                    </button>
                ))}
            </div>

            {/* Role Filter Bar */}
            <RoleFilters 
                activeRole={activeRole} 
                onRoleChange={setActiveRole} 
            />
        </div>
    )
}

