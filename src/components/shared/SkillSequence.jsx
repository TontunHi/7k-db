import SafeImage from './SafeImage'
import { Zap, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSkillImagePath } from '@/lib/formation-utils'

export default function SkillSequence({ skillRotation = [], heroes = [], customClasses = {} }) {
    if (!skillRotation?.length) return null;

    return (
        <div className={cn("space-y-2", customClasses.container)}>
            <div className="flex items-center gap-2 px-1">
                <Zap className="w-3 h-3 text-indigo-400" />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest text-[#FFD700]">Skill Rotation</span>
            </div>
            
            <div className={cn("flex flex-wrap items-center gap-2 w-full bg-black/40 rounded-2xl border border-white/5 p-4 shadow-inner relative overflow-hidden", customClasses.wrapper)}>
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                
                {skillRotation.map((slot, sIdx) => {
                    const parts = (slot.skill || '').split('-')
                    const hIdx = parseInt(parts[0])
                    const sNum = parts[1]
                    const hFile = heroes?.[hIdx]
                    const sPath = slot.skill ? getSkillImagePath(hFile, sNum) : null
                    const isLast = sIdx === skillRotation.length - 1;
                    const displayLabel = slot.label || String(sIdx + 1);

                    return (
                        <div key={sIdx} className="flex items-center gap-1.5">
                            <div className="flex flex-col items-center group/skill p-0.5 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 hover:border-indigo-500/50 transition-all duration-300 relative shadow-lg">
                                <div className="absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] px-1 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-[9px] font-black border-2 border-black z-10 shadow-[0_0_10px_rgba(99,102,241,0.4)]">
                                    {displayLabel}
                                </div>
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/5 bg-gray-950">
                                    {hFile && sPath ? (
                                        <SafeImage src={sPath} alt="" fill sizes="40px" className="object-cover transition-transform duration-500 group-hover/skill:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-800 text-[10px] font-bold">-</div>
                                    )}
                                </div>
                            </div>
                            {!isLast && (
                                <div className="flex items-center justify-center w-4">
                                    <ArrowRight size={10} className="text-gray-700 opacity-60" />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
