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
            }, 1000)
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop Blur */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
            
            {/* Modal Box */}
            <div className={`relative w-full max-w-md overflow-hidden bg-card border border-primary/20 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 ${
                isClosing 
                    ? "opacity-0 scale-95 translate-y-4" 
                    : "opacity-100 scale-100 translate-y-0"
            }`}>
                {/* Glow backing */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent blur-3xl rounded-[2.5rem] pointer-events-none" />
                {/* Accent lighting top edge */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 pointer-events-none" />
                
                <button 
                    onClick={handleClose}
                    className="absolute top-5 right-5 p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all"
                >
                    <X size={18} />
                </button>

                <div className="flex flex-col items-center text-center gap-5 mt-2">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 flex items-center justify-center shadow-inner">
                        <Lightbulb className="w-7 h-7 text-primary" />
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className="text-lg font-black text-foreground uppercase italic tracking-wider">
                            We Need <span className="text-primary">Experts!</span>
                        </h3>
                        
                        <div className="text-xs text-muted-foreground font-medium leading-relaxed space-y-3 px-2">
                            <p className="text-sm text-foreground/90 font-bold">
                                Are you a Seven Knights expert? We&apos;re looking for contributors to help manage and update Hero Builds and Tierlists.
                            </p>
                            <p className="text-muted-foreground/80 border-t border-border/40 pt-3">
                                เรากำลังตามหาผู้เชี่ยวชาญ 7K! หากคุณมีความรู้และอยากช่วยอัปเดตข้อมูลบนเว็บนี้ ติดต่อเรามาได้เลยครับ
                            </p>
                        </div>
                        
                        <Link 
                            href="/contact"
                            onClick={handleClose}
                            className="inline-flex items-center justify-center gap-2 w-full mt-4 py-3 px-5 bg-[#FFD700] hover:bg-[#FFD700]/95 hover:scale-[1.02] active:scale-[0.98] border-none rounded-2xl text-xs font-black text-black transition-all uppercase tracking-widest shadow-lg shadow-primary/25 group"
                        >
                            Contact Us
                            <ExternalLink size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>

                        {/* Checkbox "Do not show again today" */}
                        <div className="flex items-center justify-center gap-2.5 pt-3 border-t border-border/40 select-none">
                            <input 
                                type="checkbox" 
                                id="dontShowToday" 
                                checked={dontShowToday}
                                onChange={(e) => setDontShowToday(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-700 bg-black text-primary focus:ring-primary focus:ring-offset-black cursor-pointer"
                            />
                            <label htmlFor="dontShowToday" className="text-[11px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors font-semibold">
                                ไม่แสดงอีกแล้วในวันนี้ (Do not show again today)
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
