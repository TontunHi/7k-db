'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Plus, X, Shield, Swords, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import FormationSelector from './FormationSelector'

// Helper to determine slot color/role based on formation and index
function getSlotType(formation, index) {
    if (!formation) return 'neutral'
    // Logic based on specific request (Index 0-4 = Slots 1-5)
    // Front = Blue, Back = Red

    if (formation === '1-4') {
        // Slot 3 (Index 2) is Front/Blue. Rest are Back/Red
        if (index === 2) return 'front'
        return 'back'
    }
    if (formation === '4-1') {
        // Slot 3 (Index 2) is Back/Red. Rest are Front/Blue
        if (index === 2) return 'back'
        return 'front'
    }
    if (formation === '2-3') {
        // Slots 2,4 (Indices 1,3) are Front/Blue. Rest (0,2,4 -> 1,3,5) are Back/Red
        if (index === 1 || index === 3) return 'front'
        return 'back'
    }
    if (formation === '3-2') {
        // Slots 2,4 (Indices 1,3) are Back/Red. Rest Front/Blue
        if (index === 1 || index === 3) return 'back'
        return 'front'
    }

    // Default fallback
    const [front, back] = formation.split('-').map(Number)
    if (index < front) return 'front'
    return 'back'
}

function getStaggerClass(formation, index) {
    if (!formation) return ''

    // Logic requested:
    // 1-4: Slots 1,2,4,5 (Indices 0,1,3,4) move down
    if (formation === '1-4') {
        if ([0, 1, 3, 4].includes(index)) return 'translate-y-8'
    }
    // 2-3: Slots 1,3,5 (Indices 0,2,4) move down
    if (formation === '2-3') {
        if ([0, 2, 4].includes(index)) return 'translate-y-8'
    }
    // 3-2: Slots 2,4 (Indices 1,3) move down
    if (formation === '3-2') {
        if ([1, 3].includes(index)) return 'translate-y-8'
    }
    // 4-1: Slot 3 (Index 2) moves down
    if (formation === '4-1') {
        if (index === 2) return 'translate-y-8'
    }
    return ''
}

export default function TeamBuilder({
    team,
    index,
    heroesList,
    petsList,
    formations,
    onUpdate,
    onRemove
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

    // Modal Components (simplified inline for this file, could be separate)
    const HeroPicker = () => (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card w-full max-w-4xl h-[80vh] rounded-2xl border border-border flex flex-col shadow-2xl">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Select Hero</h3>
                    <button onClick={() => setIsHeroOpen(null)} className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 gap-2 auto-rows-max">
                    {sortedHeroesList.map(h => (
                        <button
                            key={h.filename}
                            onClick={() => handleHeroSelect(h.filename)}
                            className="group rounded-lg overflow-hidden border border-border hover:border-primary hover:ring-2 hover:ring-primary/50 transition-all bg-black/20"
                        >
                            <Image
                                src={`/heroes/${h.filename}`}
                                alt={h.name}
                                width={128}
                                height={128}
                                className="w-full h-auto object-contain group-hover:scale-105 transition-transform"
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )

    const PetPicker = () => (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card w-full max-w-3xl h-[70vh] rounded-2xl border border-border flex flex-col shadow-2xl">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Select Pet</h3>
                    <button onClick={() => setIsPetOpen(false)} className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                    {petsList.map(p => (
                        <button
                            key={p}
                            onClick={() => handlePetSelect(p)}
                            className="group relative aspect-square rounded-xl overflow-hidden border border-border hover:border-primary hover:ring-2 hover:ring-primary/50 transition-all bg-secondary/10"
                        >
                            <Image src={p} alt="Pet" fill className="object-contain p-2 group-hover:scale-110 transition-transform" />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="space-y-8 bg-muted/5 rounded-3xl p-6 md:p-8 border border-border/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="bg-primary/10 text-primary px-4 py-1.5 rounded-full font-bold text-sm uppercase tracking-wider border border-primary/20">
                    Team {team.index}
                </div>
                {/* Remove Button removed as requested */}
            </div>

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
                    <div className="grid grid-cols-5 gap-2 sm:gap-3 pb-8"> {/* pb-8 for stagger space */}
                        {[0, 1, 2, 3, 4].map((i) => {
                            const type = getSlotType(team.formation, i)
                            const heroFile = team.heroes?.[i]
                            const stagger = getStaggerClass(team.formation, i)

                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setIsHeroOpen(i)}
                                    className={cn(
                                        "relative aspect-[3/4] rounded-lg border flex items-center justify-center transition-all overflow-hidden group hover:shadow-xl hover:z-10",
                                        stagger,
                                        type === 'front'
                                            ? "border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/10 hover:border-sky-500" // Blue
                                            : "border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500", // Red
                                        !heroFile && "border-dashed"
                                    )}
                                >
                                    {heroFile ? (
                                        <>
                                            <Image
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

                {/* Pet (Right - smaller) */}
                <div className="space-y-3 w-32 shrink-0">
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
                                <Image src={team.pet_file} alt="Pet" fill className="object-contain p-2 group-hover:scale-110 transition-transform" />
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
            </div>

            {/* Modals */}
            {isHeroOpen !== null && <HeroPicker />}
            {isPetOpen && <PetPicker />}
        </div >
    )
}
