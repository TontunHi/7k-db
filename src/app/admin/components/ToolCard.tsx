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
      className="group relative overflow-hidden bg-card/30 backdrop-blur-sm hover:bg-card/60 border border-border/40 hover:border-primary/40 rounded-2xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      {/* Decorative top indicator line */}
      <div className={`absolute top-0 inset-x-0 h-[2px] ${markerColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-black uppercase tracking-wider text-foreground/90 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="p-1 rounded-lg bg-accent/25 border border-border/30 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300">
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground/80 leading-relaxed min-h-[32px] mb-4">
        {desc}
      </p>
      
      <div className="flex items-center gap-1.5 pt-3 border-t border-border/25">
        <span className="text-[9px] font-black tracking-widest text-[#FFD700]/50 group-hover:text-[#FFD700] transition-colors uppercase">
          Launch Command
        </span>
      </div>
    </Link>
  );
}
