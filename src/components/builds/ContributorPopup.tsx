"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function ContributorPopup() {
    const [isVisible, setIsVisible] = useState(false)
    const [isClosing, setIsClosing] = useState(false)
    const [dontShowToday, setDontShowToday] = useState(false)

    useEffect(() => {
        const dismissedDate = localStorage.getItem("contributorPopupDismissedDate")
        const todayStr = new Date().toDateString()
        const hasDismissedSession = sessionStorage.getItem("contributorPopupDismissed")
        
        if (dismissedDate !== todayStr && !hasDismissedSession) {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        setIsClosing(true)
        if (dontShowToday) {
            const todayStr = new Date().toDateString()
            localStorage.setItem("contributorPopupDismissedDate", todayStr)
        }
        sessionStorage.setItem("contributorPopupDismissed", "true")
        
        setTimeout(() => {
            setIsVisible(false)
        }, 300)
    }

    if (!isVisible) return null

    return (
        <div className={`fixed bottom-6 left-6 z-[100] w-[310px] bg-slate-950/90 border border-primary/20 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 ${
            isClosing 
                ? "opacity-0 scale-95 translate-y-4" 
                : "opacity-100 scale-100 translate-y-0"
        }`}>
            {/* Glow backing */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent blur-2xl rounded-2xl pointer-events-none" />
            
            <button 
                onClick={handleClose}
                className="absolute top-3.5 right-3.5 p-1 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all"
            >
                <X size={14} />
            </button>

            <div className="flex gap-3 items-start pr-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-foreground uppercase italic tracking-wider">
                        We Need <span className="text-primary">Experts!</span>
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-medium mt-1 leading-relaxed">
                        Are you a Seven Knights expert? We're looking for contributors to help manage and update Hero Builds and Tierlists.
                    </p>
                </div>
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-border/40 items-center justify-between">
                <div className="flex items-center gap-1.5 select-none">
                    <input 
                        type="checkbox" 
                        id="dontShowToday" 
                        checked={dontShowToday}
                        onChange={(e) => setDontShowToday(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-gray-700 bg-black text-primary focus:ring-primary focus:ring-offset-black cursor-pointer"
                    />
                    <label htmlFor="dontShowToday" className="text-[10px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors font-medium">
                        Don't show again today
                    </label>
                </div>
                
                <Link 
                    href="/contact"
                    onClick={handleClose}
                    className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#FFD700] hover:bg-[#FFD700]/95 hover:scale-[1.02] border-none rounded-lg text-[10px] font-black text-black transition-all uppercase tracking-wider"
                >
                    Contact Us
                    <ExternalLink size={10} />
                </Link>
            </div>
        </div>
    )
}
