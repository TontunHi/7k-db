"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ThemeToggle({ className }) {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), [])
    if (!mounted) return <div className="w-[72px] h-8 rounded-full bg-white/5 animate-pulse" />

    const isDark = resolvedTheme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
            className={cn(
                "relative flex items-center gap-1 rounded-full border transition-all duration-300 overflow-hidden group",
                "px-1 py-1 h-8 w-[72px]",
                isDark
                    ? "bg-[#111] border-gray-700 hover:border-[#FFD700]/50"
                    : "bg-white border-gray-200 hover:border-amber-400/70",
                className
            )}
        >
            {/* Track background glow */}
            <span className={cn(
                "absolute inset-0 transition-opacity duration-500 rounded-full",
                isDark
                    ? "opacity-0 bg-gradient-to-r from-indigo-900/30 to-purple-900/30"
                    : "opacity-100 bg-gradient-to-r from-amber-50 to-yellow-50"
            )} />

            {/* Sliding knob */}
            <span className={cn(
                "relative z-10 flex items-center justify-center w-6 h-6 rounded-full shadow-md transition-all duration-300",
                isDark
                    ? "translate-x-0 bg-[#FFD700] text-black shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                    : "translate-x-[36px] bg-amber-400 text-white shadow-[0_0_8px_rgba(251,191,36,0.5)]"
            )}>
                {isDark
                    ? <Moon className="w-3.5 h-3.5" />
                    : <Sun className="w-3.5 h-3.5" />
                }
            </span>

            {/* Opposite icon (faint) */}
            <span className={cn(
                "absolute z-10 flex items-center justify-center w-6 h-6 transition-all duration-300",
                isDark ? "right-1 text-gray-600" : "left-1 text-gray-300"
            )}>
                {isDark
                    ? <Sun className="w-3.5 h-3.5" />
                    : <Moon className="w-3.5 h-3.5" />
                }
            </span>
        </button>
    )
}
