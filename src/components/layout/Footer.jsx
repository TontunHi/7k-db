"use client"

import Link from "next/link"

export default function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-black py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="text-lg font-bold text-white">7K DB</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Unofficial Database for Seven Knights Rebirth
                        </p>
                    </div>

                    <div className="flex gap-6 text-sm text-gray-400">
                        <Link href="/about" className="hover:text-[#FFD700] transition-colors">
                            About
                        </Link>
                        <Link href="/privacy" className="hover:text-[#FFD700] transition-colors">
                            Privacy
                        </Link>
                        <Link href="/contact" className="hover:text-[#FFD700] transition-colors">
                            Contact
                        </Link>
                    </div>

                    <div className="text-xs text-gray-600">
                        © {new Date().getFullYear()} 7K DB. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    )
}
