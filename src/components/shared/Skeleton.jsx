import { cn } from "@/lib/utils"

// ─── Base Skeleton ────────────────────────────────────────────────────────────
export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/5", className)}
      {...props}
    />
  )
}

// ─── Hero Card Skeleton (for /build page grid) ────────────────────────────────
export function HeroCardSkeleton() {
  return (
    <div className="group relative flex flex-col items-center">
      <div className="relative w-full aspect-[4/5] bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-lg" />
        {/* Shimmer overlay */}
        <div className="absolute inset-0 translate-x-[-100%] animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
      </div>
    </div>
  )
}

// ─── Build Page Skeleton ──────────────────────────────────────────────────────
export function BuildPageSkeleton() {
  return (
    <div className="relative min-h-screen bg-[#050505] px-4 py-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 mb-16">
        <Skeleton className="h-16 w-64 rounded-xl" />
        <Skeleton className="h-4 w-80 rounded" />
        <Skeleton className="h-14 w-full max-w-md rounded-xl" />
        {/* Tabs */}
        <div className="flex gap-2">
          <Skeleton className="h-12 w-32 rounded-xl" />
          <Skeleton className="h-12 w-32 rounded-xl" />
        </div>
        {/* Role filters */}
        <div className="flex gap-2 flex-wrap justify-center">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-xl" />
          ))}
        </div>
      </div>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {[...Array(18)].map((_, i) => (
          <HeroCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

// ─── Tierlist Skeleton ────────────────────────────────────────────────────────
export function TierlistSkeleton() {
  return (
    <div className="relative min-h-screen bg-[#050505] px-4 py-12">
      <div className="flex flex-col items-center gap-6 mb-16">
        <Skeleton className="h-16 w-48 rounded-xl" />
        <div className="flex gap-4 flex-wrap justify-center">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-20 rounded" />
          ))}
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-xl" />
          ))}
        </div>
      </div>
      {/* Table */}
      <div className="border border-gray-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-6 gap-px bg-gray-800">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-none" />
          ))}
        </div>
        {[...Array(5)].map((_, row) => (
          <div key={row} className="grid grid-cols-6 gap-px bg-gray-800 mt-px">
            {[...Array(6)].map((_, col) => (
              <Skeleton key={col} className="h-36 rounded-none" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Feature Card Skeleton (for home page) ────────────────────────────────────
export function FeatureCardSkeleton() {
  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 flex flex-col items-center gap-4">
      <Skeleton className="w-16 h-16 rounded-2xl" />
      <Skeleton className="h-5 w-28 rounded" />
      <Skeleton className="h-3 w-40 rounded" />
      <Skeleton className="h-3 w-32 rounded" />
    </div>
  )
}

// ─── Home Page Skeleton ───────────────────────────────────────────────────────
export function HomePageSkeleton() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-7xl mx-auto">
      <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(12)].map((_, i) => (
          <FeatureCardSkeleton key={i} />
        ))}
      </div>
      <div className="xl:col-span-4 space-y-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 space-y-4">
          <Skeleton className="h-5 w-40 rounded" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-6 h-6 rounded-md shrink-0" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-2 w-24 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Stage/Dungeon/Raid Generic Row Skeleton ──────────────────────────────────
export function ContentRowSkeleton() {
  return (
    <div className="p-4 bg-gray-900/40 border border-gray-800 rounded-xl flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48 rounded" />
        <Skeleton className="h-3 w-32 rounded" />
      </div>
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  )
}

export function ContentListSkeleton({ rows = 8 }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <ContentRowSkeleton key={i} />
      ))}
    </div>
  )
}

// ─── Advent / Boss Skeleton ───────────────────────────────────────────────────
export function BossGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="relative w-full aspect-[4/5] bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
          <Skeleton className="absolute inset-0" />
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <Skeleton className="h-5 w-32 rounded" />
            <Skeleton className="h-1 w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Team Set Skeleton (for boss strategy page) ───────────────────────────────
export function TeamSetSkeleton() {
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="h-5 w-24 rounded" />
        <Skeleton className="h-5 w-16 rounded-full ml-auto" />
      </div>
      {/* Hero slots */}
      <div className="p-5 space-y-4">
        <div className="flex gap-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-16 h-20 rounded-lg flex-1" />
          ))}
        </div>
        <div className="flex gap-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="w-10 h-10 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  )
}
