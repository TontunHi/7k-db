"use client"

import Link from "next/link"
import SafeImage from "@/components/shared/SafeImage"

export default function Footer() {
    return (
        <footer className="border-t border-gray-800/50 bg-[#050505] py-12 mt-auto relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FFD700] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-10">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                        <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
                            <SafeImage src="/about_website/logo_website.webp" alt="7K DB" width={120} height={40} style={{ height: 'auto' }} className="object-contain opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                        </Link>
                    </div>

                    {/* Navigation Section */}
                    <div className="flex justify-center items-center gap-8 md:gap-12">
                        {[
                            { name: "About", href: "/about" },
                            { name: "Privacy", href: "/privacy" },
                            { name: "Contact", href: "/contact" }
                        ].map(link => (
                            <Link 
                                key={link.name} 
                                href={link.href} 
                                className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-[#FFD700] transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#FFD700] transition-all group-hover:w-full"></span>
                            </Link>
                        ))}
                    </div>

                    {/* Copyright Section */}
                    <div className="flex flex-col items-center md:items-end text-center md:text-right gap-2">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-gray-700">
                            © {new Date().getFullYear()} 7K DB
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
