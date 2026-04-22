'use client'

import { useState, useEffect, useRef, useMemo } from "react"
import { X } from "lucide-react"
import { clsx } from "clsx"
import { toast } from "sonner"
import { toPng, toBlob } from "html-to-image"
import { getSimulatorData, getSimulatorHeroes } from "@/lib/simulator-actions"

import SimulatorHeroPicker from "./components/SimulatorHeroPicker"
import SimulatorEditor from "./components/SimulatorEditor"
import SimulatorPreview from "./components/SimulatorPreview"
import ItemPickerModal from "./components/ItemPickerModal"
import { WEAPON_MAIN_STATS, ARMOR_MAIN_STATS } from "./constants"

import styles from "./BuildSimulator.module.css"

export default function BuildSimulatorView({ initialHero, onBack }) {
    const [hero, setHero] = useState(initialHero)
    const [items, setItems] = useState({ weapons: [], armors: [], accessories: [] })
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [allHeroes, setAllHeroes] = useState([])
    const [searchHero, setSearchHero] = useState("")
    const [scale, setScale] = useState(1)
    const [showMobilePreview, setShowMobilePreview] = useState(false)
    
    const previewContainerRef = useRef(null)
    const [activePicker, setActivePicker] = useState(null) // { type, index }
    
    // Build State
    const [build, setBuild] = useState({
        weapons: [
            { image: null, stat: WEAPON_MAIN_STATS[0] }, 
            { image: null, stat: WEAPON_MAIN_STATS[0] }
        ],
        armors: [
            { image: null, stat: ARMOR_MAIN_STATS[0] }, 
            { image: null, stat: ARMOR_MAIN_STATS[0] }
        ],
        accessories: [
            { image: null, refined: null },
            { image: null, refined: null },
            { image: null, refined: null },
            { image: null, refined: null },
            { image: null, refined: null }
        ],
        substats: [],
        minStats: {},
        skillPriority: [],
        cLevel: "None"
    })

    // Filter to only include skill files 1, 2, 3, 4 and sort descending (4,3,2,1)
    const displaySkills = useMemo(() => {
        return skills
            .filter(s => {
                const filename = s.split('/').pop().split('.')[0]
                return ["1", "2", "3", "4"].includes(filename)
            })
            .sort((a, b) => {
                const numA = parseInt(a.split('/').pop().split('.')[0]) || 0
                const numB = parseInt(b.split('/').pop().split('.')[0]) || 0
                return numB - numA // Descending: 4, 3, 2, 1
            })
    }, [skills])

    const exportRef = useRef(null)

    useEffect(() => {
        async function loadInitial() {
            setLoading(true)
            try {
                // Fetch All Heroes for Picker
                const hList = await getSimulatorHeroes()
                setAllHeroes(hList)
                
                if (hero) {
                    const data = await getSimulatorData(hero.filename)
                    setItems({ 
                        weapons: data.weapons, 
                        armors: data.armors, 
                        accessories: data.accessories 
                    })
                    setSkills(data.skills)
                    // Reset priority on hero change
                    setBuild(prev => ({ ...prev, skillPriority: [] }))
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        loadInitial()
    }, [hero])

    // Auto-Scaling Logic
    useEffect(() => {
        const handleResize = () => {
            const previewContainer = previewContainerRef.current
            if (!previewContainer) return
            
            const availableWidth = previewContainer.offsetWidth - 100
            const availableHeight = previewContainer.offsetHeight - 100
            
            const cardWidth = 1200
            const cardHeight = 630
            
            const scaleX = availableWidth / cardWidth
            const scaleY = availableHeight / cardHeight
            
            const finalScale = Math.min(scaleX, scaleY, 1)
            setScale(finalScale)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        const timer = setTimeout(handleResize, 300)
        
        return () => {
            window.removeEventListener('resize', handleResize)
            clearTimeout(timer)
        }
    }, [hero, loading])

    const handleExport = async (mode = 'download') => {
        if (!exportRef.current) return
        
        const loadToast = toast.loading(mode === 'download' ? "Preparing your download..." : "Copying to clipboard...")
        
        try {
            const options = {
                pixelRatio: 2,
                quality: 1,
                cacheBust: true,
                style: {
                    transform: 'scale(1)',
                }
            }
            
            await new Promise(r => setTimeout(r, 400))
            
            if (mode === 'download') {
                const dataUrl = await toPng(exportRef.current, options)
                const link = document.createElement('a')
                link.download = `build-${hero?.slug || 'hero'}-${Date.now()}.png`
                link.href = dataUrl
                link.click()
                toast.success("Build card downloaded!", { id: loadToast })
            } else {
                const blob = await toBlob(exportRef.current, options)
                window.focus()
                
                if (typeof ClipboardItem !== 'undefined') {
                    try {
                        const item = new ClipboardItem({ "image/png": blob })
                        await navigator.clipboard.write([item])
                        toast.success("Build card copied to clipboard!", { id: loadToast })
                    } catch (clipboardErr) {
                        console.error("Clipboard Error:", clipboardErr)
                        toast.error("Failed to copy. Please keep this tab active and try again.", { id: loadToast })
                    }
                } else {
                    toast.error("Your browser doesn't support direct image copying. Please use Download instead.", { id: loadToast })
                }
            }
        } catch (err) {
            console.error("Export Error:", err)
            toast.error("Failed to generate high-quality image", { id: loadToast })
        }
    }

    if (!hero) {
        return (
            <SimulatorHeroPicker 
                allHeroes={allHeroes}
                searchHero={searchHero}
                setSearchHero={setSearchHero}
                onSelect={setHero}
                onBack={onBack}
            />
        )
    }

    return (
        <div className={clsx(
            styles.simulator,
            onBack ? styles.simulatorFixed : styles.simulatorRelative
        )}>
            {/* Top Navigation */}
            <div className={styles.nav}>
                <div className={styles.navLeft}>
                    {onBack && (
                        <>
                            <button onClick={() => setHero(null)} className={styles.backButton}>
                                <X size={24} />
                            </button>
                            <div className={styles.navDivider}></div>
                        </>
                    )}
                    <h2 className={styles.navTitle}>Build Heroes</h2>
                </div>
            </div>

            <div className={styles.mainLayout}>
                <SimulatorEditor 
                    build={build}
                    setBuild={setBuild}
                    displaySkills={displaySkills}
                    setActivePicker={setActivePicker}
                    showMobilePreview={showMobilePreview}
                />

                <SimulatorPreview 
                    hero={hero}
                    build={build}
                    displaySkills={displaySkills}
                    exportRef={exportRef}
                    containerRef={previewContainerRef}
                    scale={scale}
                    handleExport={handleExport}
                    showMobilePreview={showMobilePreview}
                    setShowMobilePreview={setShowMobilePreview}
                />
            </div>

            {/* Item Picker Modal */}
            {activePicker && (
                <ItemPickerModal 
                    type={activePicker.type} 
                    items={activePicker.type === 'accessory' ? items.accessories : items[`${activePicker.type}s`]} 
                    onSelect={(img) => {
                        setBuild(prev => {
                            const newB = { ...prev }
                            if (activePicker.type === 'accessory') {
                                const newAccs = [...newB.accessories]
                                if (activePicker.sub === 'refined') {
                                    newAccs[activePicker.index] = { ...newAccs[activePicker.index], refined: img }
                                } else {
                                    newAccs[activePicker.index] = { ...newAccs[activePicker.index], image: img }
                                }
                                newB.accessories = newAccs
                            } else {
                                const targetField = activePicker.type === 'weapon' ? 'weapons' : 'armors'
                                const newList = newB[targetField].map((item, idx) => 
                                    idx === activePicker.index ? { ...item, image: img } : item
                                )
                                newB[targetField] = newList
                            }
                            return newB
                        })
                        setActivePicker(null)
                    }}
                    onClose={() => setActivePicker(null)}
                />
            )}
        </div>
    )
}
