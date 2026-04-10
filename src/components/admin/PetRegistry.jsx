"use client"

import { useState } from "react"
import { Plus, Edit3, Trash2, X, Save, Loader2, Sparkles } from "lucide-react"
import { clsx } from "clsx"
import { upsertPetRegistry, deletePetRegistry } from "@/lib/registry-actions"
import { toast } from "sonner"

const GRADES = ["r", "l"]

export default function PetRegistry({ initialData }) {
    const [pets, setPets] = useState(initialData)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPet, setEditingPet] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    // Form State
    const [formData, setFormData] = useState({ name: "", grade: "l", atk_all: 0, def: 0, hp: 0 })

    const openModal = (pet = null) => {
        if (pet) {
            setEditingPet(pet)
            setFormData({ ...pet })
        } else {
            setEditingPet(null)
            setFormData({ name: "", grade: "l", atk_all: 0, def: 0, hp: 0 })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)
        try {
            const result = await upsertPetRegistry(formData)
            if (result.success) {
                toast.success(editingPet ? "Pet updated" : "Pet registered")
                window.location.reload() // Simpler for multi-table refresh
            }
        } catch (err) {
            console.error(err)
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
            console.error(err)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button 
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/10"
                >
                    <Plus className="w-4 h-4" />
                    Register New Pet
                </button>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-separate border-spacing-0 text-left">
                        <thead>
                            <tr className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                <th className="px-6 py-4 border-b border-white/5">Pet Identity</th>
                                <th className="px-6 py-4 border-b border-white/5">Base Stats (+5)</th>
                                <th className="px-6 py-4 border-b border-white/5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {pets.map((pet) => (
                                <tr key={pet.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                                <Sparkles className="w-5 h-5 text-amber-500" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-white">{pet.name}</div>
                                                <div className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">{pet.grade} GRADE</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-6 text-[10px] items-center italic tabular-nums">
                                            <span className="text-gray-400"><span className="text-gray-600 uppercase font-black mr-2">ATK</span>{pet.atk_all}</span>
                                            <span className="text-gray-400"><span className="text-gray-600 uppercase font-black mr-2">DEF</span>{pet.def}</span>
                                            <span className="text-gray-400"><span className="text-gray-600 uppercase font-black mr-2">HP</span>{pet.hp}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openModal(pet)} className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(pet.id)} className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pets.length === 0 && (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">No pets registered yet</td>
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
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-amber-500/5 to-transparent">
                            <h3 className="text-lg font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                                <Sparkles className="w-5 h-5 text-amber-500" />
                                {editingPet ? "Edit Pet" : "Register Pet"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-600 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Pet Name</label>
                                    <input 
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-amber-500 transition-all"
                                        placeholder="Enter pet name..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Grade</label>
                                    <select 
                                        value={formData.grade}
                                        onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-amber-500 appearance-none cursor-pointer transition-all"
                                    >
                                        {GRADES.map(g => <option key={g} value={g}>{g.toUpperCase()}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">All Atk</label>
                                    <input 
                                        type="number"
                                        value={formData.atk_all}
                                        onChange={(e) => setFormData(prev => ({ ...prev, atk_all: parseInt(e.target.value) || 0 }))}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-amber-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">Defense</label>
                                    <input 
                                        type="number"
                                        value={formData.def}
                                        onChange={(e) => setFormData(prev => ({ ...prev, def: parseInt(e.target.value) || 0 }))}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-amber-500 transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest ml-1">HP</label>
                                    <input 
                                        type="number"
                                        value={formData.hp}
                                        onChange={(e) => setFormData(prev => ({ ...prev, hp: parseInt(e.target.value) || 0 }))}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-amber-500 transition-all"
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
                                    className="flex-[2] bg-amber-500 text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {editingPet ? "Update Pet" : "Save Pet"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
