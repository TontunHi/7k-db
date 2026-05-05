import { Search } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import HeroStatsHeader from './HeroStatsHeader'
import styles from './HeroSelection.module.css'

export default function HeroSelection({ heroes, search, setSearch, onSelect }) {
    const filteredHeroes = heroes.filter(h => 
        h.name.toLowerCase().includes(search.toLowerCase()) || 
        h.filename.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className={styles.heroSelection}>
            <HeroStatsHeader lastUpdated={null} />
            <div className={styles.container}>

                <div className={styles.pickerBox}>
                    <div className={styles.searchWrapper}>
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
