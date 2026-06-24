"use client"

import { Eye, Users, TrendingUp, Zap } from "lucide-react"

interface StatCardProps {
  label: string;
  value: string | number;
  type: string;
}

export default function StatCard({ label, value, type }: StatCardProps) {
  const getIcon = () => {
    switch (type) {
      case "total_views":
        return <Eye size={20} className="text-cyan-400 animate-pulse" />;
      case "unique_users":
        return <Users size={20} className="text-emerald-400 animate-pulse" />;
      case "views_today":
        return <TrendingUp size={20} className="text-rose-400 animate-pulse" />;
      case "users_today":
        return <Zap size={20} className="text-amber-400 animate-pulse" />;
      default:
        return null;
    }
  };

  const getColorTheme = () => {
    switch (type) {
      case "total_views":
        return {
          border: "border-cyan-500/25 hover:border-cyan-400/50",
          glow: "from-cyan-500/10 to-transparent",
          text: "text-cyan-400",
          barBg: "bg-cyan-500/20",
          barFill: "bg-cyan-400",
        };
      case "unique_users":
        return {
          border: "border-emerald-500/25 hover:border-emerald-400/50",
          glow: "from-emerald-500/10 to-transparent",
          text: "text-emerald-400",
          barBg: "bg-emerald-500/20",
          barFill: "bg-emerald-400",
        };
      case "views_today":
        return {
          border: "border-rose-500/25 hover:border-rose-400/50",
          glow: "from-rose-500/10 to-transparent",
          text: "text-rose-400",
          barBg: "bg-rose-500/20",
          barFill: "bg-rose-400",
        };
      case "users_today":
        return {
          border: "border-amber-500/25 hover:border-amber-400/50",
          glow: "from-amber-500/10 to-transparent",
          text: "text-amber-400",
          barBg: "bg-amber-500/20",
          barFill: "bg-amber-400",
        };
      default:
        return {
          border: "border-border/30 hover:border-border/60",
          glow: "from-primary/5 to-transparent",
          text: "text-primary",
          barBg: "bg-primary/15",
          barFill: "bg-primary",
        };
    }
  };

  const theme = getColorTheme();

  return (
    <div className={`relative overflow-hidden bg-card/45 backdrop-blur-md border ${theme.border} rounded-2xl p-5 shadow-2xl transition-all duration-300 hover:-translate-y-1 group`}>
      {/* Background Radial Glow */}
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 bg-gradient-to-tr ${theme.glow} blur-2xl rounded-full opacity-60 pointer-events-none`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">{label}</span>
        <div className={`p-2 rounded-xl bg-accent/30 border border-border/40`}>
          {getIcon()}
        </div>
      </div>

      <div className="relative z-10 space-y-3">
        <h4 className={`text-2xl font-black italic tracking-tight font-sans ${theme.text}`}>{value}</h4>
        
        {/* Futuristic Status Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[8px] font-bold text-muted-foreground/60 uppercase tracking-widest">
            <span>Signal Strong</span>
            <span>100% telemetry</span>
          </div>
          <div className={`h-1.5 w-full rounded-full ${theme.barBg} overflow-hidden`}>
            <div className={`h-full ${theme.barFill} rounded-full w-[85%] group-hover:w-[95%] transition-all duration-500`} />
          </div>
        </div>
      </div>
    </div>
  );
}
