'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

export default function FormationSelector({ formations, value, onChange }) {
    // formations: [{ name: "1 - 4", value: "1-4", image: "..." }]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {formations.map((fmt) => (
                <button
                    key={fmt.value}
                    type="button"
                    onClick={() => onChange(fmt.value)}
                    className={cn(
                        "relative flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 group",
                        value === fmt.value
                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                            : "border-border bg-card hover:border-primary/50"
                    )}
                >
                    <div className="relative w-12 h-12">
                        {/* Fallback to simple text if image fails or for clarity, but user provided images */}
                        <Image
                            src={fmt.image}
                            alt={fmt.name}
                            fill
                            className="object-contain drop-shadow-md"
                            sizes="48px"
                        />
                    </div>
                    <span className={cn(
                        "font-bold text-sm",
                        value === fmt.value ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                        {fmt.name}
                    </span>

                    {value === fmt.value && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full animate-pulse" />
                    )}
                </button>
            ))}
        </div>
    )
}
