"use client"

import Link from "next/link"

export default function Footer() {
    return (
        <footer className="relative bg-background mt-20 border-t border-border/40 overflow-hidden">
            {/* Subtle top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            
            <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col items-center gap-6">
                
                {/* Navigation Links */}
                <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
                    {[
                        { name: "About Us", href: "/about" },
                        { name: "Privacy Policy", href: "/privacy" },
                        { name: "Contact", href: "/contact" }
                    ].map(link => (
                        <Link 
                            key={link.name} 
                            href={link.href} 
                            className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>



                {/* Copyright */}
                <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase font-bold tracking-widest text-muted-foreground/40">
                    <span>© {new Date().getFullYear()} 7K DB</span>
                    <span>•</span>
                    <span>Built by fans, for fans.</span>
                </div>

            </div>
        </footer>
    )
}
