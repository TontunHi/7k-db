"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { X, ExternalLink, MessageCircle, Facebook, Zap, ChevronDown } from "lucide-react"
import { clsx } from "clsx"

const ELASTIC_SHOP_FB = "https://www.facebook.com/elasticshop/"
const ELASTIC_SHOP_LINE = "https://line.me/R/ti/p/%40274kgoaf"
const LOGO_PATH = "/about_website/logo_elasticshop.webp"
const BANNER_PATH = "/about_website/elasticshop.webp"

export default function SponsorBanner({ variant = "sidebar", className = "" }) {
    const [isVisible, setIsVisible] = useState(true)
    const [isHovered, setIsHovered] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
        
        // Handle click outside for navbar dropdown
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (!mounted || !isVisible) return null

    // Floating variant: Hover to expand
    if (variant === "floating") {
        return (
            <div 
                className={clsx(
                    "fixed bottom-6 right-6 z-[100] transition-all duration-500",
                    isHovered ? "w-64" : "w-16",
                    className
                )}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative group/floating">
                    <button
                        onClick={() => setIsVisible(false)}
                        className="absolute -top-2 -right-2 p-1 bg-black/80 border border-gray-800 rounded-full text-gray-400 hover:text-white z-20 opacity-0 group-hover/floating:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3" />
                    </button>
                    
                    <div className={clsx(
                        "flex items-center gap-3 p-2 bg-[#0a0a0a]/90 backdrop-blur-xl border border-[#FFD700]/30 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.2)] overflow-hidden transition-all duration-500",
                        isHovered ? "pr-4" : "pr-2"
                    )}>
                        {/* Main Logo */}
                        <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-[#FFD700]/20 bg-black group-hover:border-[#FFD700]/50 transition-all shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                             <Image 
                                src={LOGO_PATH} 
                                alt="ElasticShop Logo" 
                                fill 
                                className="object-contain p-1"
                             />
                        </div>

                        {/* Expanded Content */}
                        <div className={clsx(
                            "flex items-center gap-2 transition-all duration-500 origin-left",
                            isHovered ? "opacity-100 scale-100 max-w-xs" : "opacity-0 scale-50 max-w-0"
                        )}>
                            <Link
                                href={ELASTIC_SHOP_LINE}
                                target="_blank"
                                className="p-2.5 bg-[#FFD700] text-black rounded-lg hover:bg-white transition-all shadow-lg"
                                title="Add LINE"
                            >
                                <MessageCircle className="w-5 h-5 fill-current" />
                            </Link>
                            <Link
                                href={ELASTIC_SHOP_FB}
                                target="_blank"
                                className="p-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all border border-white/10"
                                title="Facebook Page"
                            >
                                <Facebook className="w-5 h-5 fill-current" />
                            </Link>
                            <div className="ml-1">
                                <p className="text-[10px] font-black text-[#FFD700] uppercase tracking-tighter leading-none italic">Elastic</p>
                                <p className="text-[10px] font-bold text-white uppercase tracking-tighter leading-none">Shop</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Navbar variant: Dropdown with logos
    if (variant === "navbar") {
        return (
            <div 
                className={clsx("relative", className)}
                ref={dropdownRef}
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
            >
                <button
                    className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full transition-all group",
                        isDropdownOpen ? "bg-[#FFD700]/20 border-[#FFD700]/50" : "hover:bg-[#FFD700]/20"
                    )}
                >
                    <div className="relative w-5 h-5 shrink-0 rounded-md overflow-hidden bg-black/50 border border-[#FFD700]/20">
                        <Image 
                            src={LOGO_PATH} 
                            alt="Logo" 
                            fill 
                            className="object-contain p-0.5"
                        />
                    </div>
                    <span className="text-xs font-black text-[#FFD700] uppercase tracking-wider italic">Elastic Shop</span>
                    <ChevronDown className={clsx("w-3 h-3 text-[#FFD700] transition-transform duration-300", isDropdownOpen && "rotate-180")} />
                </button>

                {/* Dropdown Menu */}
                <div className={clsx(
                    "absolute top-full right-0 mt-2 w-48 bg-[#0a0a0a] border border-[#FFD700]/20 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-2 z-[200] overflow-hidden transition-all duration-300 transform",
                    isDropdownOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible"
                )}>
                    <div className="px-3 pb-2 mb-2 border-b border-white/5">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Select Platform</p>
                    </div>
                    <Link
                        href={ELASTIC_SHOP_LINE}
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2 text-white hover:bg-[#FFD700]/10 transition-colors group/item"
                    >
                        <div className="w-8 h-8 rounded-lg bg-[#FFD700] flex items-center justify-center text-black group-hover/item:scale-110 transition-transform">
                             <MessageCircle className="w-4 h-4 fill-current" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold font-sans">Contact LINE</span>
                            <span className="text-[10px] text-gray-500 font-mono">@274kgoaf</span>
                        </div>
                    </Link>
                    <Link
                        href={ELASTIC_SHOP_FB}
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2 text-white hover:bg-[#FFD700]/10 transition-colors group/item"
                    >
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white group-hover/item:scale-110 transition-transform">
                             <Facebook className="w-4 h-4 fill-current" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold font-sans">Facebook Page</span>
                            <span className="text-[10px] text-gray-500 font-mono">ElasticShop</span>
                        </div>
                    </Link>
                </div>
            </div>
        )
    }

    if (variant === "sidebar") {
        return (
            <div className={clsx(
                "group relative bg-[#0a0a0a] border border-[#FFD700]/10 rounded-2xl overflow-hidden transition-all hover:border-[#FFD700]/30",
                className
            )}>
                <div className="relative h-32 w-full overflow-hidden">
                    <Image 
                        src={BANNER_PATH} 
                        alt="ElasticShop Banner" 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                    <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 text-[10px] font-bold text-[#FFD700] bg-black/60 backdrop-blur-md border border-[#FFD700]/20 rounded uppercase tracking-widest">
                            Sponsored
                        </span>
                    </div>
                </div>

                <div className="p-5 pt-2 flex flex-col gap-4 relative z-10">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black italic uppercase text-white tracking-tight leading-none group-hover:text-[#FFD700] transition-colors">
                            Elastic <span className="text-[#FFD700]">Shop</span>
                        </h3>
                        <p className="text-xs text-gray-400 font-medium">Game top-up service. 100% Safe & Fast.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href={ELASTIC_SHOP_LINE}
                            target="_blank"
                            className="flex items-center justify-center gap-2 py-2.5 bg-[#FFD700] text-black rounded-xl font-bold text-xs uppercase hover:bg-white transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                        >
                            <MessageCircle className="w-4 h-4" />
                            LINE
                        </Link>
                        <Link
                            href={ELASTIC_SHOP_FB}
                            target="_blank"
                            className="flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold text-xs uppercase hover:bg-white/10 transition-all"
                        >
                            <Facebook className="w-4 h-4" />
                            Visit FB
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Wide variant: Improved layout to prevent text overlap
    return (
        <div className={clsx(
            "group relative w-full bg-[#0a0a0a] border border-[#FFD700]/20 rounded-3xl overflow-hidden transition-all hover:border-[#FFD700]/40 shadow-2xl",
            className
        )}>
            <div className="flex flex-col lg:flex-row items-stretch">
                {/* Image Section - Shifted and refined */}
                <div className="relative w-full lg:w-[48%] h-64 lg:h-80 shrink-0 overflow-hidden">
                     <Image 
                        src={BANNER_PATH} 
                        alt="ElasticShop Full" 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-1000 origin-left"
                     />
                     {/* Gradient mask with better fall-off to prevent obscuring text */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0a0a]/30 to-[#0a0a0a] hidden lg:block" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent lg:hidden" />
                </div>
                
                {/* Content Section - Increased padding and clear space */}
                <div className="flex-1 flex flex-col justify-center text-center lg:text-left space-y-5 p-8 lg:p-10 lg:pl-4">
                    <div className="flex items-center justify-center lg:justify-start gap-2">
                         <span className="text-xs font-bold text-white uppercase tracking-[0.2em] px-4 py-1.5 bg-[#FFD700]/80 text-black rounded-full shadow-[0_5px_15px_rgba(255,215,0,0.3)] transform transition-transform group-hover:-translate-y-1">
                            Official Partner
                         </span>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex flex-col lg:flex-row lg:items-end gap-x-3">
                            <h3 className="text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter leading-none">
                                ELASTIC <span className="text-[#FFD700]">SHOP</span>
                            </h3>
                            <span className="hidden lg:block h-8 w-1 bg-white/20 rounded-full mb-1" />
                            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest hidden lg:block mb-1.5">Game Top-up</span>
                        </div>
                        <p className="text-lg md:text-xl text-gray-400 font-medium tracking-wide">
                            Affordable game top-up. Safe & No Refund. <br className="hidden md:block" /> 
                            <span className="text-white/60">Available 24/7. Reliable & 100% Safe.</span>
                        </p>
                    </div>
                    
                    <div className="pt-4 flex flex-wrap justify-center lg:justify-start gap-4">
                        {/* LINE Button */}
                        <Link
                            href={ELASTIC_SHOP_LINE}
                            target="_blank"
                            className="flex items-center gap-3 px-8 py-4 bg-[#FFD700] text-black rounded-2xl font-black italic uppercase text-sm hover:bg-white hover:scale-105 transition-all shadow-[0_10px_20px_rgba(254,215,0,0.2)] active:scale-95"
                        >
                            <MessageCircle className="w-5 h-5 fill-current" />
                            Contact LINE
                        </Link>
                        
                        {/* Facebook Button */}
                        <Link
                            href={ELASTIC_SHOP_FB}
                            target="_blank"
                            className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black italic uppercase text-sm hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all backdrop-blur-sm active:scale-95"
                        >
                            <Facebook className="w-5 h-5 fill-current" />
                            Facebook Page
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-full bg-[#FFD700]/5 blur-[150px] -z-10" />
        </div>
    )
}
