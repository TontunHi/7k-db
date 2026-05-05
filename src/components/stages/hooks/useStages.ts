import { useState, useMemo } from 'react'

export function useStages(initialStages, initialNightmares) {
    const [mode, setMode] = useState("stage")
    const [searchQuery, setSearchQuery] = useState("")

    const filteredStages = useMemo(() => {
        const baseData = mode === "stage" ? initialStages : initialNightmares
        return baseData
            .filter(stage => stage.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [mode, searchQuery, initialStages, initialNightmares])

    return {
        mode,
        setMode,
        searchQuery,
        setSearchQuery,
        filteredStages
    }
}
