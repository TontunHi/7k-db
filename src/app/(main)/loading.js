import { HomePageSkeleton } from "@/components/shared/Skeleton"

export default function Loading() {
  return (
    <div className="relative min-h-screen bg-[#050505] animate-in fade-in duration-500">
      <div className="relative z-10 container mx-auto px-4 pt-12 md:pt-24 pb-20">
        {/* Hero Header skeleton */}
        <div className="text-center mb-16 md:mb-24 space-y-4 flex flex-col items-center">
          <div className="h-20 w-80 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-12 w-64 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-4 w-96 bg-white/5 rounded animate-pulse mt-6" />
        </div>
        <HomePageSkeleton />
      </div>
    </div>
  )
}
