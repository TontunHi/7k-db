import SafeImage from './SafeImage'
import { cn } from '@/lib/utils'

export default function PetDisplay({ petFile, customClasses = {}, hideLabel = false }) {
    return (
        <div className={cn("flex flex-col items-center shrink-0", customClasses.container)}>
            <div className={cn(
                "relative w-16 h-16 flex items-center justify-center rounded-xl border flex-shrink-0 transition-all duration-300 overflow-hidden group/pet shadow-2xl",
                petFile 
                    ? "bg-gradient-to-br from-gray-900 via-black to-black border-indigo-500/30 shadow-indigo-500/10 group-hover/pet:border-indigo-400 group-hover/pet:shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
                    : "bg-black/40 border-gray-800/60 border-dashed",
                customClasses.wrapper
            )}>
                {petFile ? (
                    <SafeImage 
                        src={petFile} 
                        alt="Pet" 
                        fill 
                        sizes="64px"
                        className={cn("object-contain p-2 transition-transform duration-500 group-hover/pet:scale-110", customClasses.image)} 
                    />
                ) : (
                    <span className={cn("text-gray-800 text-[10px] font-black uppercase tracking-widest", customClasses.emptyText)}>None</span>
                )}
                
                {!hideLabel && (
                    <div className={cn("absolute bottom-0 left-0 right-0 bg-indigo-600/20 backdrop-blur-md text-[8px] font-black text-indigo-400 py-0.5 text-center uppercase tracking-[0.2em] border-t border-indigo-500/30", customClasses.label)}>
                        PET
                    </div>
                )}
            </div>
        </div>
    )
}
