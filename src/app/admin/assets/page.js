'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { UploadCloud, Trash2, LayoutDashboard, Search, Image as ImageIcon, Loader2, Folder, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { getAllHeroes, getPets, getAllSkills } from '@/lib/stage-actions'

export default function AdminAssetsPage() {
    const [heroes, setHeroes] = useState([])
    const [pets, setPets] = useState([])
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [activeTab, setActiveTab] = useState('heroes') // 'heroes' | 'pets' | 'skills'
    const [search, setSearch] = useState('')
    const [skillFolder, setSkillFolder] = useState('')

    const loadData = async () => {
        setLoading(true)
        try {
            const [h, p, s] = await Promise.all([getAllHeroes(), getPets(), getAllSkills()])
            setHeroes(h)
            setPets(p)
            setSkills(s)
        } catch (error) {
            toast.error('Failed to load assets: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return

        if (activeTab === 'skills' && !skillFolder) {
            toast.error('Please select a hero folder or create one first!')
            return
        }

        setUploading(true)
        try {
            for (const file of files) {
                const formData = new FormData()
                formData.append('type', activeTab)
                formData.append('file', file)
                if (activeTab === 'skills') {
                    formData.append('subfolder', skillFolder)
                }
                
                const res = await fetch('/api/assets', {
                    method: 'POST',
                    body: formData
                })
                
                const data = await res.json()
                if (!res.ok) throw new Error(data.error)
            }
            toast.success(`Uploaded ${files.length} file(s) successfully!`)
            loadData() // refresh list
        } catch (error) {
            toast.error('Upload Failed: ' + error.message)
        } finally {
            setUploading(false)
            e.target.value = '' // clear input
        }
    }

    const handleDelete = async (filename, folder = '') => {
        if (!confirm(`Are you sure you want to delete ${filename}?`)) return
        
        try {
            const cleanFilename = filename.startsWith('/') ? filename.split('/').pop() : filename
            
            let url = `/api/assets?type=${activeTab}&filename=${encodeURIComponent(cleanFilename)}`
            if (activeTab === 'skills') {
                url += `&subfolder=${folder || skillFolder}`
            }

            const res = await fetch(url, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            
            toast.success(`Deleted ${cleanFilename}`)
            loadData()
        } catch (error) {
            toast.error('Delete Failed: ' + error.message)
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 w-full">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 shadow-2xl">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700]/20 to-purple-500/20 flex items-center justify-center border border-[#FFD700]/30 shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                        <ImageIcon className="w-8 h-8 text-[#FFD700]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            Asset Manager
                        </h1>
                        <p className="text-gray-400 font-medium mt-1">Directly manage Hero, Pet, and Skill image assets on the server.</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-gray-900/40 p-4 rounded-xl border border-gray-800 gap-4">
                <div className="flex bg-black/50 p-1 rounded-lg w-full md:w-auto">
                    {['heroes', 'pets', 'skills'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-md font-bold text-sm capitalize transition-colors ${
                                activeTab === tab ? 'bg-[#FFD700] text-black shadow' : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black/50 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-white focus:border-[#FFD700] outline-none"
                        />
                    </div>
                    
                    <div className="relative">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleUpload}
                            disabled={uploading || (activeTab === 'skills' && !skillFolder)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <button className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all ${(uploading || (activeTab === 'skills' && !skillFolder)) ? 'opacity-50' : ''}`}>
                            {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                            {uploading ? 'Uploading...' : 'Upload Images'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Skill Folder Selector */}
            {activeTab === 'skills' && skillFolder && (
                <div className="flex items-center gap-4 bg-gray-900/30 p-4 rounded-xl border border-[#FFD700]/50 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                    <button onClick={() => setSkillFolder('')} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300 flex items-center gap-2 font-bold text-sm">
                        <ArrowLeft className="w-4 h-4" /> Back to Folders
                    </button>
                    <div className="w-px h-6 bg-gray-700 mx-2" />
                    <label className="text-gray-400 font-bold text-sm">Uploading to:</label>
                    <div className="px-4 py-2 bg-black rounded-lg border border-gray-700 font-mono text-[#FFD700] font-bold">
                        {skillFolder}
                    </div>
                </div>
            )}
            {activeTab === 'skills' && !skillFolder && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-900/30 p-4 rounded-xl border border-gray-800">
                    <label className="text-gray-400 font-bold text-sm">Create / Find Folder:</label>
                    <div className="flex-1 w-full max-w-sm flex gap-2">
                        <input 
                            list="hero-folders" 
                            id="new-folder-input"
                            placeholder="e.g. l+_eileene"
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-[#FFD700]"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value) {
                                    setSkillFolder(e.target.value)
                                }
                            }}
                        />
                        <button 
                            onClick={() => {
                                const val = document.getElementById('new-folder-input').value
                                if (val) setSkillFolder(val)
                            }}
                            className="bg-[#FFD700]/20 text-[#FFD700] px-4 py-2 rounded-lg font-bold hover:bg-[#FFD700]/30 transition-colors"
                        >
                            Open
                        </button>
                        <datalist id="hero-folders">
                            {[...new Set(heroes.map(h => h.filename?.replace(/\.[^/.]+$/, '')))].filter(Boolean).map(folder => (
                                <option key={folder} value={folder} />
                            ))}
                        </datalist>
                    </div>
                </div>
            )}

            {/* Content Area */}
            {loading ? (
                <div className="flex justify-center p-20">
                    <Loader2 className="w-10 h-10 animate-spin text-[#FFD700]" />
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {activeTab === 'heroes' && heroes
                        .filter(h => h.filename && h.filename.toLowerCase().includes(search.toLowerCase()))
                        .map(h => (
                        <div key={h.filename} className="group relative aspect-[3/4] bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex flex-col hover:border-[#FFD700] transition-colors">
                            <div className="relative flex-1 w-full h-full p-2">
                                <Image src={`/heroes/${h.filename}`} alt="" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={() => handleDelete(h.filename)} className="p-3 bg-red-600/90 text-white rounded-full hover:bg-red-500 hover:scale-110 transition-all shadow-lg">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-2 bg-black text-center border-t border-gray-800 truncate text-xs text-gray-400 font-mono">
                                {h.filename}
                            </div>
                        </div>
                    ))}

                    {activeTab === 'pets' && pets
                        .filter(p => p.toLowerCase().includes(search.toLowerCase()))
                        .map(p => (
                        <div key={p} className="group relative aspect-square bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex flex-col hover:border-amber-500 transition-colors">
                            <div className="relative flex-1 w-full h-full p-4">
                                <Image src={p} alt="" fill className="object-contain" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={() => handleDelete(p)} className="p-3 bg-red-600/90 text-white rounded-full hover:bg-red-500 hover:scale-110 transition-all shadow-lg">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-2 bg-black text-center border-t border-gray-800 truncate text-[10px] text-gray-400 font-mono">
                                {p.split('/').pop()}
                            </div>
                        </div>
                    ))}

                    {activeTab === 'skills' && !skillFolder && (() => {
                        const uniqueFolders = [...new Set(skills.map(s => s.folder))].filter(f => search ? f.toLowerCase().includes(search.toLowerCase()) : true)
                        if (uniqueFolders.length === 0) return (
                            <div className="col-span-full text-center py-10 text-gray-500 border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
                                No skill folders found mapping to your search.
                            </div>
                        )
                        return uniqueFolders.map(folder => {
                            const folderSkills = skills.filter(s => s.folder === folder)
                            return (
                                <div key={folder} onClick={() => setSkillFolder(folder)} className="cursor-pointer group relative aspect-square bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex flex-col justify-center items-center hover:border-[#FFD700] hover:bg-black transition-all shadow-xl hover:shadow-[0_0_20px_rgba(255,215,0,0.1)]">
                                    <Folder className="w-12 h-12 text-[#FFD700] mb-2 group-hover:scale-110 transition-transform opacity-80 group-hover:opacity-100" />
                                    <span className="text-sm font-bold text-gray-300 truncate w-full text-center px-4">{folder}</span>
                                    <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{folderSkills.length} files</span>
                                </div>
                            )
                        })
                    })()}

                    {activeTab === 'skills' && skillFolder && skills
                        .filter(s => s.folder === skillFolder)
                        .filter(s => s.filename.toLowerCase().includes(search.toLowerCase()))
                        .map(s => (
                        <div key={s.path} className="group relative aspect-square bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex flex-col hover:border-indigo-400 transition-colors">
                            <div className="relative flex-1 w-full h-full p-4 bg-gray-950">
                                <Image src={s.path} alt="" fill className="object-contain" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={() => handleDelete(s.filename, s.folder)} className="p-3 bg-red-600/90 text-white rounded-full hover:bg-red-500 hover:scale-110 transition-all shadow-lg">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-2 bg-black text-center border-t border-gray-800 truncate text-[11px] text-[#FFD700] font-mono font-bold tracking-wider">
                                {s.filename}
                            </div>
                        </div>
                    ))}

                    {((activeTab === 'heroes' && !heroes.length) || (activeTab === 'pets' && !pets.length) || (activeTab === 'skills' && !skills.length)) && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No assets found.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
