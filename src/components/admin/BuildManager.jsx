"use client"

import { useState } from "react"
import { uploadHeroImage, deleteHeroImage } from "@/lib/admin-actions"
import { openEditor, saveEditor } from "@/lib/editor-actions"
import Image from "next/image"
import { Trash2, Upload, Loader2, Edit, X, Plus } from "lucide-react"
import BuildEditorModal from "@/components/admin/BuildEditorModal"
import { toast } from "sonner"

export default function BuildManager({ heroes }) {
    const [isUploading, setIsUploading] = useState(false)
    const [editorOpen, setEditorOpen] = useState(false)
    const [currentHero, setCurrentHero] = useState(null)
    const [editorData, setEditorData] = useState(null)
    const [isLoadingEditor, setIsLoadingEditor] = useState(false)

    // Upload State
    const [heroFile, setHeroFile] = useState(null)
    const [skillFiles, setSkillFiles] = useState([])
    const [skillFolderName, setSkillFolderName] = useState("")

    async function handleSubmit(e) {
        e.preventDefault()
        if (!heroFile) return
        if (skillFiles.length > 0 && !skillFolderName) {
            toast.error("Please enter a Skill Folder Name for the skills.")
            return
        }

        setIsUploading(true)
        try {
            const data = new FormData()
            data.append("heroFile", heroFile)
            data.append("folderName", skillFolderName)

            for (let i = 0; i < skillFiles.length; i++) {
                data.append("skillFiles", skillFiles[i])
            }

            await uploadHeroImage(data)
            toast.success("Hero uploaded successfully!")

            // Reset
            setHeroFile(null)
            setSkillFiles([])
            setSkillFolderName("")
            e.target.reset()
        } catch (err) {
            toast.error("Failed to upload: " + err.message)
        } finally {
            setIsUploading(false)
        }
    }

    async function handleDelete(filename) {
        if (!window.confirm("Are you sure you want to delete this hero?")) return
        try {
            await deleteHeroImage(filename)
            toast.success("Hero deleted successfully.")
        } catch (err) {
            toast.error("Failed to delete hero.")
        }
    }

    async function handleEdit(hero) {
        setIsLoadingEditor(true)
        try {
            const data = await openEditor(hero.filename)
            setEditorData(data)
            setCurrentHero(hero)
            setEditorOpen(true)
        } catch (err) {
            console.error(err)
            toast.error("Failed to load editor: " + err.message)
        } finally {
            setIsLoadingEditor(false)
        }
    }

    async function handleSaveBuilds(newBuilds, newSkillPriority) {
        if (!currentHero) return
        try {
            await saveEditor(
                currentHero.filename,
                newBuilds,
                newSkillPriority,
                currentHero.name,
                currentHero.grade
            )
            toast.success("Builds saved successfully!")
        } catch (error) {
            toast.error("Failed to save builds.")
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-gray-800 pb-4">
                <div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-200 tracking-tight">
                        Manage Builds
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">Upload and manage hero builds and skills</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-xl flex items-center shadow-inner">
                    <span className="text-lg font-bold text-[#FFD700]">{heroes.length}</span>
                    <span className="text-sm text-gray-400 ml-2 uppercase tracking-wider font-semibold">Heroes Total</span>
                </div>
            </div>

            {/* Upload Form */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-gray-700 transition-colors rounded-2xl p-6 shadow-2xl shadow-black/50">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <div className="p-2 bg-[#FFD700]/10 rounded-lg">
                        <Upload className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    Upload New Hero
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                    
                    {/* Hero Image Input */}
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest font-bold ml-1">Hero Image</label>
                        <div className="relative group">
                            <input
                                type="file"
                                id="hero-upload"
                                required
                                accept="image/*"
                                onChange={(e) => setHeroFile(e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`flex flex-col items-center justify-center border-2 border-dashed ${heroFile ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-gray-700 bg-black/50'} rounded-xl h-24 hover:border-[#FFD700] transition-colors group-hover:bg-gray-900/50`}>
                                {heroFile ? (
                                    <span className="text-sm font-semibold text-[#FFD700] truncate px-4 w-full text-center">{heroFile.name}</span>
                                ) : (
                                    <>
                                        <Plus className="w-6 h-6 text-gray-500 group-hover:text-[#FFD700] mb-1 transition-colors" />
                                        <span className="text-xs text-gray-500 font-medium group-hover:text-gray-300">Choose image...</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Skill Folder Name Input */}
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest font-bold ml-1">Skill Folder</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={skillFolderName}
                                onChange={(e) => setSkillFolderName(e.target.value)}
                                placeholder="e.g. Ace"
                                className="w-full bg-black/50 border-2 border-gray-700 rounded-xl h-24 px-4 text-white text-base placeholder-gray-600 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition-all hover:border-gray-600 text-center"
                            />
                        </div>
                    </div>

                    {/* Skill Images Input */}
                    <div className="space-y-2">
                        <label className="text-xs text-gray-400 uppercase tracking-widest font-bold ml-1">Skill Files</label>
                        <div className="relative group">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setSkillFiles(e.target.files)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`flex flex-col items-center justify-center border-2 border-dashed ${skillFiles.length > 0 ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-gray-700 bg-black/50'} rounded-xl h-24 hover:border-[#FFD700] transition-colors group-hover:bg-gray-900/50`}>
                                {skillFiles.length > 0 ? (
                                    <span className="text-sm font-semibold text-[#FFD700] truncate px-4 w-full text-center">{skillFiles.length} files selected</span>
                                ) : (
                                    <>
                                        <Plus className="w-6 h-6 text-gray-500 group-hover:text-[#FFD700] mb-1 transition-colors" />
                                        <span className="text-xs text-gray-500 font-medium group-hover:text-gray-300">Choose skills...</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="space-y-2 h-full flex flex-col justify-end">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="h-24 w-full bg-gradient-to-br from-[#FFD700] to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-extrabold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest shadow-lg shadow-[#FFD700]/20"
                        >
                            {isUploading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-6 h-6" />
                                    <span>Upload Hero</span>
                                </>
                            )}
                        </button>
                    </div>

                </form>

                <div className="mt-8 flex items-center justify-between p-4 bg-black/40 rounded-xl border border-gray-800">
                    <p className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                        Filename: <code className="text-[#FFD700] font-mono bg-black px-1.5 py-0.5 rounded shadow-inner">grade_Name.ext</code> (e.g. <code className="text-[#FFD700] font-mono bg-black px-1.5 py-0.5 rounded shadow-inner">l++_ace.png</code>). 
                        Skill Folder should match the Name exactly.
                    </p>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {heroes.map((hero) => (
                    <div
                        key={hero.filename}
                        className="group relative bg-black border border-gray-800 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:border-[#FFD700]/50 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:-translate-y-1"
                    >
                        <div onClick={() => handleEdit(hero)} className="cursor-pointer h-full">
                            <div className="aspect-[4/5] relative bg-gray-900 overflow-hidden">
                                <Image
                                    src={`/heroes/${hero.filename}`}
                                    alt={hero.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-[2px]">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="bg-[#FFD700] text-black px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-[#FFD700]/30 hover:bg-yellow-300 transition-colors">
                                            <Edit className="w-4 h-4" /> Edit Build
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(hero.filename)
                            }}
                            className="absolute top-3 right-3 p-3 bg-red-500/80 backdrop-blur-md text-white rounded-xl hover:bg-red-600 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20 border border-red-400 hover:border-red-300 transform scale-95 group-hover:scale-110 shadow-lg hover:shadow-red-500/50"
                            title="Delete Hero"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>

            {isLoadingEditor && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
                    <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin mb-4" />
                    <p className="text-[#FFD700] font-bold tracking-widest animate-pulse uppercase">Loading Editor...</p>
                </div>
            )}

            {editorOpen && currentHero && editorData && (
                <BuildEditorModal
                    hero={currentHero}
                    skills={editorData.resources.skills}
                    weapons={editorData.resources.weapons}
                    armors={editorData.resources.armors}
                    accessories={editorData.resources.accessories}
                    initialBuilds={editorData.builds}
                    initialSkillPriority={editorData.heroData.skillPriority}
                    onSave={handleSaveBuilds}
                    onClose={() => setEditorOpen(false)}
                />
            )}
        </div>
    )
}
