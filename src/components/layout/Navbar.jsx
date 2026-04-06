"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { clsx } from "clsx"
import { ChevronDown, Menu, X } from "lucide-react"

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Builds", href: "/build" },
        { name: "Tier List", href: "/tierlist" },
        {
            name: "PVE Mode",
            href: "#",
            children: [
                { name: "Stage", href: "/stages" },
                { name: "Dungeons", href: "/dungeon" },
                { name: "Raids", href: "/raid" },
                { name: "Castle Rush", href: "/castle-rush" },
                { name: "Advent Expedition", href: "/advent" },
            ]
        },
        {
            name: "PVP Mode",
            href: "#",
            children: [
                { name: "Arena & Celestial PVP", href: "/arena" },
                { name: "Total War", href: "/total-war" },
                { name: "Guild War", href: "/guild-war" },
            ]
        },
    ]

    const toggleDropdown = (name) => {
        if (activeDropdown === name) {
            setActiveDropdown(null)
        } else {
            setActiveDropdown(name)
        }
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-[#FFD700]/10 bg-[#050505]/95 backdrop-blur-md shadow-lg">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="group flex items-center gap-1">
                        <div className="relative h-8 w-28 md:w-36 transition-transform group-hover:scale-105">
                            <Image
                                src="/about_website/logo_website.webp"
                                alt="7K DB Logo"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 112px, 144px"
                                priority
                            />
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item, index) => (
                        <div key={item.name} className="relative group">
                            {item.children ? (
                                <button
                                    className={clsx(
                                        "flex items-center gap-1 px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all rounded-lg",
                                        "text-gray-400 hover:text-white hover:bg-white/5",
                                        pathname.startsWith(item.href) && item.href !== '#' && "text-[#FFD700]"
                                    )}
                                >
                                    {item.name}
                                    <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                                </button>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={clsx(
                                        "block px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all rounded-lg",
                                        pathname === item.href
                                            ? "text-[#FFD700] bg-[#FFD700]/10 shadow-[0_0_10px_rgba(255,215,0,0.1)]"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            )}

                            {/* Dropdown Menu */}
                            {item.children && (
                                <div className={clsx(
                                    "absolute top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50",
                                    index > 2 ? "right-0" : "left-0"
                                )}>
                                    <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl shadow-2xl overflow-hidden p-1.5">
                                        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 to-transparent pointer-events-none"></div>
                                        {item.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                className={clsx(
                                                    "block px-4 py-3 text-sm font-medium transition-all rounded-lg mb-0.5",
                                                    pathname === child.href
                                                        ? "bg-[#FFD700]/10 text-[#FFD700]"
                                                        : "text-gray-400 hover:text-white hover:bg-white/5 hover:pl-6"
                                                )}
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                </div>

                {/* Mobile Menu Button & Search */}
                <div className="flex items-center gap-2 md:hidden">
                    <button
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        onClick={() => {
                            setIsMenuOpen(!isMenuOpen)
                        }}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-800 bg-[#050505] animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 space-y-4 h-[calc(100vh-4rem)] overflow-y-auto">
                        <div className="space-y-2 pt-2 border-t border-gray-800/50">
                            {navItems.map((item) => (
                            <div key={item.name}>
                                {item.children ? (
                                    <>
                                        <button
                                            onClick={() => toggleDropdown(item.name)}
                                            className={clsx(
                                                "w-full flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-colors",
                                                activeDropdown === item.name
                                                    ? "text-white bg-white/5"
                                                    : "text-gray-400 hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {item.name}
                                            <ChevronDown className={clsx("w-4 h-4 transition-transform", activeDropdown === item.name && "rotate-180")} />
                                        </button>
                                        {activeDropdown === item.name && (
                                            <div className="pl-4 mt-1 space-y-1 border-l-2 border-[#FFD700]/20 ml-4">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className={clsx(
                                                            "block px-4 py-2.5 text-sm font-medium transition-colors rounded-lg",
                                                            pathname === child.href
                                                                ? "text-[#FFD700] bg-[#FFD700]/5"
                                                                : "text-gray-500 hover:text-white"
                                                        )}
                                                        onClick={() => setIsMenuOpen(false)}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className={clsx(
                                            "block px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-colors",
                                            pathname === item.href
                                                ? "text-[#FFD700] bg-[#FFD700]/10"
                                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                        )}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
        </nav>
    )
}
