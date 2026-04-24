"use client"

import { useState, useEffect, useMemo } from "react"
import { 
    getMessages, 
    updateMessageStatus, 
    deleteMessage 
} from '@/lib/message-actions'
import { 
    getSetting, 
    updateSetting 
} from '@/lib/setting-actions'

/**
 * useMessagesManager - Custom hook to manage user messages and site settings.
 * Maintains original data flow and server actions.
 */
export function useMessagesManager() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEnabled, setIsEnabled] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState('all') // all, unread, read
    const [actionLoading, setActionLoading] = useState(null)

    const loadData = async () => {
        try {
            const [msgData, settingData] = await Promise.all([
                getMessages(),
                getSetting('contact_form_enabled', 'true')
            ])
            setMessages(msgData)
            setIsEnabled(settingData === 'true')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let isMounted = true
        if (isMounted) {
            loadData()
        }
        return () => { isMounted = false }
    }, [])

    const handleToggle = async () => {
        const newValue = !isEnabled
        setIsEnabled(newValue)
        await updateSetting('contact_form_enabled', newValue ? 'true' : 'false')
    }

    const handleStatus = async (id, status) => {
        setActionLoading(id)
        const res = await updateMessageStatus(id, status)
        if (res.success) {
            setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
        }
        setActionLoading(null)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return
        setActionLoading(id)
        const res = await deleteMessage(id)
        if (res.success) {
            setMessages(prev => prev.filter(m => m.id !== id))
        }
        setActionLoading(null)
    }

    const filteredMessages = useMemo(() => {
        return messages.filter(m => {
            const matchesSearch = 
                m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                m.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                m.message.toLowerCase().includes(searchTerm.toLowerCase())
            
            const matchesFilter = filter === 'all' || m.status === filter
            return matchesSearch && matchesFilter
        })
    }, [messages, searchTerm, filter])

    return {
        messages: filteredMessages,
        allCount: messages.length,
        loading,
        isEnabled,
        searchTerm,
        setSearchTerm,
        filter,
        setFilter,
        actionLoading,
        handleToggle,
        handleStatus,
        handleDelete,
        refresh: loadData
    }
}
