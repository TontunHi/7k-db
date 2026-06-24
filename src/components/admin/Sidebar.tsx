"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { logout } from "@/lib/actions"
import { clsx } from "clsx"
import { NAV_SECTIONS } from "@/app/admin/constants"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import {
  Menu, X, LogOut, ChevronRight, Home,
  Layers, Swords, Flame, BookOpen, Users, Settings
} from "lucide-react"

interface User {
  username?: string;
  role?: string;
  permissions?: string[];
}

interface SidebarContentProps {
  setIsOpen: (open: boolean) => void;
  pathname: string;
  filteredSections: any[];
  user: User | null;
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  "General": <Layers className="w-3.5 h-3.5" />,
  "PVE Content": <BookOpen className="w-3.5 h-3.5" />,
  "PVP Content": <Swords className="w-3.5 h-3.5" />,
  "Database": <Flame className="w-3.5 h-3.5" />,
  "Analytics": <Settings className="w-3.5 h-3.5" />,
  "System": <Users className="w-3.5 h-3.5" />,
}

const SidebarContent = ({ setIsOpen, pathname, filteredSections, user }: SidebarContentProps) => {
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r border-border/40 text-foreground">
      {/* Logo / Brand */}
      <div className="h-16 flex items-center px-6 border-b border-border/30 shrink-0">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 group"
          onClick={() => setIsOpen(false)}
        >
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <span className="text-[10px] font-black text-primary-foreground">7K</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-bold text-foreground/90">7K Admin</span>
            <span className="text-[9px] text-muted-foreground/70 font-medium">Control Panel</span>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-muted-foreground hover:text-foreground md:hidden rounded-lg hover:bg-accent/40 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {/* Dashboard Home */}
        <Link
          href="/admin"
          onClick={() => setIsOpen(false)}
          className={clsx(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 mb-4",
            pathname === "/admin"
              ? "bg-primary/10 text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/20"
          )}
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>Dashboard</span>
          {pathname === "/admin" && (
            <ChevronRight className="w-3 h-3 ml-auto text-primary/70" />
          )}
        </Link>

        {/* Sections */}
        {filteredSections.map((section) => (
          <div key={section.title} className="py-3">
            <div className="flex items-center gap-1.5 px-3 mb-2">
              <span className="text-muted-foreground/40">
                {SECTION_ICONS[section.title] || <Layers className="w-3.5 h-3.5" />}
              </span>
              <p className="text-[10px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                {section.title}
              </p>
            </div>
            <div className="space-y-1">
              {section.items.map((item: any) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                      isActive
                        ? "bg-accent/60 text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/20 font-medium"
                    )}
                  >
                    <span className={clsx(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      isActive ? item.color || "bg-primary" : "bg-muted-foreground/30"
                    )} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer — User Profile */}
      <div className="p-4 border-t border-border/30 space-y-3 shrink-0">
        {/* User row */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-accent/10 border border-border/20">
          <div className={clsx(
            "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ring-2",
            isSuperAdmin
              ? "bg-amber-500/20 text-amber-400 ring-amber-400/20"
              : "bg-blue-500/20 text-blue-400 ring-blue-400/20"
          )}>
            {user?.username?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-foreground truncate">{user?.username || "Admin"}</p>
            <p className={clsx(
              "text-[10px] font-medium capitalize truncate",
              isSuperAdmin ? "text-amber-500" : "text-blue-400"
            )}>
              {user?.role?.replace("_", " ") || "admin"}
            </p>
          </div>
        </div>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-medium text-muted-foreground hover:text-rose-400 hover:bg-rose-500/5 rounded-lg transition-all duration-150"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
};

export default function Sidebar({ user }: { user: User | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const hasPermission = (perm: string) => {
    if (user?.role === "super_admin") return true;
    return user?.permissions?.includes(perm) || user?.permissions?.includes("*");
  };

  const filteredSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (item.superOnly && user?.role !== "super_admin") return false;
      return hasPermission(item.perm);
    }),
  })).filter((section) => section.items.length > 0);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex h-14 w-full items-center justify-between px-4 border-b border-border/60 bg-card shrink-0">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-[10px] font-black text-primary-foreground">7K</span>
          </div>
          <span className="text-sm font-semibold">Admin</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-accent/40 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-200 ease-out shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent
          setIsOpen={setIsOpen}
          pathname={pathname}
          filteredSections={filteredSections}
          user={user}
        />
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
