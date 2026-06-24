"use client"

import React, { useState } from "react"
import Link from "next/link"
import ToolCard from "./components/ToolCard"
import ActivityFeed from "./components/ActivityFeed"
import { DASHBOARD_CATEGORIES } from "./constants"
import {
  Search, RefreshCw, LayoutDashboard, ChevronRight,
  Clock, ArrowUpRight
} from "lucide-react"

interface AdminDashboardViewProps {
  user: any;
  stats: any;
  recentLogs: any[];
}

const QUICK_ACTIONS = [
  { label: "Builds", href: "/admin/builds", color: "bg-blue-500/8 text-blue-400 border-blue-500/15 hover:bg-blue-500/15 hover:border-blue-500/30" },
  { label: "Tierlist", href: "/admin/tierlist", color: "bg-pink-500/8 text-pink-400 border-pink-500/15 hover:bg-pink-500/15 hover:border-pink-500/30" },
  { label: "Registry", href: "/admin/registry", color: "bg-amber-500/8 text-amber-400 border-amber-500/15 hover:bg-amber-500/15 hover:border-amber-500/30" },
  { label: "Analytics", href: "/admin/analytics", color: "bg-emerald-500/8 text-emerald-400 border-emerald-500/15 hover:bg-emerald-500/15 hover:border-emerald-500/30" },
]

export default function AdminDashboardView({ user, stats, recentLogs }: AdminDashboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hasPermission = (perm: string) => {
    if (user?.role === 'super_admin') return true;
    return user?.permissions?.includes(perm) || user?.permissions?.includes('*');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => window.location.reload(), 800);
  };

  const filteredCategories = DASHBOARD_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) => {
      if (item.superOnly && user?.role !== 'super_admin') return false;
      const permitted = hasPermission(item.perm);
      if (!permitted) return false;
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        return item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
      }
      return true;
    }),
  })).filter((cat) => {
    if (cat.items.length === 0) return false;
    if (activeCategory === "ALL") return true;
    if (activeCategory === "CONTENT" && (cat.title === "Core Logistics" || cat.title === "General")) return true;
    if (activeCategory === "PVE" && cat.title.includes("PVE")) return true;
    if (activeCategory === "PVP" && cat.title.includes("PVP")) return true;
    if (activeCategory === "SYSTEM" && cat.title.includes("System")) return true;
    return false;
  });

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground/60">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Dashboard</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {greeting},{" "}
            <span className="text-primary">{user?.username || "Admin"}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your platform content and settings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 pt-1">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border/40 bg-card/60 text-xs font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Database Online
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border/40 bg-card/60 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <p className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">Quick access</p>
        <div className="flex items-center gap-2.5 flex-wrap">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-all duration-150 ${action.color}`}
            >
              {action.label}
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left: Module Grid */}
        <div className="lg:col-span-8 space-y-8">

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card/60 border border-border/40 hover:border-border/70 focus:border-primary/50 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/40"
              />
            </div>
            <div className="flex gap-1 bg-card/60 border border-border/40 rounded-lg p-1 shrink-0">
              {["ALL", "CONTENT", "PVE", "PVP", "SYSTEM"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-10">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <div key={cat.title} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-semibold text-foreground/70 whitespace-nowrap">{cat.title}</h2>
                    <div className="flex-1 h-px bg-border/30" />
                    <span className="text-xs text-muted-foreground/50 whitespace-nowrap">{cat.items.length} modules</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {cat.items.map((tool) => (
                      <ToolCard
                        key={tool.title}
                        {...tool}
                        markerColor={tool.marker}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-4">
                  <Search className="w-5 h-5 text-muted-foreground/30" />
                </div>
                <p className="text-sm font-medium text-muted-foreground/60">No modules found</p>
                <p className="text-xs text-muted-foreground/40 mt-1.5">Try adjusting your search or filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Activity Feed */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <Clock className="w-3.5 h-3.5" />
              <h2 className="text-xs font-semibold uppercase tracking-wider">Recent Activity</h2>
            </div>
            <Link
              href="/admin/logs"
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <ActivityFeed logs={recentLogs} />
        </div>

      </div>
    </div>
  );
}
