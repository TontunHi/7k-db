"use client"

import { useState } from "react"
import { upsertPetRegistry, deletePetRegistry } from "@/lib/registry-actions"
import { toast } from "sonner"

/**
 * usePetRegistry - Custom hook for Pet Registry logic
 */
export function usePetRegistry(initialData) {
    const [pets, setPets] = useState(initialData)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPet, setEditingPet] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState({ 
        name: "", 
        grade: "l", 
        atk_all: 0, 
        def: 0, 
        hp: 0, 
        image: "" 
    })

    const openModal = (pet = null) => {
        if (pet) {
            setEditingPet(pet)
            setFormData({ ...pet, image: pet.image || "" })
        } else {
            setEditingPet(null)
            setFormData({ name: "", grade: "l", atk_all: 0, def: 0, hp: 0, image: "" })
        }
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingPet(null)
    }

    const handleSave = async (e) => {
        if (e) e.preventDefault()
        setIsSaving(true)
        try {
            const result = await upsertPetRegistry(formData)
            if (result.success) {
                toast.success(editingPet ? "Pet updated" : "Pet registered")
                // In a real app, we might update state or revalidate
                // For now, reload to keep it simple as per original code
                window.location.reload() 
            }
        } catch (err) {
            console.error("[PET_REGISTRY_SAVE_ERROR]", err)
            toast.error("Operation failed")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this pet registry?")) return
        try {
            await deletePetRegistry(id)
            setPets(prev => prev.filter(p => p.id !== id))
            toast.success("Pet removed")
        } catch (err) {
            console.error("[PET_REGISTRY_DELETE_ERROR]", err)
            toast.error("Failed to delete pet")
        }
    }

    const updateFormField = (key, value) => {
        setFormData(prev => {
            const next = { ...prev, [key]: value }
            // Auto-adjust grade based on image prefix if needed
            if (key === 'image' && value) {
                if (value.startsWith('l_')) next.grade = 'l'
                else if (value.startsWith('r_')) next.grade = 'r'
            }
            return next
        })
    }

    return {
        pets,
        isModalOpen,
        editingPet,
        formData,
        isSaving,
        openModal,
        closeModal,
        handleSave,
        handleDelete,
        updateFormField
    }
}
