import SafeImage from './SafeImage'
import { cn } from '@/lib/utils'
import { getSlotType, getStaggerClass } from '@/lib/formation-utils'
import { resolveHeroImage } from '@/lib/hero-utils'

export default function FormationGrid({ 
    formation, 
    heroes = [], 
    staggerAmount = 'translate-y-6', // Allow customizing the translate amount
    customClasses = {}, // Override default class sets
    heroImageMap = {}, // Mapping slug -> actual_filename
    hideEmpty = false // Option to skip rendering of empty slots
}) {
    const allIndices = [0, 1, 2, 3, 4]
    const indices = hideEmpty ? allIndices.filter(i => heroes?.[i]) : allIndices

    if (indices.length === 0 && hideEmpty) return null

    return (
        <div className={cn(
            "flex-1 grid gap-1.5", 
            hideEmpty ? "grid-cols-3" : "grid-cols-5",
            hideEmpty ? "max-w-[180px]" : "max-w-[280px]",
            customClasses.container
        )}>
            {indices.map(i => {
                const heroFile = heroes?.[i]
                const type = getSlotType(formation, i)
                const isFront = type === 'front'
                
                // Get base stagger, then replace the default value if staggerAmount is provided
                let stagger = getStaggerClass(formation, i)
                if (stagger && staggerAmount !== 'translate-y-6') {
                    stagger = staggerAmount
                }

                // Default styles
                const cardClasses = typeof customClasses.card === 'function' 
                    ? customClasses.card({ isFront, heroFile, type })
                    : cn(
                        "relative aspect-[3/4] rounded-lg overflow-hidden border flex flex-col transition-all duration-500 shadow-xl group/hero",
                        stagger,
                        heroFile 
                            ? (isFront 
                                ? "border-sky-500/40 bg-sky-950/20 shadow-[0_0_15px_rgba(14,165,233,0.1)] hover:border-sky-400 hover:shadow-[0_0_25px_rgba(14,165,233,0.25)]" 
                                : "border-rose-600/40 bg-rose-950/20 shadow-[0_0_15px_rgba(225,29,72,0.1)] hover:border-rose-500 hover:shadow-[0_0_25px_rgba(225,29,72,0.25)]")
                            : "border-gray-800/40 border-dashed bg-black/40",
                        customClasses.cardString
                    )

                return (
                    <div key={i} className={cardClasses}>
                        {heroFile ? (
                            <>
                                <div 
                                    className="relative flex-1 w-full h-full block group/link"
                                >
                                    <SafeImage 
                                        src={`/heroes/${resolveHeroImage(heroFile, heroImageMap) || heroFile + '.webp'}`} 
                                        alt="Hero" 
                                        fill 
                                        sizes="(max-width: 768px) 20vw, 10vw"
                                        className={cn("object-cover transition-all duration-500 group-hover/link:scale-110", customClasses.image)} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                                    
                                    {/* Inset border glow */}
                                    <div className={cn(
                                        "absolute inset-0 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-500",
                                        isFront ? "shadow-[inset_0_0_20px_rgba(14,165,233,0.2)]" : "shadow-[inset_0_0_20px_rgba(225,29,72,0.2)]"
                                    )} />
                                </div>
                                
                                {customClasses.renderOverlay && customClasses.renderOverlay({ isFront, type, heroFile })}
                            </>
                        ) : (
                            customClasses.emptyRender 
                                ? customClasses.emptyRender({ isFront }) 
                                : (
                                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                        <div className={cn("w-1.5 h-1.5 rounded-full", isFront ? "bg-sky-500" : "bg-gray-600")} />
                                    </div>
                                )
                        )}
                    </div>
                )
            })}
        </div>
    )
}
