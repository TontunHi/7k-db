"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { uploadHeroImage, deleteHeroImage } from "@/lib/admin-actions"
import { openEditor, saveEditor } from "@/lib/editor-actions"
import Image from "next/image"
import { Trash2, Loader2, Edit, X } from "lucide-react"
import BuildEditorModal from "@/components/admin/BuildEditorModal"
import { toast } from "sonner"

export default function BuildManager({ heroes }) {
    const [editorOpen, setEditorOpen] = useState(false)
    const [currentHero, setCurrentHero] = useState(null)
    const [editorData, setEditorData] = useState(null)
    const [isLoadingEditor, setIsLoadingEditor] = useState(false)
    const router = useRouter()

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

    async function handleSaveBuilds(newBuilds, newSkillPriority, isNewHero) {
        if (!currentHero) return
        try {
            const result = await saveEditor(
                currentHero.filename,
                newBuilds,
                newSkillPriority,
                currentHero.name,
                currentHero.grade,
                isNewHero
            )
            
            if (result.success) {
                toast.success("Builds saved successfully!")
                router.refresh()
                setEditorOpen(false) // Close modal on success
            } else {
                toast.error(result.error || "Failed to save builds.")
            }
        } catch (error) {
            console.error("Save error:", error)
            toast.error("An unexpected error occurred.")
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
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                />
                                {hero.is_new_hero && (
                                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-[#FFD700] text-black text-[10px] font-black rounded-md shadow-[0_0_10px_rgba(255,215,0,0.5)] uppercase tracking-widest animate-pulse">
                                        New
                                    </div>
                                )}
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
                    initialIsNewHero={editorData.heroData.is_new_hero}
                    onSave={handleSaveBuilds}
                    onClose={() => setEditorOpen(false)}
                />
            )}
        </div>
    )
}
