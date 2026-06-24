"use client"

import React, { useState } from "react"
import StatCard from "./components/StatCard"
import ToolCard from "./components/ToolCard"
import ActivityFeed from "./components/ActivityFeed"
import { DASHBOARD_CATEGORIES } from "./constants"
import { Search, ShieldAlert, Cpu, Database, Activity, RefreshCw } from "lucide-react"

interface AdminDashboardViewProps {
  user: any;
  stats: any;
  recentLogs: any[];
}

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
    setTimeout(() => {
      window.location.reload();
    }, 800);
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

  const statCards = [
    { label: "Total Views", value: stats.views.toLocaleString(), type: "total_views" },
    { label: "Unique Users", value: stats.visitors.toLocaleString(), type: "unique_users" },
    { label: "Views Today", value: stats.viewsToday.toLocaleString(), type: "views_today" },
    { label: "Users Today", value: stats.visitorsToday.toLocaleString(), type: "users_today" },
  ];

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto text-foreground font-sans antialiased">
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-primary/5 to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* Cyberpunk Header Banner */}
      <header className="relative overflow-hidden bg-card/35 backdrop-blur-md border border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary animate-spin-slow" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFD700]/70">Admin Command Terminal</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold italic transform -skew-x-6 tracking-tight">
            HELLO, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">{user?.username?.toUpperCase() || 'OPERATOR'}</span>
          </h1>
          <p className="text-xs text-muted-foreground/80 font-medium">
            System initialization completed. All control systems are operational.
          </p>
        </div>

        {/* Live System Diagnostics Widget */}
        <div className="flex items-center gap-4 bg-accent/25 border border-border/40 px-5 py-3.5 rounded-2xl relative z-10 shrink-0">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div className="space-y-0.5">
            <div className="text-[9px] font-black uppercase tracking-wider text-muted-foreground/75">TiDB Status</div>
            <div className="text-xs font-black uppercase tracking-widest text-emerald-400">CONNECTED</div>
          </div>
          <div className="h-6 w-[1px] bg-border/40 mx-2" />
          <button 
            onClick={handleRefresh}
            className="p-2 bg-accent/40 border border-border/50 rounded-xl hover:bg-accent hover:border-primary/50 transition-all active:scale-95"
            title="Revalidate modules"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground hover:text-primary ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Module Terminal */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card/25 border border-border/50 rounded-3xl p-6 md:p-7 shadow-2xl space-y-6">
            
            {/* Minimalist Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-5">
              {/* Search box */}
              <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                <input 
                  type="text" 
                  placeholder="Filter operations..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-accent/20 border border-border/60 hover:border-border focus:border-primary/60 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none transition-all"
                />
              </div>

              {/* Categorization tabs */}
              <div className="flex flex-wrap gap-1.5 bg-accent/15 border border-border/40 rounded-xl p-1 text-[9px] font-black uppercase tracking-wider">
                {["ALL", "CONTENT", "PVE", "PVP", "SYSTEM"].map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeCategory === category 
                        ? "bg-primary text-primary-foreground shadow" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tool categories rendering */}
            <div className="space-y-6">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => (
                  <div key={cat.title} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-3 bg-primary rounded-full" />
                      <h3 className="text-xs font-black tracking-widest text-muted-foreground/70 uppercase">
                        {cat.title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                  <ShieldAlert className="w-12 h-12 text-muted-foreground/20" />
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">No Systems Match</h4>
                    <p className="text-[10px] text-muted-foreground/50">Change your query parameters above.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Telemetries & Feed */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Telemetries Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">Live Telemetries</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {statCards.map((stat, idx) => (
                <StatCard key={idx} {...stat} />
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <ActivityFeed logs={recentLogs} />
        </div>
      </div>
    </div>
  );
}
