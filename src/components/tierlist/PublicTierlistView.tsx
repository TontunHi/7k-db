"use client"

import { Loader2 } from "lucide-react"
import { useTierlist } from "./hooks/useTierlist"
import TierlistHeader from "./components/TierlistHeader"
import CategoryFilters from "./components/CategoryFilters"
import RoleFilters from "@/components/shared/RoleFilters"
import TierlistMatrix from "./components/TierlistMatrix"
import styles from './PublicTierlistView.module.css'

export default function PublicTierlistView() {
    const {
        category, setCategory,
        activeRole, setActiveRole,
        tierData, isLoading,
        visibleTypes
    } = useTierlist()

    return (
        <div className={styles.page}>
            {/* Background Effects */}
            <div className={styles.background}>
                <div className={styles.gridPattern} />
                <div className={styles.topGlow} />
                <div className={styles.bottomGlow} />
            </div>

            <div className={styles.content}>
                {/* Header */}
                <TierlistHeader />

                {/* Category Selection */}
                <CategoryFilters 
                    activeCategory={category} 
                    onCategoryChange={setCategory} 
                />

                {/* Role Filters */}
                <div className={styles.roleFilterWrapper}>
                    <RoleFilters 
                        activeRole={activeRole} 
                        onRoleChange={setActiveRole} 
                    />
                </div>

                {/* Main Content */}
                {isLoading ? (
                    <div className={styles.loadingWrapper}>
                        <Loader2 className={styles.loader} />
                    </div>
                ) : (
                    <div className={styles.mainContent}>
                        <TierlistMatrix 
                            tierData={tierData} 
                            visibleTypes={visibleTypes} 
                        />

                        {/* Footer Note */}
                        <div className={styles.footer}>
                            <p className={styles.footerText}>
                                Seven Knights 2 Rebirth Database • Community Driven Project
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

