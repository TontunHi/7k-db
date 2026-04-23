"use client"

import BuildSimulator from "@/components/build/BuildSimulator"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"

function SimulatorContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const heroFilename = searchParams.get('hero')
    
    // Create a minimal hero object if filename is provided
    const initialHero = heroFilename ? { filename: heroFilename, name: heroFilename.split('.')[0] } : null

    return (
        <div>
            <BuildSimulator 
                initialHero={initialHero} 
                onBack={() => router.back()}
            />
        </div>
    )
}

export default function SimulatorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center text-foreground font-black uppercase tracking-widest italic animate-pulse">Loading Simulator...</div>}>
            <SimulatorContent />
        </Suspense>
    )
}
