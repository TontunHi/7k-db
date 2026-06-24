"use client"

interface LogItem {
  admin_name?: string;
  display_time: string;
  target_name: string;
  action_type: string;
}

interface ActivityFeedProps {
  logs?: LogItem[];
}

const ACTION_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
  create: { label: "Created", dot: "bg-emerald-500", text: "text-emerald-500" },
  delete: { label: "Deleted", dot: "bg-rose-500",    text: "text-rose-500"    },
  update: { label: "Updated", dot: "bg-blue-400",    text: "text-blue-400"    },
  default:{ label: "Action",  dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
};

export default function ActivityFeed({ logs = [] }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-border/30 bg-card/40 overflow-hidden">
      <div className="max-h-[420px] overflow-y-auto divide-y divide-border/20">
        {logs && logs.length > 0 ? (
          logs.map((log, i) => {
            const config = ACTION_CONFIG[log.action_type] || ACTION_CONFIG.default;
            return (
              <div key={i} className="flex items-start gap-4 px-5 py-4 hover:bg-accent/10 transition-colors">
                <div className="pt-1.5 shrink-0">
                  <span className={`block w-1.5 h-1.5 rounded-full ${config.dot} opacity-80`} />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-xs text-foreground/80">
                    <span className="font-medium">{log.admin_name || "System"}</span>
                    {" "}<span className="text-muted-foreground/60">{config.label.toLowerCase()}</span>{" "}
                    <span className="font-medium truncate">{log.target_name}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground/40">{log.display_time}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-5 py-14 text-center space-y-1.5">
            <p className="text-sm text-muted-foreground/40 font-medium">No recent activity</p>
            <p className="text-xs text-muted-foreground/30">Actions will appear here as they happen.</p>
          </div>
        )}
      </div>
    </div>
  );
}
