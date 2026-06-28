import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { clsx } from 'clsx'
import SafeImage from '@/components/shared/SafeImage'
import RoleFilters from '@/components/shared/RoleFilters'
import HeroStatsHeader from './HeroStatsHeader'
import styles from './HeroSelection.module.css'

export default function HeroSelection({ heroes, search, setSearch, onSelect }) {
    const [activeTab, setActiveTab] = useState("awake")
    const [activeRole, setActiveRole] = useState("all")

    const filteredHeroes = useMemo(() => {
        const mapped = heroes.map(h => {
            let resolvedGrade = h.grade
            if (h.grade === "a") {
                const coreName = h.filename.replace(/^a_/, "")
                for (const basePrefix of ["l++_", "l+_", "l_", "r_"]) {
                    const baseFilename = basePrefix + coreName
                    if (heroes.some(other => other.filename === baseFilename)) {
                        resolvedGrade = "a" + basePrefix.slice(0, -1)
                        break
                    }
                }
            }
            return {
                ...h,
                resolvedGrade
            }
        })

        // Sort mapped heroes by resolvedGrade
        const gradeOrder: Record<string, number> = {
            "al++": 0,
            "al+": 1,
            "al": 2,
            "ar": 3,
            "a": 4,
            "l++": 5,
            "l+": 6,
            "l": 7,
            "r": 8
        }
        
        const sorted = [...mapped].sort((a, b) => {
            const ga = gradeOrder[a.resolvedGrade] ?? 99
            const gb = gradeOrder[b.resolvedGrade] ?? 99
            if (ga !== gb) return ga - gb
            return a.name.localeCompare(b.name)
        })

        return sorted.filter(h => {
            const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) || 
                                h.filename.toLowerCase().includes(search.toLowerCase())
            if (!matchesSearch) return false

            let matchesTab = false
            if (activeTab === "awake") {
                matchesTab = h.resolvedGrade?.startsWith("a")
            } else if (activeTab === "legendary") {
                matchesTab = h.resolvedGrade?.startsWith("l")
            } else {
                matchesTab = h.resolvedGrade === "r"
            }
            if (!matchesTab) return false

            const matchesRole = activeRole === "all" || (h.type?.toLowerCase() === activeRole.toLowerCase())
            return matchesRole
        })
    }, [heroes, search, activeTab, activeRole])

    return (
        <div className={styles.heroSelection}>
            <HeroStatsHeader lastUpdated={null} />
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
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
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
                        {filteredHeroes.map(hero => (
                            <button
                                key={hero.filename}
                                onClick={() => onSelect(hero)}
                                className={styles.heroButton}
                            >
                                <div className={styles.portraitWrapper}>
                                    <SafeImage src={`/heroes/${hero.filename}.webp`} fill className={styles.portraitImage} alt={hero.name} />
                                    <div className={styles.portraitOverlay} />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
