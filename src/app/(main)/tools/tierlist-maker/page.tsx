import TierlistCreator from "@/components/tools/TierlistCreator"
import { Suspense } from "react"

export const metadata = {
    title: "Tier List Maker | 7K-DB Tool",
    description: "Create your own Seven Knights 2 Rebirth tier list. Customize titles, ranks, and categories. Perfect for sharing your meta insights with the community.",
}

export default function TierlistMakerPage() {
    return (
        <main className="min-h-screen bg-[#050505] py-20 px-4">
            <Suspense fallback={
                <div className="flex flex-col h-[70vh] items-center justify-center gap-6">
                    <div className="w-16 h-16 border-4 border-[#FFD700]/20 border-t-[#FFD700] rounded-full animate-spin shadow-[0_0_20px_rgba(255,215,0,0.2)]"></div>
                    <p className="text-gray-500 font-black uppercase tracking-[0.3em] animate-pulse">Loading Interface...</p>
                </div>
            }>
                <TierlistCreator />
            </Suspense>
        </main>
    )
}
