import { BossGridSkeleton } from "@/components/shared/Skeleton"

export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[#050505] px-4 py-12 animate-in fade-in duration-500">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-16">
          <div className="h-16 w-64 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
        </div>
        <BossGridSkeleton />
      </div>
    </div>
  )
}
