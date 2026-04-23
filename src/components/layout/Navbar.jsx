"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { clsx } from "clsx"
import { ChevronDown, Menu, X } from "lucide-react"

import { ThemeToggle } from "@/components/shared/ThemeToggle"

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
        {
            name: "Tools",
            href: "#",
            children: [
                { name: "Build Heroes", href: "/tools/build-simulator" },
                { name: "Hero Stats", href: "/tools/hero-stats" },
                { name: "Tier List Maker", href: "/tools/tierlist-maker" },
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
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md shadow-lg">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="group flex items-center gap-1">
                        <div className="relative h-8 w-28 md:w-36 transition-transform group-hover:scale-105">
                            <Image
                                src="/about_website/logo_website.webp"
                                alt="7K DB Logo"
                                fill
                                className="object-contain dark:brightness-100 brightness-0 transition-all"
                                sizes="(max-width: 768px) 112px, 144px"
                                priority
                            />
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-1">
                    {navItems.map((item, index) => {
                        const isChildActive = item.children?.some(child => pathname.startsWith(child.href))
                        return (
                        <div key={item.name} className="relative group">
                            {item.children ? (
                                <button
                                    className={clsx(
                                        "flex items-center gap-1 px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all rounded-lg",
                                        isChildActive
                                            ? "text-primary bg-primary/10"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
                                            ? "text-primary bg-primary/10 shadow-[0_0_10px_rgba(255,215,0,0.1)]"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
                                    <div className="relative bg-card border border-border rounded-xl shadow-2xl overflow-hidden p-1.5">
                                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-0" />
                                        <div className="relative z-10">
                                            {item.children.map((child) => {
                                                const isActive = pathname === child.href || pathname.startsWith(child.href + '/')
                                                return (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={clsx(
                                                        "flex items-center justify-between px-4 py-3 text-sm font-medium transition-all rounded-lg mb-0.5",
                                                        isActive
                                                            ? "bg-primary/10 text-primary"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-accent hover:pl-6"
                                                    )}
                                                >
                                                    {child.name}
                                                    {isActive && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                    )}
                                                </Link>
                                            )})}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        )
                    })}

                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    
                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => {
                                setIsMenuOpen(!isMenuOpen)
                            }}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border bg-background animate-in slide-in-from-top-2 duration-200">
                    <div className="p-4 space-y-4 h-[calc(100vh-4rem)] overflow-y-auto">
                        <div className="space-y-2 pt-2 border-t border-border/50">
                            {navItems.map((item) => (
                            <div key={item.name}>
                                {item.children ? (
                                    <>
                                        <button
                                            onClick={() => toggleDropdown(item.name)}
                                            className={clsx(
                                                "w-full flex items-center justify-between px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-colors",
                                                activeDropdown === item.name
                                                    ? "text-foreground bg-accent"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                            )}
                                        >
                                            {item.name}
                                            <ChevronDown className={clsx("w-4 h-4 transition-transform", activeDropdown === item.name && "rotate-180")} />
                                        </button>
                                        {activeDropdown === item.name && (
                                            <div className="pl-4 mt-1 space-y-1 border-l-2 border-primary/20 ml-4">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.href}
                                                        href={child.href}
                                                        className={clsx(
                                                            "block px-4 py-2.5 text-sm font-medium transition-colors rounded-lg",
                                                            pathname === child.href
                                                                ? "text-primary bg-primary/5"
                                                                : "text-muted-foreground hover:text-foreground"
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
                                                ? "text-primary bg-primary/10"
                                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
