'use client'
import { Search } from 'lucide-react'
import SafeImage from '@/components/shared/SafeImage'
import styles from './SimulatorHeroPicker.module.css'

export default function SimulatorHeroPicker({ allHeroes, searchHero, setSearchHero, onSelect, onBack }) {
    const filteredHeroes = allHeroes.filter(h => 
        h.name.toLowerCase().includes(searchHero.toLowerCase()) || 
        h.filename.toLowerCase().includes(searchHero.toLowerCase())
    )

    return (
        <div className={styles.heroPicker}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        Choose Your <span className={styles.titleAccent}>Hero</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Select a hero from the pool to initiate high-performance build analysis and simulation
                    </p>
                </div>

                <div className={styles.pickerBox}>
                    <div className={styles.searchWrapper}>
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
