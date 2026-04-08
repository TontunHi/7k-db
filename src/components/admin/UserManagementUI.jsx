"use client"

import { useState, useMemo } from "react"
import { Users, Plus, Trash2, Edit2, Shield, X, Check, Key, Calendar, Lock, Globe, AlertCircle, Search, Filter, CheckSquare, Square, User } from "lucide-react"
import { createUser, updateUser, deleteUser } from "@/lib/user-actions"
import { clsx } from "clsx"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const PERMISSION_GROUPS = [
    {
        name: 'Content Management',
        permissions: [
            { id: 'MANAGE_BUILDS', label: 'Hero Builds', color: 'text-blue-400 bg-blue-400/10' },
            { id: 'MANAGE_TIERLIST', label: 'Tier List', color: 'text-pink-400 bg-pink-400/10' },
        ]
    },
    {
        name: 'Game Modes',
        permissions: [
            { id: 'MANAGE_STAGES', label: 'Stages', color: 'text-amber-400 bg-amber-400/10' },
            { id: 'MANAGE_DUNGEONS', label: 'Dungeons', color: 'text-emerald-400 bg-emerald-400/10' },
            { id: 'MANAGE_RAIDS', label: 'Raids', color: 'text-red-400 bg-red-400/10' },
            { id: 'MANAGE_CASTLE_RUSH', label: 'Castle Rush', color: 'text-yellow-400 bg-yellow-400/10' },
            { id: 'MANAGE_ADVENT', label: 'Advent', color: 'text-violet-400 bg-violet-400/10' },
            { id: 'MANAGE_ARENA', label: 'Arena', color: 'text-orange-400 bg-orange-400/10' },
            { id: 'MANAGE_TOTAL_WAR', label: 'Total War', color: 'text-rose-400 bg-rose-400/10' },
            { id: 'MANAGE_GUILD_WAR', label: 'Guild War', color: 'text-indigo-400 bg-indigo-400/10' },
        ]
    },
    {
        name: 'System & Misc',
        permissions: [
            { id: 'MANAGE_MESSAGES', label: 'Messages', color: 'text-cyan-400 bg-cyan-400/10' },
            { id: 'MANAGE_ASSETS', label: 'Assets', color: 'text-gray-400 bg-gray-400/10' },
            { id: 'MANAGE_CREDITS', label: 'Credits', color: 'text-rose-300 bg-rose-300/10' },
        ]
    }
]

const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap(g => g.permissions)

