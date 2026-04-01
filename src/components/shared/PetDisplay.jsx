import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function PetDisplay({ petFile, customClasses = {}, hideLabel = false }) {
    return (
        <div className={cn("flex flex-col items-center shrink-0", customClasses.container)}>
            <div className={cn(
                "relative w-16 h-16 flex items-center justify-center rounded-lg border border-indigo-900/50 bg-gradient-to-b from-gray-900 to-black shadow-lg overflow-hidden group/pet",
                customClasses.wrapper
            )}>
                {petFile ? (
                    <Image 
                        src={petFile} 
                        alt="Pet" 
                        fill 
                        sizes="64px"
                        className={cn("object-contain p-2 hover:scale-110 transition-transform duration-500", customClasses.image)} 
                    />
                ) : (
                    <span className={cn("text-gray-700 text-[10px] font-bold", customClasses.emptyText)}>-</span>
                )}
                
                {!hideLabel && (
                    <div className={cn("absolute bottom-0 left-0 right-0 bg-black/60 text-[8px] font-black text-indigo-400 py-0.5 text-center uppercase tracking-tighter", customClasses.label)}>
                        PET
                    </div>
                )}
            </div>
        </div>
    )
}
