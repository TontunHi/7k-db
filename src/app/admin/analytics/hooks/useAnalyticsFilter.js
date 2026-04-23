"use client"

import { useState, useEffect } from "react"
import { getFilteredPageViews } from "@/lib/analytics-actions"

/**
 * useAnalyticsFilter - Custom hook to manage analytics filtering logic.
 */
export function useAnalyticsFilter() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        pagePath: ""
    })

    const fetchData = async () => {
        setLoading(true)
        try {
            const result = await getFilteredPageViews(filters)
            setData(result)
        } catch (err) {
            console.error("[ANALYTICS_FILTER_ERROR]", err)
        } finally {
            setLoading(false)
        }
    }

    // Initial load
    useEffect(() => {
        fetchData()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleApplyFilters = (e) => {
        if (e) e.preventDefault()
        fetchData()
    }

    const clearFilters = () => {
        setFilters({ startDate: "", endDate: "", pagePath: "" })
    }

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    return {
        data,
        loading,
        filters,
        handleApplyFilters,
        clearFilters,
        updateFilter
    }
}
