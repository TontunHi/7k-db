'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Premium Skill Rotation Grid for Raid
 * Handles missing skills beautifully and shows sequence numbers.
 */
export default function RaidSkillRotation({ skillRotation = [], heroes = [] }) {
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
        <div className="mt-8 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-red-500/5 rounded-[2.5rem] blur-2xl opacity-50" />
            
            <div className="relative bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 backdrop-blur-md overflow-hidden">
                <div className="flex items-center gap-2 mb-4 px-1">
                    <div className="p-1 rounded-lg bg-red-500/10 border border-red-500/20">
                        <Zap className="w-3 h-3 text-red-400" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500/80">Skill Tactics Grid</span>
                </div>

                <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                    {[0, 1, 2, 3, 4].map((heroIdx) => {
                        const heroFile = heroes?.[heroIdx]
                        
                        return (
                            <div key={heroIdx} className="space-y-3 flex flex-col items-center">
                                {/* Skill 2 Slot */}
                                {(() => {
                                    const skillDataKey = `${heroIdx}-2`
                                    const errorKey = `h${heroIdx}-s2`
                                    const path = getSkillPath(heroFile, 2)
                                    const orderIndex = skillRotation.indexOf(skillDataKey)
                                    const order = orderIndex >= 0 ? orderIndex + 1 : null
                                    
                                    const isMissing = !heroFile || skillErrors[errorKey]
                                    
                                    if (isMissing) return <div className="w-11 h-11 sm:w-12 sm:h-12" />

                                    return (
                                        <div className={cn(
                                            "relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 transition-all duration-300",
                                            order 
                                                ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                                                : "border-white/10 opacity-30 hover:opacity-50"
                                        )}>
                                            <Image
                                                src={path}
                                                alt="S2"
                                                fill
                                                className="object-contain p-1"
                                                onError={() => handleSkillError(errorKey)}
                                                sizes="(max-width: 640px) 44px, 48px"
                                            />
                                            {order && (
                                                <div className="absolute top-0 right-0 p-0.5">
                                                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-600 text-white text-[8px] sm:text-[9px] font-black rounded-md flex items-center justify-center shadow-lg transform translate-x-1 -translate-y-1">
                                                        {order}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })()}

                                {/* Skill 3 Slot */}
                                {(() => {
                                    const skillDataKey = `${heroIdx}-3`
                                    const errorKey = `h${heroIdx}-s3`
                                    const path = getSkillPath(heroFile, 3)
                                    const orderIndex = skillRotation.indexOf(skillDataKey)
                                    const order = orderIndex >= 0 ? orderIndex + 1 : null
                                    
                                    const isMissing = !heroFile || skillErrors[errorKey]
                                    
                                    if (isMissing) return <div className="w-11 h-11 sm:w-12 sm:h-12" />

                                    return (
                                        <div className={cn(
                                            "relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 transition-all duration-300",
                                            order 
                                                ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                                                : "border-white/10 opacity-30 hover:opacity-50"
                                        )}>
                                            <Image
                                                src={path}
                                                alt="S3"
                                                fill
                                                className="object-contain p-1"
                                                onError={() => handleSkillError(errorKey)}
                                                sizes="(max-width: 640px) 44px, 48px"
                                            />
                                            {order && (
                                                <div className="absolute top-0 right-0 p-0.5">
                                                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-red-600 text-white text-[8px] sm:text-[9px] font-black rounded-md flex items-center justify-center shadow-lg transform translate-x-1 -translate-y-1">
                                                        {order}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })()}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
