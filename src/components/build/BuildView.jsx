"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import BuildViewerModal from "./BuildViewerModal"
import { fetchHeroBuildData } from "@/lib/viewer-actions"
import { trackCustomPageView } from "../analytics/AnalyticsTracker"
import { useBuildFilter } from "./hooks/useBuildFilter"
import BuildHeader from "./components/BuildHeader"
import FilterBar from "./components/FilterBar"
import HeroCard from "./components/HeroCard"
import styles from './BuildView.module.css'

export default function BuildView({ heroes }) {
    const {
        activeTab, setActiveTab,
        searchQuery, setSearchQuery,
        activeRole, setActiveRole,
        filteredHeroes
    } = useBuildFilter(heroes)

    // Modal & Loading State
    const [selectedHero, setSelectedHero] = useState(null)
    const [viewerData, setViewerData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleHeroClick = async (hero) => {
        setIsLoading(true)
        try {
            const data = await fetchHeroBuildData(hero.filename)
            setViewerData(data)
            setSelectedHero(hero)
            trackCustomPageView(`/build/${hero.slug}`)
        } catch (err) {
            console.error("Failed to fetch build data", err)
        } finally {
            setIsLoading(false)
        }
    }

    const closeViewer = () => {
        setSelectedHero(null)
        setViewerData(null)
    }

    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.gridPattern} />
                <div className={styles.topGlow} />
                <div className={styles.bottomGlow} />
            </div>

            <div className={styles.content}>
                {/* Page Header */}
                <BuildHeader />

                {/* Filters */}
                <FilterBar 
                    searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                    activeTab={activeTab} setActiveTab={setActiveTab}
                    activeRole={activeRole} setActiveRole={setActiveRole}
                />

                {/* Grid Content */}
                {filteredHeroes.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyTitle}>No heroes found in this category.</p>
                        <p className={styles.emptyDesc}>Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {filteredHeroes.map((hero) => (
                            <HeroCard 
                                key={hero.filename} 
                                hero={hero} 
                                onClick={handleHeroClick} 
                            />
                        ))}
                    </div>
                )}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className={styles.loadingOverlay}>
                        <div className={styles.loaderWrapper}>
                            <div className={styles.loaderGlow} />
                            <Loader2 className={styles.loaderIcon} />
                        </div>
                    </div>
                )}
            </div>
            
            {/* Modal */}
            {selectedHero && viewerData && (
                <BuildViewerModal
                    hero={selectedHero}
                    data={viewerData}
                    onClose={closeViewer}
                />
            )}
        </div>
    )
}

