"use client"

import { useState, useEffect } from "react"
import { useBuildEditor } from "./hooks/useBuildEditor"
import HeroCard from "./HeroCard"
import BuildEditorModal from "@/components/admin/BuildEditorModal"
import styles from "./builds.module.css"
import { Marker } from "@/app/admin/components/AdminEditorial"
import { Search } from "lucide-react"

/**
 * BuildManagerView - Main Dashboard for Builds Management
 */
export default function BuildManagerView({ heroes: initialHeroes = [] }) {
    const [heroes, setHeroes] = useState(initialHeroes)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedGrade, setSelectedGrade] = useState("ALL")

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

    // Filter display heroes based on Search and Grade
    const filteredHeroes = heroes.filter(hero => {
        const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesGrade = selectedGrade === "ALL" || hero.grade.toLowerCase() === selectedGrade.toLowerCase()
        return matchesSearch && matchesGrade
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
            <div className={styles.controlBar}>
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
