'use client'

import { useState } from 'react'
import { Send, Loader2, CheckCircle2, AlertCircle, User, Mail, MessageSquare, Tag } from 'lucide-react'
import { sendMessage } from '@/lib/message-actions'
import { cn } from '@/lib/utils'

export default function ContactForm() {
    const [status, setStatus] = useState('idle') // idle, sending, success, error
    const [errorMessage, setErrorMessage] = useState('')
    const [cooldown, setCooldown] = useState(0)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (cooldown > 0) return

        setStatus('sending')
        const formData = new FormData(e.target)
        const result = await sendMessage(formData)

        if (result.success) {
            setStatus('success')
            setCooldown(60) // 1 minute cooldown
            const timer = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            e.target.reset()
        } else {
            setStatus('error')
            setErrorMessage(result.error || 'Something went wrong. Please try again.')
        }
    }

    if (status === 'success') {
        return (
            <div className="p-12 rounded-3xl bg-green-500/5 border border-green-500/20 text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase mb-2">Message Sent!</h3>
                <p className="text-gray-400 font-light mb-8 max-w-sm mx-auto">
                    Thank you for reaching out. We&apos;ve received your message and will get back to you as soon as possible.
                </p>
                <button 
                    onClick={() => setStatus('idle')}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-bold text-sm uppercase tracking-widest border border-white/10"
                >
                    Send Another
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Honeypot field (hidden) */}
            <div className="hidden">
                <input type="text" name="nickname" tabIndex="-1" autoComplete="off" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Your Name</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#FFD700] transition-colors">
                            <User className="w-4 h-4" />
                        </div>
                        <input 
                            name="name"
                            type="text" 
                            required 
                            placeholder="John Doe"
                            className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/20 transition-all placeholder:text-gray-700 font-light"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#FFD700] transition-colors">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input 
                            name="email"
                            type="email" 
                            required 
                            placeholder="john@example.com"
                            className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/20 transition-all placeholder:text-gray-700 font-light"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Subject</label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 group-focus-within:text-[#FFD700] transition-colors">
                        <Tag className="w-4 h-4" />
                    </div>
                    <input 
                        name="subject"
                        type="text" 
                        placeholder="Feedback or Question"
                        className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/20 transition-all placeholder:text-gray-700 font-light"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Message</label>
                <div className="relative group">
                    <div className="absolute top-4 left-4 pointer-events-none text-gray-600 group-focus-within:text-[#FFD700] transition-colors">
                        <MessageSquare className="w-4 h-4" />
                    </div>
                    <textarea 
                        name="message"
                        required 
                        rows={6}
                        placeholder="Tell us what's on your mind..."
                        className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/20 transition-all placeholder:text-gray-700 font-light resize-none"
                    />
                </div>
            </div>

            {status === 'error' && (
                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm animate-in shake duration-300">
                    <AlertCircle className="w-4 h-4" />
                    {errorMessage}
                </div>
            )}

            <button 
                type="submit"
                disabled={status === 'sending' || cooldown > 0}
                className={cn(
                    "w-full bg-gradient-to-r from-red-600 to-orange-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg uppercase tracking-widest italic group active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed",
                    "hover:shadow-[0_0_30px_rgba(239,68,68,0.3)] shadow-red-500/10"
                )}
            >
                {status === 'sending' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : cooldown > 0 ? (
                    `Wait ${cooldown}s`
                ) : (
                    <>
                        Send Message
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    )
}
