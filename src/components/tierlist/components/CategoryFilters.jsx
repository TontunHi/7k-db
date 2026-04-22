import { clsx } from 'clsx'
import styles from './CategoryFilters.module.css'

const CATEGORIES = ["PVE", "PVP", "Raid", "GVG", "ART", "Tower"]

export default function CategoryFilters({ activeCategory, onCategoryChange }) {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        onClick={() => onCategoryChange(cat)}
                        className={clsx(styles.button, activeCategory === cat && styles.active)}
                    >
                        <span className={clsx(styles.corner, styles.topLeft)}></span>
                        <span className={clsx(styles.corner, styles.bottomRight)}></span>
                        {cat}
                    </button>
                ))}
            </div>
        </div>
    )
}
