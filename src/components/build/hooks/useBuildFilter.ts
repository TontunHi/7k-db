import { useState, useMemo } from 'react'

export function useBuildFilter(heroes) {
    const [activeTab, setActiveTab] = useState("legendary")
    const [searchQuery, setSearchQuery] = useState("")
    const [activeRole, setActiveRole] = useState("all")

    const filteredHeroes = useMemo(() => {
        return heroes.filter((hero) => {
            const matchesTab = activeTab === "legendary" ? hero.grade.startsWith("l") : hero.grade === "r"
            const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesRole = activeRole === "all" || (hero.type?.toLowerCase() === activeRole.toLowerCase())
            return matchesTab && matchesSearch && matchesRole
        })
    }, [heroes, activeTab, searchQuery, activeRole])

    return {
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        activeRole,
        setActiveRole,
        filteredHeroes
    }
}
