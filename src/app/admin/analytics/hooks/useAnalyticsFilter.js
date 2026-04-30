"use client"

import { useState, useEffect } from "react"
import { getFilteredPageViews } from "@/lib/analytics-actions"

/**
 * useAnalyticsFilter - Custom hook to manage analytics filtering logic.
 */
export function useAnalyticsFilter() {
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        pagePath: "",
        limit: 100,
        offset: 0
    })

    const fetchData = async (isLoadMore = false) => {
        if (isLoadMore) setLoadingMore(true)
        else setLoading(true)

        try {
            const result = await getFilteredPageViews({
                ...filters,
                offset: isLoadMore ? data.length : 0
            })
            
            if (isLoadMore) {
                setData(prev => [...prev, ...result.data])
            } else {
                setData(result.data)
            }
            setTotal(result.total)
        } catch (err) {
            console.error("[ANALYTICS_FILTER_ERROR]", err)
        } finally {
            setLoading(false)
            setLoadingMore(false)
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
        setFilters({ startDate: "", endDate: "", pagePath: "", limit: 100, offset: 0 })
    }

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const setRange = (days) => {
        const end = new Date()
        const start = new Date()
        start.setDate(end.getDate() - days)
        
        const formatDate = (date) => date.toISOString().split('T')[0]
        
        setFilters(prev => ({
            ...prev,
            startDate: formatDate(start),
            endDate: formatDate(end)
        }))
    }

    const loadMore = () => {
        if (data.length < total && !loadingMore) {
            fetchData(true)
        }
    }

    return {
        data,
        total,
        loading,
        loadingMore,
        filters,
        handleApplyFilters,
        clearFilters,
        updateFilter,
        setRange,
        loadMore
    }
}
