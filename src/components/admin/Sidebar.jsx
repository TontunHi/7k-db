"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react"
import { logout } from "@/lib/actions"
import { clsx } from "clsx"
import { NAV_SECTIONS } from "@/app/admin/constants"
import styles from "./Sidebar.module.css"

/**
 * SidebarContent - The actual menu content
 */
const SidebarContent = ({ setIsOpen, pathname, filteredSections, user }) => (
    <>
        <div className={styles.header}>
            <Link href="/admin" className={styles.logoText}>
                7K Admin
            </Link>
            <button 
                onClick={() => setIsOpen(false)} 
                className={clsx(styles.menuButton, "md:hidden")}
                aria-label="Close menu"
            >
                <X size={18} />
            </button>
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
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                </Link>
            </div>

            {filteredSections.map((section) => (
                <div key={section.title} className="space-y-2">
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
                                    <item.icon size={16} className={!isActive ? item.color : undefined} />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            ))}
        </nav>

        <div className={styles.footer}>
            <div className={styles.userBadge}>
                <p className={styles.userLabel}>Authorized Admin</p>
                <p className={styles.userName}>{user?.username || 'Admin'}</p>
                <p className={styles.userRole}>{user?.role?.replace('_', ' ')}</p>
            </div>
            <form action={logout}>
                <button type="submit" className={styles.logoutBtn}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
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
