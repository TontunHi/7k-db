"use client"

import { useState, useEffect } from 'react'
import { 
    getGlobalCredits, 
    createGlobalCredit, 
    updateGlobalCredit, 
    deleteGlobalCredit 
} from '@/lib/credit-actions'

/**
 * useCreditsManager - Custom hook to manage global credits/attributions logic.
 * Maintains original data flow and server actions.
 */
export function useCreditsManager() {
    const [credits, setCredits] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [newItem, setNewItem] = useState({ platform: 'youtube', name: '', link: '' })

    const loadData = async () => {
        setLoading(true)
        const data = await getGlobalCredits()
        setCredits(data)
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleAdd = async () => {
        if (!newItem.name || !newItem.link) return
        setSaving(true)
        const res = await createGlobalCredit(newItem)
        if (res.success) {
            await loadData()
            setNewItem({ platform: 'youtube', name: '', link: '' })
        }
        setSaving(false)
    }

    const handleUpdate = async (id, data) => {
        setSaving(true)
        const res = await updateGlobalCredit(id, data)
        if (res.success) {
            setEditingId(null)
            await loadData()
        }
        setSaving(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this attribution?')) return
        setSaving(true)
        const res = await deleteGlobalCredit(id)
        if (res.success) {
            await loadData()
        }
        setSaving(false)
    }

    const updateNewItem = (field, value) => {
        setNewItem(prev => ({ ...prev, [field]: value }))
    }

    return {
        credits,
        loading,
        saving,
        editingId,
        setEditingId,
        newItem,
        handleAdd,
        handleUpdate,
        handleDelete,
        updateNewItem,
        refresh: loadData
    }
}
