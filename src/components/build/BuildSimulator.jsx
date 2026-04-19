"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import SafeImage from "../shared/SafeImage"
import { 
    X, Plus, Sword, Shield, Trash2, 
    Download, Copy, Check, Info, 
    ChevronRight, Sparkles, Wand2,
    Eye, Edit3, Search
} from "lucide-react"
import { clsx } from "clsx"
import { toast } from "sonner"
import { toPng, toBlob } from "html-to-image"
import { getAllItemImages, getSimulatorData, getSimulatorHeroes } from "@/lib/simulator-actions"

const WEAPON_MAIN_STATS = [
    "Weakness Hit Chance", "Crit Rate", "Crit Damage", "All Attack (%)", 
    "All Attack", "Defense (%)", "Defense", "HP (%)", "HP", "Effect Hit Rate"
]

const ARMOR_MAIN_STATS = [
    "Damage Taken Reduction", "Block Rate", "All Attack (%)", "All Attack", 
    "Defense (%)", "Defense", "HP (%)", "HP", "Effect Resistance"
]

const SUBSTATS = [
    "All Attack (%)", "Defense (%)", "HP (%)", "Crit Rate", 
    "Weakness Hit Chance", "Effect Hit Rate", "All Attack", 
    "Defense", "HP", "Speed", "Crit Damage", "Block Rate", "Effect Resistance"
]

const MIN_STATS_KEYS = [
  { key: "physAtk", label: "Physical Attack", icon: "/about_website/icon_physical_attack.webp" },
  { key: "defense", label: "Defense", icon: "/about_website/icon_defense.webp" },
  { key: "hp", label: "HP", icon: "/about_website/icon_hp.webp" },
  { key: "speed", label: "Speed", icon: "/about_website/icon_speed.webp" },
  { key: "critRate", label: "Crit Rate", icon: "/about_website/icon_crit_rate.webp", unit: "%" },
  { key: "critDamage", label: "Crit Damage", icon: "/about_website/icon_crit_damage.webp", unit: "%" },
  { key: "weaknessHit", label: "Weakness Hit Chance", icon: "/about_website/icon_weakness_hit_chance.webp", unit: "%" },
  { key: "blockRate", label: "Block Rate", icon: "/about_website/icon_block_rate.webp", unit: "%" },
  { key: "damageReduction", label: "Damage Taken Reduction", icon: "/about_website/icon_damage_taken_reduction.webp", unit: "%" },
  { key: "effectHit", label: "Effect Hit Rate", icon: "/about_website/icon_effect_hit_rate.webp", unit: "%" },
  { key: "effectResist", label: "Effect Resistance", icon: "/about_website/icon_effect_resistance.webp", unit: "%" }
]

