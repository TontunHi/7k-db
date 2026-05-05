"use client"

import { useState } from "react"
import { upsertItemRegistry, deleteItemRegistry } from "@/lib/registry-actions"
import { toast } from "sonner"

/**
 * useItemRegistry - Custom hook for Item Registry logic
 */
export function useItemRegistry(initialData) {
    const [items, setItems] = useState(initialData)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState<{ 
        name: string, 
        item_type: "Weapon" | "Armor" | "Accessory", 
        weapon_group: string | null, 
        item_set: string,
        atk_all_perc: number, 
        def_perc: number, 
        hp_perc: number,
        image: string,
        id?: number
    }>({ 
        name: "", 
        item_type: "Weapon", 
        weapon_group: "Physical", 
        item_set: "",
        atk_all_perc: 0, 
        def_perc: 0, 
        hp_perc: 0,
        image: ""
    })

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item)
            setFormData({ 
                ...item, 
                image: item.image || "", 
                weapon_group: item.weapon_group || "Physical",
                item_set: item.item_set || ""
            })
        } else {
            setEditingItem(null)
            setFormData({ 
                name: "", 
                item_type: "Weapon", 
                weapon_group: "Physical", 
                item_set: "",
                atk_all_perc: 0, 
                def_perc: 0, 
                hp_perc: 0,
                image: ""
            })
        }
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingItem(null)
    }

    const handleSave = async (e) => {
        if (e) e.preventDefault()
        setIsSaving(true)
        try {
            const result = await upsertItemRegistry(formData as any)
            if (result.success) {
                toast.success(editingItem ? "Item updated" : "Item registered")
                window.location.reload()
            }
        } catch (err) {
            console.error("[ITEM_REGISTRY_SAVE_ERROR]", err)
            toast.error("Operation failed")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return
        try {
            await deleteItemRegistry(id)
            setItems(prev => prev.filter(i => i.id !== id))
            toast.success("Item removed")
        } catch (err) {
            console.error("[ITEM_REGISTRY_DELETE_ERROR]", err)
            toast.error("Failed to delete item")
        }
    }

    const updateFormField = (key, value) => {
        setFormData(prev => {
            const next = { ...prev, [key]: value }
            
            // Special logic for item type change
            if (key === 'item_type') {
                next.image = ""
                next.weapon_group = value === "Weapon" ? "Physical" : null
            }
            
            return next
        })
    }

    return {
        items,
        isModalOpen,
        editingItem,
        formData,
        isSaving,
        openModal,
        closeModal,
        handleSave,
        handleDelete,
        updateFormField
    }
}
