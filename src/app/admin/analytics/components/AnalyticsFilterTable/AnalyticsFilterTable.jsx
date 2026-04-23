"use client"

import { Search, Calendar, Filter, Loader2 } from "lucide-react"
import { useAnalyticsFilter } from "../../hooks/useAnalyticsFilter"
import styles from "./AnalyticsFilterTable.module.css"
import { clsx } from "clsx"

/**
 * AnalyticsFilterTable - Refactored table with custom filtering logic.
 */
export default function AnalyticsFilterTable() {
    const {
        data,
        loading,
        filters,
        handleApplyFilters,
        clearFilters,
        updateFilter
    } = useAnalyticsFilter()

    return (
        <div className={styles.card}>
            {/* Header & Filter Controls */}
            <div className={styles.header}>
                <div className={styles.titleGroup}>
                    <div className={styles.iconBox}>
                        <Filter className="w-4 h-4 text-blue-400" />
                    </div>
                    <h2 className={styles.title}>Custom Page Views Log</h2>
                </div>

                <form onSubmit={handleApplyFilters} className={styles.filterForm}>
                    <div className={styles.inputGroup}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Filter by Page Path..."
                            className={styles.input}
                            value={filters.pagePath}
                            onChange={(e) => updateFilter("pagePath", e.target.value)}
                        />
                    </div>
                    
                    <div className={clsx(styles.inputGroup, styles.dateRange)}>
                        <Calendar className={styles.calendarIcon} />
                        <input
                            type="date"
                            className={styles.input}
                            value={filters.startDate}
                            onChange={(e) => updateFilter("startDate", e.target.value)}
                        />
                        <span className={styles.separator}>-</span>
                        <input
                            type="date"
                            className={styles.input}
                            value={filters.endDate}
                            onChange={(e) => updateFilter("endDate", e.target.value)}
                        />
                    </div>

                    <div className={styles.buttonGroup}>
                        <button
                            type="submit"
                            disabled={loading}
                            className={styles.submitButton}
                        >
                            {loading ? <Loader2 className={clsx(styles.loader, "w-4 h-4")} /> : "Apply"}
                        </button>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className={styles.clearButton}
                        >
                            Clear
                        </button>
                    </div>
                </form>
            </div>

            {/* Data Display */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Page Path</th>
                            <th className={clsx(styles.th, styles.valueCell)}>Unique Visitors</th>
                            <th className={clsx(styles.th, styles.valueCell)}>Total Views</th>
                        </tr>
                    </thead>
                    <tbody className="relative">
                        {loading ? (
                            <tr>
                                <td colSpan="3" className={styles.loadingState}>
                                    <div className={styles.loaderWrapper}>
                                        <Loader2 className={styles.loader} />
                                        <span className="text-gray-500">Loading data...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((item, idx) => (
                                <tr key={idx} className={styles.tr}>
                                    <td className={clsx(styles.td, styles.pathCell)}>{item.page_path}</td>
                                    <td className={clsx(styles.td, styles.valueCell)}>{item.unique_visitors.toLocaleString()}</td>
                                    <td className={clsx(styles.td, styles.valueCellBold)}>{item.views.toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className={styles.emptyState}>
                                    No data found for these filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