export default function BuildSimulator({ initialHero, onBack }) {
    const [hero, setHero] = useState(initialHero)
    const [items, setItems] = useState({ weapons: [], armors: [], accessories: [] })
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [allHeroes, setAllHeroes] = useState([])
    const [searchHero, setSearchHero] = useState("")
    const [scale, setScale] = useState(1)
    const [showMobilePreview, setShowMobilePreview] = useState(false)
    
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

    const [activePicker, setActivePicker] = useState(null) // { type, index }
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

    // --- Add Auto-Scaling Logic ---
    useEffect(() => {
        const handleResize = () => {
            const previewContainer = document.querySelector('.preview-container')
            if (!previewContainer) return
            
            // Calculate available width and height (with padding)
            const availableWidth = previewContainer.offsetWidth - 100
            const availableHeight = previewContainer.offsetHeight - 100
            
            // Base resolution of the card
            const cardWidth = 1200
            const cardHeight = 630
            
            // Calculate scale to fit both width and height
            const scaleX = availableWidth / cardWidth
            const scaleY = availableHeight / cardHeight
            
            const finalScale = Math.min(scaleX, scaleY, 1) // Max scale is 1
            setScale(finalScale)
            document.documentElement.style.setProperty('--scale', finalScale)
        }

        handleResize()
        window.addEventListener('resize', handleResize)
        const timer = setTimeout(handleResize, 300)
        
        return () => {
            window.removeEventListener('resize', handleResize)
            clearTimeout(timer)
        }
    }, [hero, loading])
    // ------------------------------

    const handleExport = async (mode = 'download') => {
        if (!exportRef.current) return
        
        const loadToast = toast.loading(mode === 'download' ? "Preparing your download..." : "Copying to clipboard...")
        
        try {
            // High quality options
            const options = {
                pixelRatio: 2, // Double Resolution for Sharpness (Retina quality)
                quality: 1,
                cacheBust: true,
                style: {
                    transform: 'scale(1)', // Ensure no scaling issues
                }
            }
            
            // Critical: Wait for images to be ready. 
            // Reduced to 400ms to maintain browser user activation context
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
                
                // Re-focus before writing
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
        const filteredHeroes = allHeroes.filter(h => 
            h.name.toLowerCase().includes(searchHero.toLowerCase()) || 
            h.filename.toLowerCase().includes(searchHero.toLowerCase())
        )

        return (
            <div className="fixed inset-0 z-[60] bg-[#050505] text-white p-6 lg:p-12 font-inter animate-in fade-in duration-700 overflow-y-auto custom-scrollbar">
                <div className="max-w-6xl mx-auto space-y-12">
                    <div className="text-center space-y-6">
                        <h1 className="text-6xl font-black italic tracking-tighter uppercase text-white leading-none">
                            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700]">Hero</span>
                        </h1>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.4em] max-w-lg mx-auto leading-relaxed">Select a hero from the pool to initiate high-performance build analysis and simulation</p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-10">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 border-b border-white/5 pb-8">
                            <div className="relative w-full md:w-[600px]">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FFD700]/40 w-6 h-6" />
                                <input 
                                    type="text"
                                    placeholder="Search legend pool..."
                                    value={searchHero}
                                    onChange={(e) => setSearchHero(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-[2rem] pl-16 pr-8 py-6 text-lg font-bold text-white outline-none focus:border-[#FFD700]/50 transition-all placeholder:text-gray-800 shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-8 animate-in slide-in-from-bottom-5 duration-700">
                            {filteredHeroes.map(h => (
                                <button
                                    key={h.filename}
                                    onClick={() => setHero(h)}
                                    className="group relative flex flex-col items-center transition-all hover:scale-105 active:scale-95"
                                >
                                    <div className="relative aspect-[11/14] w-full rounded-[2.5rem] overflow-hidden border-2 border-white/5 group-hover:border-[#FFD700] transition-all shadow-2xl bg-black/40">
                                        <SafeImage src={`/heroes/${h.filename}`} fill className="object-contain p-1 transition-transform duration-700 group-hover:scale-110" alt={h.name} />
                                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="text-center">
                        <button onClick={onBack} className="text-gray-600 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Go Back to Previous Page</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={clsx(
            "bg-[#050505] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300",
            onBack ? "fixed inset-0 z-[60]" : "relative h-[calc(100vh-64px)] w-full z-10"
        )}>
            {/* Top Navigation */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#080808]/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    {onBack && (
                        <>
                            <button onClick={() => setHero(null)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                            <div className="h-8 w-px bg-white/10 mx-2"></div>
                        </>
                    )}
                    <h2 className="text-lg font-black text-white italic tracking-tighter uppercase transform -skew-x-6">Build Heroes</h2>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                {/* Scrollable Left Column: Editor */}
                <div className={clsx(
                    "w-full lg:w-[450px] flex-shrink-0 border-r border-white/5 overflow-y-auto px-8 py-10 space-y-12 bg-black/40 custom-scrollbar",
                    showMobilePreview ? "hidden lg:block" : "block"
                )}>
                    
                    {/* Equipment Section */}
                    <Section title="Equipment Slots">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <SlotBox label="Weapon 1" icon={<Sword className="w-3 h-3"/>} item={build.weapons[0]} onClick={() => setActivePicker({ type: 'weapon', index: 0 })} />
                                <select 
                                    value={build.weapons[0].stat}
                                    onChange={(e) => {
                                        const newWp = build.weapons.map((w, i) => i === 0 ? { ...w, stat: e.target.value } : w);
                                        setBuild(b => ({ ...b, weapons: newWp }));
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-bold text-gray-400 outline-none focus:border-primary"
                                >
                                    {WEAPON_MAIN_STATS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <SlotBox label="Armor 1" icon={<Shield className="w-3 h-3"/>} item={build.armors[0]} onClick={() => setActivePicker({ type: 'armor', index: 0 })} />
                                <select 
                                    value={build.armors[0].stat}
                                    onChange={(e) => {
                                        const newAr = build.armors.map((a, i) => i === 0 ? { ...a, stat: e.target.value } : a);
                                        setBuild(b => ({ ...b, armors: newAr }));
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-bold text-gray-400 outline-none focus:border-primary"
                                >
                                    {ARMOR_MAIN_STATS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <SlotBox label="Weapon 2" icon={<Sword className="w-3 h-3"/>} item={build.weapons[1]} onClick={() => setActivePicker({ type: 'weapon', index: 1 })} />
                                <select 
                                    value={build.weapons[1].stat}
                                    onChange={(e) => {
                                        const newWp = build.weapons.map((w, i) => i === 1 ? { ...w, stat: e.target.value } : w);
                                        setBuild(b => ({ ...b, weapons: newWp }));
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-bold text-gray-400 outline-none focus:border-primary"
                                >
                                    {WEAPON_MAIN_STATS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <SlotBox label="Armor 2" icon={<Shield className="w-3 h-3"/>} item={build.armors[1]} onClick={() => setActivePicker({ type: 'armor', index: 1 })} />
                                <select 
                                    value={build.armors[1].stat}
                                    onChange={(e) => {
                                        const newAr = build.armors.map((a, i) => i === 1 ? { ...a, stat: e.target.value } : a);
                                        setBuild(b => ({ ...b, armors: newAr }));
                                    }}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] font-bold text-gray-400 outline-none focus:border-primary"
                                >
                                    {ARMOR_MAIN_STATS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </Section>

                    {/* Accessory Section */}
                    <Section title="Accessory Slots">
                        <div className="space-y-4">
                            {build.accessories.map((acc, i) => (
                                <div key={i} className="flex gap-4 items-center">
                                    <SlotBox 
                                        label={`Slot ${i+1}`} 
                                        item={acc.image ? { image: acc.image } : null} 
                                        folder="accessory"
                                        onClick={() => setActivePicker({ type: 'accessory', index: i, sub: 'image' })} 
                                        className="w-16 h-16 rounded-2xl"
                                    />
                                    <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                                        <div className="flex-1">
                                            <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-1">Refining</p>
                                            <div className="flex items-center gap-3">
                                                {acc.refined ? (
                                                     <div className="w-10 h-10 relative border border-cyan-500/30 rounded-lg overflow-hidden">
                                                        <SafeImage src={`/items/accessory/${acc.refined}`} fill alt="" />
                                                     </div>
                                                ) : (
                                                    <span className="text-xs text-gray-600 italic">No refining selected</span>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => setActivePicker({ type: 'accessory', index: i, sub: 'refined' })} 
                                                        className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-[10px] font-black uppercase tracking-tight hover:bg-cyan-500/20 transition-all"
                                                    >
                                                        {acc.refined ? 'Change' : 'Set Refining'}
                                                    </button>
                                                    {acc.refined && (
                                                        <button 
                                                            onClick={() => {
                                                                const newAcc = build.accessories.map((a, idx) => idx === i ? { ...a, refined: null } : a)
                                                                setBuild(b => ({ ...b, accessories: newAcc }))
                                                            }}
                                                            className="p-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all shadow-lg"
                                                            title="Remove Refining"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Substats */}
                    <Section title="Substats Priority">
                        <div className="flex flex-wrap gap-2">
                            {SUBSTATS.map(stat => (
                                <button
                                    key={stat}
                                    onClick={() => {
                                        setBuild(prev => {
                                            const active = prev.substats.includes(stat)
                                            if (active) return { ...prev, substats: prev.substats.filter(s => s !== stat) }
                                            if (prev.substats.length >= 6) return prev
                                            return { ...prev, substats: [...prev.substats, stat] }
                                        })
                                    }}
                                    className={clsx(
                                        "px-4 py-2 rounded-xl text-[11px] font-bold transition-all border",
                                        build.substats.includes(stat) 
                                            ? "bg-orange-500 border-orange-500 text-white" 
                                            : "bg-white/5 border-white/5 text-gray-500 hover:border-white/20"
                                    )}
                                >
                                    {build.substats.includes(stat) && (
                                        <span className="mr-2 opacity-60">#{build.substats.indexOf(stat) + 1}</span>
                                    )}
                                    {stat}
                                </button>
                            ))}
                        </div>
                    </Section>

                    {/* Skill Priority Selector */}
                    <Section title="Manual Skill Priority">
                        <div className="flex flex-wrap gap-4">
                            {displaySkills.map((s, i) => {
                                const isSelected = build.skillPriority.includes(s)
                                const order = isSelected ? build.skillPriority.indexOf(s) + 1 : null
                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => {
                                            setBuild(prev => {
                                                if (isSelected) {
                                                    return { ...prev, skillPriority: prev.skillPriority.filter(x => x !== s) }
                                                } else {
                                                    if (prev.skillPriority.length >= 4) return prev
                                                    return { ...prev, skillPriority: [...prev.skillPriority, s] }
                                                }
                                            })
                                        }}
                                        className={clsx(
                                            "relative w-16 h-16 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all",
                                            isSelected ? "border-primary" : "border-white/10 grayscale opacity-60"
                                        )}
                                    >
                                        <SafeImage src={`/skills/${s}`} fill className="object-cover" alt="" />
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <div className="w-7 h-7 bg-primary rounded-full text-black text-[12px] font-black flex items-center justify-center border-2 border-black">
                                                    {order}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest italic">Click skills to set priority (1-4)</p>
                    </Section>

                    {/* Minimum Stats */}
                    <Section title="Minimum Stats (Goals)">
                        <div className="space-y-2">
                            {MIN_STATS_KEYS.map(s => (
                                <div key={s.key} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                                    <div className="w-5 h-5 relative filter grayscale opacity-60">
                                        <SafeImage src={s.icon} fill alt="" className="object-contain" />
                                    </div>
                                    <span className="flex-1 text-xs font-bold text-gray-400">{s.label}</span>
                                    <input 
                                        type="text" 
                                        placeholder=""
                                        value={build.minStats[s.key] || ""}
                                        onChange={(e) => setBuild(b => ({ ...b, minStats: { ...b.minStats, [s.key]: e.target.value } }))}
                                        className="w-20 bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-right text-xs font-black text-white focus:border-primary outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </Section>

                    {/* Progress / Level Selection */}
                    <Section title="Hero Progression">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">C - Level</span>
                                <select 
                                    value={build.cLevel}
                                    onChange={(e) => setBuild(b => ({ ...b, cLevel: e.target.value }))}
                                    className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-xs font-black text-primary outline-none focus:border-primary"
                                >
                                    <option value="None">None</option>
                                    {[...Array(6)].map((_, i) => (
                                        <option key={i+1} value={`C${i+1}`}>C{i+1}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Fixed Right: Live Preview */}
                <div className={clsx(
                    "flex-1 items-center justify-center bg-[#070707] relative p-4 md:p-12 overflow-hidden preview-container",
                    showMobilePreview ? "flex" : "hidden lg:flex"
                )}>
                    <div className="absolute inset-0 z-0 opacity-20">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/30 blur-[150px] rounded-full"></div>
                    </div>

                    {/* Scaled Wrapper: This container has the exact size of the SCALED card */}
                    <div 
                        className="relative z-10 shrink-0"
                        style={{ 
                            width: 1200 * scale, 
                            height: 630 * scale,
                            transition: 'all 0.3s ease-out'
                        }}
                    >
                        <div 
                            className="absolute top-0 left-0 origin-top-left" 
                            style={{ 
                                width: 1200, 
                                height: 630, 
                                transform: `scale(${scale})` 
                            }}
                        >
                            <p className="text-center text-[10px] text-gray-600 font-bold uppercase tracking-[0.5em] mb-4">Live Preview</p>
                            <div className="p-2 bg-gradient-to-br from-white/10 to-transparent rounded-[40px] shadow-2xl">
                                <div className="overflow-hidden rounded-[32px]">
                                    <BuildCardExport ref={exportRef} hero={hero} build={build} skills={displaySkills} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Action Buttons */}
                    <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-50">
                        <button 
                            onClick={() => handleExport('copy')}
                            className="flex items-center gap-3 px-6 py-4 bg-white/[0.05] hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-black text-white transition-all backdrop-blur-xl group shadow-2xl"
                        >
                            <Copy className="w-5 h-5 text-primary" /> 
                            <span className="uppercase tracking-widest">Copy Image</span>
                        </button>
                        <button 
                            onClick={() => handleExport('download')}
                            className="flex items-center gap-3 px-8 py-5 bg-primary text-black rounded-2xl text-sm font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(255,215,0,0.25)] hover:scale-105 active:scale-95 transition-all group"
                        >
                            <Download className="w-5 h-5" /> 
                            <span>Download Image</span>
                        </button>
                    </div>

                </div>
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

            {/* Mobile Floating Toggle Button */}
            <button 
                onClick={() => setShowMobilePreview(!showMobilePreview)}
                className="lg:hidden fixed bottom-10 right-8 z-[100] flex items-center gap-3 px-6 py-4 bg-primary text-black rounded-[24px] shadow-[0_10px_40px_rgba(255,215,0,0.4)] font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all outline-none border-0"
            >
                {showMobilePreview ? (
                    <>
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Build</span>
                    </>
                ) : (
                    <>
                        <Eye className="w-4 h-4" />
                        <span>View Preview</span>
                    </>
                )}
            </button>
        </div>
    )
}

function Section({ title, children }) {
    return (
        <div className="space-y-4">
            <h3 className="flex items-center gap-3 text-xs font-black text-white/40 uppercase tracking-[0.25em]">
                <span className="w-1.5 h-px bg-primary"></span> {title}
            </h3>
            {children}
        </div>
    )
}

function SlotBox({ label, icon, item, folder, onClick, className }) {
    const isAcc = folder === 'accessory'
    const imgFolder = isAcc ? 'accessory' : (label.includes('Weapon') ? 'weapon' : 'armor')

    return (
        <div onClick={onClick} className={clsx(
            "group relative cursor-pointer border-2 border-dashed border-white/10 hover:border-primary/50 rounded-2xl transition-all aspect-square flex flex-col items-center justify-center overflow-hidden bg-black/20",
            item?.image && "border-solid border-white/20",
            className
        )}>
            {item?.image ? (
                <>
                    <SafeImage src={`/items/${imgFolder}/${item.image}`} fill className="object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <Plus className="w-6 h-6 text-white" />
                    </div>
                </>
            ) : (
                <>
                    <div className="p-3 bg-white/5 rounded-full mb-1 group-hover:scale-110 transition-transform">
                        {icon || <Plus className="w-4 h-4 text-gray-600" />}
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{label}</span>
                </>
            )}
        </div>
    )
}

// BuildCardExport Component
import { forwardRef } from "react"
const BuildCardExport = forwardRef(({ hero, build, skills }, ref) => {
    return (
        <div 
            ref={ref}
            className="w-[1200px] h-[630px] bg-[#0a0a0a] flex flex-col relative text-white"
            style={{ fontFamily: 'Inter, sans-serif' }}
        >
            <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden opacity-30">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full"></div>
            </div>
            
            <div className="relative z-10 px-12 pt-10 flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-black text-black text-2xl">7K</div>
                    <div>
                        <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">BUILD <span className="text-primary">ARCHIVE</span></h1>
                        <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Powered by 7k-db.com</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex px-12 pb-12 gap-12 items-center">
                <div className="relative w-[320px] h-[400px] shrink-0">
                    <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full transform scale-75"></div>
                    <div className="relative w-full h-full rounded-[40px] border border-white/10 overflow-hidden shadow-2xl bg-black">
                        <img 
                            src={`/heroes/${hero.filename}`} 
                            className="w-full h-full object-cover" 
                            alt="" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                        
                        {/* C-Level Badge */}
                        {build.cLevel && build.cLevel !== "None" && (
                            <div className="absolute top-6 right-6 px-4 py-2 bg-primary/95 text-black rounded-xl font-black text-xl italic shadow-2xl transform rotate-2 animate-in slide-in-from-top-2 duration-500">
                                {build.cLevel}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-x-12 gap-y-6">
                    {/* Column 1: Equipment & Substats */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                 <Sword className="w-3 h-3" /> Equipment Set
                                 <div className="h-px flex-1 bg-white/5"></div>
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {[build.weapons[0], build.armors[0], build.weapons[1], build.armors[1]].map((item, idx) => {
                                    const type = idx % 2 === 0 ? 'weapon' : 'armor'
                                    return (
                                        <div key={idx} className="bg-[#151515] border border-white/10 rounded-2xl p-2.5 flex items-center gap-3 h-16">
                                            <div className="relative w-11 h-11 bg-black rounded-xl overflow-hidden border border-white/5 flex-shrink-0">
                                                {item?.image && (
                                                    <img 
                                                        src={`/items/${type}/${item.image}`} 
                                                        className="w-full h-full object-cover" 
                                                        alt="" 
                                                    />
                                                )}
                                            </div>
                                            <div className="truncate">
                                                <p className="text-[8px] font-bold text-gray-500 uppercase">{type}</p>
                                                <p className="text-[10px] font-black text-white truncate">{item?.stat || ""}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                 <Wand2 className="w-3 h-3" /> Substats Priority
                                 <div className="h-px flex-1 bg-white/5"></div>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                 {build.substats.map((stat, idx) => (
                                     <div key={idx} className="px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-xl flex items-center gap-2">
                                         <span className="text-[10px] font-black text-primary/80">#{idx+1}</span>
                                         <span className="text-[10px] font-black text-white uppercase tracking-tight">{stat}</span>
                                     </div>
                                 ))}
                                 {build.substats.length === 0 && (
                                    <div className="text-[10px] text-gray-700 italic font-bold uppercase tracking-widest opacity-50">No priority set</div>
                                 )}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Accessories & Skills */}
                    <div className="space-y-8">
                        <div>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                 <Plus className="w-3 h-3" /> Accessories
                                 <div className="h-px flex-1 bg-white/5"></div>
                            </h4>
                            <div className="flex gap-4 min-h-[82px]">
                                {build.accessories.filter(acc => acc.image).map((acc, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-3">
                                        <div className="relative w-14 h-14 bg-[#151515] border border-white/10 rounded-2xl overflow-hidden shadow-lg">
                                            <img src={`/items/accessory/${acc.image}`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        {acc.refined && (
                                            <div className="w-8 h-8 relative bg-black border border-cyan-500/40 rounded-lg overflow-hidden shadow-inner ring-1 ring-cyan-500/20">
                                                <img src={`/items/accessory/${acc.refined}`} className="w-full h-full object-cover" alt="" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {build.accessories.filter(acc => acc.image).length === 0 && (
                                    <div className="text-[10px] text-gray-700 italic font-bold py-4 uppercase tracking-widest opacity-50">No accessories equipped</div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                 <Sparkles className="w-3 h-3" /> Skill Priority
                                 <div className="h-px flex-1 bg-white/5"></div>
                            </h4>
                            <div className="flex gap-3">
                                {skills.map((s, idx) => {
                                    const rankIndex = build.skillPriority.indexOf(s)
                                    const isRanked = rankIndex !== -1
                                    return (
                                        <div key={idx} className="relative">
                                            <div className={clsx(
                                                "w-14 h-14 bg-[#151515] border border-white/10 rounded-2xl overflow-hidden transition-all",
                                                !isRanked && "opacity-40 grayscale-[0.5]"
                                            )}>
                                                <img src={`/skills/${s}`} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            {isRanked && (
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full text-black text-[11px] font-black flex items-center justify-center border-2 border-black">
                                                    {rankIndex + 1}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Full Width Bottom: Target Stats */}
                    <div className="col-span-2">
                        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                             <Info className="w-3 h-3" /> Target Stats
                             <div className="h-px flex-1 bg-white/5"></div>
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                             {MIN_STATS_KEYS.filter(s => build.minStats[s.key]).map(s => (
                                 <div key={s.key} className="flex items-center justify-between px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl">
                                     <div className="flex items-center gap-3">
                                         <div className="w-4 h-4 relative opacity-60">
                                            <img src={s.icon} className="w-full h-full object-contain" alt="" />
                                         </div>
                                         <span className="text-[9px] font-bold text-gray-500 uppercase">{s.label}</span>
                                     </div>
                                     <span className="text-xs font-black text-white">{build.minStats[s.key]}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 right-12 flex items-center gap-4 opacity-40">
                <p className="text-[9px] font-bold uppercase tracking-[0.4em]">Designed at 7k-db.com</p>
                <div className="w-4 h-px bg-white"></div>
            </div>
        </div>
    )
})

BuildCardExport.displayName = "BuildCardExport"

function ItemPickerModal({ type, items, onSelect, onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-lg animate-in fade-in duration-200">
            <div className="bg-[#0f0f0f] border border-white/10 rounded-[32px] w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-3xl">
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter transform -skew-x-6">Select {type}</h2>
                        <p className="text-[10px] text-primary/60 font-black uppercase tracking-[0.2em]">Equipment Library</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-12 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-10 gap-y-12 custom-scrollbar">
                    {(items || []).map((img, idx) => {
                        const imgFolder = type === 'weapon' ? 'weapon' : type === 'armor' ? 'armor' : 'accessory'
                        return (
                            <div 
                                key={idx} 
                                onClick={() => onSelect(img)}
                                className="group relative cursor-pointer aspect-square"
                            >
                                <div className="relative w-full h-full bg-black/40 border-2 border-white/5 rounded-3xl overflow-hidden hover:border-primary transition-all hover:scale-110 active:scale-95 shadow-2xl">
                                    <SafeImage src={`/items/${imgFolder}/${img}`} fill className="object-cover p-1" alt="" />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            </div>
                        )
                    })}
                    {(!items || items.length === 0) && (
                        <div className="col-span-full py-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">No items found</div>
                    )}
                </div>
            </div>
        </div>
    )
}
