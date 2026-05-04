"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { uploadHeroImage, deleteHeroImage } from "@/lib/admin-actions"
import { openEditor, saveEditor } from "@/lib/editor-actions"
import Image from "next/image"
import { Marker, ActionLabel } from "./AdminEditorial"
import BuildEditorModal from "@/components/admin/BuildEditorModal"
import { toast } from "sonner"
import { clsx } from "clsx"

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

    const gradeColors = {
        "l++": { bg: "from-amber-500/20 to-amber-600/5", border: "border-amber-500/40", text: "text-amber-400", label: "L++" },
        "l+": { bg: "from-purple-500/20 to-purple-600/5", border: "border-purple-500/40", text: "text-purple-400", label: "L+" },
        "l": { bg: "from-blue-500/20 to-blue-600/5", border: "border-blue-500/40", text: "text-blue-400", label: "L" },
        "r": { bg: "from-green-500/20 to-green-600/5", border: "border-green-500/40", text: "text-green-400", label: "R" },
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="relative flex justify-between items-end pb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Marker color="bg-[#FFD700]" className="w-1.5 h-6" />
                        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-yellow-200 to-[#FFD700] tracking-tight">
                            Manage Builds
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500 ml-14">Upload and manage hero builds and skills</p>
                </div>
                <div className="flex items-center gap-3 bg-black/60 border border-gray-800/80 px-5 py-3 rounded-2xl backdrop-blur-sm"
                    style={{ boxShadow: "0 0 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)" }}
                >
                    <span className="text-2xl font-black text-[#FFD700] tabular-nums">{heroes.length}</span>
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Heroes</span>
                </div>
                {/* Bottom gradient line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />
            </div>

            {/* Hero Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                {heroes.map((hero) => {
                    const grade = gradeColors[hero.grade] || gradeColors["r"]
                    return (
                        <div
                            key={hero.filename}
                            className={clsx(
                                "group relative rounded-2xl overflow-hidden transition-all duration-300",
                                "hover:-translate-y-1.5 hover:shadow-[0_8px_40px_rgba(255,215,0,0.15)]",
                            )}
                            style={{
                                background: "linear-gradient(145deg, rgba(20,20,20,1) 0%, rgba(10,10,10,1) 100%)",
                                border: "1px solid rgba(50,50,50,0.6)",
                            }}
                        >
                            <div onClick={() => handleEdit(hero)} className="cursor-pointer h-full">
                                <div className="aspect-[4/5] relative overflow-hidden bg-black">
                                    <Image
                                        src={`/heroes/${hero.filename}`}
                                        alt={hero.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                    />

                                    {/* New hero badge */}
                                    {hero.is_new_hero && (
                                        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2 py-0.5 bg-[#FFD700] text-black text-[9px] font-black rounded-md shadow-[0_0_12px_rgba(255,215,0,0.6)] uppercase tracking-widest">
                                            New
                                        </div>
                                    )}

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-[#FFD700]/0 group-hover:bg-[#FFD700]/10 transition-colors duration-300 flex items-center justify-center">
                                        <div className="transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                            <div className="bg-[#FFD700] text-black px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-[#FFD700]/40 hover:bg-yellow-300 transition-colors uppercase tracking-wider">
                                                EDIT
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delete button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(hero.filename)
                                }}
                                className="absolute top-2.5 right-2.5 p-2 bg-red-500/80 backdrop-blur-md text-white rounded-lg hover:bg-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20 border border-red-400/50 hover:border-red-300 hover:scale-110 active:scale-95 shadow-lg"
                                title="Delete Hero"
                            >
                                <ActionLabel label="DEL" size="text-[10px]" color="text-white" />
                            </button>
                        </div>
                    )
                })}
            </div>

            {/* Loading overlay */}
            {isLoadingEditor && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in">
                    <div className="text-[4rem] font-black italic opacity-10 animate-pulse tracking-tighter text-[#FFD700]">EDITOR_INIT</div>
                    <p className="text-[#FFD700]/80 font-bold tracking-[0.3em] text-xs mt-6 uppercase animate-pulse">Loading Editor</p>
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
