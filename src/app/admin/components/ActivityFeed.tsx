"use client"

import Link from "next/link"
import { Terminal, ArrowRight } from "lucide-react"

interface LogItem {
  admin_name?: string;
  display_time: string;
  target_name: string;
  action_type: string;
}

interface ActivityFeedProps {
  logs?: LogItem[];
}

const ACTION_THEMES: Record<string, { dot: string; text: string; label: string; badgeBg: string }> = {
  create: {
    dot: "bg-emerald-500 shadow-emerald-500/50",
    text: "text-emerald-400",
    label: "CREATE",
    badgeBg: "bg-emerald-500/10 border-emerald-500/20"
  },
  delete: {
    dot: "bg-rose-500 shadow-rose-500/50",
    text: "text-rose-400",
    label: "DELETE",
    badgeBg: "bg-rose-500/10 border-rose-500/20"
  },
  update: {
    dot: "bg-cyan-500 shadow-cyan-500/50",
    text: "text-cyan-400",
    label: "UPDATE",
    badgeBg: "bg-cyan-500/10 border-cyan-500/20"
  },
  default: {
    dot: "bg-gray-500 shadow-gray-500/50",
    text: "text-gray-400",
    label: "SYSTEM",
    badgeBg: "bg-gray-500/10 border-gray-500/20"
  }
};

export default function ActivityFeed({ logs = [] }: ActivityFeedProps) {
  return (
    <div className="flex flex-col bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary animate-pulse" />
          <h2 className="text-sm font-black tracking-widest uppercase text-foreground/90">Audit Log Feed</h2>
        </div>
        <Link 
          href="/admin/logs" 
          className="text-[10px] font-black tracking-widest text-[#FFD700] hover:text-[#FFD700]/80 transition-colors flex items-center gap-1 group"
        >
          VIEW ALL
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Log list */}
      <div className="max-h-[350px] overflow-y-auto pr-1.5 custom-scrollbar space-y-3">
        {logs && logs.length > 0 ? (
          <div className="relative border-l border-border/40 ml-2.5 pl-5 space-y-4 py-2">
            {logs.map((log, i) => {
              const theme = ACTION_THEMES[log.action_type] || ACTION_THEMES.default;

              return (
                <div key={i} className="relative group/item">
                  {/* Timeline Dot Indicator */}
                  <div className={`absolute -left-[25px] top-1.5 w-2 h-2 rounded-full ${theme.dot} shadow-[0_0_8px]`} />
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-[11px] font-bold text-foreground/90">{log.admin_name || 'System'}</span>
                      <span className="text-[9px] text-muted-foreground/60 font-semibold">{log.display_time}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-muted-foreground/80">
                      <span className="font-mono text-amber-500 font-semibold">{log.target_name}</span>
                      <span className="opacity-30">/</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border ${theme.badgeBg} ${theme.text}`}>
                        {theme.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-muted-foreground uppercase tracking-widest font-black">
            No telemetry logs.
          </div>
        )}
      </div>
    </div>
  );
}
