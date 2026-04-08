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
            <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/20 to-transparent blur-xl rounded-[2rem]" />
            
            <div className="relative overflow-hidden bg-[#0a0a0a] border border-[#FFD700]/20 rounded-[2rem] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                {/* Accent lighting top edge */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50" />
                
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                    <X size={16} />
                </button>

                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFD700]/5 border border-[#FFD700]/20 flex items-center justify-center shrink-0">
                        <Lightbulb className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-white uppercase italic tracking-wide">
                            We Need <span className="text-[#FFD700]">Experts!</span>
                        </h3>
                        
                        <div className="text-xs text-gray-400 font-medium leading-relaxed space-y-2">
                            <p>
                                Are you a Seven Knights expert? We're looking for contributors to help manage and update Hero Builds and Tierlists.
                            </p>
                            <p className="text-gray-500">
                                เรากำลังตามหาผู้เชี่ยวชาญ 7K! หากคุณมีความรู้และอยากช่วยอัปเดตข้อมูลบนเว็บนี้ ติดต่อเรามาได้เลยครับ
                            </p>
                        </div>
                        
                        <Link 
                            href="/contact"
                            onClick={handleClose}
                            className="inline-flex items-center justify-center gap-2 w-full mt-2 py-2.5 px-4 bg-white/5 hover:bg-[#FFD700]/10 border border-white/5 hover:border-[#FFD700]/50 rounded-xl text-xs font-bold text-gray-300 hover:text-[#FFD700] transition-all uppercase tracking-widest group"
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
