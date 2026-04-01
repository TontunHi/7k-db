"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { clsx } from "clsx"
import { ChevronDown, Menu, X, Search, Sparkles, Loader2 } from "lucide-react"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const searchRef = useRef(null)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const fetchResults = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([])
                return
            }
            setIsSearching(true)
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
                const data = await res.json()
                setSearchResults(data)
            } catch (err) {
                console.error(err)
            } finally {
                setIsSearching(false)
            }
        }

        const timer = setTimeout(fetchResults, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        setIsSearchOpen(false)
        setSearchQuery("")
    }, [pathname])

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
                { name: "Arena & Celetial PVP", href: "/arena" },
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
                                src="/about_website/logo_website.png"
                                alt="7K DB Logo"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 112px, 144px"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Desktop Search Bar */}
                    <div className="hidden lg:block relative" ref={searchRef}>
                        <div className="relative w-64 xl:w-80 group">
                            <Search className={clsx(
                                "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                                isSearchOpen ? "text-[#FFD700]" : "text-gray-500"
                            )} />
                            <input
                                type="text"
                                placeholder="Search heroes (e.g. Rudy)..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    setIsSearchOpen(true)
                                }}
                                onFocus={() => setIsSearchOpen(true)}
                                className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#FFD700]/50 focus:bg-white/10 transition-all font-medium"
                            />
                            {isSearching && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#FFD700] animate-spin" />
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {isSearchOpen && (searchQuery.length >= 2) && (
                            <div className="absolute top-full mt-2 w-full bg-[#0a0a0a] border border-gray-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-2 space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                                    {searchResults.length > 0 ? (
                                        searchResults.map(hero => (
                                            <button
                                                key={hero.id}
                                                onClick={() => router.push(`/hero/${hero.id}`)}
                                                className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-all group/res text-left"
                                            >
                                                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-800 shrink-0">
                                                    <Image src={hero.image} alt={hero.name} fill className="object-cover group-hover/res:scale-110 transition-transform" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-bold text-gray-200 group-hover/res:text-[#FFD700] truncate uppercase tracking-tight">{hero.name}</div>
                                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{hero.grade}</div>
                                                </div>
                                                <Sparkles className="w-3 h-3 text-[#FFD700] opacity-0 group-hover/res:opacity-100 transition-opacity" />
                                            </button>
                                        ))
                                    ) : (
                                        !isSearching && (
                                            <div className="p-4 text-center text-gray-500 text-xs italic">
                                                No heroes found matching "{searchQuery}"
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
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
                            setIsSearchOpen(false)
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
                        {/* Mobile Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search heroes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#FFD700]/50"
                            />
                            {searchQuery.length >= 2 && (
                                <div className="mt-2 space-y-1">
                                    {searchResults.map(hero => (
                                        <button
                                            key={hero.id}
                                            onClick={() => {
                                                router.push(`/hero/${hero.id}`)
                                                setIsMenuOpen(false)
                                            }}
                                            className="w-full flex items-center gap-3 p-2 bg-white/5 rounded-xl text-left"
                                        >
                                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-800 shrink-0">
                                                <Image src={hero.image} alt={hero.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-200 uppercase tracking-tight">{hero.name}</div>
                                                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{hero.grade}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

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
