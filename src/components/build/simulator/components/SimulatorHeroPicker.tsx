import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { clsx } from 'clsx'
import SafeImage from '@/components/shared/SafeImage'
import RoleFilters from '@/components/shared/RoleFilters'
import BuildSimulatorHeader from './BuildSimulatorHeader'
import styles from './SimulatorHeroPicker.module.css'

export default function SimulatorHeroPicker({ allHeroes, searchHero, setSearchHero, onSelect, onBack }) {
    const [activeTab, setActiveTab] = useState("awake")
    const [activeRole, setActiveRole] = useState("all")

    const filteredHeroes = useMemo(() => {
        return allHeroes.filter(h => {
            const matchesSearch = h.name.toLowerCase().includes(searchHero.toLowerCase()) || 
                                h.filename.toLowerCase().includes(searchHero.toLowerCase())
            if (!matchesSearch) return false

            let matchesTab = false
            if (activeTab === "awake") {
                matchesTab = h.grade?.startsWith("a")
            } else if (activeTab === "legendary") {
                matchesTab = h.grade?.startsWith("l")
            } else {
                matchesTab = h.grade === "r"
            }
            if (!matchesTab) return false

            const matchesRole = activeRole === "all" || (h.type?.toLowerCase() === activeRole.toLowerCase())
            return matchesRole
        })
    }, [allHeroes, searchHero, activeTab, activeRole])

    return (
        <div className={styles.heroPicker}>
            <BuildSimulatorHeader lastUpdated={null} />
            <div className={styles.container}>

                <div className={styles.pickerBox}>
                    <div className={styles.searchWrapper}>
                        {/* Row 1: Search Bar */}
                        <div className={styles.row1}>
                            <div className={styles.searchInputBox}>
                                <Search className={styles.searchIcon} />
                                <input 
                                    type="text"
                                    placeholder="Search legend pool..."
                                    value={searchHero}
                                    onChange={(e) => setSearchHero(e.target.value)}
                                    className={styles.searchInput}
                                />
                            </div>
                        </div>

                        {/* Row 2: Grade tabs and Role filters */}
                        <div className={styles.row2}>
                            {/* Awake / Legendary / Rare Tabs */}
                            <div className={styles.tabs}>
                                {['awake', 'legendary', 'rare'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={clsx(styles.tabButton, activeTab === tab && styles.tabButtonActive)}
                                    >
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
                    </div>

                    <div className={styles.grid}>
                        {filteredHeroes.map(h => (
                            <button
                                key={h.filename}
                                onClick={() => onSelect(h)}
                                className={styles.heroButton}
                            >
                                <div className={styles.portraitWrapper}>
                                    <SafeImage src={`/heroes/${h.filename}`} fill className={styles.portraitImage} alt={h.name} />
                                    <div className={styles.portraitOverlay} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button onClick={onBack} className={styles.backLink}>
                        Go Back to Previous Page
                    </button>
                </div>
            </div>
        </div>
    )
}
