"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Cloud, Star, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * ThemeToggle - Premium dynamic switch with morphing icons and environment effects
 */
export default function ThemeToggle({ className }) {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const handle = requestAnimationFrame(() => {
            setMounted(true)
        })
        return () => cancelAnimationFrame(handle)
    }, [])

    if (!mounted) return (
        <div className="w-[72px] h-9 rounded-full bg-muted/20 border border-border/50 animate-pulse shrink-0" />
    )

    const isDark = resolvedTheme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className={cn(
                "relative flex items-center p-1 h-9 w-[72px] rounded-full transition-all duration-700 overflow-hidden group border shrink-0",
                isDark 
                    ? "bg-[#0f172a] border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" 
                    : "bg-[#f8fafc] border-slate-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]",
                className
            )}
        >
            {/* --- Track Environment --- */}
            
            {/* Stars (Dark Mode Only) */}
            <div className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                isDark ? "opacity-100" : "opacity-0"
            )}>
                <Star className="absolute top-1 left-2 w-1 h-1 text-white animate-pulse" />
                <Star className="absolute bottom-2 left-5 w-0.5 h-0.5 text-white animate-pulse delay-500" />
                <Star className="absolute top-3 left-4 w-0.5 h-0.5 text-white animate-pulse delay-1000" />
            </div>

            {/* Clouds (Light Mode Only) */}
            <div className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                isDark ? "opacity-0" : "opacity-100"
            )}>
                <Cloud className="absolute -bottom-1 right-2 w-4 h-4 text-slate-200/50" />
                <Cloud className="absolute top-0 right-5 w-3 h-3 text-slate-200/30" />
            </div>

            {/* --- Track Icons --- */}
            <div className="relative flex items-center justify-between w-full px-1 z-0">
                {/* Light Icon Placeholder */}
                <div className="w-6 h-6 flex items-center justify-center">
                    <Sun className={cn(
                        "w-3.5 h-3.5 transition-all duration-500",
                        isDark ? "text-slate-700 scale-50 opacity-0 -rotate-90" : "text-amber-500 scale-100 opacity-40 rotate-0"
                    )} />
                </div>

                {/* Dark Icon Placeholder */}
                <div className="w-6 h-6 flex items-center justify-center">
                    <Moon className={cn(
                        "w-3.5 h-3.5 transition-all duration-500",
                        isDark ? "text-primary scale-100 opacity-40 rotate-0" : "text-slate-300 scale-50 opacity-0 rotate-90"
                    )} />
                </div>
            </div>

            {/* --- The Floating Knob --- */}
            <div className={cn(
                "absolute top-1 bottom-1 w-7 h-7 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-10 flex items-center justify-center",
                isDark
                    ? "translate-x-[35px] bg-slate-900 shadow-[0_0_15px_rgba(255,215,0,0.3)] border border-primary/20"
                    : "translate-x-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] border border-amber-100"
            )}>
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Sun Icon (Light Mode Active) */}
                    <Sun className={cn(
                        "absolute w-4 h-4 text-amber-500 transition-all duration-500 fill-amber-500",
                        isDark ? "opacity-0 scale-0 rotate-180" : "opacity-100 scale-100 rotate-0"
                    )} />
                    
                    {/* Moon Icon (Dark Mode Active) */}
                    <Moon className={cn(
                        "absolute w-4 h-4 text-primary transition-all duration-500 fill-primary",
                        isDark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-180"
                    )} />

                    {/* Sparkle Decoration (Dark Mode only) */}
                    <Sparkles className={cn(
                        "absolute -top-1 -right-1 w-2.5 h-2.5 text-white transition-opacity duration-700",
                        isDark ? "opacity-100 animate-pulse" : "opacity-0"
                    )} />
                </div>
            </div>

            {/* --- Interaction Overlay --- */}
            <div className={cn(
                "absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-full pointer-events-none",
                isDark ? "shadow-[0_0_20px_rgba(255,215,0,0.1)]" : "shadow-[0_0_20px_rgba(245,158,11,0.1)]"
            )} />
        </button>
    )
}


