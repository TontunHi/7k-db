'use client'

import { useState, useMemo } from 'react'
import SafeImage from '@/components/shared/SafeImage'
import { Plus, X, Shield, Swords, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import FormationSelector from './FormationSelector'

import { getSlotType, getStaggerClass } from '@/lib/formation-utils'

export default function TeamBuilder({
    team,
    index,
    heroesList,
    petsList,
    formations,
    onUpdate,
    onRemove,
    maxHeroes = 5,
    className
}) {
    // team: { index, formation, pet_file, heroes: [file1, file2...] }
    // heroesList: [{ filename, name, grade }]
    // petsList: ["/pets/l_dello.png"...]

    const [isHeroOpen, setIsHeroOpen] = useState(null) // index of slot opening modal
    const [isPetOpen, setIsPetOpen] = useState(false)

    // Sort heroes by grade (l++ > l+ > l > r > uc > c) then by name
    // Grade is parsed from filename prefix: l++_xxx, l+_xxx, l_xxx, r_xxx, uc_xxx, c_xxx
    const sortedHeroesList = useMemo(() => {
        const gradeOrder = { 'l++': 6, 'l+': 5, 'l': 4, 'r': 3, 'uc': 2, 'c': 1 }

        const getGradeFromFilename = (filename) => {
            if (!filename) return 0
            const lower = filename.toLowerCase()
            if (lower.startsWith('l++_')) return gradeOrder['l++']
            if (lower.startsWith('l+_')) return gradeOrder['l+']
            if (lower.startsWith('l_')) return gradeOrder['l']
            if (lower.startsWith('r_')) return gradeOrder['r']
            if (lower.startsWith('uc_')) return gradeOrder['uc']
            if (lower.startsWith('c_')) return gradeOrder['c']
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
            .filter(h => h && h.filename)
            .sort((a, b) => {
                const gradeA = getGradeFromFilename(a.filename)
                const gradeB = getGradeFromFilename(b.filename)

                if (gradeA !== gradeB) return gradeB - gradeA // Higher grade first

                // Then sort by name
                const nameA = getNameFromFilename(a.filename)
                const nameB = getNameFromFilename(b.filename)
                return nameA.localeCompare(nameB)
            })
    }, [heroesList])

    const handleHeroSelect = (filename) => {
        const newHeroes = [...(team.heroes || [])]
        // Ensure array size
        while (newHeroes.length < 5) newHeroes.push(null)

        newHeroes[isHeroOpen] = filename
        onUpdate({ ...team, heroes: newHeroes })
        setIsHeroOpen(null)
    }

    const handlePetSelect = (filename) => {
        onUpdate({ ...team, pet_file: filename })
        setIsPetOpen(false)
    }

    // Modal Components
    const HeroPicker = () => (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
            <div className="bg-gray-900 w-full max-w-4xl h-[85vh] rounded-2xl border border-gray-700 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/50">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Select Hero</h3>
                        <p className="text-sm text-gray-400 mt-1">Choose a hero for this slot</p>
                    </div>
                    <button onClick={() => setIsHeroOpen(null)} className="p-3 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors text-gray-400">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 auto-rows-max">
                    {sortedHeroesList.map(h => (
                        <button
                            key={h.filename}
                            onClick={() => handleHeroSelect(h.filename)}
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

    const PetPicker = () => (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in">
            <div className="bg-gray-900 w-full max-w-3xl max-h-[80vh] rounded-2xl border border-gray-700 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-black/50">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Select Pet</h3>
                        <p className="text-sm text-gray-400 mt-1">Choose a pet for this team</p>
                    </div>
                    <button onClick={() => setIsPetOpen(false)} className="p-3 hover:bg-red-500/20 hover:text-red-400 rounded-xl transition-colors text-gray-400">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    {petsList.map(p => (
                        <button
                            key={p}
                            onClick={() => handlePetSelect(p)}
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
                {/* Heroes - 5 Cols */}
                <div className="flex-1 space-y-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <Swords className="w-3 h-3" /> Heroes
                    </label>
                    <div className="grid grid-cols-5 gap-2 sm:gap-3 pb-8 max-w-[380px] md:max-w-[500px]"> {/* pb-8 for stagger space */}
                        {[0, 1, 2, 3, 4].map((i) => {
                            const type = getSlotType(team.formation, i)
                            const heroFileOrSlug = team.heroes?.[i]
                            const heroData = heroesList?.find(h => 
                                h.filename === heroFileOrSlug || 
                                h.filename.replace(/\.[^/.]+$/, "") === heroFileOrSlug
                            )
                            const heroFile = heroData?.filename || heroFileOrSlug
                            const stagger = getStaggerClass(team.formation, i)
                            const currentCount = team.heroes?.filter(h => h !== null).length || 0
                            const isDisabled = !heroFile && currentCount >= maxHeroes

                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => !isDisabled && setIsHeroOpen(i)}
                                    className={cn(
                                        "relative aspect-[3/4] rounded-lg border flex items-center justify-center transition-all overflow-hidden",
                                        !isDisabled && "group hover:shadow-xl hover:z-10",
                                        stagger,
                                        type === 'front'
                                            ? "border-sky-500/30 bg-sky-500/5"
                                            : "border-rose-500/30 bg-rose-500/5",
                                        !isDisabled && type === 'front' && "hover:bg-sky-500/10 hover:border-sky-500",
                                        !isDisabled && type !== 'front' && "hover:bg-rose-500/10 hover:border-rose-500",
                                        !heroFile && "border-dashed",
                                        isDisabled && "opacity-20 cursor-not-allowed grayscale"
                                    )}
                                >
                                    {heroFile ? (
                                        <>
                                            <SafeImage
                                                src={`/heroes/${heroFile}`}
                                                alt="Hero"
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                                sizes="(max-width: 768px) 20vw, 15vw"
                                            />
                                            {/* Labels Removed */}
                                            {/* Remove Button */}
                                            <div
                                                className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive transition-all"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    const newHeroes = [...(team.heroes || [])]
                                                    newHeroes[i] = null
                                                    onUpdate({ ...team, heroes: newHeroes })
                                                }}
                                            >
                                                <X size={12} />
                                            </div>
                                        </>
                                    ) : (
                                        <Plus className={cn("w-8 h-8 opacity-50", type === 'front' ? "text-sky-500" : "text-rose-500")} />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Pet & Aura (Right - smaller) */}
                <div className="space-y-6 w-32 shrink-0 self-start">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                            <Star className="w-3 h-3" /> Pet
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsPetOpen(true)}
                            className={cn(
                                "relative w-24 h-24 rounded-xl border-2 border-dashed border-primary/30 flex items-center justify-center transition-all overflow-hidden group hover:border-primary hover:bg-primary/5 mx-auto",
                                team.pet_file ? "border-solid border-primary" : ""
                            )}
                        >
                            {team.pet_file ? (
                                <>
                                    <SafeImage 
                                        src={team.pet_file} 
                                        alt="Pet" 
                                        fill 
                                        className="object-contain p-2 group-hover:scale-110 transition-transform" 
                                        sizes="96px"
                                    />
                                    <div
                                        className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive transition-all z-10"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onUpdate({ ...team, pet_file: null })
                                        }}
                                    >
                                        <X size={12} />
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-1 text-primary/50 group-hover:text-primary">
                                    <Plus className="w-6 h-6" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Pet</span>
                                </div>
                            )}
                        </button>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block text-center">
                            Aura
                        </label>
                        <div className="flex justify-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => onUpdate({ ...team, aura: 'blue' })}
                                className={cn(
                                    "w-7 h-7 rounded-full border-2 transition-all shadow-lg",
                                    team.aura === 'blue' 
                                        ? "bg-blue-600 border-white ring-4 ring-blue-500/30 scale-110" 
                                        : "bg-blue-900 border-blue-800 opacity-40 hover:opacity-100"
                                )}
                                title="Blue Aura"
                            />
                            <button
                                type="button"
                                onClick={() => onUpdate({ ...team, aura: 'red' })}
                                className={cn(
                                    "w-7 h-7 rounded-full border-2 transition-all shadow-lg",
                                    team.aura === 'red' 
                                        ? "bg-red-600 border-white ring-4 ring-red-500/30 scale-110" 
                                        : "bg-red-900 border-red-800 opacity-40 hover:opacity-100"
                                )}
                                title="Red Aura"
                            />
                            <button
                                type="button"
                                onClick={() => onUpdate({ ...team, aura: null })}
                                className={cn(
                                    "w-7 h-7 rounded-full border-2 border-gray-800 bg-gray-900 flex items-center justify-center transition-all",
                                    !team.aura ? "opacity-100 border-gray-400" : "opacity-20"
                                )}
                                title="No Aura"
                            >
                                <X size={10} className="text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isHeroOpen !== null && <HeroPicker />}
            {isPetOpen && <PetPicker />}
        </div >
    )
}
