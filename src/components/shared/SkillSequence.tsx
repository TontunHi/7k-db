import SafeImage from './SafeImage'
import { Zap, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSkillImagePath } from '@/lib/formation-utils'

export default function SkillSequence({ 
    skillRotation = [], 
    heroes = [], 
    customClasses = {} as any,
    ...props
}: any) {
    if (!skillRotation?.length) return null;
    const { heroImageMap, accentColor = "var(--primary)" } = props;

    return (
        <div className={cn("space-y-2", customClasses.container)}>
            <div className="flex items-center gap-2 px-1">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Skill Rotation</span>
            </div>
            
            <div className={cn("flex flex-wrap items-center gap-2 w-full bg-muted rounded-2xl border border-border p-4 shadow-inner relative overflow-hidden", customClasses.wrapper)}>
                {/* Subtle background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-opacity rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                
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
                            <div className="flex flex-col items-center group/skill p-0.5 bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300 relative shadow-lg">
                                <div className="absolute -top-1.5 -left-1.5 min-w-[18px] h-[18px] px-1 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[9px] font-black border-2 border-background z-10 shadow-sm">
                                    {displayLabel}
                                </div>
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border bg-muted">
                                    {hFile && sPath ? (
                                        <SafeImage src={sPath} alt="" fill sizes="40px" className="object-cover transition-transform duration-500 group-hover/skill:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] font-bold">-</div>
                                    )}
                                </div>
                            </div>
                            {!isLast && (
                                <div className="flex items-center justify-center w-4">
                                    <ArrowRight size={10} className="text-muted-foreground opacity-60" />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
