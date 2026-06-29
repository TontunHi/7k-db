'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Premium Skill Rotation Grid for Raid
 * Handles missing skills beautifully and shows sequence numbers.
 */
export default function RaidSkillRotation({ skillRotation = [], heroes = [], skillsMap = {} }) {
    const [skillErrors, setSkillErrors] = useState({})

    const handleSkillError = (key) => {
        setSkillErrors(prev => ({ ...prev, [key]: true }))
    }

    const getSkillPath = (heroFile, skillNumber) => {
        if (!heroFile) return null
        const folderName = heroFile.replace(/\.[^/.]+$/, '')
        return `/skills/${folderName}/${skillNumber}.webp`
    }

    return (
        <div className="mt-4 relative animate-in fade-in slide-in-from-bottom-4 duration-700 w-fit">
            {/* Background Glow */}
            <div className="absolute -inset-2 bg-red-500/5 rounded-[1.5rem] blur-xl opacity-50 pointer-events-none" />
            
            <div className="relative bg-white/[0.01] border border-white/5 rounded-[1.5rem] p-4 backdrop-blur-md overflow-hidden w-fit">
                <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="p-1 rounded-lg bg-red-500/10 border border-red-500/20">
                        <Zap className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500/80">Skill Rotation</span>
                </div>

                {(() => {
                    // 1. Identify active hero slots
                    const activeHeroIndices = [0, 1, 2, 3, 4].filter(idx => heroes?.[idx])
                    const displayIndices = activeHeroIndices.length === 0 ? [0, 1, 2, 3, 4] : activeHeroIndices

                    // 2. Identify all unique skills used across the entire team rotation
                    const allRotationSkills = skillRotation
                        .filter(s => typeof s === 'string' && s.includes('-'))
                        .map(s => s.split('-')[1])
                    
                    // 3. Create a uniform set of rows: [2, 3] + any others in rotation
                    const rowSkills = Array.from(new Set(['2', '3', ...allRotationSkills]))
                        .sort((a, b) => (parseInt(a) || 0) - (parseInt(b) || 0))

                    return (
                        <div 
                            className="grid gap-2.5 sm:gap-3 md:gap-4 w-fit"
                            style={{ 
                                gridTemplateColumns: `repeat(${displayIndices.length}, minmax(0, 1fr))` 
                            }}
                        >
                            {displayIndices.map((heroIdx) => {
                                const heroFile = heroes?.[heroIdx]

                                return (
                                    <div key={heroIdx} className="space-y-3 flex flex-col items-center min-w-[36px] sm:min-w-[40px]">
                                        {rowSkills.map(skillName => {
                                            const skillDataKey = `${heroIdx}-${skillName}`
                                            const errorKey = `h${heroIdx}-s${skillName}`
                                            const path = getSkillPath(heroFile, skillName)
                                            const orderIndex = skillRotation.indexOf(skillDataKey)
                                            const order = orderIndex >= 0 ? orderIndex + 1 : null
                                            
                                            const isMissing = !heroFile || skillErrors[errorKey]
                                            
                                            if (isMissing) {
                                                // Render empty space to keep grid uniform
                                                return <div key={skillName} className="w-9 h-9 sm:w-10 sm:h-10 opacity-0" />
                                            }

                                            return (
                                                <div key={skillName} className={cn(
                                                "relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden border-2 transition-all duration-300",
                                                order 
                                                    ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                                                    : "border-white/10 opacity-30 hover:opacity-50"
                                            )}>
                                                <Image
                                                    src={path}
                                                    alt={skillName}
                                                    fill
                                                    className="object-contain p-0.5"
                                                    onError={() => handleSkillError(errorKey)}
                                                    sizes="(max-width: 640px) 36px, 40px"
                                                />
                                                {order && (
                                                    <div className="absolute top-0 right-0 p-0.5">
                                                        <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-red-600 text-white text-[7px] sm:text-[8px] font-black rounded flex items-center justify-center shadow-lg transform translate-x-0.5 -translate-y-0.5">
                                                            {order}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                    {/* Placeholder if no skills visible to keep grid aligned */}
                                    {rowSkills.length === 0 && <div className="w-9 h-9 sm:w-10 sm:h-10" />}
                                </div>
                            )
                        })}
                        </div>
                    )
                })()}
            </div>
        </div>
    )
}
