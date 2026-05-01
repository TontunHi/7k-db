'use client'

import { useState, useMemo } from 'react'
import SafeImage from '@/components/shared/SafeImage'
import { Plus, X, Shield, Swords, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import FormationSelector from './FormationSelector'

import { getSlotType, getStaggerClass } from '@/lib/formation-utils'

// Modal Components
const HeroPicker = ({ isOpen, sortedHeroesList, onSelect, onClose }) => {
    if (isOpen === null) return null
    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
            <div className="bg-gray-900 w-full max-w-4xl h-[85vh] rounded-2xl border border-gray-700 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/50">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Select Hero</h3>
                        <p className="text-sm text-gray-400 mt-1">Choose a hero for this slot</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors text-gray-400">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 auto-rows-max">
                    {sortedHeroesList.map(h => (
                        <button
                            key={h.filename}
                            onClick={() => onSelect(h.filename)}
                            className="group relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-gray-700 hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all bg-black"
                        >
                            <SafeImage
                                src={`/heroes/${h.filename}`}
                                alt={h.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                sizes="(max-width: 768px) 25vw, 15vw"
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

const PetPicker = ({ isOpen, petsList, onSelect, onClose }) => {
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
            <div className="bg-gray-900 w-full max-w-3xl max-h-[80vh] rounded-2xl border border-gray-700 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/50">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Select Pet</h3>
                        <p className="text-sm text-gray-400 mt-1">Choose a pet for this team</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors text-gray-400">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    {petsList.map(p => (
                        <button
                            key={p}
                            onClick={() => onSelect(p)}
                            className="group flex items-center justify-center aspect-square rounded-xl border-2 border-gray-700 hover:border-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all bg-gradient-to-b from-gray-800 to-black"
                        >
                            <SafeImage 
                                src={p} 
                                alt="Pet" 
                                width={80}
                                height={80}
                                className="object-contain group-hover:scale-110 transition-transform duration-300" 
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function TeamBuilder({
    team,
    index,
    heroesList,
    petsList,
    formations,
    onUpdate,
    onRemove,
    maxHeroes = 5,
    className,
    renderHeroAction
}) {
    // team: { index, formation, pet_file, heroes: [file1, file2...] }
    // heroesList: [{ filename, name, grade }]
    // petsList: ["/pets/l_dello.png"...]

    const [isHeroOpen, setIsHeroOpen] = useState(null) // index of slot opening modal
    const [isPetOpen, setIsPetOpen] = useState(false)
    const [isSupportPetOpen, setIsSupportPetOpen] = useState(null) // index of support slot (0, 1, 2)

    // Sort heroes by grade (l++ > l+ > l > r > uc > c) then by name
    // Grade is parsed from filename prefix: l++_xxx, l+_xxx, l_xxx, r_xxx, uc_xxx, c_xxx
    const sortedHeroesList = useMemo(() => {
        const gradeOrder = { 'l++': 6, 'l+': 5, 'l': 4, 'r': 3, 'uc': 2, 'c': 1 }
        const allowedGrades = ['l++', 'l+', 'l', 'r']

        const getGradeFromFilename = (filename) => {
            if (!filename) return 0
            const lower = filename.toLowerCase()
            if (lower.startsWith('l++_')) return gradeOrder['l++']
            if (lower.startsWith('l+_')) return gradeOrder['l+']
            if (lower.startsWith('l_')) return gradeOrder['l']
            if (lower.startsWith('r_')) return gradeOrder['r']
            return 0
        }

        const getNameFromFilename = (filename) => {
            if (!filename) return ''
            return filename
                .replace(/^(l\+\+|l\+|l|r|uc|c)_/i, '') // Remove grade prefix
                .replace(/\.[^/.]+$/, '')                // Remove extension
                .replace(/_/g, ' ')                      // Replace underscores with spaces
        }

        return [...heroesList]
            .filter(h => {
                if (!h || !h.filename) return false
                const lower = h.filename.toLowerCase()
                return allowedGrades.some(g => lower.startsWith(g + '_'))
            })
            .sort((a, b) => {
                const gradeA = getGradeFromFilename(a.filename)
                const gradeB = getGradeFromFilename(b.filename)

                if (gradeA !== gradeB) return gradeB - gradeA // Higher grade first

                const nameA = getNameFromFilename(a.filename)
                const nameB = getNameFromFilename(b.filename)
                return nameA.localeCompare(nameB)
            })
    }, [heroesList])

    const handleHeroSelect = (filename) => {
        const newHeroes = [...(team.heroes || [null, null, null, null, null])]
        const currentCount = newHeroes.filter(h => h).length
        const newOrder = [...(team.selection_order || [])]

        // If clicking an empty slot and already have maxHeroes, block
        if (!newHeroes[isHeroOpen] && currentCount >= maxHeroes) {
            alert(`Maximum ${maxHeroes} heroes allowed for this mode.`)
            setIsHeroOpen(null)
            return
        }
        
        // If replacing an existing hero, keep the order index
        if (newHeroes[isHeroOpen]) {
            // No change to order needed, just updating the file
        } else {
            // Adding new hero, push index to order
            newOrder.push(isHeroOpen)
        }

        newHeroes[isHeroOpen] = filename
        onUpdate({ ...team, heroes: newHeroes, selection_order: newOrder })
        setIsHeroOpen(null)
    }

    const handlePetSelect = (filename) => {
        if (isSupportPetOpen !== null) {
            const supports = [...(team.pet_supports || [null, null, null])]
            supports[isSupportPetOpen] = filename
            onUpdate({ ...team, pet_supports: supports })
            setIsSupportPetOpen(null)
        } else {
            onUpdate({ ...team, pet_file: filename })
            setIsPetOpen(false)
        }
    }


    return (
        <div className={cn("space-y-8 bg-muted/5 rounded-3xl p-6 md:p-8 border border-border/50", className)}>
            {/* Formation Selector */}
            <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Formation
                </label>
                <FormationSelector
                    formations={formations}
                    value={team.formation}
                    onChange={(val) => onUpdate({ ...team, formation: val })}
                />
            </div>

            {/* Hero Grid & Pet */}
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Heroes - 3 Cols */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Swords className="w-3.5 h-3.5" /> Formation ({maxHeroes} Heroes Max)
                        </label>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                            <span className="text-[8px] font-black text-sky-500/80 uppercase tracking-tighter">Front</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] ml-2" />
                            <span className="text-[8px] font-black text-rose-500/80 uppercase tracking-tighter">Back</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-3 pb-4"> 
                        {[0, 1, 2, 3, 4].map((i) => {
                            const type = getSlotType(team.formation, i)
                            const heroFileOrSlug = team.heroes?.[i]
                            const heroData = heroesList?.find(h => 
                                h.filename === heroFileOrSlug || 
                                h.filename.replace(/\.[^/.]+$/, "") === heroFileOrSlug
                            )
                            const heroFile = heroData?.filename || heroFileOrSlug
                            const stagger = getStaggerClass(team.formation, i)
                            const isSlotActive = (team.heroes || []).filter(h => h).length < maxHeroes || heroFile

                            return (
                                <div
                                    key={i}
                                    onClick={() => setIsHeroOpen(i)}
                                    className={cn(
                                        "relative aspect-[3/4] rounded-2xl border-2 flex items-center justify-center transition-all duration-300 overflow-hidden cursor-pointer",
                                        "group hover:z-10 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]",
                                        stagger,
                                        type === 'front'
                                            ? "border-sky-500/20 bg-sky-500/5 hover:border-sky-500/60"
                                            : "border-rose-500/20 bg-rose-500/5 hover:border-rose-500/60",
                                        !heroFile && "border-dashed"
                                    )}
                                >
                                    {heroFile ? (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <SafeImage
                                                src={`/heroes/${heroFile}`}
                                                alt="Hero"
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(max-width: 768px) 30vw, 20vw"
                                            />
                                            {renderHeroAction && renderHeroAction(i, heroFile)}
                                            {/* Remove Button */}
                                            <button
                                                className="absolute top-2 right-2 p-1.5 bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 hover:bg-rose-600 transition-all z-30 border border-white/10 backdrop-blur-md"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    const newHeroes = [...(team.heroes || [])]
                                                    newHeroes[i] = null
                                                    const newOrder = (team.selection_order || []).filter(idx => idx !== i)
                                                    onUpdate({ ...team, heroes: newHeroes, selection_order: newOrder })
                                                }}
                                            >
                                                <X size={12} strokeWidth={3} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 opacity-20 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                            <div className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center border-2 border-dashed",
                                                type === 'front' ? "border-sky-500/40 text-sky-500/60" : "border-rose-500/40 text-rose-500/60"
                                            )}>
                                                <Plus size={20} />
                                            </div>
                                            <span className={cn(
                                                "text-[8px] font-black uppercase tracking-[0.2em]",
                                                type === 'front' ? "text-sky-500/60" : "text-rose-500/60"
                                            )}>
                                                {type}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Pet Section */}
                <div className="space-y-6 w-full xl:w-48 shrink-0">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Star className="w-3 h-3 text-yellow-500" />
                        </label>
                        <div
                            onClick={() => setIsPetOpen(true)}
                            className={cn(
                                "relative w-20 h-20 rounded-xl border border-dashed border-primary/30 flex items-center justify-center transition-all overflow-hidden group hover:border-primary hover:bg-primary/5 cursor-pointer",
                                team.pet_file ? "border-solid border-primary bg-primary/5" : ""
                            )}
                        >
                            {team.pet_file ? (
                                <>
                                    <SafeImage 
                                        src={team.pet_file} 
                                        alt="Pet" 
                                        fill 
                                        className="object-contain p-2 group-hover:scale-110 transition-transform" 
                                        sizes="80px"
                                    />
                                    <button
                                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive transition-all z-10"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onUpdate({ ...team, pet_file: null })
                                        }}
                                    >
                                        <X size={12} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-primary/50 group-hover:text-primary">
                                    <Plus className="w-5 h-5" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest"></label>
                        <div className="flex gap-2">
                            {[0, 1, 2].map(idx => (
                                <div
                                    key={idx}
                                    onClick={() => setIsSupportPetOpen(idx)}
                                    className={cn(
                                        "relative w-12 h-12 rounded-lg border border-dashed border-white/10 flex items-center justify-center transition-all overflow-hidden group hover:border-primary/50 hover:bg-white/5 cursor-pointer",
                                        team.pet_supports?.[idx] ? "border-solid border-white/20 bg-black/40" : ""
                                    )}
                                >
                                    {team.pet_supports?.[idx] ? (
                                        <>
                                            <SafeImage 
                                                src={team.pet_supports[idx]} 
                                                alt="Support Pet" 
                                                fill 
                                                className="object-contain p-1.5" 
                                                sizes="48px"
                                            />
                                            <button
                                                className="absolute top-0 right-0 p-0.5 bg-black/50 text-white rounded-bl-md opacity-0 group-hover:opacity-100 hover:bg-destructive transition-all z-10"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    const supports = [...(team.pet_supports || [null, null, null])]
                                                    supports[idx] = null
                                                    onUpdate({ ...team, pet_supports: supports })
                                                }}
                                            >
                                                <X size={10} />
                                            </button>
                                        </>
                                    ) : (
                                        <Plus className="w-3 h-3 text-white/20" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {/* Modals */}
            <HeroPicker 
                isOpen={isHeroOpen} 
                sortedHeroesList={sortedHeroesList} 
                onSelect={handleHeroSelect} 
                onClose={() => setIsHeroOpen(null)} 
            />
            <PetPicker 
                isOpen={isPetOpen || isSupportPetOpen !== null} 
                petsList={petsList} 
                onSelect={handlePetSelect} 
                onClose={() => { setIsPetOpen(false); setIsSupportPetOpen(null); }} 
            />

        </div >
    )
}
