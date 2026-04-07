'use client'

import { useState, useEffect } from 'react'
import { 
    getMessages, 
    updateMessageStatus, 
    deleteMessage 
} from '@/lib/message-actions'
import { 
    getSetting, 
    updateSetting 
} from '@/lib/setting-actions'
import { 
    Mail, Trash2, CheckCircle, Clock, Search, 
    ArrowLeft, Loader2, MessageSquare, AlertCircle, 
    ShieldCheck, Globe, Eye, EyeOff
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEnabled, setIsEnabled] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState('all') // all, unread, read
    const [actionLoading, setActionLoading] = useState(null)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const [msgData, settingData] = await Promise.all([
                getMessages(),
                getSetting('contact_form_enabled', 'true')
            ])
            setMessages(msgData)
            setIsEnabled(settingData === 'true')
            setLoading(false)
        }
        loadData()
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
            setMessages(messages.map(m => m.id === id ? { ...m, status } : m))
        }
        setActionLoading(null)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return
        setActionLoading(id)
        const res = await deleteMessage(id)
        if (res.success) {
            setMessages(messages.filter(m => m.id !== id))
        }
        setActionLoading(null)
    }

    const filteredMessages = messages.filter(m => {
        const matchesSearch = 
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            m.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
            m.message.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesFilter = filter === 'all' || m.status === filter
        return matchesSearch && matchesFilter
    })

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">
                            User <span className="text-[#FFD700]">Messages</span>
                        </h1>
                        <p className="text-gray-500 text-xs font-light tracking-wide mt-1">Manage incoming inquiries and site settings.</p>
                    </div>
                </div>

                {/* Toggle Section */}
                <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 flex items-center gap-4 shadow-xl">
                    <div className={cn(
                        "p-2 rounded-xl border transition-colors",
                        isEnabled ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
                    )}>
                        {isEnabled ? <Globe className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 pr-4">
                        <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none mb-1">Contact Form Status</p>
                        <p className="text-sm font-bold text-white">{isEnabled ? 'ONLINE' : 'OFFLINE'}</p>
                    </div>
                    <button 
                        onClick={handleToggle}
                        className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                            isEnabled ? "bg-green-500" : "bg-gray-700"
                        )}
                    >
                        <span className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                            isEnabled ? "translate-x-6" : "translate-x-1"
                        )} />
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#FFD700] transition-colors">
                        <Search className="w-5 h-5" />
                    </div>
                    <input 
                        type="text"
                        placeholder="Search by name, email, or message content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#FFD700] transition-all"
                    />
                </div>
                <div className="md:col-span-4">
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full bg-black border border-gray-800 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:border-[#FFD700] transition-all appearance-none"
                    >
                        <option value="all">All Messages</option>
                        <option value="unread">Unread Only</option>
                        <option value="read">Read Only</option>
                    </select>
                </div>
            </div>

            {/* Message List */}
            <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-800 rounded-3xl bg-gray-900/5">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                            <MessageSquare className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 italic">No messages found matching your criteria.</p>
                    </div>
                ) : (
                    filteredMessages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={cn(
                                "group bg-[#0a0a0a] border rounded-2xl p-6 transition-all duration-300 hover:border-gray-600",
                                msg.status === 'unread' ? "border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.03)]" : "border-gray-800"
                            )}
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-white font-black">
                                                {msg.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                                    {msg.name}
                                                    {msg.status === 'unread' && <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />}
                                                </h3>
                                                <p className="text-xs text-gray-400 flex items-center gap-1.5 font-light">
                                                    <Mail className="w-3 h-3" />
                                                    {msg.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase text-gray-600 tracking-[0.1em] mb-1">Received</p>
                                            <p className="text-xs text-gray-400 flex items-center gap-1.5 justify-end">
                                                <Clock className="w-3 h-3" />
                                                {format(new Date(msg.created_at), 'MMM d, yyyy · HH:mm')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-black/40 border border-gray-800/50 rounded-xl p-4">
                                        {msg.subject && (
                                            <p className="text-xs font-black text-[#FFD700] uppercase tracking-widest mb-2">Subject: {msg.subject}</p>
                                        )}
                                        <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                                            {msg.message}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                            <ShieldCheck className="w-3 h-3" />
                                            IP: {msg.ip_address}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {msg.status === 'unread' ? (
                                                <button 
                                                    onClick={() => handleStatus(msg.id, 'read')}
                                                    disabled={actionLoading === msg.id}
                                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold transition-all border border-white/5"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    Mark as Read
                                                </button>
                                            ) : (
                                                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/5 text-green-400 rounded-lg text-xs font-bold border border-green-500/10">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Seen
                                                </div>
                                            )}
                                            <button 
                                                onClick={() => handleDelete(msg.id)}
                                                disabled={actionLoading === msg.id}
                                                className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-all"
                                            >
                                                {actionLoading === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
