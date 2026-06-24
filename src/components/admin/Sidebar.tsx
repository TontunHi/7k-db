"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { logout } from "@/lib/actions"
import { clsx } from "clsx"
import { NAV_SECTIONS } from "@/app/admin/constants"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { Menu, X, Shield, LogOut, Terminal, Compass } from "lucide-react"

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

const SidebarContent = ({ setIsOpen, pathname, filteredSections, user }: SidebarContentProps) => {
  const isSuperAdmin = user?.role === "super_admin";

  return (
    <div className="flex flex-col h-full bg-card/65 backdrop-blur-lg border-r border-border/50 text-foreground font-sans w-64">
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border/40 shrink-0">
        <Link href="/admin" className="font-extrabold italic tracking-wider text-lg transform -skew-x-6 flex items-center gap-1.5 group">
          <Terminal className="w-5 h-5 text-primary" />
          7K <span className="text-primary italic">ADM</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-muted-foreground hover:text-foreground md:hidden border border-border/40 rounded-lg hover:bg-accent/40"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6 space-y-6">
        <div className="space-y-1">
          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              pathname === "/admin"
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/35"
            )}
          >
            <Compass className="w-4 h-4 shrink-0" />
            Command Center
          </Link>
        </div>

        {filteredSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              {section.title}
            </h3>
            <div className="space-y-0.5">
              {section.items.map((item: any) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all",
                      isActive
                        ? "bg-accent text-primary border-l-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                    )}
                  >
                    <div className={clsx("w-1.5 h-1.5 rounded-full shrink-0", isActive ? "bg-primary animate-pulse" : item.color || "bg-muted-foreground/40")} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Operator Badge & Logout Footer */}
      <div className="p-4 border-t border-border/40 bg-accent/10 space-y-4">
        <div className="flex items-center gap-3.5 bg-card/40 border border-border/50 rounded-2xl p-3.5 shadow-sm relative overflow-hidden group">
          <div className={`absolute -right-6 -bottom-6 w-14 h-14 bg-gradient-to-tr ${isSuperAdmin ? "from-emerald-500/10" : "from-cyan-500/10"} blur-xl rounded-full pointer-events-none`} />
          <div className={clsx(
            "w-9 h-9 rounded-xl border flex items-center justify-center relative z-10 shrink-0",
            isSuperAdmin ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
          )}>
            <Shield className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 min-w-0 relative z-10">
            <p className="text-[8px] font-black uppercase tracking-wider text-muted-foreground/60 leading-none">OPERATOR SIG</p>
            <p className="text-xs font-black text-foreground/95 truncate leading-tight">{user?.username || "Admin"}</p>
            <p className={`text-[8px] font-black uppercase tracking-widest leading-none ${isSuperAdmin ? "text-emerald-400" : "text-cyan-400"}`}>
              {user?.role?.replace("_", " ")}
            </p>
          </div>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/40 rounded-xl text-[10px] font-black tracking-widest text-rose-400 hover:text-rose-300 transition-all active:scale-[0.98] uppercase"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
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

  // Filter sections and items based on permissions
  const filteredSections = NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (item.superOnly && user?.role !== "super_admin") return false;
      return hasPermission(item.perm);
    }),
  })).filter((section) => section.items.length > 0);

  return (
    <>
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden flex h-16 w-full items-center justify-between px-6 border-b border-border bg-card/65 backdrop-blur-md shrink-0">
        <Link href="/admin" className="font-extrabold italic tracking-wider text-lg transform -skew-x-6 flex items-center gap-1.5">
          <Terminal className="w-5 h-5 text-primary" />
          7K <span className="text-primary italic">ADM</span>
        </Link>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 border border-border/40 rounded-lg hover:bg-accent/40 text-muted-foreground hover:text-foreground"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Drawer Container */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          setIsOpen={setIsOpen}
          pathname={pathname}
          filteredSections={filteredSections}
          user={user}
        />
      </div>

      {/* Backdrop for mobile view */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
