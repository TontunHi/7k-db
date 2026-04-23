import SafeImage from './SafeImage'
import { cn } from '@/lib/utils'

export default function PetDisplay({ petFile, customClasses = {}, hideLabel = false }) {
    return (
        <div className={cn("flex flex-col items-center shrink-0", customClasses.container)}>
            <div className={cn(
                "relative w-16 h-16 flex items-center justify-center rounded-xl border flex-shrink-0 transition-all duration-300 overflow-hidden group/pet shadow-2xl",
                petFile 
                    ? "bg-card border-border shadow-primary/5 group-hover/pet:border-primary group-hover/pet:shadow-[0_0_20px_var(--primary-opacity)]" 
                    : "bg-muted/40 border-border border-dashed",
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
                    <span className={cn("text-muted-foreground/30 text-[10px] font-black uppercase tracking-widest", customClasses.emptyText)}>None</span>
                )}
                
                {!hideLabel && (
                    <div className={cn("absolute bottom-0 left-0 right-0 bg-primary/20 backdrop-blur-md text-[8px] font-black text-primary py-0.5 text-center uppercase tracking-[0.2em] border-t border-primary/30", customClasses.label)}>
                        PET
                    </div>
                )}
            </div>
        </div>
    )
}
