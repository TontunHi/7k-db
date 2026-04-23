"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function ContributorPopup() {
    const [isVisible, setIsVisible] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    useEffect(() => {
        // Check session storage to see if user already dismissed it
        const hasDismissed = sessionStorage.getItem("contributorPopupDismissed")
        
        if (!hasDismissed) {
            // Slight delay so it doesn't pop up instantly on page load
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        setIsClosing(true)
        sessionStorage.setItem("contributorPopupDismissed", "true")
        
        // Wait for animation to finish before removing from DOM
        setTimeout(() => {
            setIsVisible(false)
        }, 500)
    }

    if (!isVisible) return null

    return (
        <div className={`fixed bottom-6 right-6 z-50 max-w-sm transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
            isClosing 
                ? "translate-y-10 opacity-0 scale-95" 
                : "translate-y-0 opacity-100 scale-100"
        }`}>
            {/* Glow backing */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent blur-xl rounded-[2rem]" />
            
            <div className="relative overflow-hidden bg-card border border-primary/20 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.1)]">
                {/* Accent lighting top edge */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded-full transition-all"
                >
                    <X size={16} />
                </button>

                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shrink-0">
                        <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-foreground uppercase italic tracking-wide">
                            We Need <span className="text-primary">Experts!</span>
                        </h3>
                        
                        <div className="text-xs text-muted-foreground font-medium leading-relaxed space-y-2">
                            <p>
                                Are you a Seven Knights expert? We're looking for contributors to help manage and update Hero Builds and Tierlists.
                            </p>
                            <p className="text-muted-foreground/60">
                                เรากำลังตามหาผู้เชี่ยวชาญ 7K! หากคุณมีความรู้และอยากช่วยอัปเดตข้อมูลบนเว็บนี้ ติดต่อเรามาได้เลยครับ
                            </p>
                        </div>
                        
                        <Link 
                            href="/contact"
                            onClick={handleClose}
                            className="inline-flex items-center justify-center gap-2 w-full mt-2 py-2.5 px-4 bg-muted hover:bg-primary/10 border border-border hover:border-primary/50 rounded-xl text-xs font-bold text-muted-foreground hover:text-primary transition-all uppercase tracking-widest group"
                        >
                            Contact Us
                            <ExternalLink size={12} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
