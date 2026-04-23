"use client"

import { useState, useMemo } from "react"
import { updateHeroRegistry } from "@/lib/registry-actions"
import { toast } from "sonner"

/**
 * useHeroRegistry - Custom hook to manage Hero Registry logic
 * 
 * Handles searching, form state, and server communication.
 */
export function useHeroRegistry(initialData) {
    const [heroes, setHeroes] = useState(initialData)
    const [search, setSearch] = useState("")
    const [editingHero, setEditingHero] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState({})

    const filteredHeroes = useMemo(() => {
        return heroes.filter(h => 
            h.name.toLowerCase().includes(search.toLowerCase()) ||
            h.filename.toLowerCase().includes(search.toLowerCase())
        )
    }, [heroes, search])

    const startEditing = (hero) => {
        setEditingHero(hero)
        setFormData({
            type: hero.type || "Attack",
            hero_group: hero.hero_group || "Physical",
            atk_phys: hero.atk_phys || 0,
            atk_mag: hero.atk_mag || 0,
            def: hero.def || 0,
            hp: hero.hp || 0,
            speed: hero.speed || 0,
            crit_rate: hero.crit_rate || 0,
            crit_dmg: hero.crit_dmg || 0,
            weak_hit: hero.weak_hit || 0,
            block_rate: hero.block_rate || 0,
            dmg_red: hero.dmg_red || 0,
            eff_hit: hero.eff_hit || 0,
            eff_res: hero.eff_res || 0
        })
    }

    const cancelEditing = () => {
        setEditingHero(null)
        setFormData({})
    }

    const handleSave = async () => {
        if (!editingHero) return
        setIsSaving(true)
        try {
            const result = await updateHeroRegistry(editingHero.filename, formData)
            if (result.success) {
                toast.success(`Updated ${editingHero.name} registry`)
                // Update local state
                setHeroes(prev => prev.map(h => 
                    h.filename === editingHero.filename 
                        ? { ...h, ...formData } 
                        : h
                ))
                setEditingHero(null)
            }
        } catch (err) {
            console.error("[HERO_REGISTRY_SAVE_ERROR]", err)
            toast.error("Failed to update registry")
        } finally {
            setIsSaving(false)
        }
    }

    const updateFormField = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    return {
        heroes: filteredHeroes,
        totalCount: heroes.length,
        search,
        setSearch,
        editingHero,
        formData,
        isSaving,
        startEditing,
        cancelEditing,
        handleSave,
        updateFormField
    }
}
