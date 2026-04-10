"use client"

import Link from 'next/link'
import { 
    Sword, Map, Skull, Landmark, Trophy, Crown, Compass, Swords, Wand2, Sparkles, Zap, ArrowRight 
} from 'lucide-react'
import { clsx } from 'clsx'

const ICON_MAP = {
    Sword, Map, Skull, Landmark, Trophy, Crown, Compass, Swords, Wand2, Sparkles, Zap
}

export default function FeatureCard({ title, iconName, href, color, glow }) {
    const Icon = ICON_MAP[iconName] || Sword

    return (
        <Link
            href={href}
            className={clsx(
                "group relative p-6 bg-[#0a0a0a] border border-gray-800 rounded-2xl overflow-hidden transition-all duration-500",
                "hover:border-white/20 hover:-translate-y-1.5 hover:bg-gradient-to-br hover:from-[#111] hover:to-black",
                "shadow-2xl",
                glow
            )}
        >
            {/* Top Border Glow */}
            <div className={clsx(
                "absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r opacity-30 group-hover:opacity-100 transition-opacity duration-500",
                color
            )} />

            {/* Background Radial Glow */}
            <div className={clsx(
                "absolute -inset-px bg-gradient-to-br opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700",
                color
            )} />

            <div className="relative z-10 flex flex-col items-center text-center space-y-5">
                {/* Icon Container */}
                <div className={clsx(
                    "p-4 rounded-2xl bg-black border border-gray-800 transition-all duration-500",
                    "group-hover:scale-110 group-hover:border-white/10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]",
                    "relative overflow-hidden"
                )}>
                    {/* Subtle icon background glow */}
                    <div className={clsx(
                        "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-br",
                        color
                    )} />
                    <Icon className="w-8 h-8 text-white relative z-10" />
                </div>

                <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-black italic uppercase text-white tracking-wider group-hover:text-[#FFD700] transition-colors duration-300">
                        {title}
                    </h3>
                </div>

                {/* Arrow indicator */}
                <div className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 absolute right-4 top-4">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Animated Light Sweep Effect */}
            <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1500ms] ease-in-out pointer-events-none bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
        </Link>
    )
}
