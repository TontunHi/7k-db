'use client'

import { useState, useEffect, useRef, useMemo } from "react"
import { toast } from "sonner"
import { toPng, toBlob } from "html-to-image"

import { getTierlistCreatorData } from "@/lib/tierlist-actions"
import TierlistHeader from "./components/TierlistHeader"
import TierlistWorkspace from "./components/TierlistWorkspace"
import HeroPool from "./components/HeroPool"
import { LAYOUT_MODES } from "./constants"

import styles from "./TierlistCreator.module.css"

export default function TierlistCreatorView() {
    const [title, setTitle] = useState("Community Tier List")
    const [allHeroes, setAllHeroes] = useState([])
    const [typeMap, setTypeMap] = useState({})
    const [loading, setLoading] = useState(true)
    const [layoutMode, setLayoutMode] = useState(LAYOUT_MODES.SIMPLE)
    const [search, setSearch] = useState("")
    const [tiers, setTiers] = useState({})
    const [isInitialized, setIsInitialized] = useState(false)
    const [poolOpen, setPoolOpen] = useState(false)

    const exportRef = useRef(null)

    // Load Data
    useEffect(() => {
        async function load() {
            try {
                const data = await getTierlistCreatorData()
                setAllHeroes(data.heroes)
                setTypeMap(data.typeMap)
            } catch (err) {
                console.error(err)
                toast.error("Failed to load heroes")
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    // Load Draft
    useEffect(() => {
        if (!loading && allHeroes.length > 0 && !isInitialized) {
            const savedDraft = localStorage.getItem("7k-db-tierlist-draft")
            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft)
                    if (parsed.title) setTitle(parsed.title)
                    if (parsed.layoutMode) setLayoutMode(parsed.layoutMode)
                    
                    if (parsed.tiers) {
                        const reconstructedTiers = {}
                        Object.keys(parsed.tiers).forEach(key => {
                            const filenames = parsed.tiers[key] || []
                            reconstructedTiers[key] = filenames
                                .map(fname => allHeroes.find(h => h.filename === fname))
                                .filter(Boolean)
                        })
                        setTiers(reconstructedTiers)
                    }
                } catch (err) {
                    console.error("Failed to load tierlist draft:", err)
                }
            }
            setIsInitialized(true)
        }
    }, [loading, allHeroes, isInitialized])

    // Auto-save
    useEffect(() => {
        if (isInitialized) {
            const draftToSave = {
                title,
                layoutMode,
                tiers: Object.keys(tiers).reduce((acc, key) => {
                    acc[key] = (tiers[key] || []).map(h => h.filename)
                    return acc
                }, {})
            }
            localStorage.setItem("7k-db-tierlist-draft", JSON.stringify(draftToSave))
        }
    }, [title, layoutMode, tiers, isInitialized])

    const handleExport = async (mode = 'download') => {
        if (!exportRef.current) return
        
        const loadToast = toast.loading(mode === 'download' ? "Generating high-quality image..." : "Copying to clipboard...")
        
        try {
            const options = {
                pixelRatio: 2,
                quality: 1,
                cacheBust: true,
                backgroundColor: '#050505',
                style: { 
                    transform: 'scale(1)',
                    margin: '0',
                    padding: '0'
                }
            }
            
            await new Promise(r => setTimeout(r, 600))
            
            if (mode === 'download') {
                const dataUrl = await toPng(exportRef.current, options)
                const link = document.createElement('a')
                link.download = `tierlist-${title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`
                link.href = dataUrl
                link.click()
                toast.success("Tier list downloaded!", { id: loadToast })
            } else {
                const blob = await toBlob(exportRef.current, options)
                try {
                    if (typeof ClipboardItem !== 'undefined') {
                        window.focus()
                        const item = new ClipboardItem({ [blob.type]: blob })
                        await navigator.clipboard.write([item])
                        toast.success("Tier list copied to clipboard!", { id: loadToast })
                    } else {
                        throw new Error("ClipboardItem not supported")
                    }
                } catch (clipErr) {
                    console.error("Clipboard Error:", clipErr)
                    toast.error("Failed to copy. Please use Download instead.", { id: loadToast })
                }
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to generate image", { id: loadToast })
        }
    }

    const resetTierlist = () => {
        if (!confirm("Are you sure you want to reset your tier list?")) return
        setTiers({})
        localStorage.removeItem("7k-db-tierlist-draft")
        toast.success("Archive reset successfully")
    }

    const toggleLayout = () => {
        const newMode = layoutMode === LAYOUT_MODES.SIMPLE ? LAYOUT_MODES.MATRIX : LAYOUT_MODES.SIMPLE
        
        const newTiers = {}
        if (newMode === LAYOUT_MODES.MATRIX) {
            Object.keys(tiers).forEach(rank => {
                const heroes = tiers[rank] || []
                heroes.forEach(h => {
                    const type = typeMap[h.slug] || "Universal"
                    const key = `${rank}-${type}`
                    newTiers[key] = [...(newTiers[key] || []), h]
                })
            })
        } else {
            Object.keys(tiers).forEach(key => {
                if (!key.includes("-")) return
                const [rank] = key.split("-")
                newTiers[rank] = [...(newTiers[rank] || []), ...(tiers[key] || [])]
            })
        }
        
        setTiers(newTiers)
        setLayoutMode(newMode)
        toast.info(`Switched to ${newMode === LAYOUT_MODES.MATRIX ? "Rank / Table View" : "Rank Table"}`)
    }

    const addToCell = (hero, rank, type = null) => {
        const key = type ? `${rank}-${type}` : rank
        setTiers(prev => {
            const next = { ...prev }
            Object.keys(next).forEach(k => {
                next[k] = (next[k] || []).filter(h => h.filename !== hero.filename)
            })
            next[key] = [...(next[key] || []), hero]
            return next
        })
    }

    const removeFromCell = (hero, key) => {
        setTiers(prev => ({
            ...prev,
            [key]: (prev[key] || []).filter(h => h.filename !== hero.filename)
        }))
    }

    const filteredPool = useMemo(() => {
        const usedHeroFilenames = new Set(Object.values(tiers).flat().map(h => h.filename))
        return allHeroes.filter(h => 
            !usedHeroFilenames.has(h.filename) && 
            h.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [allHeroes, tiers, search])

    const handleAutoAssign = (hero) => {
        if (layoutMode === LAYOUT_MODES.SIMPLE) {
            addToCell(hero, "EX")
        } else {
            const type = typeMap[hero.slug] || "Attack" 
            addToCell(hero, "EX", type)
        }
    }

    if (loading) {
        return (
            <div className={styles.loadingBox}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Syncing Tactical Data...</p>
            </div>
        )
    }

    return (
        <div className={styles.creator}>
            <TierlistHeader 
                title={title}
                setTitle={setTitle}
                layoutMode={layoutMode}
                onToggleLayout={toggleLayout}
                onReset={resetTierlist}
                onExport={handleExport}
            />

            <div className={styles.mainLayout}>
                <TierlistWorkspace 
                    ref={exportRef}
                    title={title}
                    layoutMode={layoutMode}
                    tiers={tiers}
                    onAddHero={addToCell}
                    onRemoveHero={removeFromCell}
                />

                <HeroPool 
                    heroes={filteredPool}
                    search={search}
                    setSearch={setSearch}
                    onAutoAssign={handleAutoAssign}
                    poolOpen={poolOpen}
                    setPoolOpen={setPoolOpen}
                />
            </div>
        </div>
    )
}
