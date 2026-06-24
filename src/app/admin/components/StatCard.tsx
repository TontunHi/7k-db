"use client"

import { Eye, Users, TrendingUp, Zap } from "lucide-react"

interface StatCardProps {
  label: string;
  value: string | number;
  type: string;
}

const STAT_CONFIG: Record<string, {
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
  trend: string;
}> = {
  total_views: {
    icon: <Eye className="w-4 h-4" />,
    iconBg: "bg-blue-500/10 text-blue-400",
    valueColor: "text-foreground",
    trend: "+12.5%",
  },
  unique_users: {
    icon: <Users className="w-4 h-4" />,
    iconBg: "bg-emerald-500/10 text-emerald-400",
    valueColor: "text-foreground",
    trend: "+8.2%",
  },
  views_today: {
    icon: <TrendingUp className="w-4 h-4" />,
    iconBg: "bg-violet-500/10 text-violet-400",
    valueColor: "text-foreground",
    trend: "+3.1%",
  },
  users_today: {
    icon: <Zap className="w-4 h-4" />,
    iconBg: "bg-amber-500/10 text-amber-400",
    valueColor: "text-foreground",
    trend: "+5.7%",
  },
};

export default function StatCard({ label, value, type }: StatCardProps) {
  const config = STAT_CONFIG[type] || STAT_CONFIG.total_views;

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 hover:border-border transition-all duration-200 hover:shadow-sm group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${config.iconBg}`}>
          {config.icon}
        </div>
        <span className="text-[11px] font-medium text-emerald-500 bg-emerald-500/8 px-2 py-0.5 rounded-full">
          {config.trend}
        </span>
      </div>
      <div>
        <p className={`text-xl font-bold ${config.valueColor} group-hover:text-primary transition-colors`}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
      </div>
    </div>
  );
}
