"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { clsx } from "clsx"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Builds", href: "/build" },
        { name: "Stages", href: "/stages" },
        { name: "Castle Rush", href: "/castle-rush" },
        { name: "Dungeons", href: "/dungeon" },
        { name: "Raids", href: "/raid" },
        { name: "Tier List", href: "/tierlist" },
    ]

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/90 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                        <span className="text-[#FFD700]">7K</span>
                        <span className="text-white">DB</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "text-sm font-medium transition-colors hover:text-[#FFD700]",
                                pathname === item.href
                                    ? "text-[#FFD700]"
                                    : "text-gray-400"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        className="md:hidden px-3 py-1 text-xs font-bold border border-gray-700 rounded-md hover:border-[#FFD700] hover:text-[#FFD700] text-gray-400 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        MENU
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-800 bg-black">
                    <div className="flex flex-col p-4 space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "text-sm font-medium transition-colors hover:text-[#FFD700]",
                                    pathname === item.href
                                        ? "text-[#FFD700]"
                                        : "text-gray-400"
                                )}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}
