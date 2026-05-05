"use client"

import { clsx } from "clsx"

/**
 * Marker - A simple geometric indicator for categorization
 */
export function Marker({ color = "bg-primary", className = "" }) {
    return (
        <div className={clsx("w-1 h-4 rounded-full", color, className)} />
    )
}

/**
 * ActionLabel - Bold, uppercase text for commands (replacing icons)
 */
export function ActionLabel({ label, color = "text-foreground", className = "", size = "text-[10px]" }) {
    return (
        <span className={clsx(
            "font-black uppercase tracking-widest",
            size,
            color,
            className
        )}>
            {label}
        </span>
    )
}

/**
 * SectionHeader - Editorial style header with a marker and numeric prefix
 */
export function SectionHeader({ title, prefix = "", markerColor = "bg-primary" }) {
    return (
        <div className="flex items-center gap-3">
            <Marker color={markerColor} />
            <div className="flex items-baseline gap-2">
                {prefix && <span className="text-[10px] font-bold text-muted-foreground opacity-50">{prefix}</span>}
                <h3 className="text-sm font-black text-foreground uppercase tracking-wider">{title}</h3>
            </div>
        </div>
    )
}

/**
 * SystemBadge - Small high-contrast indicator for states
 */
export function SystemBadge({ children, variant = "default" }) {
    const variants = {
        default: "bg-muted text-muted-foreground",
        active: "bg-primary/10 text-primary border border-primary/20",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20",
        warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
        success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    }
    
    return (
        <span className={clsx(
            "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter",
            variants[variant]
        )}>
            {children}
        </span>
    )
}
