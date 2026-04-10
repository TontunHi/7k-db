"use client"

import { useState, useMemo } from "react"
import { Search, Edit3, X, Save, Loader2, ChevronRight, Info } from "lucide-react"
import { clsx } from "clsx"
import SafeImage from "../shared/SafeImage"
import { updateHeroRegistry } from "@/lib/registry-actions"
import { toast } from "sonner"

const TYPES = ["Attack", "Magic", "Defense", "Support", "Universal"]
const GROUPS = ["Physical", "Magic"]

const STAT_FIELDS = [
    { key: "atk_phys", label: "Phys Atk", type: "number" },
    { key: "atk_mag", label: "Mag Atk", type: "number" },
    { key: "def", label: "Defense", type: "number" },
    { key: "hp", label: "HP", icon: "HP", type: "number" },
    { key: "speed", label: "Speed", type: "number" },
    { key: "crit_rate", label: "Crit %", type: "float" },
    { key: "crit_dmg", label: "Crit Dmg %", type: "float" },
    { key: "weak_hit", label: "Weakness %", type: "float" },
    { key: "block_rate", label: "Block %", type: "float" },
    { key: "dmg_red", label: "Dmg Red %", type: "float" },
    { key: "eff_hit", label: "Eff Hit %", type: "float" },
    { key: "eff_res", label: "Eff Res %", type: "float" }
]

export default function HeroRegistry({ initialData }) {
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

    const handleSave = async () => {
        if (!editingHero) return
        setIsSaving(true)
        try {
            const result = await updateHeroRegistry(editingHero.filename, formData)
            if (result.success) {
                toast.success(`Updated ${editingHero.name} registry`)
                // Update local state
                setHeroes(prev => prev.map(h => h.filename === editingHero.filename ? { ...h, ...formData } : h))
                setEditingHero(null)
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to update registry")
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex gap-6 relative">
            {/* Table Section */}
            <div className={clsx("flex-1 transition-all duration-500", editingHero ? "w-2/3" : "w-full")}>
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4 bg-gradient-to-r from-white/[0.02] to-transparent">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                            <input 
                                type="text"
                                placeholder="Search hero registry..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm font-bold text-white focus:border-[#FFD700] outline-none transition-all"
                            />
                        </div>
                        <div className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                            {filteredHeroes.length} HEROES
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full border-separate border-spacing-0">
                            <thead>
                                <tr className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-left">
                                    <th className="px-6 py-4 border-b border-white/5">Hero</th>
                                    <th className="px-6 py-4 border-b border-white/5">Group / Type</th>
                                    <th className="px-6 py-4 border-b border-white/5">Primary Stats</th>
                                    <th className="px-6 py-4 border-b border-white/5 text-right w-20">Edit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredHeroes.map((hero) => (
                                    <tr key={hero.filename} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 relative rounded-lg overflow-hidden border border-white/10 group-hover:border-[#FFD700]/30 transition-all">
                                                    <SafeImage src={`/heroes/${hero.filename}.webp`} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-white">{hero.name}</div>
                                                    <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{hero.grade}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={clsx(
                                                        "text-[8px] font-black uppercase px-2 py-0.5 rounded-md border",
                                                        hero.hero_group === "Physical" ? "text-orange-400 border-orange-400/20 bg-orange-400/5" : "text-blue-400 border-blue-400/20 bg-blue-400/5"
                                                    )}>
                                                        {hero.hero_group || "—"}
                                                    </span>
                                                    <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md border border-gray-800 bg-gray-900 text-gray-400">
                                                        {hero.type || "—"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-6 text-[10px] tabular-nums font-bold">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-600 text-[8px] uppercase tracking-tighter">Atk / Matk</span>
                                                    <span className="text-white">{hero.atk_phys || 0} / {hero.atk_mag || 0}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-600 text-[8px] uppercase tracking-tighter">Defense</span>
                                                    <span className="text-white">{hero.def || 0}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-gray-600 text-[8px] uppercase tracking-tighter">HP</span>
                                                    <span className="text-white">{hero.hp || 0}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => startEditing(hero)}
                                                className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:border-[#FFD700]/30 hover:bg-[#FFD700]/5 transition-all"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Editing Side Panel */}
            {editingHero && (
                <div className="w-[400px] flex-shrink-0 bg-[#0a0a0a] border border-[#FFD700]/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.05)] h-fit sticky top-6 animate-in slide-in-from-right duration-500">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-b from-[#FFD700]/5 to-transparent">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 relative rounded-xl overflow-hidden border border-[#FFD700]/30 shadow-2xl">
                                <SafeImage src={`/heroes/${editingHero.filename}.webp`} fill className="object-cover" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white italic tracking-tight">{editingHero.name}</h3>
                                <p className="text-[9px] font-bold text-[#FFD700] uppercase tracking-[0.2em]">{editingHero.grade}</p>
                            </div>
                        </div>
                        <button onClick={() => setEditingHero(null)} className="text-gray-600 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {/* Classification */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1 h-1 bg-[#FFD700] rounded-full" />
                                Classification
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold text-gray-600 uppercase ml-1">Hero Group</label>
                                    <select 
                                        value={formData.hero_group}
                                        onChange={(e) => setFormData(prev => ({ ...prev, hero_group: e.target.value }))}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-orange-500 transition-all appearance-none cursor-pointer"
                                    >
                                        {GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-bold text-gray-600 uppercase ml-1">Role Type</label>
                                    <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                    >
                                        {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <div className="w-1 h-1 bg-[#FFD700] rounded-full" />
                                Base Stats (Lv 30 +5)
                            </h4>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                                {STAT_FIELDS.map((stat) => (
                                    <div key={stat.key} className="space-y-1.5">
                                        <label className="text-[8px] font-bold text-gray-600 uppercase ml-1">{stat.label}</label>
                                        <input 
                                            type="number"
                                            step={stat.type === "float" ? "0.01" : "1"}
                                            value={formData[stat.key]}
                                            onChange={(e) => setFormData(prev => ({ ...prev, [stat.key]: parseFloat(e.target.value) || 0 }))}
                                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-[#FFD700] transition-all"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/5 bg-black/40">
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full bg-[#FFD700] text-black h-12 rounded-xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-[#FFD700]/10"
                        >
                            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Update Registry
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
