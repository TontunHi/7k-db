'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { sendMessage } from '@/lib/message-actions'
import { cn } from '@/lib/utils'

export default function FloatingContactWidget({ enabled }) {
    const [isOpen, setIsOpen] = useState(false)
    const [status, setStatus] = useState('idle') // idle, sending, success, error
    const [errorMessage, setErrorMessage] = useState('')
    const [cooldown, setCooldown] = useState(0)

    // Ensure the widget doesn't hide the "Wait Xs" state when closed, keep cooldown running
    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown(prev => (prev <= 1 ? 0 : prev - 1))
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [cooldown])

    if (!enabled) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (cooldown > 0) return

        setStatus('sending')
        const formData = new FormData(e.target)
        
        // Add default subject for widget
        formData.append('subject', 'Message from Live Chat Widget')

        const result = await sendMessage(formData)

        if (result.success) {
            setStatus('success')
            setCooldown(60) // 1 minute cooldown
            e.target.reset()
        } else {
            setStatus('error')
            setErrorMessage(result.error || 'Something went wrong. Please try again.')
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            
            {/* Chat Panel */}
            <div 
                className={cn(
                    "mb-4 w-80 sm:w-96 bg-card border border-border shadow-[0_10px_40px_rgba(0,0,0,0.8)] rounded-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right",
                    isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none absolute bottom-16 right-0"
                )}
            >
                {/* Header */}
                <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mt-10 -mr-10"></div>
                    <div className="flex items-center gap-2 relative z-10">
                        <MessageCircle className="w-5 h-5" />
                        <h3 className="font-bold text-sm uppercase tracking-widest">Send a Message</h3>
                    </div>
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="text-primary-foreground/80 hover:text-primary-foreground transition-colors relative z-10 p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {status === 'success' ? (
                        <div className="text-center py-8 animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h4 className="font-bold text-foreground mb-2">Message Sent!</h4>
                            <p className="text-xs text-muted-foreground mb-6">We&apos;ll get back to you as soon as possible.</p>
                            <button 
                                onClick={() => setStatus('idle')}
                                className="text-xs font-bold uppercase text-primary hover:text-primary/80"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Honeypot field (hidden) */}
                            <div className="hidden">
                                <input type="text" name="nickname" tabIndex={-1} autoComplete="off" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Name</label>
                                <input 
                                    name="name"
                                    type="text" 
                                    required 
                                    placeholder="Your name"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Email</label>
                                <input 
                                    name="email"
                                    type="email" 
                                    required 
                                    placeholder="your@email.com"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest pl-1">Message</label>
                                <textarea 
                                    name="message"
                                    required 
                                    rows={4}
                                    placeholder="How can we help?"
                                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 resize-none"
                                />
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            <button 
                                type="submit"
                                disabled={status === 'sending' || cooldown > 0}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {status === 'sending' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : cooldown > 0 ? (
                                    `Wait ${cooldown}s`
                                ) : (
                                    <>
                                        Send Message
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <div className="relative">
                {/* Background Glow */}
                <div className={cn(
                    "absolute inset-0 bg-primary/40 rounded-full blur-xl transition-opacity duration-500",
                    isOpen ? "opacity-0" : "opacity-100"
                )}></div>
                
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.4)] transition-all duration-300 hover:scale-105 active:scale-95 group z-10",
                        isOpen ? "bg-surface border border-border text-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    )}
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-foreground" />
                    ) : (
                        <div className="relative">
                            <MessageCircle className="w-6 h-6" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-primary rounded-full animate-pulse"></span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    )
}
