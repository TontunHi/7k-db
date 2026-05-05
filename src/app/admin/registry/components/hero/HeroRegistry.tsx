"use client"

import { Search } from "lucide-react"
import { useHeroRegistry } from "../../hooks/useHeroRegistry"
import HeroTableRow from "./HeroTableRow"
import HeroEditModal from "./HeroEditModal"
import styles from "./HeroRegistry.module.css"

/**
 * HeroRegistry - Refactored Hero Registry Management
 * 
 * Uses custom hooks for logic and sub-components for UI breakdown.
 * Styled with CSS Modules for route-based scoping.
 */
export default function HeroRegistry({ initialData }) {
    const {
        heroes,
        totalCount,
        search,
        setSearch,
        editingHero,
        formData,
        isSaving,
        startEditing,
        cancelEditing,
        handleSave,
        updateFormField
    } = useHeroRegistry(initialData)

    return (
        <div className={styles.container}>
            {/* Table Section */}
            <div className={styles.tableCard}>
                {/* Search & Header */}
                <div className={styles.tableHeader}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} />
                        <input 
                            type="text"
                            placeholder="Search hero registry..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.countLabel}>
                        {heroes.length} / {totalCount} HEROES
                    </div>
                </div>

                {/* Main Table */}
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Hero Identity</th>
                                <th className={styles.th}>Group / Type</th>
                                <th className={styles.th}>Primary Stats</th>
                                <th className={clsx(styles.th, styles.actionsCell)}>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {heroes.map((hero) => (
                                <HeroTableRow 
                                    key={hero.filename} 
                                    hero={hero} 
                                    onEdit={startEditing} 
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Editing Modal */}
            <HeroEditModal 
                hero={editingHero}
                formData={formData}
                isSaving={isSaving}
                onUpdateField={updateFormField}
                onSave={handleSave}
                onClose={cancelEditing}
            />
        </div>
    )
}

// Helper for conditional classes if clsx is not imported in this file
function clsx(...args) {
    return args.filter(Boolean).join(' ')
}
