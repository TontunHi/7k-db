import SafeImage from './SafeImage'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSkillImagePath } from '@/lib/formation-utils'

export default function SkillSequence({ 
    skillRotation = [], 
    heroes = [], 
    customClasses = {} as any,
    ...props
}: any) {
    if (!skillRotation?.length) return null;
    const { accentColor = "var(--primary)" } = props;

    return (
        <div className={cn("space-y-3", customClasses.container)}>
            <div className="flex items-center gap-2 px-1">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Tactical Skill Rotation</span>
            </div>
            
            <div className={cn(
                "flex flex-wrap items-center gap-3 w-full bg-black/40 backdrop-blur-md rounded-2xl border border-[#ffd700]/20 p-4 shadow-lg hover:border-[#ffd700]/30 transition-all duration-300 relative overflow-visible", 
                customClasses.wrapper
            )}>
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                
                {skillRotation.map((slot, sIdx) => {
                    const parts = (slot.skill || '').split('-')
                    const hIdx = parseInt(parts[0])
                    const sNum = parts[1] || ''
                    const hFile = heroes?.[hIdx]
                    const sPath = slot.skill ? getSkillImagePath(hFile, sNum) : null
                    const isLast = sIdx === skillRotation.length - 1
                    const displayLabel = slot.label || String(sIdx + 1)

                    return (
                        <div key={sIdx} className="flex items-center gap-2">
                            <div className="flex flex-col items-center group/skill p-0.5 bg-background rounded-xl border border-border hover:border-primary/50 transition-all duration-300 relative shadow-lg hover:scale-105">
                                {/* Order Number Badge */}
                                <div className="absolute -top-2 -left-2 min-w-[20px] h-[20px] px-1 text-black rounded-full flex items-center justify-center text-[9px] font-black border-2 border-card z-20 shadow-sm bg-primary">
                                    {displayLabel}
                                </div>

                                {/* Main Skill Icon Container */}
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted">
                                    {hFile && sPath ? (
                                        <SafeImage src={sPath} alt="" fill sizes="48px" className="object-cover transition-transform duration-500 group-hover/skill:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] font-bold">-</div>
                                    )}
                                </div>
                            </div>

                            {!isLast && (
                                <div className="flex items-center justify-center w-5 opacity-40 hover:opacity-75 transition-opacity">
                                    <ArrowRight size={12} className="text-muted-foreground stroke-[2.5]" />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
