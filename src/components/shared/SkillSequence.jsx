import Image from 'next/image'
import { Zap, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSkillImagePath } from '@/lib/formation-utils'

export default function SkillSequence({ skillRotation = [], heroes = [], customClasses = {} }) {
    if (!skillRotation?.length) return null;

    return (
        <div className={cn("space-y-2", customClasses.container)}>
            <div className="flex items-center gap-2 px-1">
                <Zap className="w-3 h-3 text-indigo-400" />
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Skill Sequence</span>
            </div>
            
            <div className={cn("flex flex-wrap items-center gap-1.5 w-full bg-black/40 rounded-xl border border-gray-800/30 p-3", customClasses.wrapper)}>
                {skillRotation.map((slot, sIdx) => {
                    const [hIdx, sNum] = (slot.skill || '').split('-').map(Number)
                    const hFile = heroes?.[hIdx]
                    const sPath = slot.skill ? getSkillImagePath(hFile, sNum) : null
                    const isLast = sIdx === skillRotation.length - 1;
                    const displayLabel = slot.label || String(sIdx + 1);

                    return (
                        <div key={sIdx} className="flex items-center gap-1">
                            <div className="flex flex-col items-center group/skill p-0.5 bg-gray-900/90 rounded-lg border border-gray-800 hover:bg-gray-800 transition-all duration-300 relative">
                                <div className="absolute -top-1.5 -left-1.5 min-w-[16px] h-4 px-1 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center text-[8px] font-black border border-black z-10 shadow-lg">
                                    {displayLabel}
                                </div>
                                <div className="relative w-9 h-9 rounded-md overflow-hidden border border-gray-800 bg-gray-950">
                                    {hFile && sPath ? (
                                        <Image src={sPath} alt="" fill sizes="36px" className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-800 text-[10px] font-bold">-</div>
                                    )}
                                </div>
                            </div>
                            {!isLast && <ArrowRight size={8} className="text-gray-900 opacity-50" />}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
