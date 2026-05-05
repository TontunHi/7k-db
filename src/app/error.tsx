'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 text-center font-sans tracking-tight">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-rose-500 blur-[100px] opacity-20"></div>
                <h1 className="relative text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-rose-500 to-red-800 italic transform -skew-x-12 select-none uppercase">
                    Error
                </h1>
            </div>

            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest mb-4">
                Something went wrong!
            </h2>
            
            <p className="text-gray-500 max-w-md mb-12 text-sm md:text-base font-light tracking-wide leading-relaxed">
                An unexpected technical error occurred while processing your request. Our team has been notified.
            </p>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <button
                    onClick={() => reset()}
                    className="group relative px-10 py-3 bg-white text-black font-black uppercase tracking-tighter italic transform -skew-x-12 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Try Again
                    </span>
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </button>

                <Link 
                    href="/" 
                    className="group relative px-10 py-3 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 font-bold uppercase tracking-tighter transform -skew-x-12 transition-all"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Back to Home
                    </span>
                </Link>
            </div>

            {process.env.NODE_ENV !== 'production' && (
                <div className="mt-20 p-6 rounded-2xl bg-black/50 border border-rose-950/30 max-w-2xl text-left overflow-hidden">
                    <p className="text-rose-500 text-xs font-black uppercase mb-3 tracking-widest">Error Details (Debug Mode)</p>
                    <pre className="text-gray-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                        {error?.message || "Unknown error"}
                        {"\n\n"}
                        {error?.digest ? `Digest: ${error.digest}` : ""}
                    </pre>
                </div>
            )}
        </div>
    )
}
