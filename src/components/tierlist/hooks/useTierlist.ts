import { useState, useEffect, useMemo } from "react"
import { getTierlistData } from "@/lib/tierlist-db"

const TYPES = ["Attack", "Magic", "Defense", "Support", "Universal"]

export function useTierlist() {
    const [category, setCategory] = useState("PVE")
    const [activeRole, setActiveRole] = useState("all")
    const [tierData, setTierData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const visibleTypes = useMemo(() => {
        return activeRole === "all" ? TYPES : TYPES.filter(t => t === activeRole)
    }, [activeRole])

    useEffect(() => {
        const fetchTiers = async () => {
            setIsLoading(true)
            try {
                const data = await getTierlistData(category)
                setTierData(data || [])
            } catch (err) {
                console.error("Failed to fetch tierlist data:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTiers()
    }, [category])

    return {
        category,
        setCategory,
        activeRole,
        setActiveRole,
        tierData,
        isLoading,
        visibleTypes
    }
}