export default function UserManagementUI({ initialUsers, currentUser }) {
    const router = useRouter()
    
    // State
    const [searchQuery, setSearchQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState('ALL') // ALL, SUPER_ADMIN, ADMIN
    
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'admin',
        permissions: []
    })

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return initialUsers.filter(u => {
            const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesRole = roleFilter === 'ALL' || u.role.toUpperCase() === roleFilter
            return matchesSearch && matchesRole
        })
    }, [initialUsers, searchQuery, roleFilter])

    const openCreateModal = () => {
        setEditingUser(null)
        setFormData({ username: '', password: '', role: 'admin', permissions: [] })
        setIsModalOpen(true)
    }

    const openEditModal = (user) => {
        setEditingUser(user)
        setFormData({
            username: user.username,
            password: '',
            role: user.role,
            permissions: user.permissions || []
        })
        setIsModalOpen(true)
    }

    const handlePermissionToggle = (permId) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permId)
                ? prev.permissions.filter(p => p !== permId)
                : [...prev.permissions, permId]
        }))
    }
    
    const handleSelectAllPermissions = () => {
        const allIds = ALL_PERMISSIONS.map(p => p.id)
        setFormData(prev => ({ ...prev, permissions: allIds }))
    }
    
    const handleClearAllPermissions = () => {
        setFormData(prev => ({ ...prev, permissions: [] }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        
        const actionPromise = editingUser 
            ? updateUser(editingUser.id, formData)
            : createUser(formData)
            
        toast.promise(actionPromise, {
            loading: editingUser ? 'Updating user...' : 'Creating user...',
            success: () => {
                setLoading(false)
                setIsModalOpen(false)
                router.refresh()
                return `User ${editingUser ? 'updated' : 'created'} successfully!`
            },
            error: (err) => {
                setLoading(false)
                return err.message || 'Operation failed'
            }
        })
    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return
        
        toast.promise(deleteUser(id), {
            loading: 'Deleting user...',
            success: () => {
                router.refresh()
                return 'User deleted successfully!'
            },
            error: (err) => err.message || 'Deleted failed'
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header Section */}
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700] to-amber-600 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl backdrop-blur-xl">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-8 bg-[#FFD700] rounded-full"></div>
                            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
                                Team <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-amber-500">Access</span>
                            </h1>
                        </div>
                        <p className="text-gray-500 text-sm font-medium tracking-wide ml-5 uppercase">Administrative privileges and account controls</p>
                    </div>
                    <button 
                        onClick={openCreateModal}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-br from-[#FFD700] to-amber-500 text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase italic text-sm shadow-[0_0_40px_rgba(255,215,0,0.15)] group/btn"
                    >
                        <Plus className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-300" />
                        Create New Admin
                    </button>
                </div>
            </div>
            
            {/* Toolbar: Search and Filter */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="Search by username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/50 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#FFD700]/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto p-1 bg-black/50 rounded-xl border border-white/5">
                    <Filter className="w-4 h-4 text-gray-500 ml-2" />
                    {['ALL', 'SUPER_ADMIN', 'ADMIN'].map(role => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={clsx(
                                "px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                                roleFilter === role 
                                    ? role === 'SUPER_ADMIN' ? "bg-[#FFD700] text-black" : "bg-white text-black" 
                                    : "text-gray-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {role.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {filteredUsers.length === 0 ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-3xl">
                        <User size={48} className="mb-4 opacity-50" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-1">No personnel found</h3>
                        <p className="text-sm">Try adjusting your search query or filters above.</p>
                    </div>
                ) : filteredUsers.map(user => {
                    const isSelf = user.id === currentUser?.id
                    const isSuper = user.role === 'super_admin'
                    
                    return (
                        <div key={user.id} className={clsx(
                            "relative group p-6 border rounded-3xl transition-all duration-500 overflow-hidden",
                            isSuper 
                                ? "bg-gradient-to-br from-[#FFD700]/5 to-transparent border-[#FFD700]/10 hover:border-[#FFD700]/30 hover:shadow-[0_0_50px_rgba(255,215,0,0.05)]" 
                                : "bg-white/5 border-white/5 hover:bg-white/[0.08] hover:border-white/10"
                        )}>
                            {/* Role Background Text */}
                            <div className="absolute -bottom-4 -right-4 text-7xl font-black italic uppercase opacity-[0.02] pointer-events-none select-none">
                                {user.role}
                            </div>

                            <div className="relative flex flex-col h-full gap-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx(
                                            "w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner transition-transform duration-500 group-hover:scale-110",
                                            isSuper ? "bg-[#FFD700]/10 border-[#FFD700]/20" : "bg-black border-white/5"
                                        )}>
                                            <Shield className={clsx("w-8 h-8", isSuper ? "text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" : "text-gray-500")} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{user.username}</h3>
                                                {isSelf && (
                                                    <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">You</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest shrink-0">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={12} className="text-[#FFD700]/50" />
                                                    <span suppressHydrationWarning>{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <Lock size={12} className="text-[#FFD700]/50" />
                                                    {isSuper ? 'Full Access' : `${user.permissions?.length || 0}/${ALL_PERMISSIONS.length} Modules`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button 
                                            onClick={() => openEditModal(user)}
                                            className="p-2.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                            title="Edit user"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        {!isSelf && (
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2.5 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                                title="Delete user"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Permissions View */}
                                <div className="mt-2 space-y-3">
                                    <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] px-1">Active Modules</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {isSuper ? (
                                            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
                                                <Globe size={14} className="text-amber-500" />
                                                <span className="text-[11px] font-black text-amber-500 uppercase tracking-widest italic">All Admin Access Granted</span>
                                            </div>
                                        ) : (
                                            user.permissions?.length > 0 ? (
                                                user.permissions.map(pId => {
                                                    const perm = ALL_PERMISSIONS.find(ap => ap.id === pId)
                                                    return (
                                                        <span key={pId} className={clsx(
                                                            "px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-tight transition-all",
                                                            perm ? perm.color : "bg-white/5 border-white/5 text-gray-500"
                                                        )}>
                                                            {perm?.label || pId}
                                                        </span>
                                                    )
                                                })
                                            ) : (
                                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/10">
                                                    <AlertCircle size={14} className="text-red-500/50" />
                                                    <span className="text-[11px] font-bold text-gray-600 uppercase">No Permissions Assigned</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Premium Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setIsModalOpen(false)} />
                    
                    <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#0a0a0a] border border-white/10 rounded-[40px] p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-8 right-8 p-3 text-gray-500 hover:text-white bg-white/5 rounded-2xl hover:rotate-90 transition-all duration-300"
                        >
                            <X size={24} />
                        </button>

                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
                                {editingUser ? 'Update' : 'Initialize'} <span className="text-[#FFD700]">Admin</span>
                            </h2>
                            <p className="text-gray-500 font-medium text-sm tracking-wide">CONFIGURE USER ACCESS AND ACCOUNT SECURITY</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-1">Admin Username</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={formData.username}
                                        onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                        className="w-full bg-[#111] border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#FFD700] focus:bg-black transition-all outline-none font-bold"
                                        placeholder="e.g. guild_lead"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-1">
                                        {editingUser ? 'Credentials (Skip to keep original)' : 'Admin Password'}
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="password" 
                                            required={!editingUser}
                                            value={formData.password}
                                            onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                            className="w-full bg-[#111] border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-[#FFD700] focus:bg-black transition-all outline-none font-bold placeholder:tracking-widest"
                                            placeholder="••••••••"
                                        />
                                        <Key className="absolute right-6 top-5 w-4 h-4 text-gray-700" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-1">Privilege Level</label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                                        className={clsx(
                                            "relative p-6 rounded-3xl border-2 transition-all flex flex-col gap-1 items-start",
                                            formData.role === 'admin' ? "bg-white/5 border-white text-white" : "border-white/5 text-gray-600 hover:border-white/10"
                                        )}
                                    >
                                        <span className="font-black italic uppercase tracking-tighter text-lg">Standard Admin</span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-left">Restricted to specific modules</span>
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, role: 'super_admin' }))}
                                        className={clsx(
                                            "relative p-6 rounded-3xl border-2 transition-all flex flex-col gap-1 items-start",
                                            formData.role === 'super_admin' ? "bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]" : "border-white/5 text-gray-600 hover:border-white/10"
                                        )}
                                    >
                                        <span className="font-black italic uppercase tracking-tighter text-lg">Super Admin</span>
                                        <span className="text-[10px] font-bold text-gray-500/60 uppercase tracking-widest text-left">All Power • System Settings</span>
                                    </button>
                                </div>
                            </div>

                            {formData.role === 'admin' && (
                                <div className="space-y-5 animate-in slide-in-from-top-2 duration-500 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">Manageable Modules</label>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={handleSelectAllPermissions} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-white transition-colors">
                                                <CheckSquare size={14} /> All
                                            </button>
                                            <button type="button" onClick={handleClearAllPermissions} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold text-gray-400 transition-colors">
                                                <Square size={14} /> Clear
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        {PERMISSION_GROUPS.map((group, gIdx) => (
                                            <div key={gIdx} className="space-y-3">
                                                <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-wider">{group.name}</h5>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {group.permissions.map(p => (
                                                        <button
                                                            key={p.id}
                                                            type="button"
                                                            onClick={() => handlePermissionToggle(p.id)}
                                                            className={clsx(
                                                                "group flex items-center justify-between px-3 py-3 rounded-xl border-2 text-[10px] sm:text-xs font-black uppercase tracking-tight transition-all",
                                                                formData.permissions.includes(p.id)
                                                                    ? "bg-white/10 border-white text-white"
                                                                    : "bg-black/50 border-white/5 text-gray-600 hover:border-white/20 hover:text-gray-300"
                                                            )}
                                                        >
                                                            <span className="truncate pr-2">{p.label}</span>
                                                            <div className={clsx(
                                                                "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                                                                formData.permissions.includes(p.id) ? "bg-white border-white text-black" : "border-white/20"
                                                            )}>
                                                                {formData.permissions.includes(p.id) && <Check size={10} strokeWidth={4} />}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6">
                                <button 
                                    disabled={loading}
                                    className="relative w-full overflow-hidden py-5 bg-white text-black font-black uppercase italic rounded-full hover:bg-[#FFD700] transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 group/save"
                                >
                                    <span className="relative z-10">{loading ? 'Processing...' : (editingUser ? 'Commit Changes' : 'Initialize Account')}</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-[#FFD700] opacity-0 group-hover/save:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
