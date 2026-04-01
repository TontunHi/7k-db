import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { getSlotType, getStaggerClass } from '@/lib/formation-utils'

export default function FormationGrid({ 
    formation, 
    heroes = [], 
    staggerAmount = 'translate-y-6', // Allow customizing the translate amount
    customClasses = {} // Override default class sets
}) {
    return (
        <div className={cn("flex-1 grid grid-cols-5 gap-1.5 max-w-[280px]", customClasses.container)}>
            {[0, 1, 2, 3, 4].map(i => {
                const heroFile = heroes?.[i]
                const type = getSlotType(formation, i)
                const isFront = type === 'front'
                
                // Get base stagger, then replace the default value if staggerAmount is provided
                let stagger = getStaggerClass(formation, i)
                if (stagger && staggerAmount !== 'translate-y-6') {
                    stagger = staggerAmount;
                }

                // Default styles based on arena/page.js
                // Allow `customClasses.card` to be a function taking `({isFront, heroFile, type})` or a static string
                const cardClasses = typeof customClasses.card === 'function' 
                    ? customClasses.card({ isFront, heroFile, type })
                    : cn(
                        "relative aspect-[3/4] rounded-lg overflow-hidden border-2 flex flex-col transition-all duration-500 shadow-lg group/hero",
                        stagger,
                        heroFile 
                            ? (isFront ? "border-sky-500/70 bg-sky-950/20" : "border-rose-600/70 bg-rose-950/20")
                            : "border-gray-800/40 border-dashed bg-black/20",
                        customClasses.cardString
                    );

                return (
                    <div key={i} className={cardClasses}>
                        {heroFile ? (
                            <>
                                <Link 
                                    href={`/hero/${heroFile.replace(/\.[^/.]+$/, "")}`}
                                    className="relative flex-1 w-full h-full block group/link"
                                >
                                    <Image 
                                        src={`/heroes/${heroFile}`} 
                                        alt="Hero" 
                                        fill 
                                        sizes="(max-width: 768px) 20vw, 10vw"
                                        className={cn("object-cover transition-all duration-500 group-hover/link:scale-110", customClasses.image)} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover/link:opacity-40 transition-opacity" />
                                    
                                    {/* Tooltip or hover effect */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/link:opacity-100 transition-opacity">
                                        <div className="bg-black/80 text-[10px] text-white px-2 py-1 rounded-full border border-white/20 backdrop-blur-sm transform translate-y-2 group-hover/link:translate-y-0 transition-transform">
                                            VIEW PROFILE
                                        </div>
                                    </div>
                                </Link>
                                
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
