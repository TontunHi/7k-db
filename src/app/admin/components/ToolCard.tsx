"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface ToolCardProps {
  title: string;
  desc: string;
  href: string;
  markerColor?: string;
}

export default function ToolCard({ title, desc, href, markerColor = "bg-primary" }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 px-5 py-4 rounded-xl border border-border/30 bg-card/40 hover:border-border/60 hover:bg-card/70 transition-all duration-200"
    >
      <div className={`w-2 h-2 rounded-full ${markerColor} shrink-0 mt-1.5 opacity-80`} />

      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">{title}</p>
        <p className="text-xs text-muted-foreground/60 leading-relaxed">{desc}</p>
      </div>

      <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/25 group-hover:text-muted-foreground/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
    </Link>
  );
}
