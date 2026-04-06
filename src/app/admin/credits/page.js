'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
    getGlobalCredits, 
    createGlobalCredit, 
    updateGlobalCredit, 
    deleteGlobalCredit 
} from '@/lib/credit-actions'
import { 
    Plus, Trash2, Save, Loader2, ArrowLeft, 
    Youtube, Share2, Facebook, MessageSquare, Link as LinkIcon, Edit2, X
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const PLATFORMS = [
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500' },
    { id: 'tiktok', name: 'TikTok', icon: Share2, color: 'text-pink-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-500' },
    { id: 'discord', name: 'Discord', icon: MessageSquare, color: 'text-indigo-400' },
    { id: 'other', name: 'Other', icon: LinkIcon, color: 'text-gray-400' },
]

export default function CreditsAdminPage() {
    const router = useRouter()
    const [credits, setCredits] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [newItem, setNewItem] = useState({ platform: 'youtube', name: '', link: '' })

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const data = await getGlobalCredits()
            setCredits(data)
            setLoading(false)
        }
        loadData()
    }, [])

    const handleAdd = async () => {
        if (!newItem.name || !newItem.link) return
        setSaving(true)
        const res = await createGlobalCredit(newItem)
        if (res.success) {
            const updated = await getGlobalCredits()
            setCredits(updated)
            setNewItem({ platform: 'youtube', name: '', link: '' })
        }
        setSaving(false)
    }

    const handleUpdate = async (id, data) => {
        setSaving(true)
        const res = await updateGlobalCredit(id, data)
        if (res.success) {
            setEditingId(null)
            const updated = await getGlobalCredits()
            setCredits(updated)
        }
        setSaving(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this attribution?')) return
        setSaving(true)
        const res = await deleteGlobalCredit(id)
        if (res.success) {
            const updated = await getGlobalCredits()
            setCredits(updated)
        }
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">
                        Manage <span className="text-[#FFD700]">Credits</span>
                    </h1>
                </div>
            </div>

            {/* Add New Credit */}
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] to-amber-600" />
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-[#FFD700]" />
                    Add Source / Attribution
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Platform</label>
                        <select 
                            value={newItem.platform}
                            onChange={(e) => setNewItem({ ...newItem, platform: e.target.value })}
                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FFD700] transition-colors appearance-none"
                        >
                            {PLATFORMS.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Creator Name</label>
                        <input 
                            type="text"
                            placeholder="e.g. SevenKnightsThai"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FFD700] transition-colors"
                        />
                    </div>
                    <div className="md:col-span-4">
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Channel Link</label>
                        <input 
                            type="url"
                            placeholder="https://youtube.com/@..."
                            value={newItem.link}
                            onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FFD700] transition-colors"
                        />
                    </div>
                    <div className="md:col-span-2 flex items-end">
                        <button 
                            onClick={handleAdd}
                            disabled={saving || !newItem.name || !newItem.link}
                            className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/10 active:scale-95 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {/* List of Credits */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest ml-1">Existing attributions ({credits.length})</h3>
                {credits.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-gray-800 rounded-2xl bg-gray-900/10">
                        <p className="text-gray-500 italic">No attributions added yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {credits.map((item) => (
                            <div key={item.id} className="group bg-[#0a0a0a] border border-gray-800 rounded-2xl p-4 hover:border-gray-600 transition-all flex items-center justify-between">
                                {editingId === item.id ? (
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3">
                                        <div className="md:col-span-3">
                                            <select 
                                                defaultValue={item.platform}
                                                id={`plat-${item.id}`}
                                                className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                                            >
                                                {PLATFORMS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="md:col-span-3">
                                            <input 
                                                id={`name-${item.id}`}
                                                defaultValue={item.name}
                                                className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-4">
                                            <input 
                                                id={`link-${item.id}`}
                                                defaultValue={item.link}
                                                className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
                                            />
                                        </div>
                                        <div className="md:col-span-2 flex gap-2">
                                            <button 
                                                onClick={() => handleUpdate(item.id, {
                                                    platform: document.getElementById(`plat-${item.id}`).value,
                                                    name: document.getElementById(`name-${item.id}`).value,
                                                    link: document.getElementById(`link-${item.id}`).value
                                                })}
                                                className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500 rounded-lg p-2 transition-all hover:text-white"
                                            >
                                                <Save className="w-5 h-5 mx-auto" />
                                            </button>
                                            <button 
                                                onClick={() => setEditingId(null)}
                                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg p-2 transition-all"
                                            >
                                                <X className="w-5 h-5 mx-auto" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-black rounded-xl border border-gray-800">
                                                {(() => {
                                                    const P = PLATFORMS.find(p => p.id === item.platform) || PLATFORMS[4]
                                                    return <P.icon className={cn("w-6 h-6", P.color)} />
                                                })()}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg">{item.name}</h4>
                                                <p className="text-xs text-gray-500 flex items-center gap-1.5 truncate max-w-[200px] md:max-w-md">
                                                    <LinkIcon className="w-3 h-3" />
                                                    {item.link}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setEditingId(item.id)}
                                                className="p-2.5 bg-gray-800 hover:bg-blue-500/20 hover:text-blue-400 text-gray-400 rounded-xl transition-all border border-gray-700/50"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2.5 bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-gray-400 rounded-xl transition-all border border-gray-700/50"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
