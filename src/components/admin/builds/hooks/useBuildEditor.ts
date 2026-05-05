"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteHeroImage } from "@/lib/admin-actions"
import { openEditor, saveEditor } from "@/lib/editor-actions"
import { toast } from "sonner"

/**
 * useBuildEditor - Manages the business logic for hero builds management
 */
export function useBuildEditor(initialHeroes = []) {
    const [editorOpen, setEditorOpen] = useState(false)
    const [currentHero, setCurrentHero] = useState(null)
    const [editorData, setEditorData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    /**
     * Handles hero deletion
     */
    async function handleDelete(filename) {
        if (!window.confirm("Are you sure you want to delete this hero? This action cannot be undone.")) return
        
        try {
            await deleteHeroImage(filename)
            toast.success("Hero removed from registry")
            router.refresh()
        } catch (err) {
            toast.error("Failed to delete hero")
        }
    }

    /**
     * Loads the editor for a specific hero
     */
    async function handleEdit(hero) {
        setIsLoading(true)
        try {
            const data = await openEditor(hero.filename)
            setEditorData(data)
            setCurrentHero(hero)
            setEditorOpen(true)
        } catch (err) {
            console.error("Editor load error:", err)
            toast.error("Failed to load build data")
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Saves the build modifications
     */
    async function handleSave(newBuilds, newSkillPriority, isNewHero) {
        if (!currentHero) return
        
        try {
            const result = await saveEditor(
                currentHero.filename,
                newBuilds,
                newSkillPriority,
                currentHero.name,
                currentHero.grade,
                isNewHero
            )
            
            if (result.success) {
                toast.success("Builds updated successfully")
                router.refresh()
                setEditorOpen(false)
            } else {
                toast.error(result.error || "Failed to save builds")
            }
        } catch (error) {
            toast.error("A system error occurred during saving")
        }
    }

    return {
        editorOpen,
        setEditorOpen,
        currentHero,
        editorData,
        isLoading,
        handleDelete,
        handleEdit,
        handleSave
    }
}
