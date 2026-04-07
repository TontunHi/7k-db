'use client'

import { useState } from 'react'
import { Copy, Check, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function GuildCta() {
    const [copied, setCopied] = useState(false)
    const guildName = "lTUSl"

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(guildName)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    return (
        <>
            {/* Bottom-Left Member Count */}
            <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 px-3 py-1 rounded-lg bg-black/60 border border-white/10 backdrop-blur-md shadow-lg pointer-events-none group-hover:border-[#FFD700]/30 transition-colors z-20">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <span className="text-[10px] md:text-xs font-black text-white/90 tracking-widest uppercase">
                        Members : <span className="text-[#FFD700]">5 / 30</span>
                    </span>
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col items-center justify-end text-center bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none group-hover:from-black/90 transition-all duration-300">
            {/* Minimal Badge */}
            <div className="mb-2 px-2 py-0.5 rounded-md bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center gap-1.5 shadow-sm">
                <Shield className="w-2.5 h-2.5 text-[#FFD700]" />
                <span className="text-[9px] font-black uppercase text-[#FFD700] tracking-[0.15em]">Guild Recruitment</span>
            </div>

            {/* Compact Action Button */}
            <button 
                onClick={handleCopy}
                className={cn(
                    "pointer-events-auto flex items-center gap-2 px-6 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest transition-all transform active:scale-95 shadow-lg relative overflow-hidden",
                    copied 
                        ? "bg-green-500 text-white shadow-green-500/20" 
                        : "bg-white text-black hover:bg-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                )}
            >
                {copied ? (
                    <>
                        COPIED! <Check className="w-3 h-3" />
                    </>
                ) : (
                    <>
                        JOIN US NOW <Copy className="w-3 h-3 group-hover:rotate-12 transition-transform" />
                    </>
                )}
                
                {/* Subtle shine effect on copy */}
                {copied && (
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                )}
            </button>
            
            {/* Hint text if needed */}
            <p className="mt-3 text-[9px] text-gray-500 font-light italic tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                Guild Name: {guildName}
            </p>
        </div>
        </>
    )
}
