"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { logout } from "@/lib/actions"
import { clsx } from "clsx"
import { NAV_SECTIONS } from "@/app/admin/constants"
import { Marker } from "@/app/admin/components/AdminEditorial"
import styles from "./Sidebar.module.css"

import { ThemeToggle } from "@/components/shared/ThemeToggle"

/**
 * SidebarContent - The actual menu content
 */
const SidebarContent = ({ setIsOpen, pathname, filteredSections, user }) => (
    <>
        <div className={styles.header}>
            <Link href="/admin" className={styles.logoText}>
                7K <span className="text-primary italic">ADM</span>
            </Link>
            <div className="flex items-center gap-2">
                <ThemeToggle />
                <button 
                    onClick={() => setIsOpen(false)} 
                    className={clsx(styles.menuButton, "md:hidden")}
                    aria-label="Close menu"
                >
                    <span className="text-[10px] font-black uppercase tracking-tighter border border-border px-1.5 py-0.5 rounded">CLOSE</span>
                </button>
            </div>
        </div>

        <nav className={styles.nav}>
            <div className="space-y-1">
                <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                        styles.navLink,
                        pathname === "/admin" && styles.navLinkActive
                    )}
                >
                    <div className={clsx("w-1.5 h-1.5 rounded-full", pathname === "/admin" ? "bg-primary" : "bg-muted")} />
                    <span className="uppercase tracking-widest font-black text-[11px]">Command Center</span>
                </Link>
            </div>

            {filteredSections.map((section) => (
                <div key={section.title} className="space-y-3 pt-4">
                    <h3 className={styles.sectionTitle}>{section.title}</h3>
                    <div className="space-y-1">
                        {section.items.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={clsx(
                                        styles.navLink,
                                        isActive && styles.navLinkActive
                                    )}
                                >
                                    <Marker color={isActive ? "bg-primary" : item.color} className="opacity-60" />
                                    <span className="uppercase tracking-wider font-bold text-[10px]">{item.name}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            ))}
        </nav>

        <div className={styles.footer}>
            <div className={styles.userBadge}>
                <p className={styles.userLabel}>Authorized Ops</p>
                <p className={styles.userName}>{user?.username || 'Admin'}</p>
                <p className={styles.userRole}>{user?.role?.replace('_', ' ')}</p>
            </div>
            <form action={logout}>
                <button type="submit" className={styles.logoutBtn}>
                    <span className="uppercase tracking-widest font-black text-[10px] text-red-500">SIGN OUT</span>
                </button>
            </form>
        </div>
    </>
)

/**
 * Sidebar Component - Main responsive navigation for admin area
 */
export default function Sidebar({ user }) {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const hasPermission = (perm) => {
        if (user?.role === 'super_admin') return true
        return user?.permissions?.includes(perm) || user?.permissions?.includes('*')
    }

    // Filter items based on permissions
    const filteredSections = NAV_SECTIONS.map(section => ({
        ...section,
        items: section.items.filter(item => {
            if (item.superOnly && user?.role !== 'super_admin') return false
            return hasPermission(item.perm)
        })
    })).filter(section => section.items.length > 0)

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div 
                    className={styles.backdrop}
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Shell */}
            <aside className={clsx(
                styles.sidebar,
                isOpen && styles.sidebarOpen
            )}>
                <SidebarContent 
                    setIsOpen={setIsOpen} 
                    pathname={pathname} 
                    filteredSections={filteredSections} 
                    user={user} 
                />
            </aside>
        </>
    )
}
