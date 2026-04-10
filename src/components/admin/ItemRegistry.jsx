"use client"

import { useState } from "react"
import { Plus, Edit3, Trash2, X, Save, Loader2, Sword } from "lucide-react"
import { clsx } from "clsx"
import { upsertItemRegistry, deleteItemRegistry } from "@/lib/registry-actions"
import { toast } from "sonner"

const GRADES = ["r", "l", "l+", "l++"]
const ITEM_TYPES = ["Weapon", "Armor", "Accessory"]

export default function ItemRegistry({ initialData }) {
    const [items, setItems] = useState(initialData)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState({ 
        name: "", grade: "l", item_type: "Weapon", 
        atk_all_perc: 0, def_perc: 0, hp_perc: 0 
    })

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item)
            setFormData({ ...item })
        } else {
            setEditingItem(null)
            setFormData({ 
                name: "", grade: "l", item_type: "Weapon", 
                atk_all_perc: 0, def_perc: 0, hp_perc: 0 
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const result = await upsertItemRegistry(formData)
            if (result.success) {
                toast.success(editingItem ? "Item updated" : "Item registered")
                window.location.reload()
            }
        } catch (err) {
            console.error(err)
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
            console.error(err)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button 
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-emerald-500/10"
                >
                    <Plus className="w-4 h-4" />
                    Register New Item
                </button>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-separate border-spacing-0 text-left">
                        <thead>
                            <tr className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                <th className="px-6 py-4 border-b border-white/5">Item Identity</th>
                                <th className="px-6 py-4 border-b border-white/5">Primary Stats (+15)</th>
                                <th className="px-6 py-4 border-b border-white/5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items.map((item) => (
                                <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                <Sword className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-white">{item.name}</div>
                                                <div className="flex gap-2">
                                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-1.5 py-0.5 rounded leading-none">{item.grade}</span>
                                                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest bg-gray-900 border border-gray-800 px-1.5 py-0.5 rounded leading-none">{item.item_type}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-6 text-[10px] items-center tabular-nums">
                                            <span className="text-gray-400 group-hover:text-white transition-colors"><span className="text-gray-600 uppercase font-black mr-2">ATK (%)</span>{item.atk_all_perc}%</span>
                                            <span className="text-gray-400 group-hover:text-white transition-colors"><span className="text-gray-600 uppercase font-black mr-2">DEF (%)</span>{item.def_perc}%</span>
                                            <span className="text-gray-400 group-hover:text-white transition-colors"><span className="text-gray-600 uppercase font-black mr-2">HP (%)</span>{item.hp_perc}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2 text-right">
                                            <button onClick={() => openModal(item)} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">No items registered yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-md bg-[#0a0a0a] border border-[#FFD700]/10 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-emerald-500/5 to-transparent">
                            <h3 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                                <Sword className="w-5 h-5 text-emerald-500" />
                                {editingItem ? "Edit Item" : "Register Item"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Item Name</label>
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-500 transition-all"
                                        placeholder="Enter item name..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Grade</label>
                                        <select 
                                            value={formData.grade}
                                            onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                                        >
                                            {GRADES.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Item Type</label>
                                        <select 
                                            value={formData.item_type}
                                            onChange={(e) => setFormData(prev => ({ ...prev, item_type: e.target.value }))}
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                                        >
                                            {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1 text-center">Atk %</label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        value={formData.atk_all_perc}
                                        onChange={(e) => setFormData(prev => ({ ...prev, atk_all_perc: parseFloat(e.target.value) || 0 }))}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-500 transition-all text-center"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1 text-center">Def %</label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        value={formData.def_perc}
                                        onChange={(e) => setFormData(prev => ({ ...prev, def_perc: parseFloat(e.target.value) || 0 }))}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-500 transition-all text-center"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1 text-center">HP %</label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        value={formData.hp_perc}
                                        onChange={(e) => setFormData(prev => ({ ...prev, hp_perc: parseFloat(e.target.value) || 0 }))}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-emerald-500 transition-all text-center"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-3 border border-white/10 rounded-xl text-xs font-black uppercase text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-[2] bg-emerald-500 text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/10"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {editingItem ? "Update Item" : "Save Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
