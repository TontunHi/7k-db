"use client"

import { useState } from "react"
import { uploadHeroImage, deleteHeroImage } from "@/lib/admin-actions"
import { openEditor, saveEditor } from "@/lib/editor-actions"
import Image from "next/image"
import { Trash2, Upload, Loader2, Edit, X, Plus } from "lucide-react"
import BuildEditorModal from "@/components/admin/BuildEditorModal"

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
            alert("Please enter a Skill Folder Name for the skills.")
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

            // Reset
            setHeroFile(null)
            setSkillFiles([])
            setSkillFolderName("")
            e.target.reset()
        } catch (err) {
            alert("Failed to upload: " + err.message)
        } finally {
            setIsUploading(false)
        }
    }

    async function handleDelete(filename) {
        if (!confirm("Are you sure you want to delete this hero?")) return
        try {
            await deleteHeroImage(filename)
        } catch (err) {
            alert("Failed to delete")
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
            alert("Failed to load editor: " + err.message)
        } finally {
            setIsLoadingEditor(false)
        }
    }

    async function handleSaveBuilds(newBuilds, newSkillPriority) {
        if (!currentHero) return
        await saveEditor(
            currentHero.filename,
            newBuilds,
            newSkillPriority,
            currentHero.name,
            currentHero.grade
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Manage Builds</h1>
                <span className="text-sm text-gray-500">{heroes.length} Heroes Total</span>
            </div>

            {/* Upload Form */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-[#FFD700] mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload New Hero
                </h2>

                {/* Changed to Grid for better alignment and equal sizing */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

                    {/* Hero Image Input */}
                    <div className="space-y-2 w-full">
                        <label className="text-xs text-gray-500 uppercase font-bold">Hero Image</label>
                        <div className="relative border border-gray-700 bg-black rounded-lg h-10 flex items-center px-2 hover:border-[#FFD700] transition-colors">
                            <input
                                type="file"
                                required
                                accept="image/*"
                                onChange={(e) => setHeroFile(e.target.files[0])}
                                className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-gray-800 file:text-[#FFD700] hover:file:bg-gray-700 cursor-pointer focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Skill Folder Name Input */}
                    <div className="space-y-2 w-full">
                        <label className="text-xs text-gray-500 uppercase font-bold">Skill Folder Name</label>
                        <div className="relative border border-gray-700 bg-black rounded-lg h-10 flex items-center px-3 hover:border-[#FFD700] transition-colors">
                            <input
                                type="text"
                                value={skillFolderName}
                                onChange={(e) => setSkillFolderName(e.target.value)}
                                placeholder="e.g. Ace"
                                className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-gray-600 focus:ring-0"
                            />
                        </div>
                    </div>

                    {/* Skill Images Input */}
                    <div className="space-y-2 w-full">
                        <label className="text-xs text-gray-500 uppercase font-bold">Skill Files</label>
                        <div className="relative border border-gray-700 bg-black rounded-lg h-10 flex items-center px-2 hover:border-[#FFD700] transition-colors">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => setSkillFiles(e.target.files)}
                                className="w-full text-xs text-gray-400 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-gray-800 file:text-[#FFD700] hover:file:bg-gray-700 cursor-pointer focus:outline-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isUploading}
                        className="h-10 w-full bg-[#FFD700] hover:bg-[#E5C100] text-black font-bold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-colors uppercase text-xs tracking-wider"
                    >
                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
                    </button>
                </form>

                <div className="flex gap-4 mt-2">
                    {heroFile && <div className="text-[10px] text-[#FFD700]">Hero: {heroFile.name}</div>}
                    {skillFiles.length > 0 && <div className="text-[10px] text-[#FFD700]">Skills: {skillFiles.length} files</div>}
                </div>

                <p className="text-[10px] text-gray-600 mt-2">
                    * Filename: <code>grade_Name.ext</code> (e.g. <code>l++_Ace.png</code>). Skill Folder should match (e.g. <code>Ace</code>).
                </p>
            </div>

            {/* List */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {heroes.map((hero) => (
                    <div
                        key={hero.filename}
                        className="group relative bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
                    >
                        <div onClick={() => handleEdit(hero)} className="cursor-pointer">
                            <div className="aspect-[4/5] relative">
                                <Image
                                    src={`/heroes/${hero.filename}`}
                                    alt={hero.name}
                                    fill
                                    className="object-cover transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/80 text-[#FFD700] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                        <Edit className="w-3 h-3" /> Edit
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(hero.filename)
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-lg hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 z-10"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {isLoadingEditor && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
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
