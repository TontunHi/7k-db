"use client"

import { useState, useEffect } from "react"
import { useBuildEditor } from "./hooks/useBuildEditor"
import HeroCard from "./HeroCard"
import BuildEditorModal from "@/components/admin/BuildEditorModal"
import styles from "./builds.module.css"
import { Marker } from "@/app/admin/components/AdminEditorial"
import { Search } from "lucide-react"
import Image from "next/image"

function getTypeIconPath(type) {
    if (!type) return null
    const lower = type.toLowerCase()
    if (lower === "attack" || lower === "dps") return "/logo_tiers/type/attack.webp"
    if (lower === "defense" || lower === "tank") return "/logo_tiers/type/defense.webp"
    if (lower === "magic" || lower === "ranged") return "/logo_tiers/type/magic.webp"
    if (lower === "support") return "/logo_tiers/type/support.webp"
    if (lower === "universal" || lower === "charge") return "/logo_tiers/type/universal.webp"
    return null
}

/**
 * BuildManagerView - Main Dashboard for Builds Management
 */
export default function BuildManagerView({ heroes: initialHeroes = [] }) {
    const [heroes, setHeroes] = useState(initialHeroes)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedGrade, setSelectedGrade] = useState("ALL")
    const [selectedType, setSelectedType] = useState("ALL")

    const {
        editorOpen,
        setEditorOpen,
        currentHero,
        editorData,
        isLoading,
        handleDelete,
        handleEdit,
        handleSave
    } = useBuildEditor(heroes)

    // Update local state when props change
    useEffect(() => {
        setHeroes(initialHeroes)
    }, [initialHeroes])

    // Extract unique types dynamically
    const allTypes = ["ALL", ...Array.from(new Set(heroes.map(h => h.type).filter(Boolean).map(t => t.toUpperCase())))]

    // Filter display heroes based on Search, Grade, and Type
    const filteredHeroes = heroes.filter(hero => {
        const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase())
        const filterGrade = selectedGrade === "AWAKE" ? "a" : selectedGrade.toLowerCase()
        const matchesGrade = selectedGrade === "ALL" || hero.grade.toLowerCase() === filterGrade
        const matchesType = selectedType === "ALL" || (hero.type && hero.type.toUpperCase() === selectedType)
        return matchesSearch && matchesGrade && matchesType
    })

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <div className={styles.titleWrapper}>
                        <Marker color="bg-primary" className="w-1.5 h-6" />
                        <h1 className={styles.title}>Hero Builds</h1>
                    </div>
                    <p className={styles.subtitle}>Configure and optimize hero equipment sets and skill priorities.</p>
                </div>

                <div className={styles.statsBox}>
                    <span className={styles.statsCount}>{heroes.length}</span>
                    <span className={styles.statsLabel}>Total Heroes</span>
                </div>
            </header>

            {/* Operations Control Bar */}
            <div className={styles.controlBar} style={{ flexDirection: "column", alignItems: "stretch", gap: "1rem" }}>
                <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between w-full">
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={14} />
                        <input 
                            type="text" 
                            placeholder="Search hero builds..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Grade Filters */}
                        <div className={styles.gradeTabs}>
                            {["ALL", "AWAKE", "L++", "L+", "L", "R"].map(grade => (
                                <button
                                    key={grade}
                                    onClick={() => setSelectedGrade(grade)}
                                    className={`${styles.gradeTabBtn} ${selectedGrade === grade ? styles.gradeTabBtnActive : ""}`}
                                >
                                    {grade}
                                </button>
                            ))}
                        </div>

                        {/* Type Filters */}
                        <div className={styles.gradeTabs}>
                            {allTypes.map(t => {
                                const iconPath = getTypeIconPath(t)
                                return (
                                    <button
                                        key={t}
                                        onClick={() => setSelectedType(t)}
                                        className={`${styles.gradeTabBtn} ${selectedType === t ? styles.gradeTabBtnActive : ""} flex items-center justify-center p-1.5`}
                                        title={t}
                                    >
                                        {iconPath ? (
                                            <div className="w-5 h-5 relative">
                                                <Image 
                                                    src={iconPath} 
                                                    fill 
                                                    unoptimized
                                                    className="object-contain" 
                                                    alt={t} 
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-[10px] px-1">{t}</span>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className={styles.grid}>
                {filteredHeroes.map((hero) => (
                    <HeroCard 
                        key={hero.filename} 
                        hero={hero} 
                        onEdit={handleEdit} 
                    />
                ))}
            </div>

            {/* Loading Overlay */}
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.loader} />
                    <p className={styles.loadingText}>Synchronizing Data...</p>
                </div>
            )}

            {/* Editor Modal */}
            {editorOpen && currentHero && editorData && (
                <BuildEditorModal
                    hero={currentHero}
                    allHeroes={heroes}
                    skills={editorData.resources.skills}
                    weapons={editorData.resources.weapons}
                    armors={editorData.resources.armors}
                    accessories={editorData.resources.accessories}
                    initialBuilds={editorData.builds}
                    initialSkillPriority={editorData.heroData.skillPriority}
                    initialIsNewHero={editorData.heroData.is_new_hero}
                    onSave={handleSave}
                    onClose={() => setEditorOpen(false)}
                />
            )}
        </div>
    )
}
